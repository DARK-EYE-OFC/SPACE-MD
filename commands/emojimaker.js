const axios = require('axios');

const emojimakerCommand = {
  name: "emojimaker",
  alias: ["emoji", "emojimix", "emojis2", "emojistic", "emojisticker", "mix", "semoji"],
  category: "fun",
  desc: "Emoji tools - maker, mix, sticker, gif",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    const cmd = msg.body?.split(' ')[0]?.replace('.', '').toLowerCase() || "";
    const q = args.join(" ").trim();
    const quoted = msg.quoted;

    const packname = "DARK-EYE TECH";
    const author = "SPACE-MD🇿🇼 V5.6.9";

    const help = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 😀 EMOJI MAKER
╰──────────────────┉

╭──• [ 🛠️ COMMANDS ]
│◊│
│◊│ 1️⃣.emoji <desc> or reply image
│◊│ → Make sticker with emoji pack
│◊│ Ex:.emoji love | reply image
│◊│
│◊│ 2️⃣.emojimix 😂+😭
│◊│ → Mix 2 emojis into 1
│◊│ Ex:.emojimix 😂 😭
│◊│
│◊│ 3️⃣.emojis2 😎
│◊│ → Create sticker using emoji
│◊│ Ex:.emojis2 😎🔥
│◊│
│◊│ 4️⃣.emojistic 😂
│◊│ → Create GIF sticker using emoji
│◊│ Ex:.emojistic 😂
│◊│
│◊│ 📦 Pack: ${packname}
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *DARK-EYE-OFC*
`;

    // EMOJIMIX: mix 2 emojis
    if (cmd.includes("emojimix") || cmd.includes("mix")) {
      if (!q) return await sock.sendMessage(from, { text: help }, { quoted: msg });
      let emojis = q.split(/[\s+]+/).filter(e => e.trim());
      if (emojis.length < 2) {
        // Try split by +
        emojis = q.split('+');
      }
      if (emojis.length < 2) return await sock.sendMessage(from, { text: "❌ Send 2 emojis\nEx:.emojimix 😂 😭\nEx:.emojimix 😂+😭" }, { quoted: msg });

      try {
        const e1 = encodeURIComponent(emojis[0].trim());
        const e2 = encodeURIComponent(emojis[1].trim());
        // Tenor emoji kitchen API
        const api = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v6&q=${e1}_${e2}`;

        const res = await axios.get(api);
        const url = res.data?.results?.[0]?.media_formats?.png_transparent?.url || res.data?.results?.[0]?.url;

        if (!url) throw new Error("No mix found");

        await sock.sendMessage(from, {
          sticker: { url: url },
          packname: packname,
          author: author
        }, { quoted: msg });

        await sock.sendMessage(from, {
          text: `╭──• [ 😀 EMOJI MIX ]\n│◊│ ${emojis[0]} + ${emojis[1]} = Mixed!\n│◊│ 📦 ${packname}\n╰──────`
        }, { quoted: msg });

      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Mix failed for ${emojis[0]} + ${emojis[1]}\nTry other emojis! Some combos don't exist.` }, { quoted: msg });
      }
      return;
    }

    // EMOJIS2: create sticker using emoji
    if (cmd.includes("emojis2") || cmd === "semoji") {
      if (!q) return await sock.sendMessage(from, { text: "❌ Send emoji\nEx:.emojis2 😎\nEx:.emojis2 😂🔥💀" }, { quoted: msg });
      try {
        const emoji = q.trim().split(' ')[0];
        const api = `https://api.dicebear.com/7.x/fun-emoji/png?seed=${encodeURIComponent(emoji)}`;
        // Better: use emoji to png via twemoji
        const code = emoji.codePointAt(0).toString(16);
        const twemojiUrl = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${code}.png`;

        await sock.sendMessage(from, {
          sticker: { url: twemojiUrl },
          packname: packname,
          author: author
        }, { quoted: msg });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
      }
      return;
    }

    // EMOJISTIC: gif sticker using emoji
    if (cmd.includes("emojistic") || cmd.includes("emojisticker")) {
      if (!q) return await sock.sendMessage(from, { text: "❌ Send emoji for gif sticker\nEx:.emojistic 😂\nEx:.emojisticker 🔥" }, { quoted: msg });
      try {
        const emoji = q.trim().split(' ')[0];
        // Use animated emoji gif API
        const code = emoji.codePointAt(0).toString(16);
        const gifUrl = `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.gif`;

        // Try download and send as sticker
        await sock.sendMessage(from, {
          sticker: { url: gifUrl },
          packname: packname,
          author: author
        }, { quoted: msg });

        await sock.sendMessage(from, { text: `╭──• [ 🎞️ EMOJI GIF ]\n│◊│ ${emoji} → Animated!\n│◊│ 📦 ${packname}\n╰──────` }, { quoted: msg });

      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Gif failed, trying static...\n${e.message}` }, { quoted: msg });
        // fallback static
        try {
          const code = q.trim().codePointAt(0).toString(16);
          const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${code}.png`;
          await sock.sendMessage(from, { sticker: { url }, packname, author }, { quoted: msg });
        } catch {}
      }
      return;
    }

    // EMOJI: desc or reply image to create real emoji sticker
    if (cmd.includes("emoji")) {
      // If reply to image
      if (quoted && (quoted.mtype === "imageMessage" || quoted.mtype === "stickerMessage")) {
        try {
          const buffer = await quoted.download();
          await sock.sendMessage(from, {
            sticker: buffer,
            packname: packname,
            author: author + (q? ` | ${q}` : "")
          }, { quoted: msg });
          return;
        } catch (e) {
          return await sock.sendMessage(from, { text: `❌ Failed to make sticker: ${e.message}` }, { quoted: msg });
        }
      }

      if (!q) return await sock.sendMessage(from, { text: help }, { quoted: msg });

      // Create sticker with text as emoji desc
      try {
        const api = `https://api.memegen.link/images/custom/_/${encodeURIComponent(q)}.png?background=https://i.imgur.com/2wzGhpF.jpeg`;
        await sock.sendMessage(from, {
          sticker: { url: api },
          packname: packname,
          author: author
        }, { quoted: msg });
      } catch {
        await sock.sendMessage(from, { text: `✅ Emoji desc set: ${q}\n📦 Pack: ${packname}\nReply to image with.emoji to make real emoji sticker!` }, { quoted: msg });
      }
      return;
    }

    await sock.sendMessage(from, { text: help }, { quoted: msg });
  }
}

module.exports = emojimakerCommand;
