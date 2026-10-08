const privacyCommand = {
  name: "privacy",
  alias: ["privacypolicy", "policy", "pp"],
  category: "core",
  desc: "Show SPACE-MD privacy policy",

  async execute(sock, msg, args, from) {
    const pushName = msg.pushName || "User";

    const caption = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [  🔵SPACE-MD🇿🇼 ]
│◊│
│◊│ *_♤ HELLO: ${pushName}_*
│◊│
│◊╰────────────┉•┉
│ 🌤️ Privacy Policy
╰──────────────────┉

╭──• [ 🔒 PRIVACY POLICY ]
│◊│
│◊│  *SPACE-MD V5.6.9*
│◊│  *Last Update: 07/10/2026*
│◊│
│◊│  1. DATA COLLECTION
│◊│  We do NOT collect your
│◊│  personal chats. Bot only
│◊│  reads commands you send.
│◊│
│◊│  2. STORAGE
│◊│  Session data stored
│◊│  securely on your server,
│◊│  not on ours.
│◊│
│◊│  3. THIRD PARTY
│◊│  Downloader features use
│◊│  public APIs. No data sold.
│◊│
│◊│  4. SECURITY
│◊│  We never ask for OTP,
│◊│  password or banking PIN.
│◊│
│◊│  5. CONTACT
│◊│  Questions? Chat owner.
│◊│
│◊╰────────────┉•┉
╰──────────────────┉

🌐 *Full Policy:* https://support-black-eight.vercel.app/

> *Built by DARK-EYE-OFC - Zimbabwe's Finest*
`;

    await sock.sendMessage(from, {
      text: caption,
      footer: "SPACE-MD | DARK-EYE-OFC",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: '🌐 READ FULL POLICY',
            url: 'https://support-black-eight.vercel.app/'
          }
        },
        {
          index: 2,
          urlButton: {
            displayText: '💬 CHAT WITH DEV',
            url: 'https://wa.me/263788279395'
          }
        }
      ]
    }, { quoted: msg });
  }
}

module.exports = privacyCommand;
