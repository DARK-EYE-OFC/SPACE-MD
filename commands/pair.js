const settings = require('../settings');

const RENDER_URL = 'https://space-md-nrvd.onrender.com';

async function pairCommand(sock, chatId, message) {
    try {
        const senderJid =
            message.key.participant ||
            message.key.remoteJid;

        const ownerJid =
            settings.ownerNumber + '@s.whatsapp.net';

        const isOwner =
            message.key.fromMe ||
            senderJid === ownerJid;

        if (!isOwner) {
            await sock.sendMessage(chatId, {
                text: '❌ *Only the bot owner can use the pair command.*'
            });
            return;
        }

        const rawText =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';

        const args = rawText.trim().split(/\s+/).slice(1);
        const phoneNumber = (args[0] || '').replace(/\D/g, '');

        if (!phoneNumber) {
            await sock.sendMessage(chatId, {
                text:
                    '❌ *Phone number required!*\n\n' +
                    'Example:\n' +
                    '`.pair 263788123456`'
            });
            return;
        }

        if (phoneNumber.length < 7 || phoneNumber.length > 15) {
            await sock.sendMessage(chatId, {
                text: '❌ *Invalid phone number.*\nUse the country code without `+`, spaces or dashes.'
            });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '⏳ *Requesting pairing code from Render...*'
        });

        const response = await fetch(
            `${RENDER_URL}/api/pair`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber
                })
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            await sock.sendMessage(chatId, {
                text:
                    '❌ *Pairing request failed.*\n\n' +
                    `Reason: ${data.error || 'Unknown error'}`
            });
            return;
        }

await sock.sendMessage(chatId, {
    text:
        `╭━━━〔 🚀 *SPACE-MD PAIRING* 〕━━━╮\n` +
        `┃\n` +
        `┃ 📱 *Number:* ${phoneNumber}\n` +
        `┃\n` +
        `┃ 🔐 *PAIRING CODE*\n` +
        `┃\n` +
        `┃ *\`${data.code}\`*\n` +
        `┃\n` +
        `┃ 📋 *COPY THE CODE ABOVE*\n` +
        `┃\n` +
        `┃ Open WhatsApp → Linked Devices\n` +
        `┃ → Link a Device → Link with phone number\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `⏳ *Use the code before it expires.*\n\n` +
        `> ⚡ *DARK-EYE-OFC*`
});

await sock.sendMessage(chatId, {
    text: data.code
});

    } catch (error) {
        console.error('Pair command error:', error);

        await sock.sendMessage(chatId, {
            text:
                '❌ *Unable to contact the SPACE-MD Render pairing service.*\n\n' +
                `Error: ${error.message}`
        });
    }
}

module.exports = pairCommand;
