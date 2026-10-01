// ⚙️ SPACE-MD Set Prefix Command

const {
    getSettings,
    setSetting
} = require('../lib/sessionSettings');

const MAX_PREFIX_LENGTH = 12;

async function react(sock, message, emoji) {
    try {
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
    } catch (error) {
        console.log(`⚠️ Could not react with ${emoji}:`, error.message);
    }
}

async function setPrefixCommand(sock, chatId, message, args, isOwner) {

    // 🌟 Command received
    await react(sock, message, '🌟');

    if (!isOwner) {
        await sock.sendMessage(
            chatId,
            {
                text: '❌ Only the bot owner can change the prefix.'
            },
            { quoted: message }
        );

        return;
    }

    const newPrefix = args.join(' ').trim();

    if (!newPrefix) {
        const current = getSettings(sock).prefix;

        await sock.sendMessage(
            chatId,
            {
                text:
                    `⚙️ *Current Prefix:* ${current || 'No Prefix'}\n\n` +
                    `Usage:\n` +
                    `.setprefix $\n` +
                    `.setprefix log\n` +
                    `.setprefix none`
            },
            { quoted: message }
        );

        return;
    }

    // 🚫 Remove prefix
    if (
        newPrefix.toLowerCase() === 'none' ||
        newPrefix.toLowerCase() === 'remove' ||
        newPrefix.toLowerCase() === 'off'
    ) {
        setSetting(sock, 'prefix', '');

        await react(sock, message, '✅');

        await sock.sendMessage(
            chatId,
            {
                text:
                    `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                    `       *SPACE-MD PREFIX UPDATED* ✅\n` +
                    `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                    `🔹 *Prefix:* Removed\n\n` +
                    `Commands can now be used without a prefix:\n\n` +
                    `ping\n` +
                    `menu\n` +
                    `alive`
            },
            { quoted: message }
        );

        return;
    }

    if (newPrefix.length > MAX_PREFIX_LENGTH) {
        await sock.sendMessage(
            chatId,
            {
                text: `❌ Prefix is too long. Maximum length is ${MAX_PREFIX_LENGTH} characters.`
            },
            { quoted: message }
        );

        return;
    }

    if (/\s/.test(newPrefix)) {
        await sock.sendMessage(
            chatId,
            {
                text: '❌ A prefix cannot contain spaces.'
            },
            { quoted: message }
        );

        return;
    }

    // 💾 Save session-specific prefix
    setSetting(sock, 'prefix', newPrefix);

    // ✅ Successful change
    await react(sock, message, '✅');

    await sock.sendMessage(
        chatId,
        {
            text:
                `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
                `    *SPACE-MD PREFIX UPDATED* ✅\n` +
                `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +
                `🔹 *New Prefix:* ${newPrefix}\n\n` +
                `Example:\n` +
                `${newPrefix}ping\n` +
                `${newPrefix}menu\n` +
                `${newPrefix}alive`
        },
        { quoted: message }
    );
}

module.exports = setPrefixCommand;
