const lockCommand = {
  name: "lock",
  alias: ["lockgc", "lock-group", "lockinfo", "grouplock"],
  category: "group",
  desc: "Lock group info - only admins can edit",

  async execute(sock, msg, args, from, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "❌ Group only command!" }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const botNumber = sock.user.id.split(":")[0];
    const isBotAdmin = metadata.participants.find(p => p.id.includes(botNumber))?.admin;
    const isSenderAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin;

    if (!isSenderAdmin) return await sock.sendMessage(from, { text: "❌ *Admin only!*" }, { quoted: msg });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: "❌ Bot must be admin!" }, { quoted: msg });

    try {
      await sock.groupSettingUpdate(from, 'locked');
      await sock.sendMessage(from, {
        text: `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ 🔵SPACE-MD🇿🇼 ]
│◊│
│◊╰────────────┉•┉
│ 🔒 GROUP LOCKED
╰──────────────────┉

╭──• [ ✅ SUCCESS ]
│◊│
│◊│ 🔒 Group info locked
│◊│ Only admins can edit group
│◊│ name, icon & description
│◊│
│◊│ Use.unlock to unlock
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

module.exports = lockCommand;
