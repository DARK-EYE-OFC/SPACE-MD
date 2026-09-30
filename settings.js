// 🌟 SPACE-MD v5.6.9 Configuration

const settings = {
  // 🤖 Bot Identity
  botName: '🚀 SPACE-MD',
  botOwner: '👑 DARK-EYE-OFC',

  // 🏷️ Sticker Settings
  packname: '🚀 SPACE-MD 🚀',
  author: '👑 DARK-EYE-OFC',

  // ⚙️ Bot Mode
  commandMode: 'public',

  // 📝 Meta Information
  description: '🚀 SPACE-MD v5.6.9 — WhatsApp Bot developed by DARK-EYE-OFC.',
  version: '5.6.9',

  // 🌐 Hosting
  port: Number(process.env.PORT) || 10000,

  // 💾 Local store
  storeWriteInterval: 10000,

  // 🔗 GitHub updater
  updateZipUrl: 'https://github.com/DARK-EYE-OFC/SPACE-MD/archive/refs/heads/main.zip',

  // 🎬 APIs
  giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
};

module.exports = settings;
