const settings = require('../settings');
const fs = require('fs');
const path = require('path');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds %= (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

async function helpCommand(sock, chatId, message) {
    const start = Date.now();
    await sock.sendMessage(chatId, { text: '⏳ *Loading sweet SPACE-MD menu...* ♻️' }, { quoted: message });
    const end = Date.now();
    const ping = Math.round((end - start) / 2);
    const uptimeFormatted = formatTime(process.uptime());

    const helpMessage = `
┏━━━━━━━━━━━━━━━━━━┓
┃💻Commands Menu💻
┗━━━━━━━━━━━━━━━━━━┛
 📝 _Owner Information_
  ━━━━━━━━━━━━━━━━━━
📍 *Owner:* ${settings.botOwner}
⏳ *Uptime:* ${uptimeFormatted}
🕐 *Time:* ${new Date().toLocaleString()}
⚡ *Speed:* ${ping}

✨ *OWNER COMMANDS* ✨
┏━━━━━━━━━━━━━┓
┃ 🔴 .ban | 🔵 .unban
┃ ✅️ .sudo | ❌️ .delsudo 
┃ 👑 .promote | 👥 .demote
┃ 👋 .kick | 🗑️ .delete
┃ 🚫 .antilink | 🚫 .antibadword
┃ 👥 .tag | 👥 .tagall
┃ 🤖 .chatbot | 🔗 .resetlink
┃ 👋 .welcome | 👋 .goodbye
┗━━━━━━━━━━━━━┛

🌍 *GENERAL COMMANDS* 🌍
┏━━━━━━━━━━━━━┓
┃ 📜 .menu | 📶 .ping
┃ ⏱️ .runtime | 👑 .owner
┃ 😂 .joke | 💬 .quote
┃ 🧠 .fact | 🌦️ .weather
┃ 📰 .news | 💌 .attp
┃ 🎵 .lyrics | 🎱 .8ball
┃ ℹ️ .groupinfo | 👮 .admins
┃ 🔍 .jid | 📸 .ss
┃ 🌍 .trt | 📞 .vv
┗━━━━━━━━━━━━━┛

⚙️ *SETTINGS* ⚙️
┏━━━━━━━━━━━━━┓
┃ 🌐 .public | 🔐 .private
┃ 🟢 .autostatus | 📖 .autoread
┃ 🧹 .clearsession | 🛡️ .antidelete
┃ 💬 .autoreact | 🖼️ .getpp
┃ 📸 .setpp | 📜 .autobio
┃ ⌨️ .autotyping | 🎙️ .autorecording
┗━━━━━━━━━━━━━┛

🎨 *STICKERS* 🎨
┏━━━━━━━━━━━━━┓
┃ 🌀 .blur | 🖼️ .simage
┃ 🌟 .sticker | 🐯 .tgsticker
┃ 🤣 .meme | 🎯 .take
┃ 🔀 .emojimix
┗━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━┓
┃ 🎶 DOWNLOAD COMMANDS
┃
┃ ▶️ .play <song> 
┃ 🎥 .video <name|url>
┃ 🎵 .song <name>
┃ 📥 .ytmp3 <url>
┃ 📥 .ytmp4 <url>
┃ ▶️ .fb <url>
┣━━━━━━━━━━━━━┫
┃ 🔴 .ban | 🔵 .unban
┃ 👑 .promote | 👥 .demote
┃ 👋 .kick | 🗑️ .delete
┃ 🚫 .antilink | 🚫 .antibadword
┃ 👥 .tag | 👥 .tagall
┃ 🤖 .chatbot | 🔗 .resetlink
┃ 👋 .welcome | 👋 .goodbye
┃ 🛡️ .sudo | ❌ .delsudo
┗━━━━━━━━━━━━━┛


🎮 *GAMES* 🎮
┏━━━━━━━━━━━━━┓
┃ ❌⭕ .tictactoe | 🎯 .hangman
┃ ❓ .guess | 🧠 .trivia
┃ ✍️ .answer | 🤐 .truth
┃ 😈 .dare
┗━━━━━━━━━━━━━┛

🤖 *AI & SEARCH* 🤖
┏━━━━━━━━━━━━━┓
┃ 🤖 .gpt | 💡 .gptgo
┃ 🧬 .gemini | 🧠 .flux
┃ 🎨 .imagine
┗━━━━━━━━━━━━━┛

🎭 *FUN ZONE* 🎭
┏━━━━━━━━━━━━━┓
┃ 💘 .compliment | 😡 .insult
┃ 😍 .flirt | 💋 .kiss
┃ 📜 .shayari | 🌙 .goodnight
┃ 🌹 .roseday | 🎭 .character
┃ ☠️ .wasted | 🚢 .ship
┃ 😈 .simp | 🤪 .stupid
┃ 🧠 .brainwash | 🐔 .detect
┃ 👻 .ghost | 🧠 .mindread
┃ 💩 .toilet | 📞 .callmom
┃ 💘 .crush | 🪞 .mirror
┃ 💣 .explode | 🕵️ .spy
┃ 💨 .bombgas | 🛏️ .bedrate
┃ 🤰 .pregnancycheck | 💘 .lovecheck
┃ 🌈 .gaycheck | 🔥 .hornycheck
┃ 👑 .shafi
┗━━━━━━━━━━━━━┛

🧰 *MAKER* 🧰
┏━━━━━━━━━━━━━┓
┃ 🔥 .fire | ⚡ .thunder
┃ ❄️ .ice | 🌫️ .snow
┃ 👹 .devil | 💜 .purple
┃ 💡 .light
┗━━━━━━━━━━━━━┛

🚀 *SYSTEM* 🚀
┏━━━━━━━━━━━━━┓
┃ 🔄 .update 
┗━━━━━━━━━━━━━┛
`;

    try {
        const imagePath = path.join(__dirname, '../assets/pathan_img.jpg');
        const audioPath = path.join(__dirname, '../assets/menu.mp3');
        const audio3Path = path.join(__dirname, '../assets/audio3.mp3');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: false,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420933039839@newsletter',
                        newsletterName: settings.botName,
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });

            if (fs.existsSync(audioPath)) {
                const audioBuffer = fs.readFileSync(audioPath);
                await sock.sendMessage(chatId, {
                    audio: audioBuffer,
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: message });
            }

            if (fs.existsSync(audio3Path)) {
                const audio3Buffer = fs.readFileSync(audio3Path);
                await sock.sendMessage(chatId, {
                    audio: audio3Buffer,
                    mimetype: 'audio/mp4',
                    ptt: true
                }, { quoted: message });
            }

        } else {
            await sock.sendMessage(chatId, { text: helpMessage });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
