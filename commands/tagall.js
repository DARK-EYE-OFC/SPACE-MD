
const isAdmin = require('../lib/isAdmin');

async function tagAllCommand(sock, chatId, message) {
    try {
        const senderId =
            message.key.participant ||
            message.participant ||
            message.key.remoteJid;

        const { isSenderAdmin, isBotAdmin } =
            await isAdmin(sock, chatId, senderId);

        if (!isSenderAdmin) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Only group admins can use this command!*'
                },
                { quoted: message }
            );
        }

        if (!isBotAdmin) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Bot must be admin to mention all members!*'
                },
                { quoted: message }
            );
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];

        if (participants.length === 0) {
            return await sock.sendMessage(
                chatId,
                {
                    text: '⚠️ *No members found in this group!*'
                },
                { quoted: message }
            );
        }

        const groupName = groupMetadata.subject || 'Unknown Group';

        /*
         * Get the message to display.
         *
         * If .tagall is used as a reply, the replied message
         * becomes the tagged message.
         */
        const quotedMessage =
            message.message?.extendedTextMessage?.contextInfo
                ?.quotedMessage;

        let taggedMessage = 'Hello everyone 👋🏽';

        if (quotedMessage) {
            const textMessage =
                quotedMessage.conversation ||
                quotedMessage.extendedTextMessage?.text ||
                quotedMessage.imageMessage?.caption ||
                quotedMessage.videoMessage?.caption;

            if (textMessage) {
                taggedMessage = textMessage;
            }
        }

        /*
         * Create the member list.
         */
        let memberList = '';

        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];

            const jid =
                participant.id ||
                participant.jid;

            const number =
                jid?.split('@')[0] || 'unknown';

            /*
             * WhatsApp may provide a display name through
             * pushName in some situations.
             */
            const name =
                participant.notify ||
                participant.name ||
                participant.pushName ||
                `+${number}`;

            memberList +=
                `│${i + 1}. 👋🏽 @${number}\n`;
        }

        const caption =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `           🔵 *𝐒𝐏𝐀𝐂𝐄-𝐌𝐃* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +

            `╭───❒ *TAG ALL* ❒───╮\n` +
            `│\n` +
            `│ 📢 *GROUP:* ${groupName}\n` +
            `│ 👥 *MEMBERS:* ${participants.length}\n` +
            `│\n` +
            `│ 💬 *MESSAGE:*\n` +
            `│ ${taggedMessage}\n` +
            `│\n` +

            memberList +

            `│\n` +
            `╰───────────────❒\n\n` +

            `> *♤powered by DARK-EYE OFC DEV*`;

        await sock.sendMessage(
            chatId,
            {
                text: caption,
                mentions: participants.map(
                    participant => participant.id
                )
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('Error in tagall command:', error);

        await sock.sendMessage(
            chatId,
            {
                text:
                    '❌️ *Failed to tag all members. Please try again later.*'
            },
            { quoted: message }
        );
    }
}

module.exports = tagAllCommand;

