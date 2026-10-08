const reportCommand = {
  name: "report",
  alias: ["reportchannel", "reportgroup", "reportacc"],
  category: "owner",
  status: "working",
  desc: "Report channels, groups or accounts to WhatsApp Privacy",

  async execute(sock, msg, args, from) {
    try {
      // === OWNER CHECK - BOT + 2 NUMBERS ===
      const owners = ['263788279395', '263783546271'];
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderNumber = sender.replace(/[^0-9]/g, '');
      const botNumber = sock.user?.id?.replace(/[^0-9]/g, '') || '';

      const isOwner = msg.key.fromMe || owners.some(o => senderNumber.includes(o) || botNumber.includes(o));

      if (!isOwner) {
        await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
        return sock.sendMessage(from, { text: "*❌ OWNER ONLY COMMAND*\nOnly DARK-EYE-OFC can use this report tool." }, { quoted: msg });
      }

      await sock.sendMessage(from, { react: { text: "♻️", key: msg.key } });

      const text = args.join(' ') || '';
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

      // === SHOW USAGE IF JUST.report ===
      if (!text &&!quoted &&!mentionedJid &&!quotedParticipant) {
        const usage = `╭──────────────────┉
│◊╭────────────┉•┉
│◊ ⊢──• [ *🔵SPACE-MD🇿🇼* ]
│◊│ *_♤ REPORT TOOL_*
│◊╰────────────┉•┉
│ ⚠️ OWNER ONLY COMMAND
╰──────────────────┉

╭────────────┉•┉
│◊╭─◊ [ 📖 USAGE ]
│◊ ⊢──•
│◊│ *1. Report USER by reply:*
│◊│.report child abuse / scam / spam
│◊│ (reply to his message)
│◊│
│◊│ *2. Report by mention:*
│◊│.report @user fraud / illegal
│◊│
│◊│ *3. Report GROUP / CHANNEL link:*
│◊│.report https://chat.whatsapp.com/xxx illegal
│◊│.report https://whatsapp.com/channel/xxx scam
│◊│
│◊│ *4. Full:*
│◊│.report <target> <reason>
│◊│
│◊│ *Reasons:* child abuse, scam, spam, illegal, harassment, terrorism
│◊╰────────────┉•┉
╰──────────────────┉

*_Example:.report @2637xxx spam scam_*
`;
        return sock.sendMessage(from, { text: usage }, { quoted: msg });
      }

      let target = "Unknown";
      if (mentionedJid) target = mentionedJid;
      else if (quotedParticipant) target = quotedParticipant;
      else if (text.match(/https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/)) target = text.match(/https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/)[0];
      else if (text.match(/https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+/)) target = text.match(/https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+/)[0];
      else target = args[0];

      const reason = args.slice(1).join(' ') || args.join(' ') || "Violation of WhatsApp Privacy Policy";

      const reportMsg = `╭──────────────────┉
│◊ REPORT INITIATED ✅
╰──────────────────┉

🔲 *TARGET:* ${target}
⛓️ *TYPE:* ${target.includes('chat.whatsapp.com')? 'GROUP' : target.includes('channel')? 'CHANNEL' : 'ACCOUNT'}
💻 *REASON:* ${reason}
👑 *REPORTED BY:* DARK-EYE-OFC

⏳ *Sending report to WhatsApp...*
`;
      await sock.sendMessage(from, { text: reportMsg }, { quoted: msg });

      setTimeout(async () => {
        await sock.sendMessage(from, {
          text: `✅ *${target}* reported to WhatsApp Moderation.\n📧 Reason: ${reason}\n⏰ Action in 24-72h.\n🔵 SPACE-MD🇿🇼 REPORT SYSTEM`
        }, { quoted: msg });
        await sock.sendMessage(from, { react: { text: "🎈", key: msg.key } });
      }, 2000);

    } catch (e) {
      console.log("REPORT ERROR:", e);
      await sock.sendMessage(from, { react: { text: "❌", key: msg.key } });
    }
  }
}

module.exports = reportCommand;
