
const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const { getSettings } = require('../lib/sessionSettings');

const commandCategories = {
    ai: [
        'ai',
        'chatbot',
        'imagine',
        'translate',
        'tts',
        'news',
        'weather',
        'time'
    ],

    download: [
        'gif',
        'github',
        'img',
        'lyrics',
        'meme',
        'play',
        'song',
        'ss',
        'stickertelegram',
        'tiktok',
        'url',
        'video'
    ],

    fun: [
        'character',
        'eightball',
        'fact',
        'ghost',
        'ghosttrace',
        'hack',
        'hornycheck',
        'insult',
        'joke',
        'kiss',
        'lovecheck',
        'marry',
        'mindread',
        'pregnancycheck',
        'pussylover',
        'quote',
        'roseday',
        'shayari',
        'ship',
        'simp',
        'stupid',
        'take',
        'toilet',
        'whoisgay',
        'wasted'
    ],

    games: [
        'hangman',
        'tictactoe',
        'trivia',
        'truth',
        'dare'
    ],

    general: [
        'alive',
        'clear',
        'goodbye',
        'groupinfo',
        'help',
        'owner',
        'ping',
        'support',
        'whois'
    ],

    group: [
        'antibadword',
        'antidelete',
        'antilink',
        'delete',
        'demote',
        'grouplink',
        'hidetag',
        'invite',
        'kick',
        'mute',
        'promote',
        'tag',
        'tagall',
        'unban',
        'unmute',
        'warn',
        'warnings',
        'welcome'
    ],

    owner: [
        'autostatus',
        'ban',
        'clearsession',
        'deletebot',
        'pmblocker',
        'setpp',
        'sudo',
        'unhack',
        'update',
        'viewonce'
    ],

    settings: [
        'prefix',
        'setprefix',
        'settings',
        'resetlink'
    ],

    system: [
        'pair',
        'spy',
        'sticker',
        'sticker-alt',
        'simage-alt',
        'textmaker',
        'virus',
        'fartblasttext',
        'explode',
        'bedskills',
        'brainwash',
        'callmom',
        'compliment',
        'crush',
        'detect',
        'emojimix',
        'facebook',
        'flirt',
        'flirt2',
        'getpp',
        'goodnight',
        'auntyalert',
        'attp',
        'shafi',
        'staff',
        'mirror',
        'topmembers'
    ]
};

function formatUptime(seconds) {
    seconds = Math.floor(seconds);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${days}D - ${hours}H - ${minutes}M - ${secs}S`;
}

function getMemoryUsage() {
    const memory = process.memoryUsage().rss / 1024 / 1024;
    return `${memory.toFixed(1)} MB`;
}

function getCommandCount() {
    return Object.values(commandCategories)
        .reduce((total, commands) => total + commands.length, 0);
}

function formatCommands(commands) {
    return commands
        .map((command, index) =>
            `┃╋━➤ .${command}`
        )
        .join('\n');
}

function categoryBlock(title, emoji, commands) {
    return (
        `╭───❒ *${emoji}${title}* ❒▪︎▪︎\n` +
        `┃🔢 *${commands.length} COMMANDS*\n` +
        `┃\n` +
        `${formatCommands(commands)}\n` +
        `╰───────────────❒`
    );
}

async function helpCommand(sock, chatId, message) {
    try {
        const sessionSettings = getSettings(sock);

        const prefix =
            sessionSettings.prefix === null ||
            sessionSettings.prefix === '' ||
            sessionSettings.prefix === false
                ? 'NONE'
                : sessionSettings.prefix;

        const totalCommands = getCommandCount();

        const panel =
            process.env.RENDER_EXTERNAL_URL ||
            'Termux / PM2';

        const helpMessage =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `           🔵 *𝐒𝐏𝐀𝐂𝐄-𝐌𝐃* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +

            `╭━━━━❒ 𝐌𝐄𝐍𝐔 ❒━━━━━╮\n` +
            `┃ 💠 *BOT NAME:* ${settings.botName || '🚀 SPACE-MD'}\n` +
            `┃ ✒️ *PREFIX:* [${prefix}]\n` +
            `┃ 🪧 *VERSION:* ${settings.version || '5.6.9'}\n` +
            `┃ 👑 *OWNER:* ${settings.botOwner || 'DARK-EYE-OFC'}\n` +
            `┃ ⏳️ *RUNTIME:* ${formatUptime(process.uptime())}\n` +
            `┃ 🏷 *COMMANDS:* ${totalCommands}\n` +
            `┃ 📡 *PANEL:* ${panel}\n` +
            `┃ 💾 *MEMORY:* ${getMemoryUsage()}\n` +
            `┃ 📺 *YOUTUBE:* ${global.ytch || 'Not set'}\n` +
            `┃ 📊 *UPTIME:* ${formatUptime(process.uptime())}\n` +
            `╰━━━━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('AI CMDS', '🔬', commandCategories.ai)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('DOWNLOAD', '⬇️', commandCategories.download)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('FUN CMDS', '🥳', commandCategories.fun)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('GAMES', '🎮', commandCategories.games)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('GENERAL', '🖥', commandCategories.general)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('GROUP', '🫂', commandCategories.group)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('OWNER', '🔐', commandCategories.owner)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('SETTINGS', '⚙️', commandCategories.settings)}\n\n` +
            `❒━━━━━━━━━━━━━❒\n\n` +

            `${categoryBlock('SYSTEM', '📟', commandCategories.system)}\n\n` +

            `━━━━━━━━━━━━━\n` +
            `> *♤powered by DARK-EYE OFC DEV*\n\n` +
            `_*📢 Join our channel for updates*_`;

        // Primary menu image
        let imagePath = path.join(
            __dirname,
            '../assets/bot_image.jpg'
        );

        // Fallback for the older filename
        if (!fs.existsSync(imagePath)) {
            const fallbackPath = path.join(
                __dirname,
                '../assets/bot_image_jpg'
            );

            if (fs.existsSync(fallbackPath)) {
                imagePath = fallbackPath;
            }
        }

        if (!fs.existsSync(imagePath)) {
            console.error(
                '❌ Menu image not found:',
                imagePath
            );

            await sock.sendMessage(
                chatId,
                {
                    text: helpMessage
                },
                { quoted: message }
            );

            return;
        }

        await sock.sendMessage(
            chatId,
            {
                image: fs.readFileSync(imagePath),
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid:
                            '120363420933039839@newsletter',
                        newsletterName:
                            'SPACE-MD',
                        serverMessageId: -1
                    }
                }
            },
            {
                quoted: message
            }
        );

    } catch (error) {
        console.error(
            '❌ Error in help command:',
            error
        );

        try {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        '❌ Failed to send the menu.'
                },
                {
                    quoted: message
                }
            );
        } catch {}
    }
}

module.exports = helpCommand;
