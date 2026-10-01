// 🎱 SPACE-MD Eight Ball Command

const answers = [
    '🎱 Yes, definitely!',
    '🎱 It is certain.',
    '🎱 Without a doubt.',
    '🎱 Most likely.',
    '🎱 Ask again later.',
    '🎱 Cannot predict that right now.',
    '🎱 Maybe.',
    '🎱 The signs are unclear.',
    '🎱 Probably not.',
    '🎱 Don’t count on it.'
];

async function eightBallCommand(sock, chatId, question) {
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const text =
        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
        `             *SPACE-MD 8BALL* 🎱\n` +
        `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
        `❓ *Question:* ${question || 'No question asked'}\n\n` +
        `${answer}\n\n` +
        `💎 *SPACE-MD*`;

    await sock.sendMessage(chatId, { text });
}

module.exports = {
    eightBallCommand
};
