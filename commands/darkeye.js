const fs = require('fs');
const path = require('path');

const darkeyeCommand = {
  name: "darkeye",
  alias: ["theon", "dark-eye", "dev"],
  category: "core",
  status: "working",
  desc: "About DARK-EYE-OFC DEV",

  async execute(sock, msg, args, from) {
    try {
      await sock.sendMessage(from, { react: { text: "♻️", key: msg.key } });

      const pushName = msg.pushName || "User";

      const darkeyeText = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  *🔵SPACE-MD🇿🇼* ]
│◊│ 
│◊│ *_♤ HELLO: *${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 👑 DARK-EYE-OFC BIOGRAPHY
╰──────────────────┉

╭────────────┉•┉
│◊╭─◊ [ 👑 THE LEGEND ]
│◊ ⊢──• [ 🌍 ZIMBABWE ]
│◊│ 👑 \`NAME\` : Theon Alex
│◊│ 🎭 \`ALIAS\` : DARK-EYE-OFC
│◊│ 🏢 \`TEAM\` : DARK-EYE TECH OFFICIALS
│◊│ 🤖 \`BOT\` : SPACE-MD🇿🇼 V5.6.9
│◊│ 🌍 \`ORIGIN\` : Zimbabwe 🇿🇼
│◊│ 📦 \`CMDS\` : 1000+ Commands
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 📖 WHO IS DARK-EYE-OFC? ]
│◊│
│◊│ Theon Alex, professionally known as 
│◊│ *DARK-EYE-OFC*, is a Zimbabwean tech 
│◊│ genius, developer and founder of 
│◊│ *DARK-EYE TECH OFFICIALS*.
│◊│
│◊│ He is the mastermind behind the 
│◊│ powerful WhatsApp bot *🔵SPACE-MD🇿🇼*,
│◊│ which started as a small V3 project 
│◊│ and has now evolved into *V5.6.9* 
│◊│ with over 1000 commands, making it 
│◊│ one of the most advanced Baileys MD 
│◊│ bots in Zimbabwe and Africa.
│◊│
│◊│ From Harare to the world, DARK-EYE 
│◊│ built SPACE-MD to give everyone 
│◊│ free access to downloaders, AI, 
│◊│ converters, group management and 
│◊│ fun - all in one bot.
│◊│
│◊│ His mission is to put Zimbabwe on 
│◊│ the map in the world of open-source 
│◊│ development. Not just a coder, but 
│◊│ a leader, innovator and inspiration 
│◊│ to many young devs in Zim.
│◊│
│◊│ *SPACE-MD is not just a bot, it's 
│◊│ a Zimbabwean legacy.* 🇿🇼
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 🔗 CONNECT WITH DEV ]
│◊│ 📞 wa.me/263788279395
│◊│ 💻 github.com/DARK-EYE-OFC
│◊│ 📢 Channel in menu
│◊╰────────────┉•┉
╰──────────────────┉

*_Built with ❤️ by DARK-EYE-OFC - Zimbabwe's Finest_*`;

      const imagePath = path.join(__dirname, '../assets/menu.jpg');

      const templateButtons = [
        {
          index: 1,
          urlButton: {
            displayText: '👑 FOLLOW DARK-EYE [CLICK HERE]',
            url: 'https://github.com/DARK-EYE-OFC'
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '💬 CHAT WITH DEV',
            url: 'https://wa.me/263788279395'
          }
        }
      ];

      if (fs.existsSync(imagePath)) {
        await sock.sendMessage(from, {
          image: fs.readFileSync(imagePath),
          caption: darkeyeText,
          footer: "🔵 SPACE-MD🇿🇼 | DARK-EYE TECH OFFICIALS",
          templateButtons: templateButtons
        }, { quoted: msg });
      } else {
        await sock.sendMessage(from, {
          text: darkeyeText,
          footer: "SPACE-MD V5.6.9",
          templateButtons: templateButtons
        }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: "🎈", key: msg.key } });

    } catch (e) {
      console.log("DARKEYE ERROR:", e);
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
    }
  }
}

module.exports = darkeyeCommand;
