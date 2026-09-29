// File: commands/hack.js

module.exports = {
  name: "shafihack",
  alias: ["shafihack", "shack", "hacktarget"],
  description: "Simulate a terrifying 2-minute hacking sequence with funny twist",
  category: "fun",
  async run({ conn, m, args }) {
    const target = args.join(" ") || "Target Device";
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    
const steps = [
      '💻 *HACK STARTING...* 💻',
      
      '█ █  10%``` ⏳',
      '█ █ █ █  20%``` ⏳',
      '█ █ █ █ █  30%``` ⏳',
      '█ █ █ █ █ █ █ 40%``` ⏳',
      '█ █ █ █ █ █ █ █  50%``` ⏳',
      '█ █ █ █ █ █ █ █ █ █ 80%``` ⏳',
      '█ █ █ █ █ █ █ █ █ ██ █ █  100%``` ✅',
      

      '🚀 *Command Execution: Complete!* 🎯',
      ];
      const funnyTwist = [
  '🚨 Unexpected twist: Target device is actually a toaster.',
      
      '🎉 This was just a prank from *SPACE-MD* 🤖',
      '💬 Go ahead and prank someone else using *.shafihack* 😎',   
  '👀 Target device: hacked, toaster: toasted.'
];


await conn.sendMessage(m.chat, {
      text: `🧠 Initiating top-level hack on *${target}*\n⏳ Duration: ~2 minutes\n⚠️ Stay calm. We are watching...`,
    }, { quoted: m });

    for (let i = 0; i < steps.length; i++) {
      await delay(350);
      await conn.sendMessage(m.chat, { text: steps[i] }, { quoted: m });
    }

    await delay(300);
    for (let line of funnyTwist) {
      await delay(250);
      await conn.sendMessage(m.chat, { text: line }, { quoted: m });
    }
  }
};



