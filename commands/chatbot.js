// 🤖 SPACE-MD Chatbot
// Developer: DARK-EYE-OFC

const responses = {
    hello: [
        '👋 Hello! SPACE-MD is here.',
        '🌟 Hey there! How are you?',
        '🚀 Hello! SPACE-MD reporting in.'
    ],

    hi: [
        '👋 Hi!',
        '🌟 Hey! What’s up?',
        '🚀 Hi there!'
    ],

    hey: [
        '👋 Hey!',
        '😎 Hey there!',
        '🚀 What’s up?'
    ],

    goodmorning: [
        '🌅 Good morning! Have a great day.',
        '☀️ Good morning from SPACE-MD!'
    ],

    goodnight: [
        '🌙 Good night! Sleep well.',
        '✨ Good night from SPACE-MD!'
    ],

    thanks: [
        '❤️ You’re welcome!',
        '😊 Anytime!',
        '🚀 Glad I could help!'
    ]
};

function randomResponse(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/**
 * Handles a direct chatbot command.
 * Example: .chatbot hello
 */
async function handleChatbotCommand(sock, chatId, message, args = []) {
    const input = args.join(' ').trim().toLowerCase();

    if (!input) {
        await sock.sendMessage(
            chatId,
            {
                text:
                    '🤖 *SPACE-MD CHATBOT*\n\n' +
                    'Usage:\n' +
                    '.chatbot hello\n' +
                    '.chatbot hi\n' +
                    '.chatbot goodmorning'
            },
            { quoted: message }
        );
        return;
    }

    const key = input.replace(/\s+/g, '');

    if (responses[key]) {
        await sock.sendMessage(
            chatId,
            {
                text: randomResponse(responses[key])
            },
            { quoted: message }
        );
        return;
    }

    await sock.sendMessage(
        chatId,
        {
            text:
                `🤖 I received: *${input}*\n\n` +
                `SPACE-MD chatbot is active.`
        },
        { quoted: message }
    );
}

/**
 * Handles ordinary group messages.
 *
 * This is intentionally conservative so the bot does not
 * reply to every single message in a group.
 */
async function handleChatbotResponse(
    sock,
    chatId,
    message,
    userMessage,
    senderId
) {
    const text = String(userMessage || '').trim().toLowerCase();

    if (!text) return;

    // Only respond to simple greetings / phrases.
    const key = text.replace(/[^a-z]/g, '');

    if (responses[key]) {
        await sock.sendMessage(
            chatId,
            {
                text: randomResponse(responses[key])
            },
            { quoted: message }
        );
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
};
