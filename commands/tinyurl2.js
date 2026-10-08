const axios = require('axios');

const tinyurl2Command = {
  name: "tinyurl3",
  alias: ["short", "shorturl", "tiny", "shortlink"],
  category: "tools",
  desc: "Shorten URL with custom alias",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    let text = args.join(" ").trim();

    if (!text || !text.includes("http")) {
      return await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 TINYURL V2 - CUSTOM
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│ 1. Normal short:
│◊│.tinyurl https://longlink.com
│◊│
│◊│ 2. Custom alias:
│◊│.tinyurl d-eye | https://link.com
│◊│.tinyurl SPACE-MD | https://link.com
│◊│
│◊│ Result: tinyurl.com/d-eye
│◊│ Result: tinyurl.com/SPACE-MD
│◊│
│◊│ ⚠️ Alias: no dots, no spaces
│◊│ Use - or _ instead of.
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9*
`
      }, { quoted: msg });
    }

    let alias = "";
    let longUrl = "";

    if (text.includes("|")) {
      let parts = text.split("|").map(v => v.trim());
      alias = parts[0];
      longUrl = parts[1];
    } else {
      longUrl = text;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = longUrl.match(urlRegex);
    if (match) longUrl = match[0];

    // Clean alias - tinyurl doesn't allow dots
    if (alias) alias = alias.replace(/[^a-zA-Z0-9-_]/g, "-");

    try {
      await sock.sendMessage(from, { text: `⏳ Shortening...\n${alias ? `Alias: ${alias}\n` : ""}URL: ${longUrl}` }, { quoted: msg });

      let apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
      if (alias) apiUrl += `&alias=${encodeURIComponent(alias)}`;

      // Need to use tinyurl with alias via different endpoint
      let short;
      if (alias) {
        // Create with custom alias using tinyurl api
        const res = await axios.get(`https://tinyurl.com/create.php?source=api_create&url=${encodeURIComponent(longUrl)}&alias=${encodeURIComponent(alias)}`);
        short = res.data;
        // If alias taken, it returns Error
        if (short.includes("Error") || short.includes("not available")) {
          throw new Error(`Alias "${alias}" already taken! Try another: ${alias}-md, ${alias}-${Math.floor(Math.random()*99)}`);
        }
      } else {
        const res = await axios.get(apiUrl);
        short = res.data;
      }

      const caption = `╭──• [ ✅ SHORTENED ]\n│◊│\n│◊│ 🌐 Original: ${longUrl.slice(0,40)}...\n│◊│ 🔗 Short: ${short}\n│◊│ ${alias? `🏷️ Alias: ${alias}` : ""}\n│◊│\n│◊╰──────\n\n${short}`;

      await sock.sendMessage(from, {
        text: caption,
        footer: "SPACE-MD",
        templateButtons: [
          { index: 1, urlButton: { displayText: '🔗 OPEN', url: short } }
        ]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, { text: `❌ ${e.message}\n\nTip: alias can't have dots. Use:\n.tinyurl d-eye-md | ${longUrl}` }, { quoted: msg });
    }
  }
}

module.exports = tinyurl2Command;
