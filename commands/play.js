
const yts = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const https = require('https');

if (!global.songCache) global.songCache = new Map();

const react = async (sock, m, emoji) => {
  try { await sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } }); } catch {}
}

function getLyrics(title) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(title + " lyrics");
    https.get(`https://api.lyrics.ovh/v1/auto/${q}`, (res) => {
      let d = "";
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          resolve(j.lyrics || "Lyrics not found. Try Google: " + title);
        } catch { resolve("Lyrics not found"); }
      });
    }).on('error', () => resolve("Lyrics not found"));
  });
}

 const playCommand = {
  name: "play",
  alias: ["song", "music", "1", "2", "3", "4", "5", "6"],
  async execute(sock, m, args) {
    const jid = m.key.remoteJid;
const sender = m.key.participant || m.key.remoteJid;
const cacheKey = m.key.participant || m.key.remoteJid;
    const body = m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const cmd = body.trim().split(" ")[0].replace(/^[.\/!]/,"").toLowerCase();
    const isNumberSelect = ["1","2","3","4","5","6"].includes(cmd);

    if (isNumberSelect) {
      const cached = global.songCache.get(cacheKey) || global.songCache.get(sender) || global.songCache.get(jid);
      if (!cached) return sock.sendMessage(jid, { text: "❌ No song found. First type *.play <song name>*" }, { quoted: m });
      const videoUrl = cached.url;
      const info = cached.info;
      await react(sock, m, "♻️");
      try {
        const tempFile = path.join(__dirname, `../temp/${Date.now()}`);
        if (["1","2","3"].includes(cmd)) {
          const filePath = tempFile + ".mp3";
          await new Promise((res, rej) => {
            ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' }).pipe(fs.createWriteStream(filePath)).on('finish', res).on('error', rej);
          });
          if (cmd === "1") await sock.sendMessage(jid, { audio: fs.readFileSync(filePath), mimetype: 'audio/mpeg' }, { quoted: m });
          if (cmd === "2") await sock.sendMessage(jid, { document: fs.readFileSync(filePath), mimetype: 'audio/mpeg', fileName: `${info.title}.mp3` }, { quoted: m });
          if (cmd === "3") await sock.sendMessage(jid, { audio: fs.readFileSync(filePath), mimetype: 'audio/mpeg', ptt: true }, { quoted: m });
          fs.unlinkSync(filePath);
          await react(sock, m, "🎶");
        } else if (["4","5"].includes(cmd)) {
          const filePath = tempFile + ".mp4";
          await new Promise((res, rej) => {
            ytdl(videoUrl, { quality: '18' }).pipe(fs.createWriteStream(filePath)).on('finish', res).on('error', rej);
          });
          if (cmd === "4") await sock.sendMessage(jid, { video: fs.readFileSync(filePath), mimetype: 'video/mp4', caption: `*${info.title}*` }, { quoted: m });
          else await sock.sendMessage(jid, { document: fs.readFileSync(filePath), mimetype: 'video/mp4', fileName: `${info.title}.mp4` }, { quoted: m });
          fs.unlinkSync(filePath);
          await react(sock, m, "🎶");
        } else if (cmd === "6") {
          let lyrics = await getLyrics(info.title);
          await sock.sendMessage(jid, { text: `*📑 LYRICS: ${info.title}*\n\n${lyrics}\n\n> Powered by SPACE MD🇿🇼` }, { quoted: m });
          await react(sock, m, "🎶");
        }
      } catch (e) {
        console.log(e);
        if (e.message.includes("private") || e.message.includes("copyright")) {
          await react(sock, m, "⛔️");
          return sock.sendMessage(jid, { text: "⛔️ This music is private / blocked" }, { quoted: m });
        }
        await react(sock, m, "❌️");
        return sock.sendMessage(jid, { text: `❌ Failed: ${e.message}` }, { quoted: m });
      }
      return;
    }

    const query = args.join(" ");
    if (!query) return sock.sendMessage(jid, { text: "*Example:*.play calm down" }, { quoted: m });
    await react(sock, m, "♻️");
    try {
      const search = await yts(query);
      if (!search.videos.length) {
        await react(sock, m, "❌️");
        return sock.sendMessage(jid, { text: "❌ Not found" }, { quoted: m });
      }
      const video = search.videos[0];
      global.songCache.set(sender, { url: video.url, info: video });
      setTimeout(()=> global.songCache.delete(sender), 5*60*1000);
      const caption = `*╭┈───〔 sᴘᴀᴄᴇ ᴍᴅ🇿🇼 〕┈───⊷*\n*├• 🗣 Artist:* ${video.author.name}\n*├• 📋 Title:* ${video.title}\n*├• 📺 Channel:* ${video.author.name}\n*├• ⏰ Duration:* ${video.timestamp}\n*├• 👀 Views:* ${video.views.toLocaleString()}\n*├• 🎤 Released:* ${video.ago}\n*╰───────────────────⊷*\n*╭───⬡ sᴇʟᴇᴄᴛ ғᴏʀᴍᴀᴛ ⬡───*\n*├•⬡ 1* 🎧 ᴀᴜᴅɪᴏ (ᴍᴘ3)\n*├•⬡ 2*🎤 ᴀᴜᴅɪᴏ ᴅᴏᴄᴜᴍᴇɴᴛ\n*├•⬡ 3* 🗣 ᴠᴏɪᴄᴇ ɴᴏᴛᴇ\n*├•⬡ 4* 🎥 ᴠɪᴅᴇᴏ (ᴍᴘ4)\n*├•⬡ 5* 🎬 ᴠɪᴅᴇᴏ ᴅᴏᴄᴜᴍᴇɴᴛ \n*├•⬡ 6* 📑 sᴏɴɢ ʟʏʀɪᴄs\n*╰───────────────────⊷*\n\n> Powered by SPACE MD 🇿🇼`;
      await sock.sendMessage(jid, { image: { url: video.thumbnail }, caption }, { quoted: m });
    } catch (e) {
      await react(sock, m, "❌️");
      await sock.sendMessage(jid, { text: `❌ Error: ${e.message}` }, { quoted: m });
    }
  }
}

module.exports = playCommand;;
