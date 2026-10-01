// 🧹 SPACE-MD Clear Command

async function clearCommand(sock, chatId) {
    const text =
        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
        `              *SPACE-MD CLEAR* 🧹\n` +
        `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
        `🧹 *Clear command executed.*\n\n` +
        `💎 *SPACE-MD*`;

    await sock.sendMessage(chatId, { text });
}

module.exports = {
    clearCommand
};
