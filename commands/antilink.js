const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'antilinkSettings.json');

function ensureFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, '{}');
    }
}

function readSettings() {
    ensureFile();

    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveSettings(data) {
    ensureFile();
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function isLink(text = '') {
    return /(?:https?:\/\/|www\.|chat\.whatsapp\.com\/|wa\.me\/|t\.me\/|discord\.gg\/|instagram\.com\/|facebook\.com\/|youtube\.com\/|youtu\.be\/)/i.test(text);
}

async function antilinkCommand(sock, chatId, message, args = []) {
    try {
        if (!chatId.endsWith('@g.us')) {
            await sock.sendMessage(
                chatId,
                { text: '❌️ *Antilink can only be used in groups.*' },
                { quoted: message }
            );
            return;
        }

        const groupMetadata = await sock.groupMetadata(chatId);
        const participants = groupMetadata.participants || [];

        const senderId = message.key.participant || message.key.remoteJid;

        const sender = participants.find(
            p => p.id === senderId
        );

        const isAdmin =
            sender?.admin === 'admin' ||
            sender?.admin === 'superadmin';

        const isBotAdmin = participants.some(
            p =>
                p.id === sock.user?.id &&
                (p.admin === 'admin' || p.admin === 'superadmin')
        );

        if (!isAdmin && !message.key.fromMe) {
            await sock.sendMessage(
                chatId,
                { text: '❌️ *Only group admins can use this command.*' },
                { quoted: message }
            );
            return;
        }

        const action = (args[0] || '').toLowerCase();

        const settings = readSettings();

        if (action === 'on') {
            settings[chatId] = true;
            saveSettings(settings);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTILINK*\n\n` +
                        `🛡️ Status: *ON*\n\n` +
                        `🚫 Group links and URLs will now be detected.`
                },
                { quoted: message }
            );
            return;
        }

        if (action === 'off') {
            settings[chatId] = false;
            saveSettings(settings);

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTILINK*\n\n` +
                        `🛡️ Status: *OFF*\n\n` +
                        `✅ Links are now allowed.`
                },
                { quoted: message }
            );
            return;
        }

        const status = settings[chatId] ? 'ON 🛡️' : 'OFF ❌️';

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🔰 *SPACE-MD ANTILINK*\n\n` +
                    `📊 Status: *${status}*\n\n` +
                    `• *.antilink on*\n` +
                    `• *.antilink off*`
            },
            { quoted: message }
        );

    } catch (error) {
        console.error('❌ Antilink command error:', error);

        await sock.sendMessage(
            chatId,
            { text: '❌️ *Antilink command failed.*' },
            { quoted: message }
        );
    }
}

async function handleAntilinkMessage(sock, chatId, message, text) {
    try {
        if (!chatId.endsWith('@g.us')) return;

        const settings = readSettings();

        if (!settings[chatId]) return;

        if (!isLink(text)) return;

        const senderId = message.key.participant || message.key.remoteJid;

        const metadata = await sock.groupMetadata(chatId);
        const participant = metadata.participants.find(
            p => p.id === senderId
        );

        const isSenderAdmin =
            participant?.admin === 'admin' ||
            participant?.admin === 'superadmin';

        if (isSenderAdmin || message.key.fromMe) return;

        const botParticipant = metadata.participants.find(
            p => p.id === sock.user?.id
        );

        const isBotAdmin =
            botParticipant?.admin === 'admin' ||
            botParticipant?.admin === 'superadmin';

        if (!isBotAdmin) {
            console.log('⚠️ Antilink: bot is not group admin.');
            return;
        }

        try {
            await sock.sendMessage(chatId, {
                delete: message.key
            });
        } catch (deleteError) {
            console.error('❌ Failed to delete link:', deleteError);
        }

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🚫 *ANTILINK DETECTED!*\n\n` +
                    `❌️ @${senderId.split('@')[0]}, links are not allowed in this group.\n\n` +
                    `🛡️ *SPACE-MD ANTILINK SYSTEM*`,
                mentions: [senderId]
            }
        );

    } catch (error) {
        console.error('❌ Antilink detection error:', error);
    }
}

module.exports = {
    antilinkCommand,
    handleAntilinkMessage
};
