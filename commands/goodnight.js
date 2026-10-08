const goodnightCommand = {
  name: "goodnight",
  alias: ["gn", "night", "sleep", "goodn8"],
  category: "fun",
  desc: "Say goodnight stylish",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    const hours = new Date().getHours();
    let greeting = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";
    
    const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  🌙SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🌙 ${greeting} ✨
╰──────────────────┉

╭──• [ 🌙 GOODNIGHT ]
│◊│
│◊│  🌟 Sleep tight, ${pushName}
│◊│  💤 Dream big, code bigger
│◊│  🌙 SPACE-MD guards your night
│◊│  ✨ Tomorrow we build V6
│◊│
│◊│  🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Built by DARK-EYE-OFC - Zimbabwe's Finest*
> *Goodnight from SPACE-MD V5.6.9* 🌙
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
            displayText: '💤 GOODMORNING CMD',
            url: 'https://wa.me/263788279395?text=.goodmorning'
          }
        }
      ]
    }, { quoted: msg });
  }
}

module.exports = goodnightCommand;
