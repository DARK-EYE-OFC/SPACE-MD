// commands/getpp.js - SPACE-MD 🇿🇼

const BOT_NAME = '🚀 SPACE-MD 🇿🇼';

async function getPPCommand(sock, chatId, message, args = []) {
    try {
        await sock.sendMessage(chatId, {
            react: {
                text: '♻️',
                key: message.key
            }
        });

        let targetJid;

        // Mentioned user
        const mentioned =
            message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (mentioned?.length) {
            targetJid = mentioned[0];
        }

        // Replied user's JID
        if (!targetJid) {
            const quotedParticipant =
                message.message?.extendedTextMessage?.contextInfo
                    ?.participant;

            if (quotedParticipant) {
                targetJid = quotedParticipant;
            }
        }

        // Otherwise use sender
        if (!targetJid) {
            targetJid =
                message.key.participant ||
                message.participant ||
                message.key.remoteJid;
        }

        const ppUrl = await sock.profilePictureUrl(
            targetJid,
            'image'
        );

        const image = await fetch(ppUrl);
        const buffer = Buffer.from(await image.arrayBuffer());

        await sock.sendMessage(
            chatId,
            {
                image: buffer,
                caption:
                    `╭──────────────────┉\n` +
                    `│◊│ 🔵 *${BOT_NAME}*\n` +
                    `│◊│\n` +
                    `│◊│ 🖼️ *PROFILE PICTURE*\n` +
                    `│◊│\n` +
                    `│◊│ 👤 *USER:* @${targetJid.split('@')[0]}\n` +
                    `│◊│ 🆔 *JID:* \`${targetJid}\`\n` +
                    `│◊│\n` +
                    `╰──────────────────┉\n\n` +
                    `> *♤ powered by DARK-EYE-OFC*`,
                mentions: [targetJid]
            },
            {
                quoted: message
            }
        );

        await sock.sendMessage(chatId, {
            react: {
                text: '📜',
                key: message.key
            }
        });

    } catch (error) {
        console.error('❌ GetPP error:', error);

        await sock.sendMessage(chatId, {
            react: {
                text: '❌',
                key: message.key
            }
        });

        await sock.sendMessage(
            chatId,
            {
                text:
                    `❌ *${BOT_NAME}*\n\n` +
                    `This user does not have a profile picture, ` +
                    `or the profile picture cannot be accessed.`
            },
            {
                quoted: message
            }
        );
    }
}

module.exports = getPPCommand;
