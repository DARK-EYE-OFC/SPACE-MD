const settings = require('../settings.js');

async function tag2Command(sock, chatId, message, args = []) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Tag2 reaction error:', error);
        }
    };

    try {
        await react('♻️');

        // This command only works in groups.
        if (!chatId.endsWith('@g.us')) {
            await react('❌️');

            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *This command can only be used in groups.*'
                },
                { quoted: message }
            );
            return;
        }

        let targetJid = null;

        /*
         * Method 1:
         * .tag @user
         */
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            const mentioned =
                message.message.extendedTextMessage.contextInfo.mentionedJid;

            targetJid = mentioned[0];
        }

        /*
         * Method 2:
         * Reply to someone's message.
         */
        if (!targetJid) {
            const context =
                message.message?.extendedTextMessage?.contextInfo;

            if (context?.participant) {
                targetJid = context.participant;
            }
        }

        /*
         * Method 3:
         * Some Baileys messages store the quoted participant here.
         */
        if (!targetJid) {
            const context =
                message.message?.extendedTextMessage?.contextInfo;

            if (context?.quotedMessage && context?.participant) {
                targetJid = context.participant;
            }
        }

        if (!targetJid) {
            await react('⛔️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *No member selected.*\n\n` +
                        `👤 Mention one person:\n` +
                        `*.tag @user*\n\n` +
                        `💬 Or reply to their message with:\n` +
                        `*.tag*`
                },
                { quoted: message }
            );
            return;
        }

        const number = targetJid.split('@')[0];

        const greeting =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `      👑 *SPACE GREETING* 👑\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +

            `🌟 Welcome, @${number}!\n\n` +

            `🔥 *A legend has entered the chat.*\n` +
            `⚡ Your presence just upgraded the energy in here.\n` +
            `💎 Keep shining, keep winning, and never forget your worth.\n\n` +

            `🚀 *SPACE-MD* salutes you!\n` +
            `👑 May your journey be filled with greatness, success and unforgettable moments.\n\n` +

            `╭━━━━━━━❖━━━━━━━╮\n` +
            `     🌌 *DARK-EYE TECH* 🌌\n` +
            `╰━━━━━━━❖━━━━━━━╯\n\n` +

            `> *♤ powered by DARK-EYE OFC DEV*`;

        await sock.sendMessage(
            chatId,
            {
                text: greeting,
                mentions: [targetJid]
            },
            { quoted: message }
        );

        await react('👑');

    } catch (error) {
        console.error('❌ Tag2 command error:', error);

        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *TAG2 failed.*\n\n` +
                        `🚀 *SPACE-MD*`
                },
                { quoted: message }
            );
        } catch (sendError) {
            console.error('Tag2 error message failed:', sendError);
        }
    }
}

module.exports = tag2Command;
