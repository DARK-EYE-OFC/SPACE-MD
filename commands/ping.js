
const settings = require('../settings.js');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';

    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;

    if (seconds > 0 || time === '') {
        time += `${seconds}s`;
    }

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Ping reaction error:', error);
        }
    };

    try {
        // Loading reaction
        await react('♻️');

        // Send initial ping message
        const start = Date.now();

        const sentMessage = await sock.sendMessage(
            chatId,
            {
                text: '♻️ *Pinging...*'
            },
            {
                quoted: message
            }
        );

        // Calculate response latency
        const latency = Date.now() - start;

        // Simple bot speed measurement
        const botSpeed = Math.max(1, latency);

        const finalText =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `      🏓 *PONG* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
            `📈 *SPEED:* _${botSpeed}ms_\n` +
            `🖥 *LATENCY:* _${latency}ms_\n\n` +
            `> *♤powered by DARK-EYE OFC DEV*`;

        // Edit the original "Pinging..." message
        await sock.sendMessage(chatId, {
            text: finalText,
            edit: sentMessage.key
        });

        // Done reaction
        await react('🏓');

    } catch (error) {
        console.error('Ping error:', error);

        // Failed reaction
        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `❌️ *Ping failed.*\n\n` +
                        `🚀 *SPACE-MD*`
                },
                {
                    quoted: message
                }
            );
        } catch (sendError) {
            console.error('Ping error message failed:', sendError);
        }
    }
}

module.exports = pingCommand;
