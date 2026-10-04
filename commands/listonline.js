const settings = require('../settings.js');

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

        // Group only
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

        // Find the person who used the command
        const senderId =
            message.key.participant || message.key.remoteJid;

        const sender = participants.find(
            p => p.id === senderId
        );

        const isAdmin =
            sender?.admin === 'admin' ||
            sender?.admin === 'superadmin';

        // Allow bot owner/fromMe and group admins
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

        /*
         * Baileys stores presence information separately from
         * group participant metadata. We check the socket's
         * presence map for this group.
         */
        const presenceMap =
            sock.presence?.[chatId] ||
            sock.presences?.[chatId] ||
            {};

        const botId = sock.user?.id?.split(':')[0];

        const onlineMembers = participants.filter(member => {
            const memberNumber = member.id?.split(':')[0];

            // Don't include the bot
            if (memberNumber === botId) return false;

            const presence = presenceMap[member.id];

            if (!presence) return false;

            return (
                presence.lastKnownPresence === 'available' ||
                presence.presences === 'available' ||
                presence === 'available'
            );
        });

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
            return `${index + 1}. 🕯 @${number}`;
        });

        const header =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `       🟢 *ONLINE MEMBERS*\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n`;

        const footer =
            `\n\n📊 *ONLINE:* ${onlineMembers.length}\n` +
            `👥 *GROUP:* ${metadata.subject}\n\n` +
            `> *♤ powered by DARK-EYE OFC DEV*`;

        if (mode === 'tag') {
            const text =
                header +
                `🌐 *Members currently online:*\n\n` +
                names.join('\n') +
                footer;

            await sock.sendMessage(
                chatId,
                {
                    text,
                    mentions
                },
                { quoted: message }
            );
        } else {
            const text =
                header +
                `🌐 *Members currently online:*\n\n` +
                names.join('\n') +
                footer;

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

module.exports = listOnlineCommand;
