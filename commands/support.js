const supportCommand = {
  name: "support",
  alias: ["helpcenter", "contact", "website"],
  category: "core",
  desc: "Show SPACE-MD support center",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    
    const caption = `╭──────────────────┉
│◊ *🔵SPACE-MD🇿🇼 SUPPORT* 
│◊ HELLO: *${pushName}*
╰──────────────────┉

*Your SPACE-MD Support Website is LIVE!* 🚀

🌐 *WEBSITE:* https://support-black-eight.vercel.app/
👑 *OWNER:* DARK-EYE-OFC
🤖 *BOT:* SPACE-MD V5.6.9
⚡ *STATUS:* Online

Click the button below to open the website.

> *Built by DARK-EYE-OFC - Zimbabwe's Finest*
`;

    await sock.sendMessage(from, {
      text: caption,
      footer: "SPACE-MD | DARK-EYE-OFC",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: '🌐 OPEN SUPPORT WEBSITE',
            url: 'https://support-black-eight.vercel.app/'
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '💬 CHAT WITH DEV',
            url: 'https://wa.me/263788279395'
          }
        },
        {
          index: 3,
          urlButton: {
            displayText: '⭐ GITHUB',
            url: 'https://github.com/DARK-EYE-OFC'
          }
        }
      ]
    }, { quoted: msg });
  }
}

module.exports = supportCommand;
