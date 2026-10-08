const closeCommand = {
  name: "close",
  alias: ["closegc", "close-group", "mute", "groupclose"],
  category: "group",
  desc: "Close group - only admins can chat",

  async execute(sock, msg, args, from, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "❌ Group only command!" }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const botNumber = sock.user.id.split(":")[0];
    const isBotAdmin = metadata.participants.find(p => p.id.includes(botNumber))?.admin;
    const sender = msg.sender;
    const isSenderAdmin = metadata.participants.find(p => p.id === sender)?.admin;

    if (!isSenderAdmin) return await sock.sendMessage(from, { text: "❌ *Admin only!*" }, { quoted: msg });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: "❌ Bot must be admin!" }, { quoted: msg });

    try {
      await sock.groupSettingUpdate(from, 'announcement');
      await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊╰────────────┉•┉
│ 🔒 GROUP CLOSED
╰──────────────────┉

╭──• [ ✅ SUCCESS ]
│◊│
│◊│ 🔒 Group closed
│◊│ Only admins can send messages now
│◊│
│◊│ Use.open to open again
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

> *SPACE-MD V5.6.9*
`
      });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Failed: ${e.message}` }, { quoted: msg });
    }
  }
}

module.exports = closeCommand;
