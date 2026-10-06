const onlineCache = new Map();

async function subscribeToGroupPresence(sock, chatId, participants) {
    if (!chatId?.endsWith('@g.us')) return;

    for (const participant of participants) {
        const jid = participant.id;

        if (!jid) continue;

        try {
            await sock.presenceSubscribe(jid);
        } catch (error) {
            // Ignore individual subscription failures
        }
    }
}

function updatePresence(id, presences) {
    if (!id || !presences) return;

    if (!onlineCache.has(id)) {
        onlineCache.set(id, new Map());
    }

    const groupPresence = onlineCache.get(id);

    for (const [participant, presence] of Object.entries(presences)) {
        const status = presence?.lastKnownPresence;

        if (status === 'available' || status === 'composing' || status === 'recording') {
            groupPresence.set(participant, {
                status,
                lastSeen: Date.now()
            });
        } else if (status === 'unavailable') {
            groupPresence.delete(participant);
        }
    }
}

function getOnlineMembers(chatId, participants, botId) {
    const groupPresence = onlineCache.get(chatId);

    if (!groupPresence) return [];

const botNumber = botId?.split(':')[0];

return participants.filter(member => {
    const memberNumber = member.id?.split(':')[0];

    if (!memberNumber || memberNumber === botNumber) {
        return false;
    }

    for (const storedJid of groupPresence.keys()) {
        const storedNumber = storedJid?.split(':')[0];

        if (storedNumber === memberNumber) {
            return true;
        }
    }

    return false;
});
}

async function listOnlineCommand(sock, chatId, message, mode = 'list') {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('ListOnline reaction error:', error);
        }
    };

    try {
        await react('♻️');

        if (!chatId.endsWith('@g.us')) {
            await react('⛔️');

            await sock.sendMessage(
                chatId,
                {
                    text: '⛔️ *This command can only be used in groups.*'
                },
                { quoted: message }
            );
            return;
        }

        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];
        await subscribeToGroupPresence(
    sock,
    chatId,
    participants
);
        const senderId =
            message.key.participant || message.key.remoteJid;

        const sender = participants.find(
            p => p.id === senderId
        );

        const isAdmin =
            sender?.admin === 'admin' ||
            sender?.admin === 'superadmin';

        if (!isAdmin && !message.key.fromMe) {
            await react('⛔️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `⛔️ *ACCESS BLOCKED*\n\n` +
                        `Only group admins can use this command.`
                },
                { quoted: message }
            );
            return;
        }

        const onlineMembers = getOnlineMembers(
            chatId,
            participants,
            sock.user?.id
        );

        if (onlineMembers.length === 0) {
            await react('🖱');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                        `       🟢 *ONLINE MEMBERS*\n` +
                        `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                        `😴 *No online members detected.*\n\n` +
                        `> *♤ powered by DARK-EYE OFC DEV*`
                },
                { quoted: message }
            );
            return;
        }

        const mentions = onlineMembers.map(member => member.id);

        const names = onlineMembers.map((member, index) => {
            const number = member.id.split('@')[0];

            return `${index + 1}. @${number}`;
        });

        const header =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `       🟢 *ONLINE MEMBERS*\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n`;

        const footer =
            `\n\n📊 *ONLINE:* ${onlineMembers.length}\n` +
            `👥 *GROUP:* ${metadata.subject}\n\n` +
            `> *♤ powered by DARK-EYE OFC DEV*`;

        const text =
            header +
            `🌐 *Members currently online:*\n\n` +
            names.join('\n') +
            footer;

        if (mode === 'tag') {
            await sock.sendMessage(
                chatId,
                {
                    text,
                    mentions
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(
                chatId,
                { text },
                { quoted: message }
            );
        }

        await react('🖱');

    } catch (error) {
        console.error('❌ ListOnline error:', error);

        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *Failed to retrieve online members.*\n\n` +
                        `🚀 *SPACE-MD*`
                },
                { quoted: message }
            );
        } catch (sendError) {
            console.error(
                'ListOnline error message failed:',
                sendError
            );
        }
    }
}

module.exports = {
    listOnlineCommand,
    updatePresence
};
