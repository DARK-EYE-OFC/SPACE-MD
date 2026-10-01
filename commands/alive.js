// 🚀 SPACE-MD Alive Command

const settings = require('../settings');

function boxMenu(lines) {
    const top = '╔═══❖•ೋ° °ೋ•❖═══╗';
    const bottom = '╚═══❖•ೋ° °ೋ•❖═══╝';

    return [
        top,
        '',
        ...lines,
        '',
        bottom
    ].join('\n');
}

async function run({ conn, m }) {
    const chatId = m.key.remoteJid;

    const runtime = Math.floor(process.uptime());

    const text = boxMenu([
        '               *SPACE-MD*',
        '',
        '║🟢 *Status:* Running',
        `║🌟 *Owner:* ${settings.botOwner}`,
        `║✨️ *Runtime:* ${runtime}s`,
        `║🌐 *Mode:* ${settings.commandMode}`,
        '║',
        '║💎 *SPACE-MD is alive and running....*'
    ]);

    await conn.sendMessage(
        chatId,
        { text },
        { quoted: m }
    );
}

module.exports = {
    run,
    boxMenu
};
