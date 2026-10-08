const axios = require('axios');
const cheerio = require('cheerio');

const ephotoCommand = {
  name: "ephoto",
  alias: ["ephoto360", "textpro", "photooxy", "ep"],
  category: "tools",
  desc: "Create 100+ text effects via ephoto",
  isGroup: false,

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    let text = args.join(" ").trim();

    const effects = {
      glitch: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
      blackpink: "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
      graffiti: "https://en.ephoto360.com/create-a-cartoon-graffiti-text-effect-668.html",
      fire: "https://en.ephoto360.com/free-burning-paper-text-effect-online-349.html",
      neon: "https://en.ephoto360.com/create-neon-text-effects-online-766.html",
      galaxy: "https://en.ephoto360.com/create-galaxy-text-effects-online-528.html",
      thunder: "https://en.ephoto360.com/create-thunder-text-effect-online-571.html",
      matrix: "https://en.ephoto360.com/matrix-text-effect-154.html",
      light: "https://en.ephoto360.com/light-text-effect-futuristic-801.html",
      pornhub: "https://en.ephoto360.com/create-pornhub-style-logos-online-free-549.html",
      wired: "https://en.ephoto360.com/create-a-wired-text-effect-online-1116.html",
      greenbrush: "https://en.ephoto360.com/create-a-green-brush-text-effect-1113.html",
      incand: "https://en.ephoto360.com/incandescent-bulbs-text-effect-666.html",
      typography: "https://en.ephoto360.com/create-typography-text-effect-on-pavement-texture-774.html",
      retro: "https://en.ephoto360.com/create-a-retro-text-effect-online-free-1095.html",
      horror: "https://en.ephoto360.com/create-horror-text-effect-online-972.html",
      eraser: "https://en.ephoto360.com/eraser-text-effect-186.html",
      foggy: "https://en.ephoto360.com/write-text-on-foggy-window-online-free-1015.html",
      watercolor: "https://en.ephoto360.com/create-a-watercolor-text-effect-1-1140.html",
      heart: "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
    };

    const listText = Object.keys(effects).map(e => `│◊│ ◊ ${e}`).join("\n");

    if (!text ||!text.includes("|")) {
      const help = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🎨 EPHOTO 360
╰──────────────────┉

╭──• [ 📝 HOW TO USE ]
│◊│
│◊│.ephoto effect | text
│◊│
│◊│ Ex:.ephoto blackpink | DARK EYE
│◊│ Ex:.ephoto glitch | SPACE MD
│◊│ Ex:.ephoto fire | Zimbabwe
│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

╭──• [ 🎨 EFFECTS LIST - ${Object.keys(effects).length} ]
│◊│
${listText}
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9 - DARK-EYE-OFC*
`;
      return await sock.sendMessage(from, { text: help }, { quoted: msg });
    }

    let [effectName, effectText] = text.split("|").map(v => v.trim().toLowerCase());
    if (!effects[effectName]) {
      return await sock.sendMessage(from, { text: `❌ Effect *${effectName}* not found!\n\nAvailable:\n${Object.keys(effects).join(", ")}` }, { quoted: msg });
    }

    try {
      await sock.sendMessage(from, { text: `🎨 *Creating ${effectName} effect for:* ${effectText}\n⏳ Wait...` }, { quoted: msg });

      // Simple ephoto scraper function
      const createImage = async (url, txt) => {
        const form = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(form.data);
        const token = $('input[name="token"]').val();
        const buildServer = $('input[name="build_server"]').val();
        const buildServerId = $('input[name="build_server_id"]').val();

        const data = new URLSearchParams();
        data.append('text[]', txt);
        data.append('token', token);
        data.append('build_server', buildServer);
        data.append('build_server_id', buildServerId);

        const post = await axios.post(url, data, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const $2 = cheerio.load(post.data);
        let imageUrl = $2('div#form_value').text();
        if (!imageUrl) {
          imageUrl = $2('div.btn-group a').attr('href') || $2('img.btn-captcha').attr('src');
        }
        // For ephoto360 final json
        try {
          const json = JSON.parse($2('div#form_value').text() || post.data);
          if (json.image) return buildServer + json.image;
        } catch {}

        // Fallback - second request
        const result = post.data.match(/"image":".*?"/);
        if (result) {
          const imgPath = JSON.parse(`{${result[0]}}`).image;
          return buildServer + imgPath;
        }
        return null;
      };

      const imageUrl = await createImage(effects[effectName], effectText);

      if (!imageUrl) {
        // Fallback API if scrape fails
        const fallback = `https://api.popcat.xyz/${effectName}?text=${encodeURIComponent(effectText)}`;
        await sock.sendMessage(from, {
          image: { url: fallback },
          caption: `╭──• [ 🎨 EPHOTO - ${effectName.toUpperCase()} ]\n│◊│ 📝 Text: ${effectText}\n│◊│ 🎨 Effect: ${effectName}\n│◊│ 👤 ${pushName}\n╰──────\n\n> *SPACE-MD V5.6.9*`
        }, { quoted: msg });
        return;
      }

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🎨 EPHOTO DONE
╰──────────────────┉

╭──• [ ✨ RESULT ]
│◊│
│◊│ 🎨 Effect: ${effectName}
│◊│ 📝 Text: ${effectText}
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Built by DARK-EYE-OFC*
`;

      await sock.sendMessage(from, {
        image: { url: imageUrl },
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
      console.log("EPHOTO ERROR:", e.message);
      await sock.sendMessage(from, { text: `❌ Failed to create ephoto: ${e.message}\nTry:.ephoto glitch | ${effectText || "SPACE"}` }, { quoted: msg });
    }
  }
}

module.exports = ephotoCommand;
