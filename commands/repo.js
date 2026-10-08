const fs = require('fs');
const path = require('path');

const repoCommand = {
  name: "repo",
  alias: ["sc", "script"],
  category: "core",
  status: "working",
  desc: "Get SPACE-MD repository",

  async execute(sock, msg, args, from) {
    try {
      // ♻️ Loading reaction
      await sock.sendMessage(from, {
        react: { text: "♻️", key: msg.key }
      });

      const pushName = msg.pushName || "User";

      const repoText = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  *🔵SPACE-MD🇿🇼* ]
│◊│ 
│◊│ *_♤ HELLO: *${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🌌 SPACE MD Repository
╰──────────────────┉

╭────────────┉•┉
│◊╭─◊ [ 📦 REPO INFO ]
│◊ ⊢──• [ 🖥️ DETAILS ]
│◊│ 🤖 \`ʙᴏᴛ\` : SPACE-MD🇿🇼 V5.6.9
│◊│ 👑 \`ᴏᴡɴᴇʀ\` : DARK-EYE OFFICIAL DEV
│◊│ 🏢 \`TEAM\` : DARK-EYE TECH OFFICIALS
│◊│ 🌍 \`ORIGIN\` : Zimbabwe 🇿🇼
│◊│ 📦 \`CMDS\` : 1000 Commands
│◊│ ⚡ \`BAILEYS\` : Multi-Device
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 🔗 LINKS ]
│◊│
│◊│  💻 GitHub Repo:
│◊│  https://github.com/DARK-EYE-OFC/SPACE-MD
│◊│
│◊│  📢 WhatsApp Channel:
│◊│  https://whatsapp.com/channel/0029Vb6zh00FcowG8euO480M
│◊│
│◊│  🎥 YouTube Tutorial:
│◊│  https://youtube.com/@dark-eye-officials 
│◊│
│◊│  👑 Owner Contact:
│◊│  wa.me/263788279395 (DARK-EYE OFC)
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 🛠️ FORK & DEPLOY ]
│◊│
│◊│  1. Fork the repo ⭐
│◊│  2. Get SESSION_ID from pair site
│◊│  3. Deploy to Heroku / Panel
│◊│  4. Enjoy 1000 commands 🚀
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

*_⭐ Don't forget to star the repository_*`;

      const imagePath = path.join(__dirname, '../assets/menu.jpg');
      
      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: repoText
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, { text: repoText }, { quoted: msg });
      }

      // 🎈 Done reaction
      await sock.sendMessage(from, {
        react: { text: "🎈", key: msg.key }
      });

    } catch (e) {
      console.log("REPO ERROR:", e);
      // ❌ Failed reaction
      await sock.sendMessage(from, {
        react: { text: "❌", key: msg.key }
      });
      await sock.sendMessage(from, { text: "*❌ Failed to fetch repo info*" }, { quoted: msg });
    }
  }
}

module.exports = repoCommand;
