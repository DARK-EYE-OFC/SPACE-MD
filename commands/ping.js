
function formatTime(ms) {
    if (ms < 1000) {
        return `${ms} milliseconds`;
    }

    if (ms < 60000) {
        const seconds = ms / 1000;
        return `${Number(seconds.toFixed(2))} seconds`;
    }

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds && days === 0) {
        parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    }

    return parts.join(' ') || 'less than a second';
}

async function pingCommand(sock, chatId, message) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: { text: emoji, key: message.key }
            });
        } catch (error) {
            console.error('Ping reaction error:', error);
        }
    };

    try {
        await react('♻️');

        const start = Date.now();

        const sentMessage = await sock.sendMessage(
            chatId,
            { text: '♻️ *Pinging...*' },
            { quoted: message }
        );

        const latency = Date.now() - start;
        const botSpeed = Math.max(1, latency);
        const responseDelay = Date.now() - start;

        const finalText =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `      🏓 *PONG* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
            `📈 *SPEED:* _${botSpeed}ms_\n` +
            `⏰️ *DELAYED:* _${formatTime(responseDelay)}_\n\n` +
            `> *♤powered by DARK-EYE OFC DEV*`;

        await sock.sendMessage(chatId, {
            text: finalText,
            edit: sentMessage.key
        });

        await react('✨️');
    } catch (error) {
        console.error('Ping error:', error);
        await react('❌️');

        try {
            await sock.sendMessage(
                chatId,
                {
                    text: `❌️ *Ping failed.*\n\n🚀 *SPACE-MD*`
                },
                { quoted: message }
            );
        } catch (sendError) {
            console.error('Ping error message failed:', sendError);
        }
    }
}

module.exports = pingCommand;

