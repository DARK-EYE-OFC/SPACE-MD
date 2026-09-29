const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
╭━━━〔 🤖 *SPACE-MD* 〕━━━╮
┃ 💠 *Bot Name:* ${settings.botName || 'ANAYAT-AI'}
┃ 🔖 *Version:* ${settings.version || '2.0.5'}
┃ 👑 *Owner:* ${settings.botOwner || 'ANAYAT-KING'}
┃ 📺 *YouTube:* ${global.ytch || 'Not set'}
╰━━━━━━━━━━━━━━╯

🔥 _"ANAYAT-AI is not just a bot, it's an experience."_  
✨ _Designed with 💙 by ANAYAT-KING_
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

📢 *Join our channel*`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(imagePath),
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420933039839@newsletter',
                        newsletterName: 'SPACE-MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420933039839@newsletter',
                        newsletterName: 'SPACE-MD',
                        serverMessageId: -1
                    }
                }
            });
        }

        // 🔊 Voice note (optional)
        const audioPath = path.join(__dirname, '../assets/audio.mp3');
        if (fs.existsSync(audioPath)) {
            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
