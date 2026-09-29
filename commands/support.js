module.exports = {
  name: "support",
  alias: ["helpbot", "support", "pathanupport"],
  description: "Get SPACE-MD support links and contact info",
  category: "general",
  async run({ conn, m }) {
    const caption = `🛠️ *SPACE-MD - SUPPORT CENTER* 🛠️



💬 *WhatsApp Support Group:*  
https://whatsapp.com/channel/0029VbAm8LqL2ATpxklIct2g

📲 *Telegram Support:*  
@anayathacker

🧑‍💻 *GitHub Repository:*  
https://github.com/ANAYAT-AI/ANAYAT-AI

📞 *Bot Admin:*  
wa.me/923452401207

📞 *Bot Owner:*  
wa.me/923452401207

🧠 Use *.menu* to explore commands.
💥 Stay updated and have fun using SPACE-MD!`;

    await conn.sendMessage(m.chat, {
      text: caption,
      mentions: [m.sender]
    }, { quoted: m });
  }
};
