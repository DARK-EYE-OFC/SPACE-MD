async function crushCommand(sock, chatId, message) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Crush reaction error:', error);
        }
    };

    try {
        await react('♻️');

        if (!chatId.endsWith('@g.us')) {
            await react('⛔️');

            await sock.sendMessage(
                chatId,
                {
                    text: '⛔️ *This command can only be used in a group.*'
                },
                { quoted: message }
            );
            return;
        }

        let targetJid = null;

        const context =
            message.message?.extendedTextMessage?.contextInfo;

        // .crush @user
        if (context?.mentionedJid?.length) {
            targetJid = context.mentionedJid[0];
        }

        // Reply to someone's message
        if (!targetJid && context?.participant) {
            targetJid = context.participant;
        }

        if (!targetJid) {
            await react('❌️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *No crush selected.*\n\n` +
                        `👤 Mention someone:\n` +
                        `*.crush @user*\n\n` +
                        `💬 Or reply to their message with:\n` +
                        `*.crush*`
                },
                { quoted: message }
            );
            return;
        }

        const targetNumber = targetJid.split('@')[0];

        const crushText =
            `╔════════════════════╗\n` +
            `     ✨ *SPACE-MD* ✨\n` +
            `       💘 *CRUSH ZONE* 💘\n` +
            `╚════════════════════╝\n\n` +

            `Dear @${targetNumber} 💌\n\n` +

            `I have a crush 😍 on you 🥰\n\n` +

            `Someone has something special to ask you...\n` +
            `Maybe your heart already knows the answer. 👀❤️\n\n` +

            `💭 *DO YOU LOVE ME...?*\n\n` +

            `Choose your answer below 👇\n\n` +

            `♡ *Made by DARK-EYE TECH*`;

        /*
         * Native WhatsApp interactive buttons.
         */
        await sock.sendMessage(
            chatId,
            {
                text: crushText,
                mentions: [targetJid],
                footer: '🚀 SPACE-MD • DARK-EYE-OFC',
                buttons: [
                    {
                        buttonId: 'crush_no',
                        buttonText: {
                            displayText: '🙅‍♀️ NO 👎'
                        },
                        type: 1
                    },
                    {
                        buttonId: 'crush_yes',
                        buttonText: {
                            displayText: '🥰 YES ❤️'
                        },
                        type: 1
                    }
                ],
                headerType: 1
            },
            { quoted: message }
        );

        await react('💘');

    } catch (error) {
        console.error('❌ Crush command error:', error);

        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *Crush system failed.*\n\n` +
                        `🚀 *SPACE-MD*`
                },
                { quoted: message }
            );
        } catch (sendError) {
            console.error('Crush error message failed:', sendError);
        }
    }
}

async function crushResponse(sock, chatId, message, buttonId) {
    try {
        if (buttonId === 'crush_yes') {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔════════════════════╗\n` +
                        `       💖 *LOVE ACCEPTED* 💖\n` +
                        `╚════════════════════╝\n\n` +

                        `🥰 *THE ANSWER IS YES!* ❤️\n\n` +

                        `✨ Someone's heart just found a reason to smile.\n\n` +
                        `💋 Love is in the air...\n` +
                        `🌹 Hearts are beating...\n` +
                        `🦋 Butterflies have entered the chat...\n\n` +

                        `💞 *FLIRT MODE: ACTIVATED* 💞\n\n` +

                        `💕 Keep talking.\n` +
                        `💕 Keep smiling.\n` +
                        `💕 Keep making each other happy.\n\n` +

                        `╭───────────────╮\n` +
                        `   💌 *LOVE DASHBOARD* 💌\n` +
                        `   ❤️ Status: ACCEPTED\n` +
                        `   🥰 Mood: ROMANTIC\n` +
                        `   💋 Flirt: ON\n` +
                        `   🌹 Vibes: BEAUTIFUL\n` +
                        `╰───────────────╯\n\n` +

                        `♡ *Made by DARK-EYE TECH*`
                },
                { quoted: message }
            );

            return true;
        }

        if (buttonId === 'crush_no') {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `╔════════════════════╗\n` +
                        `       🥀 *HEARTBREAK* 🥀\n` +
                        `╚════════════════════╝\n\n` +

                        `💔 *The answer was NO.*\n\n` +

                        `Sometimes two hearts simply don't beat\n` +
                        `to the same rhythm.\n\n` +

                        `🌧️ It's okay to feel the silence.\n` +
                        `🥀 It's okay to let the moment pass.\n` +
                        `🌅 Tomorrow still has another story to tell.\n\n` +

                        `╭───────────────╮\n` +
                        `   🖤 *HEART STATUS* 🖤\n` +
                        `   💔 Status: HEARTBROKEN\n` +
                        `   🌧️ Mood: SORROW\n` +
                        `   🥀 Dignity: INTACT\n` +
                        `   🌅 Tomorrow: HOPE\n` +
                        `╰───────────────╯\n\n` +

                        `👑 No begging. No chasing.\n` +
                        `Sometimes walking away is the strongest reply.\n\n` +

                        `♡ *Made by DARK-EYE TECH*`
                },
                { quoted: message }
            );

            return true;
        }

        return false;

    } catch (error) {
        console.error('❌ Crush response error:', error);
        return false;
    }
}

module.exports = {
    crushCommand,
    crushResponse
};
