
// 🛡️ SPACE-MD AntiBadword System
// Developer: DARK-EYE-OFC

const {
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    incrementWarningCount,
    resetWarningCount
} = require('../lib/index');

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(
    __dirname,
    '../data/userGroupData.json'
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

async function react(sock, message, emoji) {
    try {
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (error) {
        console.log(`⚠️ AntiBadword reaction error: ${error.message}`);
    }
}

function loadAntibadwordConfig(groupId) {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return {};
        }

        const data = JSON.parse(
            fs.readFileSync(CONFIG_FILE, 'utf8')
        );

        return data.antibadword?.[groupId] || {};
    } catch (error) {
        console.error(
            '❌ Error loading antibadword config:',
            error.message
        );

        return {};
    }
}

// ─────────────────────────────────────────────
// AntiBadword Command
// ─────────────────────────────────────────────

async function handleAntiBadwordCommand(
    sock,
    chatId,
    message,
    match = '',
    isSenderAdmin = false
) {
    const command = String(match || '')
        .trim()
        .toLowerCase();

    // No option
    if (!command) {
        await sock.sendMessage(
            chatId,
            {
                text:
                    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                    `      🇿🇼  *𝐒𝐏𝐀𝐂𝐄 𝐌𝐃* 🛡️\n` +
                    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                    `🛡️ *ANTIBADWORD*\n\n` +
                    `Usage:\n\n` +
                    `.antibadword on\n` +
                    `.antibadword warn\n` +
                    `.antibadword kick\n` +
                    `.antibadword off\n\n` +
                    `*on* → Delete bad-word messages\n` +
                    `*warn* → Warn sender up to 3 times\n` +
                    `*kick* → Immediately kick sender`
            },
            { quoted: message }
        );

        return;
    }

    // Only admins can change the group protection
    if (!isSenderAdmin && !message.key.fromMe) {
        await react(sock, message, '❌️');

        await sock.sendMessage(
            chatId,
            {
                text:
                    '❌️ *Only group admins or the bot owner can configure AntiBadword.*'
            },
            { quoted: message }
        );

        return;
    }

    // ─────────────────────────────────────────
    // NORMAL / DELETE MODE
    // ─────────────────────────────────────────

    if (
        command === 'on' ||
        command === 'delete'
    ) {
        try {
            await setAntiBadword(
                chatId,
                'on',
                'delete'
            );

            await react(sock, message, '✅️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `       𝐒𝐏𝐀𝐂𝐄 𝐌𝐃\n` +
                        ` 🔵Successfully activated antibadword\n` +
                        `❎️ All badwords will be executed`
                },
                { quoted: message }
            );

        } catch (error) {
            console.error(
                '❌ Error enabling AntiBadword:',
                error.message
            );

            await react(sock, message, '❌️');

            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Unable to turn on AntiBadword.*'
                },
                { quoted: message }
            );
        }

        return;
    }

    // ─────────────────────────────────────────
    // WARN MODE
    // ─────────────────────────────────────────

    if (command === 'warn') {
        try {
            await setAntiBadword(
                chatId,
                'on',
                'warn'
            );

            await react(sock, message, '☢️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `       𝐒𝐏𝐀𝐂𝐄 𝐌𝐃\n` +
                        ` 🔵Successfully activated antibadword\n` +
                        `⚠️ All badwords will be executed and warn the sender [0/3]`
                },
                { quoted: message }
            );

        } catch (error) {
            console.error(
                '❌ Error enabling AntiBadword warn mode:',
                error.message
            );

            await react(sock, message, '❌️');

            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Unable to turn on AntiBadword.*'
                },
                { quoted: message }
            );
        }

        return;
    }

    // ─────────────────────────────────────────
    // KICK MODE
    // ─────────────────────────────────────────

    if (command === 'kick') {
        try {
            await setAntiBadword(
                chatId,
                'on',
                'kick'
            );

            await react(sock, message, '🥾');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `     𝐒𝐏𝐀𝐂𝐄 𝐌𝐃\n` +
                        ` 🔵Successfully activated antibadword\n` +
                        `👢 All badwords will be executed and immediately kick the sender`
                },
                { quoted: message }
            );

        } catch (error) {
            console.error(
                '❌ Error enabling AntiBadword kick mode:',
                error.message
            );

            await react(sock, message, '❌️');

            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Unable to turn on AntiBadword.*'
                },
                { quoted: message }
            );
        }

        return;
    }

    // ─────────────────────────────────────────
    // OFF
    // ─────────────────────────────────────────

    if (command === 'off') {
        try {
            await removeAntiBadword(chatId);

            await react(sock, message, '❌️');

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `       𝐒𝐏𝐀𝐂𝐄 𝐌𝐃\n\n` +
                        `🔴 *AntiBadword successfully disabled.*`
                },
                { quoted: message }
            );

        } catch (error) {
            console.error(
                '❌ Error disabling AntiBadword:',
                error.message
            );

            await react(sock, message, '❌️');

            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ *Unable to disable AntiBadword.*'
                },
                { quoted: message }
            );
        }

        return;
    }

    // Invalid option
    await react(sock, message, '❌️');

    await sock.sendMessage(
        chatId,
        {
            text:
                `❌️ *Invalid AntiBadword option.*\n\n` +
                `Use:\n` +
                `.antibadword on\n` +
                `.antibadword warn\n` +
                `.antibadword kick\n` +
                `.antibadword off`
        },
        { quoted: message }
    );
}

// ─────────────────────────────────────────────
// Bad-word detection
// ─────────────────────────────────────────────

async function handleBadwordDetection(
    sock,
    chatId,
    message,
    userMessage,
    senderId
) {
    if (!chatId.endsWith('@g.us')) return;
    if (message.key.fromMe) return;

    const config = loadAntibadwordConfig(chatId);

    if (!config.enabled) return;

    const antiBadwordConfig =
        await getAntiBadword(chatId, 'on');

    if (!antiBadwordConfig?.enabled) return;

    const cleanMessage = String(userMessage || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleanMessage) return;

    const badWords = [
        'gandu', 'madarchod', 'bhosdike', 'bsdk',
        'fucker', 'bhosda', 'lauda', 'laude',
        'betichod', 'chutiya', 'maa ki chut',
        'behenchod', 'behen ki chut',
        'randi', 'chuchi', 'boobs', 'boobies',
        'tits', 'idiot', 'fuck', 'dick', 'bitch',
        'bastard', 'asshole', 'lund', 'mc', 'lodu',
        'benchod', 'shit', 'damn', 'hell', 'piss',
        'crap', 'slut', 'whore', 'prick',
        'motherfucker', 'cock', 'cunt', 'pussy',
        'twat', 'wanker', 'douchebag', 'jackass',
        'moron', 'scumbag', 'skank', 'arse',
        'bugger', 'chut', 'madar', 'behen ke lode',
        'chodne', 'sala kutta', 'harami',
        'chodu', 'kameena', 'haramzada',
        'chamiya', 'chudai', 'fck', 'fckr',
        'fcker', 'fuk', 'fukk', 'fcuk', 'btch',
        'bch', 'f*ck', 'assclown', 'a**hole',
        'f@ck', 'b!tch', 'd!ck', 'f***er',
        's***head', 'a$$', 'l0du',
        'blowjob', 'handjob', 'cum', 'cumshot',
        'jizz', 'deepthroat', 'fap', 'hentai',
        'milf', 'anal', 'orgasm', 'dildo',
        'vibrator', 'gangbang', 'threesome',
        'porn', 'sex', 'xxx', 'weed', 'pot',
        'coke', 'heroin', 'meth', 'crack',
        'dope', 'bong', 'kush', 'hash',
        'trip', 'rolling'
    ];

    const words = cleanMessage.split(' ');

    let containsBadWord = false;

    // Exact single-word match
    for (const word of words) {
        if (word.length < 2) continue;

        if (badWords.includes(word)) {
            containsBadWord = true;
            break;
        }
    }

    // Multi-word phrases
    if (!containsBadWord) {
        for (const badWord of badWords) {
            if (
                badWord.includes(' ') &&
                cleanMessage.includes(badWord)
            ) {
                containsBadWord = true;
                break;
            }
        }
    }

    if (!containsBadWord) return;

    // Get group information
    const groupMetadata =
        await sock.groupMetadata(chatId);

    const botId =
        sock.user.id.split(':')[0] +
        '@s.whatsapp.net';

    const bot =
        groupMetadata.participants.find(
            participant => participant.id === botId
        );

    if (!bot?.admin) return;

    // Don't punish admins
    const participant =
        groupMetadata.participants.find(
            participant => participant.id === senderId
        );

    if (participant?.admin) return;

    // Delete offending message
    try {
        await sock.sendMessage(chatId, {
            delete: message.key
        });
    } catch (error) {
        console.error(
            '❌ Error deleting bad-word message:',
            error.message
        );
    }

    // ─────────────────────────────────────────
    // ACTION
    // ─────────────────────────────────────────

    switch (antiBadwordConfig.action) {

        case 'delete':
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🚫 *@${senderId.split('@')[0]}* ` +
                        `bad words are not allowed here.`,
                    mentions: [senderId]
                }
            );
            break;

        case 'warn': {
            const warningCount =
                await incrementWarningCount(
                    chatId,
                    senderId
                );

            if (warningCount >= 3) {
                try {
                    await sock.groupParticipantsUpdate(
                        chatId,
                        [senderId],
                        'remove'
                    );

                    await resetWarningCount(
                        chatId,
                        senderId
                    );

                    await sock.sendMessage(
                        chatId,
                        {
                            text:
                                `🥾 *@${senderId.split('@')[0]}* ` +
                                `has been kicked after 3 warnings.`,
                            mentions: [senderId]
                        }
                    );
                } catch (error) {
                    console.error(
                        '❌ Error kicking after warnings:',
                        error.message
                    );
                }
            } else {
                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `⚠️ *@${senderId.split('@')[0]}* ` +
                            `warning ${warningCount}/3 for using bad words.`,
                        mentions: [senderId]
                    }
                );
            }

            break;
        }

        case 'kick':
            try {
                await sock.groupParticipantsUpdate(
                    chatId,
                    [senderId],
                    'remove'
                );

                await sock.sendMessage(
                    chatId,
                    {
                        text:
                            `🥾 *@${senderId.split('@')[0]}* ` +
                            `has been kicked for using bad words.`,
                        mentions: [senderId]
                    }
                );
            } catch (error) {
                console.error(
                    '❌ Error kicking user:',
                    error.message
                );
            }

            break;
    }
}

module.exports = {
    handleAntiBadwordCommand,
    handleBadwordDetection
};
