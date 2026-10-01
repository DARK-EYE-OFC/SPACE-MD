// 🛡️ SPACE-MD AntiBadword Command

const {
    handleAntiBadwordCommand
} = require('../lib/antibadword');

async function antibadwordCommand(
    sock,
    chatId,
    message,
    senderId,
    isSenderAdmin
) {
    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    const args = text
        .trim()
        .split(/\s+/)
        .slice(1);

    const match = args.join(' ');

    return handleAntiBadwordCommand(
        sock,
        chatId,
        message,
        match,
        isSenderAdmin
    );
}

module.exports = antibadwordCommand;

