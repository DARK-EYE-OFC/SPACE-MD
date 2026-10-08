const axios = require('axios');

const tinyurlCommand = {
  name: "tinyurl",
  alias: ["short", "shorturl", "tiny", "shortlink"],
  category: "tools",
  desc: "Shorten long URL to tiny URL",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    let url = args[0] || (msg.quoted? msg.quoted.text : "");

    if (!url) {
      return await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 TINYURL
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│.tinyurl https://your-long-link.com/very/long...
│◊│
│◊│ Ex:.tinyurl https://support-black-eight.vercel.app/
│◊│
│◊│ Reply to link with.tinyurl
│◊│ also works
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9 - DARK-EYE-OFC*
`
      }, { quoted: msg });
    }

    // Extract URL from text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = url.match(urlRegex);
    if (match) url = match[0];

    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    try {
      await sock.sendMessage(from, { text: `⏳ *Shortening...*\n${url}` }, { quoted: msg });

      // TinyURL API
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const short = res.data;

      // Also get is.gd as backup
      let short2 = "";
      try {
        const res2 = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
        short2 = res2.data;
      } catch {}

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 SHORTENED
╰──────────────────┉

╭──• [ ✅ RESULT ]
│◊│
│◊│ 🌐 Original:
│◊│ ${url.slice(0, 50)}${url.length > 50? "..." : ""}
│◊│
│◊│ 🔗 TinyURL:
│◊│ ${short}
│◊│
│◊│ ${short2? `🔗 IsGd:\n│◊│ ${short2}\n│◊│` : ""}
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *DARK-EYE-OFC*
`;

      await sock.sendMessage(from, {
        text: caption,
        footer: "SPACE-MD | DARK-EYE-OFC",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: '🔗 OPEN SHORT',
              url: short
            }
          },
          {
            index: 2,
            urlButton: {
              displayText: '🌐 SUPPORT WEBSITE',
              url: 'https://support-black-eight.vercel.app/'
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Failed to shorten: ${e.message}\nMake sure link starts with https://` }, { quoted: msg });
    }
  }
}

module.exports = tinyurlCommand;
