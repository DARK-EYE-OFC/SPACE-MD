
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {

    const helpMessage = `
╭━━━〔 *𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔* 〕━━━╮
┃ 💠 *Bot Name:* ${settings.botName || '🔵𝐒𝐏𝐀𝐂𝐄 𝐌𝐃'}
┃ 🔖 *Version:* ${settings.version || '5.6.9'}
┃ 👑 *Owner:* ${settings.botOwner || '𝐀𝐋𝐄𝐗 𝐓𝐇𝐄𝐎𝐍'}
┃ 📺 *YouTube:* ${global.ytch || 'Not set'}
╰━━━━━━━━━━━━━━╯

🔥 _"💦𝐒𝐏𝐀𝐂𝐄 𝐌𝐃🇿🇼 is not just a bot, it's an experience."_
✨ _Designed with 💙 by 𝑫𝑨𝑹𝑲 𝑬𝒀𝑬 𝑶𝑭𝑪_
🔍 _Use the commands below to explore the magic🪄._

━━━━━━━━━━━━━━━
> 📌*COMMAND MENU*
━━━━━━━━━━━━━━━

╭─🌐 *GENERAL ZONE*
│ 🌐 .help
│ 📡 .ping
│ ⚡ .alive
│ 🗣️ .tts
│ 👑 .owner
│ 😂 .joke
│ 📜 .quote
│ 📚 .fact
│ 🌤️ .weather
│ 📰 .news
│ 🖍️ .attp
│ 🎶 .lyrics
│ 🎱 .8ball
│ 👥 .groupinfo
│ 🛡️ .staff
│ 📎 .vv
│ 🌍 .trt
│ 🖼️ .ss
│ 🆔 .jid
╰──────────────

╭─🛡️ *GROUP GUARD*
│ 🚫 .ban
│ 🔺 .promote
│ 🔻 .demote
│ 🔇 .mute
│ 🔊 .unmute
│ 🗑️ .delete
│ 🥾 .kick
│ ⚠️ .warnings
│ ⚡ .warn
│ 🛑 .antilink
│ 🤬 .antibadword
│ 🧹 .clear
│ 📢 .tag
│ 📣 .tagall
│ 🤖 .chatbot
│ 🔁 .resetlink
│ 👋 .welcome
│ 🥀 .goodbye
╰──────────────

╭─🔒 *OWNER PANEL*
│ 🛠️ .mode
│ 📶 .autostatus
│ 🧼 .clearsession
│ 👁‍🗨 .antidelete
│ 🗑 .cleartmp
│ 🖼 .setpp
│ ❤️ .autoreact
╰──────────────

╭─🎨 *STICKER TOOLS*
│ 🌀 .blur
│ 🖼️ .simage
│ 🪄 .sticker
│ 🔗 .tgsticker
│ 😂 .meme
│ 🏷️ .take
│ 😎 .emojimix
╰──────────────

╭─🎮 *GAME ROOM*
│ ❌⭕ .tictactoe
│ 💀 .hangman
│ 🔤 .guess
│ ❓ .trivia
│ ✅ .answer
│ 🔍 .truth
│ 🔥 .dare
╰──────────────

╭─🧠 *AI POWER*
│ 🤖 .gpt
│ 🧠 .gemini
│ 🎨 .imagine
│ 🌌 .flux
╰──────────────

╭─🎉 *FUN ZONE*
│ 💘 .compliment
│ 🤬 .insult
│ 😎 .flirt
│ 🎭 .shayari
│ 🌙 .goodnight
│ 🌹 .roseday
│ 🎭 .character
│ ☠️ .wasted
│ 🚢 .ship
│ 🤤 .simp
│ 🤡 .stupid
╰──────────────

╭─✍️ *TEXT MAKER*
│ 💎 .metallic
│ 🧊 .ice
│ ❄️ .snow
│ ✨ .impressive
│ 🌌 .matrix
│ 💡 .light
│ 🎇 .neon
│ 👿 .devil
│ 💜 .purple
│ ⚡ .thunder
│ 🌿 .leaves
│ 🎬 .1917
│ 🛡️ .arena
│ 💀 .hacker
│ 🏖️ .sand
│ 🩷 .blackpink
│ 💥 .glitch
│ 🔥 .fire
╰──────────────

╭─📥 *MEDIA ZONE*
│ 🎧 .play
│ 🎵 .song
│ 📹 .video
│ ▶️ .ytmp4
│ 📸 .instagram
│ 📘 .facebook
│ 🎞️ .tiktok
╰──────────────

╭─💻 *GITHUB CORNER*
│ 🖥️ .git
│ 📂 .github
│ 🧠 .sc
│ 🧾 .script
│ 📦 .repo
╰──────────────

> ©𝓹𝓸𝔀𝓮𝓻𝓮𝓭 𝓫𝔂 *𝑫𝑨𝑹𝑲 𝑬𝒀𝑬 𝑻𝑬𝑪𝑯®*
📢 *Join our channel*
`;

    try {

        // Menu image
        const imagePath = path.join(
            __dirname,
            '../assets/bot_image_jpg'
        );

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

        // Send menu image + caption
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
