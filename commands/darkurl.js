const axios = require('axios');

const darkurlCommand = {
  name: "darkurl",
  alias: ["spaceurl", "durl", "dark-url", "space-url"],
  category: "tools",
  desc: "Shorten URL with DARK-EYE auto alias",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    let text = args.join(" ").trim();

    const prefixes = [
      "dark-eye-ofc",
      "dark-eye",
      "dark-eye-tech",
      "spaceurl",
      "space-md",
      "space-md-zw",
      "dark-eye-ofc-zw",
      "dark-eye-official",
      "dark-eye-zw",
      "space-md-com",
      "dark-eye-md",
      "space-md-official",
      "dark-eye-space"
    ];

    if (!text ||!text.includes("http")) {
      return await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 DARKURL / SPACEURL
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│ Auto alias:
│◊│.darkurl https://longlink.com
│◊│.spaceurl https://longlink.com
│◊│
│◊│ Custom alias:
│◊│.darkurl myname | https://link.com
│◊│.spaceurl dark-eye-001 | https://link.com
│◊│
│◊│ Auto prefixes:
│◊│ ${prefixes.join(", ")}
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9 - DARK-EYE-OFC*
`
      }, { quoted: msg });
    }

    let customAlias = "";
    let longUrl = "";

    if (text.includes("|")) {
      const parts = text.split("|").map(v => v.trim());
      customAlias = parts[0].replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();
      longUrl = parts[1];
    } else {
      longUrl = text;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = longUrl.match(urlRegex);
    if (match) longUrl = match[0];

    // Generate auto alias if not provided
    function genAlias() {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const rand = Math.floor(Math.random() * 9999) + 100;
      const styles = [
        `${prefix}`,
        `${prefix}-${rand}`,
        `${prefix}-${Math.floor(Math.random()*99)}`,
        `${prefix}-zw`,
        `${prefix}-ofc`
      ];
      return styles[Math.floor(Math.random() * styles.length)];
    }

    let aliasToUse = customAlias || genAlias();
    let attempts = 0;

    try {
      await sock.sendMessage(from, { text: `🔗 *DARKURL*\n⏳ Creating...\n🔗 ${longUrl}\n🏷️ Trying alias: ${aliasToUse}` }, { quoted: msg });

      let shortUrl = null;

      while (attempts < 5) {
        try {
          const api = `https://tinyurl.com/create.php?source=api_create&url=${encodeURIComponent(longUrl)}&alias=${encodeURIComponent(aliasToUse)}`;
          const res = await axios.get(api);
          const data = res.data.trim();

          if (data.startsWith("https://") &&!data.includes("Error")) {
            shortUrl = data;
            break;
          } else if (data.includes("not available") || data.includes("Error") || data.includes("already")) {
            // Alias taken, generate new
            attempts++;
            aliasToUse = genAlias();
            continue;
          } else {
            shortUrl = data;
            break;
          }
        } catch (err) {
          attempts++;
          aliasToUse = genAlias();
        }
      }

      // Fallback if all alias taken -> normal tinyurl
      if (!shortUrl) {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        shortUrl = res.data.trim();
        aliasToUse = "random";
      }

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 DARKURL SUCCESS
╰──────────────────┉

╭──• [ ✅ RESULT ]
│◊│
│◊│ 🌐 Original:
│◊│ ${longUrl.slice(0, 45)}${longUrl.length > 45? "..." : ""}
│◊│
│◊│ 🏷️ Alias:
│◊│ ${aliasToUse}
│◊│
│◊│ 🔗 DarkURL:
│◊│ ${shortUrl}
│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

${shortUrl}

> *DARK-EYE-OFC | SPACE-MD V5.6.9*
`;

      await sock.sendMessage(from, {
        text: caption,
        footer: "SPACE-MD | DARK-EYE-OFC",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: '🔗 OPEN DARKURL',
              url: shortUrl
            }
          },
          {
            index: 2,
            urlButton: {
              displayText: '🌐 SUPPORT',
              url: 'https://support-black-eight.vercel.app/'
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, { text: `❌ DARKURL Failed: ${e.message}` }, { quoted: msg });
    }
  }
}

module.exports = darkurlCommand;
