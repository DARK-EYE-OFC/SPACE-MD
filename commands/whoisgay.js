// commands/whoisgay.js
module.exports = {
  name: "whoisgay",
  alias: ["randomgay", "gaypicker"],
  description: "Randomly picks a group member and reveals their rainbow energy 🌈",
  category: "fun",

  async run({ conn, m }) {
    try {
      if (!m.isGroup) {
        return await conn.sendMessage(m.chat, { text: "❌ This command only works in groups!" }, { quoted: m });
      }

      // Get group metadata
      const groupMetadata = await conn.groupMetadata(m.chat);
      const participants = groupMetadata.participants;

      if (!participants || participants.length === 0) {
        return await conn.sendMessage(m.chat, { text: "⚠️ Couldn’t fetch group members." }, { quoted: m });
      }

      // Pick random user
      const randomUser = participants[Math.floor(Math.random() * participants.length)].id;
      const tagUser = `@${randomUser.split("@")[0]}`;

      // Savage gay lines 😅🌈
      const gayLines = [
        `Confirmed u 200% gay 😅🌈`,
        `Bro ur rainbow level is 9999% 🤣🤣`,
        `No escape, ur officially gay certified ✅😂`,
        `U just broke the gaymeter 💅🌈💥`,
        `Warning ⚠️ too much fabulous detected 😭✨`,
        `Gay vibes stronger than WiFi signal 📶🌈`,
        `Scientifically proven: ur 101% gay 😜😂`,
        `Gaydar says: FULL POWER MODE 💅🤣`,
        `Oops… rainbow energy overload 🌈🔥`,
        `Even ur shadow is fabulous 💃😂`
      ];

      const chosenLine = gayLines[Math.floor(Math.random() * gayLines.length)];

      // Send message
      await conn.sendMessage(m.chat, {
        text: `🎭 *WHO IS GAY?* 🎭\n\n👤 Target: ${tagUser}\n${chosenLine}\n\n⚡ Powered by SPACE-MD 🌟`,
        mentions: [randomUser]
      }, { quoted: m });

    } catch (err) {
      console.error("❌ Error in whoisgay command:", err);
      await conn.sendMessage(m.chat, { text: "❌ Something went wrong while scanning rainbow vibes." }, { quoted: m });
    }
  }
};
