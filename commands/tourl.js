const axios = require('axios');
const FormData = require('form-data');

const urlCommand = {
  name: "tourl",
  alias: ["upload", "geturl", "catbox"],
  category: "tools",
  desc: "Convert image/video/sticker to URL",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    const quoted = msg.quoted;

    if (!quoted || (quoted.mtype !== "imageMessage" && quoted.mtype !== "videoMessage" && quoted.mtype !== "stickerMessage" && quoted.mtype !== "audioMessage" && quoted.mtype !== "documentMessage")) {
      return await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 URL / TOURl
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│ Reply to image/video/sticker
│◊│ with:.url or.tourl
│◊│
│◊│ Ex: reply image >.tourl
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9*
`
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(from, { text: "⏳ *Uploading to Catbox...* Please wait..." }, { quoted: msg });

      const buffer = await quoted.download();
      const mime = quoted.mimetype || "image/jpeg";
      const ext = mime.split('/')[1] || "jpg";

      // Upload to catbox.moe
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', buffer, `file.${ext}`);

      const res = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders()
      });

      const url = res.data.trim();

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔗 URL CREATED
╰──────────────────┉

╭──• [ ✅ SUCCESS ]
│◊│
│◊│ 📁 Type: ${mime}
│◊│ 📦 Size: ${(buffer.length / 1024).toFixed(2)} KB
│◊│ 🔗 URL: ${url}
│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

${url}

> *Never expires - Catbox*
> *Built by DARK-EYE-OFC*
`;

      await sock.sendMessage(from, {
        text: caption,
        footer: "SPACE-MD | DARK-EYE-OFC",
        templateButtons: [
          {
            index: 1,
            urlButton: {
              displayText: '🔗 OPEN URL',
              url: url
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
      console.log("URL ERROR:", e);
      // Fallback to file.io
      try {
        const buffer = await quoted.download();
        const form = new FormData();
        form.append('file', buffer, 'file.jpg');
        const res = await axios.post("https://file.io", form, { headers: form.getHeaders() });
        await sock.sendMessage(from, { text: `✅ *URL:*\n${res.data.link}\n\nExpires: ${res.data.expires}` }, { quoted: msg });
      } catch (err) {
        await sock.sendMessage(from, { text: `❌ Upload failed: ${e.message}` }, { quoted: msg });
      }
    }
  }
}

module.exports = tourlCommand;
