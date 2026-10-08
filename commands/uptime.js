const uptimeCommand = {
  name: "uptime",
  alias: ["runtime", "up", "running"],
  category: "core",
  desc: "Show bot uptime",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    
    // Calculate uptime
    const uptimeSec = process.uptime();
    const days = Math.floor(uptimeSec / 86400);
    const hours = Math.floor((uptimeSec % 86400) / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    const secs = Math.floor(uptimeSec % 60);
    
    const uptimeFormatted = `${days}d ${hours}h ${mins}m ${secs}s`;

    const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ ⏱️ UPTIME CHECK
╰──────────────────┉

╭──• [ ⏰ UPTIME ]
│◊│
│◊│  🤖 BOT: SPACE-MD🇿🇼
│◊│  📦 VER: V5.6.9
│◊│  ⏱️ UP: ${uptimeFormatted}
│◊│  📊 DAYS: ${days}
│◊│  🕝 HOURS: ${hours}
│◊│  💤 MINS: ${mins}
│◊│  ⚡ SECS: ${secs}
│◊│
│◊│  👑 BY: DARK-EYE-OFC
│◊│  🌐 WEB: support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Running Smooth Since Startup 🚀*
`;

    await sock.sendMessage(from, {
      text: caption,
      footer: "SPACE-MD | DARK-EYE-OFC",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: '🌐 SUPPORT WEBSITE',
            url: 'https://support-black-eight.vercel.app/'
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '📡 PING TEST',
            url: 'https://wa.me/263788279395?text=.ping'
          }
        }
      ]
    }, { quoted: msg });
  }
}

module.exports = uptimeCommand;
