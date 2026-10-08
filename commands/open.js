const openCommand = {
  name: "open",
  alias: ["opengc", "open-group", "unmute", "groupopen"],
  category: "group",
  desc: "Open group - all members can chat",

  async execute(sock, msg, args, from, isGroup) {
    if (!isGroup) return await sock.sendMessage(from, { text: "❌ Group only!" }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const botNumber = sock.user.id.split(":")[0];
    const isBotAdmin = metadata.participants.find(p => p.id.includes(botNumber))?.admin;
    const isSenderAdmin = metadata.participants.find(p => p.id === msg.sender)?.admin;

    if (!isSenderAdmin) return await sock.sendMessage(from, { text: "❌ Admin only!" }, { quoted: msg });
    if (!isBotAdmin) return await sock.sendMessage(from, { text: "❌ Bot must be admin!" }, { quoted: msg });

    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, { text: `🔓 *Group opened!* All members can chat now.\n> SPACE-MD` }, { quoted: msg });
  }
}

module.exports = openCommand;
