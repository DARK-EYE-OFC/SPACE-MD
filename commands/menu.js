
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
        'time',

        // NEW AI
        'gpt',
        'gpt4',
        'gpt3',
        'openai',
        'bard',
        'gemini',
        'claude',
        'llama',
        'metaai',
        'copilot',
        'blackbox',
        'youai',
        'phind',
        'dalle',
        'midjourney',
        'stable',
        'sd',
        'flux',
        'aiimg',
        'aimage',
        'draw',
        'art',
        'generate',
        'gen',
        'chat',
        'talk',
        'ask',
        'question',
        'answer',
        'explain',
        'define',
        'meaning',
        'synonym',
        'antonym',
        'grammar',
        'summarize',
        'paraphrase',
        'rewrite',
        'fix',
        'correct',
        'spellcheck',
        'math',
        'calculate',
        'solve',
        'formula',
        'code',
        'program',
        'python',
        'javascript',
        'html',
        'css',
        'java',
        'cplus',
        'debug',
        'explaincode',
        'aicode',
        'codeai',
        'story',
        'poem',
        'lyrics',
        'songlyrics',
        'pickupline',
        'roast',
        'compliment',
        'quoteai',
        'ai-char',
        'roleplay',
        'rp',
        'waifuai',
        'girlfriend',
        'boyfriend',
        'cai',
        'personality'
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
        'video',

        // NEW DOWNLOADERS
        'tt',
        'tiktokdl',
        'ttdl',
        'tiktokmp3',
        'tiktokaudio',
        'tiktoknowm',
        'facebook',
        'fb',
        'fbdl',
        'fbmp3',
        'fbmp4',
        'instagram',
        'ig',
        'igdl',
        'igreel',
        'igstory',
        'igpost',
        'igvideo',
        'igmp3',
        'twitter',
        'tw',
        'xdl',
        'xvideo',
        'twtdl',
        'youtube',
        'yt',
        'ytdl',
        'ytmp3',
        'ytmp4',
        'ytmp3doc',
        'ytmp4doc',
        'ytaudio',
        'ytvideo',
        'yts',
        'ytsearch',
        'audio',
        'mp3',
        'mp4',
        'mediafire',
        'mf',
        'gdrive',
        'gdrivedl',
        'mega',
        'megadl',
        'terabox',
        'teraboxdl',
        'pinterest',
        'pin',
        'pindl',
        'pinterestdl',
        'soundcloud',
        'scdl',
        'spotify',
        'spotifydl',
        'spdl',
        'applemusic',
        'appledl',
        'tiktok2',
        'snackvideo',
        'likee',
        'capcut',
        'threadsdl',
        'reddit',
        'redditdl',
        'imgur',
        'imgurdl',
        'apk',
        'apkdl',
        'app',
        'playstore',
        'apksearch',
        'modapk',
        'zip',
        'unzip',
        'rar',
        '7zip',
        'githubdl',
        'gitclone',
        'npmsearch',
        'apkmod',
        'media',
        'doc',
        'document',
        'upload',
        'tourl',
        'tinyurl',
        'shorturl'
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
        'wasted',

        // NEW FUN
        'tord',
        'wouldyou',
        'wyr',
        '8ball',
        '8b',
        'dice',
        'roll',
        'flipcoin',
        'coinflip',
        'random',
        'choose',
        'pick',
        'love',
        'couple',
        'compat',
        'compatibility',
        'lesbicheck',
        'prettycheck',
        'uglycheck',
        'stupidcheck',
        'smartcheck',
        'soulmate',
        'crushcheck',
        'gay',
        'lesbi',
        'straight',
        'bisexual',
        'rps',
        'rockpaper',
        'wordgame',
        'guess',
        'riddle',
        'quiz',
        'mathgame',
        'slot',
        'casino',
        'gamble',
        'bet',
        'jackpot',
        'lottery',
        'roulette',
        'blackjack',
        'poker',
        'chess',
        'uno',
        'memes',
        'mememaker',
        'dankmeme',
        'wholesome',
        'darkmeme',
        'funny',
        'fun',
        'haha',
        'lol',
        'lmao',
        'joke2',
        'pun',
        'dadjoke',
        'knockknock',
        'humor',
        'laugh',
        'cry',
        'sad',
        'happy',
        'angry',
        'love2',
        'hug',
        'slap',
        'punch',
        'pat',
        'cuddle',
        'kill',
        'bite',
        'lick',
        'yeet',
        'bonk',
        'poke',
        'tickle',
        'highfive'
    ],

    games: [
        'hangman',
        'tictactoe',
        'trivia',
        'truth',
        'dare',

        // NEW GAMES
        'ttt',
        'rps',
        'rockpaper',
        'wordgame',
        'guess',
        'riddle',
        'quiz',
        'mathgame',
        'dice',
        'roll',
        'flipcoin',
        'coinflip',
        '8ball',
        '8b',
        'wouldyou',
        'wyr',
        'slot',
        'chess',
        'uno',
        'poker',
        'blackjack',
        'roulette'
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
        'whois',

        // NEW GENERAL
        'about',
        'donate',
        'version',
        'runtime',
        'uptime',
        'speed',
        'status',
        'bot',
        'chriss',
        'darkeye',
        'report',
        'request',
        'feedback',
        'privacy',
        'terms',
        'sc',
        'script',
        'repo',
        'list',
        'allmenu',
        'mainmenu',
        'homemenu',
        'ping2',
        'pong',
        'hi',
        'hello',
        'hey',
        'test',
        'tes',
        'check',
        'online',
        'offline',
        'id',
        'jid',
        'getid',
        'getjid',
        'me',
        'myid',
        'groupid',
        'chatid',
        'link',
        'inviteinfo',
        'getbio',
        'getdesc',
        'getname',
        'getpic',
        'profile',
        'ava',
        'avatar',
        'pp',
        'mypp',
        'setbio',
        'setname',
        'block',
        'unblock',
        'blocklist',
        'clearchat',
        'del',
        'delsession',
        'logout',
        'restart',
        'backup',
        'restore',
        'save',
        'load',
        'export',
        'import',
        'sync',
        'refresh'
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
        'welcome',
        'tag2',
        'listonline',
        'tagonline',

        // NEW GROUP
        'group',
        'gc',
        'groupopen',
        'groupclose',
        'open',
        'close',
        'lock',
        'unlock',
        'nolink',
        'antispam',
        'nospam',
        'antibot',
        'nobots',
        'antiviewonce',
        'antivv',
        'antidel',
        'setwelcome',
        'setgoodbye',
        'setdesc',
        'setsubject',
        'setnamegc',
        'setppgc',
        'gcpp',
        'gcid',
        'gclink',
        'revoke',
        'resetlink',
        'add',
        'remove',
        'admin',
        'admins',
        'adminlist',
        'mention',
        'tagadmin',
        'invitegc',
        'join',
        'leave',
        'exit',
        'left',
        'kickall',
        'removeall',
        'purge',
        'clearmembers',
        'linkgc',
        'grouplist',
        'poll',
        'vote',
        'voting',
        'survey',
        'democracy',
        'afk',
        'afkcheck',
        'delafk',
        'unwarn',
        'warnlist',
        'resetwarn',
        'banlist',
        'bancount',
        'blockgc',
        'unblockgc',
        'filter',
        'filterlist',
        'setfilter',
        'delfilter'
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
        'viewonce',

        // NEW OWNER / ADVANCED
        'eval',
        'exec',
        'execute',
        'run',
        'cmd',
        'terminal',
        'shell',
        'bash',
        'sh',
        'node',
        'npm',
        'install',
        'uninstall',
        'broadcast',
        'bc',
        'bcgc',
        'bcgroup',
        'bcall',
        'announce',
        'announcement',
        'notify',
        'notif',
        'push',
        'send',
        'setstatus',
        'setabout',
        'setpresence',
        'online2',
        'offline2',
        'typing',
        'recording',
        'autoread',
        'autobio',
        'autolike',
        'autoreact',
        'autotyping',
        'autorecording',
        'autoread2',
        'self',
        'public',
        'mode',
        'setmode',
        'autoreply',
        'autoresponse',
        'chatbotgc',
        'antispamgc',
        'antilinkgc',
        'onlyadmin',
        'onlygroup',
        'onlyprivate',
        'onlypm',
        'anticall',
        'nocall',
        'autoblock',
        'autoblockcall',
        'callblock',
        'blockcall',
        'setowner',
        'addowner',
        'delowner',
        'ownerlist',
        'addsudo',
        'delsudo',
        'sudolist',
        'premium',
        'addprem',
        'delprem',
        'premlist',
        'vip',
        'addvip',
        'delvip',
        'viplist',
        'limit',
        'limitcount',
        'resetlimit',
        'unlimit',
        'nolimit',
        'cooldown',
        'nocooldown',
        'banchat',
        'unbanchat',
        'bannedlist',
        'getsession',
        'setsession',
        'delsession2',
        'creds',
        'credsjson',
        'sessionid',
        'pairing',
        'paircode',
        'qrscan',
        'qrcode2',
        'restart2',
        'reboot2',
        'update2',
        'upgrade',
        'downgrade',
        'migration',
        'database',
        'db',
        'resetdb',
        'cleardb',
        'backupdb'
    ],

    settings: [
        'prefix',
        'setprefix',
        'settings',
        'resetlink',

        // NEW SETTINGS
        'setstatus',
        'setabout',
        'setpresence',
        'setmode',
        'public',
        'self',
        'mode',
        'autoread',
        'autostatus',
        'autobio',
        'autolike',
        'autoreact',
        'autotyping',
        'autorecording',
        'autoreply',
        'autoresponse'
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
        'topmembers',

        // NEW TOOLS / CONVERTERS
        's',
        'st',
        'stickermaker',
        'stickerwm',
        'steal',
        'toimg',
        'toimage',
        'tovideo',
        'tomp3',
        'tomp4',
        'toaudio',
        'tovoice',
        'toptt',
        'tosticker',
        'togif',
        'tomp3doc',
        'tomp4doc',
        'toqr',
        'qr',
        'qrcode',
        'readqr',
        'scanqr',
        'trt',
        'lang',
        'texttospeech',
        'speech',
        'voice',
        'voicemaker',
        'ai-voice',
        'elevenlabs',
        'ocr',
        'readtext',
        'extracttext',
        'removebg',
        'nobg',
        'blur',
        'enhance',
        'hd',
        'hdr',
        'upscale',
        'remini',
        'emoji',
        'emojimaker',
        'brat',
        'bratvideo',
        'qc',
        'quotely',
        'fakechat',
        'fakereply',
        'tohd',
        'dehaze',
        'colorize',
        'grayscale',
        'invert',
        'flip',
        'rotate',
        'crop',
        'resize',
        'compress',
        'getexif',
        'exif',
        'wm',
        'setwm',
        'nowm',
        'nowa',
        'write',
        'writemenu',
        'textpro',
        'photooxy',
        'ephoto'
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
            `┃╋━➤ *.${command}*`
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
        // ♻️ Menu loading
        await sock.sendMessage(chatId, {
            react: {
                text: '📜',
                key: message.key
            }
        });

        await sock.sendMessage(
            chatId,
            {
                text: '> _*[📜 SPACE-MD 🇿🇼] please wait, bot menu is loading...*_'
            },
            {
                quoted: message
            }
        );

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
            `┃ ⏳️ *RUNTIME:* NODES/PANEL\n` +
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

        // Send menu audio as a voice note
        const audioPath = path.join(
            process.cwd(),
            'assets',
            'menu_audio.mp3'
        );

        if (fs.existsSync(audioPath)) {
            await sock.sendMessage(
                chatId,
                {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mpeg',
                    ptt: false
                }
            );
        } else {
            console.warn(
                '⚠️ Menu audio not found:',
                audioPath
            );
        }

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
