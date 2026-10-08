const hd2Command = {
  name: "hd2",
  alias: ["enhance2", "remini2", "hdr2", "upscale2"],
  category: "tools",
  desc: "Enhance image to HD",

  async execute(sock, msg, args, from) {
    const quoted = msg.quoted;
    if (!quoted || quoted.mtype !== "imageMessage") {
      return await sock.sendMessage(from, { text: "❌ Reply to an image with .hd" }, { quoted: msg });
    }
    try {
      await sock.sendMessage(from, { text: "✨ Enhancing..." }, { quoted: msg });
      const buffer = await quoted.download();
      const FormData = require('form-data');
      const axios = require('axios');
      const form = new FormData();
      form.append('image', buffer, 'enhance.jpg');
      
      const { data } = await axios.post("https://api.ryzendesu.vip/api/image/hd", form, {
        headers: form.getHeaders()
      });
      
      const url = data.url || data.result || data.image;
      if (!url) throw new Error("No URL");
      
      await sock.sendMessage(from, {
        image: { url: url },
        caption: `✨ HD Done\n> SPACE-MD`
      }, { quoted: msg });
      
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
  }
}
module.exports = hd2Command;
