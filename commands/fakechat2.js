const fakechat2Command = {
  name: "fakechat2",
  alias: ["fchat2", "fake2", "fakereply"],
  category: "fun",
  desc: "Fake chat with quoted user's real DP",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    const fakeMsg = args.join(" ").trim();

    if (!msg.quoted) {
      return await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 😂 FAKECHAT2 HELP
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│ Reply to someone's message:
│◊│.fakechat2 Hello bro I love you
│◊│
│◊│ Bot will use their real DP
│◊│ and name automatically!
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9 - DARK-EYE-OFC*
`
      }, { quoted: msg });
    }

    if (!fakeMsg) return await sock.sendMessage(from, { text: "❌ Reply with text!\nEx: reply to user >.fakechat2 I miss you" }, { quoted: msg });

    try {
      const targetJid = msg.quoted.sender;
      const targetName = msg.quoted.pushName || targetJid.split('@')[0];

      // Get real DP
      let ppUrl;
      try {
        ppUrl = await sock.profilePictureUrl(targetJid, 'image');
      } catch {
        ppUrl = 'https://i.imgur.com/2wzGhpF.jpeg';
      }

      const apiUrl = `https://some-random-api.com/canvas/misc/fakechat?avatar=${encodeURIComponent(ppUrl)}&username=${encodeURIComponent(targetName)}&text=${encodeURIComponent(fakeMsg)}&darkmode=true`;

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 😂 FAKE CHAT V2
╰──────────────────┉

╭──• [ 💬 FAKE CHAT V2 ]
│◊│
│◊│ 👤 NAME: ${targetName} (real DP)
│◊│ 💬 MSG: ${fakeMsg}
│◊│ 🎯 TARGET: @${targetJid.split('@')[0]}
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
        mentions: [targetJid],
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
              displayText: '😂 FAKECHAT V1',
              url: `https://wa.me/263788279395?text=.fakechat`
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      console.log("FAKECHAT2 ERROR:", e);
      await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
    }
  }
}

module.exports = fakechat2Command;
