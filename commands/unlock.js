const unlockCommand = {
  name: "unlock",
  alias: ["unlockgc", "unlock-group", "unlockinfo", "groupunlock"],
  category: "group",
  desc: "Unlock group info",

  async execute(sock, msg, args, from, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "❌ Group only!" }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const botNumber = sock.user.id.split(":")[0];
    const isBotAdmin = metadata.participants.find(p => p.id.includes(botNumber))?.admin;
    const isSenderAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin;

    if (!isSenderAdmin) return await sock.sendMessage(from, { text: "❌ Admin only!" }, { quoted: msg });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: "❌ Bot must be admin!" }, { quoted: msg });

    await sock.groupSettingUpdate(from, 'unlocked');
    await sock.sendMessage(from, { text: `🔓 *Group info unlocked!* All members can edit group info now.\n> SPACE-MD` }, { quoted: msg });
  }
}

module.exports = unlockCommand;
