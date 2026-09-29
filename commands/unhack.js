// File: commands/unhack.js

module.exports = {
  name: "unhack",
  alias: ["unhack", "rehack", "reversehack"],
  description: "Funniest and shortest unhack prank ever 😆",
  category: "fun",
  async run({ conn, m, args }) {
    const target = args.join(" ") || "your device";
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
//CREATED BY ANAYAT-KING OFFICIAL 
    const steps = [
      `😱 ALERT! ${target} is still hacked!`,
      `🔄 Trying CTRL+Z... Not working!`,
      `🪛 Hitting it gently with chappal...`,
      `📴 Rebooting with slipper mode ON...`,
      `🔧 Shouting “CHAL NAA!” at screen...`,
      `🍌 Using banana to boost signals...`,
      `🧠 Talking to WiFi router like a therapist...`,
      `🎉 Unhack complete! ${target} is safe now.`
    ];

    await conn.sendMessage(m.chat, {
      text: `🧼 UNHACK process started for *${target}*...`,
    }, { quoted: m });

    for (let line of steps) {
      await delay(2500);
      await conn.sendMessage(m.chat, { text: line }, { quoted: m });
    }

    await delay(2000);
    await conn.sendMessage(m.chat, {
      text: `🤣 GOTCHA!\n\nIt was just a prank bro! 💀\n\n*SPACE-MD* never hacked anything. Chill 😎`,
    }, { quoted: m });
  }
};
