// ⚙️ SPACE-MD Settings Command

const settings = require('../settings');

async function settingsCommand(sock, chatId, message) {
    const text =
        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
        `            *SPACE-MD SETTINGS* ⚙️\n` +
        `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
        `🤖 *Bot:* ${settings.botName}\n` +
        `👑 *Owner:* ${settings.botOwner}\n` +
        `📦 *Version:* ${settings.version}\n` +
        `🌐 *Mode:* ${settings.commandMode}\n` +
        `🚀 *Port:* ${settings.port}\n` +
        `📝 *Description:* ${settings.description}\n\n` +
        `💎 *Powered by DARK-EYE-OFC*`;

    await sock.sendMessage(
        chatId,
        { text },
        { quoted: message }
    );
}

module.exports = settingsCommand;
