// 🌌 SPACE-MD Fact Command

const facts = [
    '🌍 Earth is the only known planet with life.',
    '💡 Light travels faster than anything else we know.',
    '🐙 Octopuses have three hearts.',
    '🌙 The Moon is slowly moving away from Earth.',
    '🧠 The human brain contains billions of neurons.',
    '🌊 Most of Earth’s surface is covered by water.',
    '☀️ Sunlight takes about 8 minutes to reach Earth.',
    '🐝 Bees communicate partly through movements known as the waggle dance.',
    '🦒 A giraffe has the same number of neck vertebrae as a human: seven.',
    '🚀 Space is not completely silent because electromagnetic waves can be detected and converted into sound.'
];

async function factCommand(sock, chatId, message, quotedMessage) {
    const fact = facts[Math.floor(Math.random() * facts.length)];

    await sock.sendMessage(
        chatId,
        {
            text:
                `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                `              *SPACE-MD FACT* 🧠\n` +
                `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                `${fact}\n\n` +
                `💎 *SPACE-MD*`
        },
        { quoted: quotedMessage || message }
    );
}

module.exports = factCommand;
