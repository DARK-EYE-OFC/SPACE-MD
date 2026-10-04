
const DEFAULT_TIMEZONE = 'Africa/Harare';

async function timeCommand(sock, chatId, message, args = []) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Time reaction error:', error);
        }
    };

    try {
        await react('♻️');

        const timezone = args[0] || DEFAULT_TIMEZONE;

        let currentDate;

        try {
            currentDate = new Date().toLocaleString('en-GB', {
                timeZone: timezone,
                dateStyle: 'full',
                timeStyle: 'medium'
            });
        } catch (error) {
            await react('❌️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *Invalid timezone!*\n\n` +
                        `🌍 *Example:*\n` +
                        `.time Africa/Harare\n` +
                        `.time Asia/Kabul\n` +
                        `.time Europe/London\n` +
                        `.time America/New_York\n\n` +
                        `🔎 Find valid timezones:\n` +
                        `https://en.wikipedia.org/wiki/List_of_tz_database_time_zones\n\n` +
                        `🚀 *SPACE-MD TIME SYSTEM*`
                },
                { quoted: message }
            );

            return;
        }

        const caption =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `        🇿🇼 *𝐒𝐏𝐀𝐂𝐄-𝐌𝐃* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +

            `╭━━━━❒ ⌚️ 𝐓𝐈𝐌𝐄 ❒━━━━╮\n` +
            `┃\n` +
            `┃ 🌍 *TIMEZONE:* ${timezone}\n` +
            `┃\n` +
            `┃ 📅 *DATE & TIME:*\n` +
            `┃ ${currentDate}\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯\n\n` +

            `> *♤powered by DARK-EYE OFC DEV*`;

        await sock.sendMessage(
            chatId,
            {
                text: caption
            },
            { quoted: message }
        );

        await react('⌚️');

    } catch (error) {
        console.error('❌ Time command error:', error);

        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *Something went wrong while fetching the time.*\n\n` +
                        `🚀 *SPACE-MD TIME SYSTEM*`
                },
                { quoted: message }
            );
        } catch (sendError) {
            console.error(
                'Time error message failed:',
                sendError
            );
        }
    }
}

module.exports = timeCommand;
