const fs = require('fs');
const path = require('path');
const axios = require('axios');

// OWNER NUMBERS
const OWNERS = ["263783546271", "263788279395", "263783546271"];

const DB_PATH = path.join(__dirname, "../../database/darklinks.json");

// Ensure DB
if (!fs.existsSync(path.dirname(DB_PATH))) fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));

function loadLinks() {
  try { return JSON.parse(fs.readFileSync(DB_PATH)); } catch { return []; }
}
function saveLinks(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

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
  "space-md-com"
];

function genAlias() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const rand = Math.floor(Math.random() * 9999) + 100;
  const styles = [`${prefix}`, `${prefix}-${rand}`, `${prefix}-${Math.floor(Math.random()*99)}`, `${prefix}-zw`, `${prefix}-ofc`];
  return styles[Math.floor(Math.random() * styles.length)];
}

const darklinkCommand = {
  name: "darklink",
  alias: ["darklinks", "spacelinks", "myspaceurl", "mydarkurl"],
  category: "owner",
  desc: "Owner darklink manager with auto alias",

  async execute(sock, msg, args, from) {
    const sender = msg.sender || msg.key.participant || from;
    const senderNum = sender.replace(/[^0-9]/g, "");
    const isOwner = OWNERS.some(n => senderNum.includes(n));

    if (!isOwner) {
      return await sock.sendMessage(from, { text: "❌ *OWNER ONLY COMMAND*\n\nThis command is for DARK-EYE-OFC only." }, { quoted: msg });
    }

    const pushName = msg.pushName || "DARK-EYE";
    let text = args.join(" ").trim();
    const links = loadLinks();

    // CASE 1: Show all links
    if (!text) {
      if (links.length === 0) {
        return await sock.sendMessage(from, {
          text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 OWNER ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 DARKLINK DB
╰──────────────────┉

╭──• [ 📭 EMPTY ]
│◊│
│◊│ No custom links saved yet.
│◊│
│◊│ Create one:
│◊│.darklink https://yourlink.com
│◊│.darklink myalias | https://link.com
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *OWNER: ${OWNERS.join(", ")}*
`
        }, { quoted: msg });
      }

      let list = links.map((l, i) => `│◊│ *${i+1}.* ${l.alias}\n│◊│ └ ${l.short}\n│◊│ └ ${l.original.slice(0,35)}...\n│◊│`).join("\n");

      const totalMsg = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 OWNER ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 ALL DARKLINKS - ${links.length}
╰──────────────────┉

╭──• [ 📋 LINKS LIST ]
│◊│
${list}
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Use:.darklink del <number> to delete*
> *Total: ${links.length} links*
`;

      return await sock.sendMessage(from, { text: totalMsg }, { quoted: msg });
    }

    // CASE 2: Delete
    if (text.startsWith("del") || text.startsWith("delete")) {
      const num = parseInt(text.split(" ")[1]);
      if (!num || num < 1 || num > links.length) {
        return await sock.sendMessage(from, { text: `❌ Invalid number. Use:.darklink del 1 to ${links.length}` }, { quoted: msg });
      }
      const removed = links.splice(num - 1, 1);
      saveLinks(links);
      return await sock.sendMessage(from, { text: `✅ Deleted link:\n🔗 ${removed[0].short}\n🏷️ ${removed[0].alias}` }, { quoted: msg });
    }

    // CASE 3: Clear all
    if (text === "clear" || text === "reset") {
      saveLinks([]);
      return await sock.sendMessage(from, { text: "✅ *All darklinks cleared!*" }, { quoted: msg });
    }

    // CASE 4: Create new link
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

    if (!longUrl.startsWith("http")) {
      return await sock.sendMessage(from, { text: `❌ Invalid URL. Must start with https://\nEx:.darklink https://support-black-eight.vercel.app/` }, { quoted: msg });
    }

    let aliasToUse = customAlias || genAlias();
    let attempts = 0;
    let shortUrl = null;

    try {
      await sock.sendMessage(from, { text: `🔗 *DARKLINK OWNER*\n⏳ Creating...\n🏷️ Alias: ${aliasToUse}\n🔗 URL: ${longUrl}` }, { quoted: msg });

      while (attempts < 6) {
        try {
          const api = `https://tinyurl.com/create.php?source=api_create&url=${encodeURIComponent(longUrl)}&alias=${encodeURIComponent(aliasToUse)}`;
          const res = await axios.get(api);
          const data = res.data.trim();

          if (data.startsWith("https://") &&!data.includes("Error")) {
            shortUrl = data;
            break;
          } else {
            attempts++;
            aliasToUse = genAlias();
          }
        } catch {
          attempts++;
          aliasToUse = genAlias();
        }
      }

      if (!shortUrl) {
        const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        shortUrl = res.data.trim();
      }

      // Save to DB
      const newEntry = {
        alias: aliasToUse,
        short: shortUrl,
        original: longUrl,
        date: new Date().toISOString(),
        by: pushName
      };
      links.push(newEntry);
      saveLinks(links);

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 OWNER ]
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 DARKLINK CREATED
╰──────────────────┉

╭──• [ ✅ SAVED - #${links.length} ]
│◊│
│◊│ 🏷️ Alias: ${aliasToUse}
│◊│ 🔗 Short: ${shortUrl}
│◊│ 🌐 Original: ${longUrl.slice(0,40)}...
│◊│ 💾 Saved to database
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

${shortUrl}

> *Total links: ${links.length}*
> *.darklink to view all*
`;

      await sock.sendMessage(from, {
        text: caption,
        footer: "SPACE-MD OWNER",
        templateButtons: [
          { index: 1, urlButton: { displayText: '🔗 OPEN LINK', url: shortUrl } },
          { index: 2, urlButton: { displayText: '🌐 SUPPORT', url: 'https://support-black-eight.vercel.app/' } }
        ]
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
    }
  }
}

module.exports = darklinkCommand;
