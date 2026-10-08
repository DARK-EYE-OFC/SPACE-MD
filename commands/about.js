// commands/about.js - SPACE-MD🇿🇼 ABOUT
// Built by DARK-EYE OFC DEV | DARK-EYE TECH OFFICIALS

const aboutCommand = {
  name: "about",
  category: "core",
  status: "working",
  desc: "About SPACE-MD bot info",

  async execute(sock, msg, args, from) {
    const os = require('os');

    // Timezone Harare
    const date = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Harare' });
    const time = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Harare', hour: '2-digit', minute: '2-digit', hour12: true });

    const uptime = Math.floor(process.uptime());
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    const ramUsed = (os.totalmem() - os.freemem()) / 1024 / 1024;
    const ramTotal = os.totalmem() / 1024 / 1024;

    const aboutText = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  🔵SPACE-MD🇿🇼 ]
│◊│ 
│◊│ *_♤ HELLO: ${msg.pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🌌 About Universe
╰──────────────────┉

╭────────────┉•┉
│◊╭─◊ [ 📑 ABOUT BOT ]
│◊ ⊢──• [ 🖥️ INFO ]
│◊│ 🤖 \`ʙᴏᴛ\` : SPACE-MD🇿🇼 V3.0.0
│◊│ 👑 \`ᴏᴡɴᴇʀ\` : DARK-EYE OFC DEV
│◊│ 🏢 \`TEAM\` : DARK-EYE TECH OFFICIALS
│◊│ 🌍 \`ORIGIN\` : Zimbabwe 🇿🇼
│◊│ 💾 \`RAM\` : ${ramUsed.toFixed(0)} / ${ramTotal.toFixed(0)} MB
│◊│ ⏰ \`UPTIME\` : ${hours}h ${minutes}m
│◊│ 📆 \`DATE\` : ${date}
│◊│ 🕝 \`TIME\` : ${time}
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ ✨ DESCRIPTION ]
│◊│
│◊│  Yoh, what's up, I'm SPACE-MD from
│◊│  Zimbabwe. Built and coded by
│◊│  DARK-EYE OFC DEV.
│◊│
│◊│  I have 1000 commands. Your wish
│◊│  is my command. I'm here to satisfy
│◊│  you all.
│◊│
│◊│  I'm easy, reliable, protective,
│◊│  and powerful in the universe ✨️.
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 🔗 LINKS ]
│◊│
│◊│  👑 Owner: wa.me/263...
│◊│  📢 Channel: dark-eye tech
│◊│  💻 GitHub: github.com/dark-eye
│◊│  🎥 YouTube: DARK-EYE OFC
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

━━━━━━━━━━━━━━━━━━━━━━
🔵 SPACE-MD🇿🇼 | V3.0
👑 DARK-EYE OFC | 1000 CMDS
⚡ Powerful in the universe ✨️
━━━━━━━━━━━━━━━━━━━━━━`;

    // Send text
    await sock.sendMessage(from, { text: aboutText }, { quoted: msg });

    // Send menu voice with low drill beat - your SUNO audio
    await sock.sendMessage(from, {
      audio: { url: "./media/menu.mp3" },
      mimetype: 'audio/mpeg',
      ptt: true,
    }, { quoted: msg });
  }
}

module.exports = aboutCommand;
