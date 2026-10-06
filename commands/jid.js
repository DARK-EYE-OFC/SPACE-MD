// commands/jid.js - SPACE-MD 🇿🇼

const BOT_NAME = '🚀 SPACE-MD 🇿🇼';

async function jidCommand(sock, chatId, message, args = []) {
    try {
        // ♻️ Loading reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '♻️',
                key: message.key
            }
        });

        const input = args.join(' ').trim();

        let jid;
        let type;

        /*
         * .jid <link>
         */
        if (input) {

            // WhatsApp Group invite
            if (
                input.includes('chat.whatsapp.com/')
            ) {
                const code =
                    input
                        .split('chat.whatsapp.com/')[1]
                        .split(/[?#\s]/)[0];

                if (!code) {
                    throw new Error('Invalid group invite link.');
                }

                const groupInfo =
                    await sock.groupGetInviteInfo(code);

                jid = groupInfo.id;
                type = 'GROUP';
            }

            // WhatsApp Channel invite
            else if (
                input.includes('whatsapp.com/channel/')
            ) {
                const code =
                    input
                        .split('whatsapp.com/channel/')[1]
                        .split(/[/?#\s]/)[0];

                if (!code) {
                    throw new Error('Invalid channel link.');
                }

                const channelInfo =
                    await sock.newsletterMetadata(
                        'invite',
                        code
                    );

                jid = channelInfo.id;
                type = 'CHANNEL';
            }

            else {
                throw new Error(
                    'Unsupported WhatsApp link.'
                );
            }

        } else {

            /*
             * .jid without a link
             *
             * Group → group JID
             * Private → user JID
             */
            jid = chatId;

            if (chatId.endsWith('@g.us')) {
                type = 'GROUP';
            } else if (
                chatId.endsWith('@s.whatsapp.net')
            ) {
                type = 'USER';
            } else if (
                chatId.endsWith('@newsletter')
            ) {
                type = 'CHANNEL';
            } else {
                type = 'CHAT';
            }
        }

        // 📜 Done reaction
        await sock.sendMessage(chatId, {
            react: {
                text: '📜',
                key: message.key
            }
        });

        await sock.sendMessage(
            chatId,
            {
                text:
                    `╭──────────────────┉\n` +
                    `│◊│ 🔵 *${BOT_NAME}*\n` +
                    `│◊│\n` +
                    `│◊│ 📌 *JID INFORMATION*\n` +
                    `│◊│\n` +
                    `│◊│ 📂 *TYPE:* ${type}\n` +
                    `│◊│ 🆔 *JID:*\n` +
                    `│◊│ \`${jid}\`\n` +
                    `│◊│\n` +
                    `╰──────────────────┉\n\n` +
                    `> *♤ powered by DARK-EYE-OFC*`
            },
            {
                quoted: message
            }
        );

    } catch (error) {

        console.error(
            '❌ JID command error:',
            error
        );

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
                    `Unable to resolve the JID.\n\n` +
                    `Use:\n` +
                    `• *.jid*\n` +
                    `• *.jid <group link>*\n` +
                    `• *.jid <channel link>*`
            },
            {
                quoted: message
            }
        );
    }
}

module.exports = jidCommand;


