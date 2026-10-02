async function characterCommand(sock, chatId, message) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Character reaction error:', error);
        }
    };

    try {
        await react('♻️');

        const characters = [
            {
                name: 'The Leader 👑',
                description: 'Natural leader with confidence, vision and strong energy.'
            },
            {
                name: 'The Genius 🧠',
                description: 'Always thinking, analyzing and finding clever solutions.'
            },
            {
                name: 'The Rebel 😈',
                description: 'Does things differently and refuses to follow the crowd.'
            },
            {
                name: 'The Mysterious One 🌑',
                description: 'Quiet, unpredictable and difficult to read.'
            },
            {
                name: 'The Comedian 😂',
                description: 'Can turn almost any situation into a joke.'
            },
            {
                name: 'The Romantic ❤️',
                description: 'Emotional, caring and secretly soft-hearted.'
            },
            {
                name: 'The Warrior ⚔️',
                description: 'Strong-minded and never gives up when things get difficult.'
            },
            {
                name: 'The Dreamer 🌌',
                description: 'Creative, imaginative and always thinking about the future.'
            },
            {
                name: 'The Hustler 💰',
                description: 'Focused on goals, money and building something bigger.'
            },
            {
                name: 'The Lone Wolf 🐺',
                description: 'Independent, private and comfortable doing things alone.'
            }
        ];

        const result =
            characters[Math.floor(Math.random() * characters.length)];

        const caption =
            `╭━━━〔 🚀 𝐒𝐏𝐀𝐂𝐄-𝐌𝐃 〕━━━╮\n` +
            `┃ 🎭 *CHARACTER ANALYZER*\n` +
            `┃\n` +
            `┃ 👤 *Character:* ${result.name}\n` +
            `┃\n` +
            `┃ 📖 *Description:*\n` +
            `┃ ${result.description}\n` +
            `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
            `> *Powered by DARK-EYE-OFC*`;

        await sock.sendMessage(
            chatId,
            {
                text: caption
            },
            { quoted: message }
        );

        await react('✅️');

    } catch (error) {
        console.error('Error in character command:', error);

        await react('❌️');

        await sock.sendMessage(
            chatId,
            {
                text: '❌️ Failed to generate your character.'
            },
            { quoted: message }
        );
    }
}

module.exports = characterCommand;
