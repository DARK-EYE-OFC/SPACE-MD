
// 🚀 SPACE-MD Alive Command
// Developed by DARK-EYE-OFC

const settings = require('../settings');

function formatRuntime(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function boxMenu(lines) {
    const top = '╔═══❖•ೋ° °ೋ•❖═══╗';
    const bottom = '╚═══❖•ೋ° °ೋ•❖═══╝';

    return [
        top,
        ...lines,
        bottom
    ].join('\n');
}

async function run({ conn, m }) {
    const chatId = m.key.remoteJid;

    try {
        // ♻️ Loading
        await conn.sendMessage(chatId, {
            react: {
                text: '♻️',
                key: m.key
            }
        });

        const uptime = Math.floor(process.uptime());
        const runtime = formatRuntime(uptime);

        const botName =
            settings.botName || '🚀 SPACE-MD';

        const owner =
            settings.botOwner || '👑 DARK-EYE-OFC';

        const mode =
            settings.commandMode || 'public';

        const version =
            settings.version || '5.6.9';

        const text = boxMenu([
            '',
            `        🔵 *${botName}*`,
            '',
            '╭────────────────────╮',
            '│ 🟢 *STATUS:* ONLINE',
            '│',
            `│ 👑 *OWNER:* ${owner}`,
            `│ ⚡ *VERSION:* ${version}`,
            `│ ⏱️ *RUNTIME:* ${runtime}`,
            `│ 🌐 *MODE:* ${mode}`,
            '│',
            '│ 🚀 *SYSTEM:* OPERATIONAL',
            '╰────────────────────╯',
            '',
            '💎 *SPACE-MD is alive and running!*',
            '',
            '> ♤ *powered by DARK-EYE-OFC*',
            ''
        ]);

        await conn.sendMessage(
            chatId,
            {
                text
            },
            {
                quoted: m
            }
        );

        // 🟢 Done
        await conn.sendMessage(chatId, {
            react: {
                text: '🟢',
                key: m.key
            }
        });

    } catch (error) {
        console.error('❌ Alive command error:', error);

        await conn.sendMessage(chatId, {
            react: {
                text: '❌',
                key: m.key
            }
        });

        await conn.sendMessage(
            chatId,
            {
                text:
                    `❌ *${settings.botName || 'SPACE-MD'}*\n\n` +
                    `Unable to display bot status.\n\n` +
                    `> *♤ powered by DARK-EYE-OFC*`
            },
            {
                quoted: m
            }
        );
    }
}

module.exports = {
    run,
    boxMenu,
    formatRuntime
};
