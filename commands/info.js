const fs = require('fs');
const path = require('path');
const axios = require('axios');

const infoCommand = {
  name: "info",
  alias: ["information", "spaceinfo"],
  category: "core",
  status: "working",
  desc: "Show SPACE-MD repo information live",

  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key: msg.key } });

      const pushName = msg.pushName || "User";
      
      // Fetch GitHub API
      const { data } = await axios.get('https://api.github.com/repos/DARK-EYE-OFC/SPACE-MD');
      
      const lastUpdate = new Date(data.updated_at).toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });

      const infoText = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  *🔵SPACE-MD🇿🇼* ]
│◊│ 
│◊│ *_♤ HELLO: *${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🌌 SPACE MD Information
╰──────────────────┉

╭────────────┉•┉
│◊╭─◊ [ 📦 REPO DETAILS ]
│◊ ⊢──• [ 🖥️ LIVE DATA ]
│◊│ 🔲 \`REPO\` : ${data.name}
│◊│ ⛓️ \`LINK\` : ${data.html_url}
│◊│ 💻 \`CREATOR\` : ${data.owner.login}
│◊│ 💫 \`FORKS\` : ${data.forks_count}
│◊│ 🌟 \`STARS\` : ${data.stargazers_count}
│◊│ 🤪 \`WATCHERS\` : ${data.watchers_count}
│◊│ 📑 \`RELEASES\` : ${data.open_issues} Issues
│◊│ 📦 \`SIZE\` : ${(data.size / 1024).toFixed(2)} MB
│◊│ 📆 \`UPDATED\` : ${lastUpdate}
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 👑 CREDIT ]
│◊│ 🤖 SPACE-MD🇿🇼 V5.6.9
│◊│ 👑 DARK-EYE OFFICIAL DEV
│◊│ 🏢 DARK-EYE TECH OFFICIALS
│◊╰────────────┉•┉
╰──────────────────┉`;

      const imagePath = path.join(__dirname, '../assets/menu.jpg');
      const imageBuffer = fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : null;

      // WhatsApp Button - FORK REPOSITORY [CLICK HERE]
      const buttons = [
        {
          buttonId: '.repo',
          buttonText: { displayText: '⭐ FORK REPOSITORY [CLICK HERE]' },
          type: 1
        }
      ];

      if (imageBuffer) {
        await sock.sendMessage(from, {
          image: imageBuffer,
          caption: infoText,
          footer: "🔵 SPACE-MD🇿🇼 | DARK-EYE OFC",
          buttons: buttons,
          headerType: 4
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          text: infoText,
          footer: "🔵 SPACE-MD🇿🇼 | DARK-EYE OFC",
          buttons: buttons,
          headerType: 1
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: "🎈", key: msg.key } });

    } catch (e) {
      console.log("INFO ERROR:", e.message);
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
      await sock.sendMessage(from, { text: "*❌ Failed to fetch repo info. Check internet / repo exists*" }, { quoted: msg });
    }
  }
}

module.exports = infoCommand;
