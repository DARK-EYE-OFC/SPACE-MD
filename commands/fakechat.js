const fakechatCommand = {
  name: "fakechat",
  alias: ["fchat", "fake", "fakemsg"],
  category: "fun",
  desc: "Create fake WhatsApp chat screenshot",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    const text = args.join(" ");

    if (!text.includes("|")) {
      const help = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 😂 FAKECHAT HELP
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│ Format: .fakechat name | message
│◊│
│◊│ Example:
│◊│ .fakechat Elon Musk | Bro send me 1 BTC
│◊│
│◊│ .fakechat Mom | Come home now!
│◊│ .fakechat CR7 | Siuuu Zimbabwe!
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9 - DARK-EYE-OFC*
`;
      return await sock.sendMessage(from, { text: help }, { quoted: msg });
    }

    const [fakeName, fakeMsg] = text.split("|").map(v => v.trim());
    if (!fakeName ||!fakeMsg) return await sock.sendMessage(from, { text: "❌ Provide name and message!\nEx: .fakechat John | Hello bro" }, { quoted: msg });

    try {
      // Use fake chat API
      const apiUrl = `https://some-random-api.com/canvas/misc/fakechat?avatar=https://i.imgur.com/2wzGhpF.jpeg&username=${encodeURIComponent(fakeName)}&text=${encodeURIComponent(fakeMsg)}&darkmode=true`;

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 😂 FAKE CHAT
╰──────────────────┉

╭──• [ 💬 FAKE CHAT CREATED ]
│◊│
│◊│ 👤 NAME: ${fakeName}
│◊│ 💬 MSG: ${fakeMsg}
│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Made with SPACE-MD V5.6.9*
`;

      await sock.sendMessage(from, {
        image: { url: apiUrl },
        caption: caption,
        footer: "SPACE-MD | DARK-EYE-OFC",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: '🌐 SUPPORT WEBSITE',
              url: 'https://support-black-eight.vercel.app/'
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      // Fallback text fake if image fails
      const fakeText = `┌─── WhatsApp ───┐
│ ${fakeName} 🟢 online │
└───────────────┘

[${fakeName}]: ${fakeMsg}
[You]: 😂😂😂

_FAKE CHAT BY SPACE-MD_`;

      await sock.sendMessage(from, {
        text: `╭──• [ 😂 FAKE CHAT ]\n│◊│\n│◊│ 👤 ${fakeName}\n│◊│ 💬 ${fakeMsg}\n│◊│\n│◊╰──────\n\n${fakeText}`
      }, { quoted: msg });
    }
  }
}

module.exports = fakechatCommand;
