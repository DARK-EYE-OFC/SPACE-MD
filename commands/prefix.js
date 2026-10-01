// ⚙️ SPACE-MD Prefix Command

const { getSettings } = require('../lib/sessionSettings');

async function prefixCommand(sock, chatId, message) {
    const settings = getSettings(sock);

    const prefix = settings.prefix;

    const displayPrefix =
        prefix === '' ? 'No Prefix' : prefix;

    const text =
        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
        `          *SPACE-MD PREFIX* ⚙️\n` +
        `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
        `🔹 *Current Prefix:* ${displayPrefix}\n\n` +
        `💡 *Change it with:*\n` +
        `.setprefix <prefix>\n\n` +
        `Examples:\n` +
        `.setprefix $\n` +
        `.setprefix log\n` +
        `.setprefix none\n\n` +
        `💎 *SPACE-MD*`;

    await sock.sendMessage(
        chatId,
        { text },
        { quoted: message }
    );
}

module.exports = prefixCommand;
