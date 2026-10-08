const winfoCommand = {
  name: "winfo",
  alias: ["whois", "userinfo", "wauserinfo", "getinfo"],
  category: "tools",
  desc: "Get WhatsApp info of a user",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";
    try {
      let targetJid = msg.mentionedJid?.[0] ||
                      (msg.quoted? msg.quoted.sender : null) ||
                      (args[0]? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null) ||
                      msg.sender;

      if (!targetJid.includes('@')) targetJid = targetJid + '@s.whatsapp.net';

      // Get profile picture
      let ppUrl;
      try {
        ppUrl = await sock.profilePictureUrl(targetJid, 'image');
      } catch {
        ppUrl = 'https://i.imgur.com/2wzGhpF.jpeg';
      }

      // Get status / bio
      let bio = "No bio";
      try {
        const status = await sock.fetchStatus(targetJid);
        bio = status.status || "No bio set";
      } catch {
        bio = "Bio hidden / private";
      }

      // Check if number exists on WhatsApp
      let exists = false;
      try {
        const [result] = await sock.onWhatsApp(targetJid);
        exists =!!result?.exists;
      } catch {}

      const number = targetJid.split('@')[0];
      const isBusiness = targetJid.includes('@s.whatsapp.net')? "No" : "Yes";

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🔍 WINFO CHECK
╰──────────────────┉

╭──• [ 👤 USER INFO ]
│◊│
│◊│ 🪪 NUMBER: +${number}
│◊│ 📛 NAME: ${msg.quoted? msg.quoted.pushName : pushName}
│◊│ 📝 BIO: ${bio.slice(0, 50)}
│◊│ ✅ EXISTS: ${exists? "Yes" : "No"}
│◊│ 🏢 BUSINESS: ${isBusiness}
│◊│ 🔗 JID: ${targetJid}
│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Powered by SPACE-MD V5.6.9*
> *Built by DARK-EYE-OFC*
`;

      await sock.sendMessage(from, {
        image: { url: ppUrl },
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
              displayText: '💬 CHAT USER',
              url: `https://wa.me/${number}`
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      console.log("WINFO ERROR:", e);
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}\nUse:.winfo @user / reply / number` }, { quoted: msg });
    }
  }
}

module.exports = winfoCommand;
