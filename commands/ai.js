// 🤖 SPACE-MD AI Command
// Developer: DARK-EYE-OFC

const axios = require('axios');

async function react(sock, message, emoji) {
    try {
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (error) {
        console.log(`⚠️ AI reaction error: ${error.message}`);
    }
}

async function askGemini(question) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured.');
    }

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
        contents: [
            {
                parts: [
                    {
                        text: question
                    }
                ]
            }
        ]
    });

    return (
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '🤖 I could not generate a response.'
    );
}

async function askOpenAI(question) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not configured.');
    }

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: question
                }
            ]
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return (
        response.data?.choices?.[0]?.message?.content ||
        '🤖 I could not generate a response.'
    );
}

async function aiCommand(sock, chatId, message, args = []) {
    const question = args.join(' ').trim();

    // ⏳️ Loading / searching
    await react(sock, message, '⏳️');

    if (!question) {
        await react(sock, message, '🚫');

        await sock.sendMessage(
            chatId,
            {
                text:
                    '🤖 *SPACE-MD AI*\n\n' +
                    'Ask me something.\n\n' +
                    'Example:\n' +
                    '.ai Explain how JavaScript works'
            },
            { quoted: message }
        );

        return;
    }

    try {
        let answer;

        // Gemini first
        if (process.env.GEMINI_API_KEY) {
            try {
                answer = await askGemini(question);
            } catch (error) {
                console.log('⚠️ Gemini failed:', error.message);
            }
        }

        // OpenAI fallback
        if (!answer && process.env.OPENAI_API_KEY) {
            try {
                answer = await askOpenAI(question);
            } catch (error) {
                console.log('⚠️ OpenAI failed:', error.message);
            }
        }

        if (!answer) {
            await react(sock, message, '🚫');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        '🚫 *AI is currently unavailable.*\n\n' +
                        'Please configure GEMINI_API_KEY or OPENAI_API_KEY.'
                },
                { quoted: message }
            );

            return;
        }

        // 🤖 AI finished
        await react(sock, message, '🤖');

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🤖 *SPACE-MD AI*\n\n` +
                    `${answer}\n\n` +
                    `💎 *DARK-EYE-OFC*`
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('❌ AI command error:', error.message);

        await react(sock, message, '🚫');

        await sock.sendMessage(
            chatId,
            {
                text: '🚫 *AI request failed.*\nPlease try again later.'
            },
            { quoted: message }
        );
    }
}

module.exports = aiCommand;
