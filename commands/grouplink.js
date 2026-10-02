const isAdmin = require('../lib/isAdmin');

async function groupLinkCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ This command can only be used in a group.'
                },
                { quoted: message }
            );
            return;
        }

        const senderId =
            message.key.participant ||
            message.participant ||
            message.key.remoteJid;

        const { isSenderAdmin, isBotAdmin } =
            await isAdmin(sock, chatId, senderId);

        if (!isSenderAdmin) {
            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ Only group admins can use this command.'
                },
                { quoted: message }
            );
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ I need to be a group admin to generate the group link.'
                },
                { quoted: message }
            );
            return;
        }

        const metadata = await sock.groupMetadata(chatId);

        const inviteCode = await sock.groupInviteCode(chatId);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        const groupName = metadata.subject || 'Unknown Group';
        const memberCount = metadata.participants?.length || 0;

        let groupPicture;

        try {
            groupPicture = await sock.profilePictureUrl(
                chatId,
                'image'
            );
        } catch {
            groupPicture = null;
        }

        const caption =
            `╭━━━〔 🚀 𝐒𝐏𝐀𝐂𝐄-𝐌𝐃 〕━━━╮\n` +
            `┃ 🔗 *GROUP LINK*\n` +
            `┃\n` +
            `┃ 👥 *Group:* ${groupName}\n` +
            `┃ 👤 *Members:* ${memberCount}\n` +
            `┃\n` +
            `┃ 🔗 ${inviteLink}\n` +
            `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
            `> *Powered by DARK-EYE-OFC*`;

        if (groupPicture) {
            await sock.sendMessage(
                chatId,
                {
                    image: {
                        url: groupPicture
                    },
                    caption
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(
                chatId,
                {
                    text: caption
                },
                { quoted: message }
            );
        }

    } catch (error) {
        console.error('Error in grouplink command:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌️ Failed to generate the group link.'
            },
            { quoted: message }
        );
    }
}

module.exports = groupLinkCommand;
