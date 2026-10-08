
const onlineCommand = {
  name: "online",
  alias: ["onlinemembers", "active", "onlinelist", "onlinecheck"],
  category: "group",
  desc: "Show REAL online members in group",
  isGroup: true,

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";

    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants;
      const groupJids = participants.map(p => p.id);

      // Subscribe to presence for all members
      for (let jid of groupJids) {
        try {
          await sock.presenceSubscribe(jid);
          await sock.sendPresenceUpdate('available', jid);
        } catch {}
      }

      // Wait 3 seconds to collect online statuses
      await sock.sendMessage(from, { text: `🔍 *Checking online members...* Scanning ${groupJids.length} users, wait 3 secs...` }, { quoted: msg });
      await new Promise(r => setTimeout(r, 3500));

      let onlineNow = [];
      let offlineList = [];

      // Check global map
      if (!global.onlineMembers) global.onlineMembers = new Map();

      for (let p of participants) {
        if (global.onlineMembers.has(p.id)) {
          const lastSeen = global.onlineMembers.get(p.id);
          const ago = Math.floor((Date.now() - lastSeen) / 1000);
          if (ago < 90) { // Online in last 90 seconds = truly online
            onlineNow.push({ id: p.id, admin: p.admin, ago });
          }
        }
      }

      let textOnline = "";
      if (onlineNow.length === 0) {
        textOnline = `│◊│ 😴 No one shows online right now\n│◊│ Try again in few seconds\n`;
      } else {
        for (let user of onlineNow) {
          const badge = user.admin? "👑" : "🟢";
          textOnline += `│◊│ ${badge} @${user.id.split('@')[0]} - ${user.ago}s ago\n`;
        }
      }

      const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🟢 LIVE ONLINE CHECK
╰──────────────────┉

╭──• [ 👥 GROUP ONLINE ]
│◊│
│◊│ 📛 NAME: ${groupMetadata.subject}
│◊│ 👥 TOTAL: ${participants.length}
│◊│ 🟢 ONLINE: ${onlineNow.length}
│◊│ 🔴 OFFLINE: ${participants.length - onlineNow.length}
│◊│
${textOnline}│◊│
│◊│ 🌐 support-black-eight.vercel.app
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *Real-time tracking - Updates every 3 sec ♻️*
> *Built by DARK-EYE-OFC V5.6.9*
`;

      await sock.sendMessage(from, {
        text: caption,
        mentions: onlineNow.map(u => u.id),
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
              displayText: '🔄 REFRESH ONLINE',
              url: `https://wa.me/263788279395?text=.online`
            }
          }
        ]
      }, { quoted: msg });

    } catch (e) {
      console.log("ONLINE ERROR:", e);
      await sock.sendMessage(from, { text: `❌ Failed: ${e.message}\n\nMake sure bot is admin!` }, { quoted: msg });
    }
  }
}

module.exports = onlineCommand;
