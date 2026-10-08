const { isAdmin } = require('../lib/isAdmin');

// Manual demotion via command
async function demoteCommand(sock, chatId, mentionedJids, message) {
    let userToDemote = [];

    if (mentionedJids && mentionedJids.length > 0) {
        userToDemote = mentionedJids;
    } else if (
        message.message?.extendedTextMessage?.contextInfo?.participant
    ) {
        userToDemote = [
            message.message.extendedTextMessage.contextInfo.participant
        ];
    }

    if (userToDemote.length === 0) {
        await sock.sendMessage(chatId, {
            text: '🫵 Tag a user or reply to their message to *demote them from admin!* 🔨'
        });
        return;
    }

    try {
        await sock.groupParticipantsUpdate(
            chatId,
            userToDemote,
            'demote'
        );

        const usernames = userToDemote.map(
            jid => `@${jid.split('@')[0]}`
        );

        const demoterJid = sock.user.id;

        const demotionMessage =
            `🔨 *SPACE-MD ADMIN ALERT!* 🔨\n\n` +
            `👤 Demoted:\n` +
            `${usernames.map(name => `🔻 ${name}`).join('\n')}\n\n` +
            `📤 Demoted By: @${demoterJid.split('@')[0]}\n` +
            `🕰️ Time: ${new Date().toLocaleString()}\n\n` +
            `⚡ Admin powers have been removed.`;

        await sock.sendMessage(chatId, {
            text: demotionMessage,
            mentions: [...userToDemote, demoterJid]
        });

    } catch (error) {
        console.error('Demotion Error:', error);

        await sock.sendMessage(chatId, {
            text: '❌ SPACE-MD failed to demote the user(s). Please try again.'
        });
    }
}

// Automatic demotion event handler
async function handleDemotionEvent(
    sock,
    groupId,
    participants,
    author
) {
    try {
        const demotedUsernames = participants.map(
            jid => `@${jid.split('@')[0]}`
        );

        let demotedBy;
        const mentionList = [...participants];

        if (author && author.length > 0) {
            demotedBy = `@${author.split('@')[0]}`;
            mentionList.push(author);
        } else {
            demotedBy = '⚙️ System';
        }

        const demotionMessage =
            `🔔 *SPACE-MD DETECTED A DEMOTION!* 🔔\n\n` +
            `👤 Demoted:\n` +
            `${demotedUsernames.map(name => `🔻 ${name}`).join('\n')}\n\n` +
            `🎯 By: ${demotedBy}\n` +
            `🗓️ On: ${new Date().toLocaleString()}\n\n` +
            `📢 Admin privileges have been removed.`;

        await sock.sendMessage(groupId, {
            text: demotionMessage,
            mentions: mentionList
        });

    } catch (error) {
        console.error('Auto-demotion error:', error);
    }
}

module.exports = {
    demoteCommand,
    handleDemotionEvent
};
