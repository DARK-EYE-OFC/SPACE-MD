const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fs = require('fs');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { getSettings } = require('./lib/sessionSettings');
const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn, isSudo } = require('./lib/index');
// Optional command loader — missing commands won't crash SPACE-MD
const optionalCommand = (file) => {
    try {
        return require(`./commands/${file}`);
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log(`⚠️ Optional command not found: ${file}`);
            return {};
        }
        throw error;
    }
};

// Command imports
const {
    listOnlineCommand,
    updatePresence
} = require('./commands/listonline');
const infoCommand = optionalCommand('./commands/info');
const flirtCommand = optionalCommand('flirt');
const { crushCommand, crushResponse } = require('./commands/crush');
const flirt2Command = optionalCommand('flirt2');
const ghosttrace = require('./commands/ghosttrace');
const deleteBotCommand = optionalCommand('deletebot');
const supportCommand = require('./commands/support');
const pregnancycheckCommand = require('./commands/pregnancycheck');
const gaycheckCommand = optionalCommand('gaycheck');
const lovecheckCommand = require('./commands/lovecheck');
const hornycheckCommand = require('./commands/hornycheck');
const pussyloverCommand = require('./commands/pussylover');
const gaydetectorCommand = optionalCommand('gaydetector');
const fartblasttextCommand = optionalCommand('fartblasttext');
const bedskillsCommand = optionalCommand('bedskills');
const brainwashCommand = optionalCommand('brainwash');
const detectCommand = optionalCommand('detect');
const ghostCommand = require('./commands/ghost');
const mindreadCommand = require('./commands/mindread');
const toiletCommand = require('./commands/toilet');
const callmomCommand = optionalCommand('callmom');
const mirrorCommand = require('./commands/mirror');
const auntyalertCommand = optionalCommand('auntyalert');
const explodeCommand = optionalCommand('explode');
const spyCommand = require('./commands/spy');
const unhackCommand = require('./commands/unhack'); // Adjust path if needed
const hackCommand = require('./commands/hack');
const aliveCommand = require('./commands/alive');
const getppCommand =optionalCommand('getpp');
const helpCommand = require('./commands/help');
const banCommand = optionalCommand('ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = optionalCommand('demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { antilinkCommand, handleAntilinkMessage } = require('./commands/antilink');
const { Antilink } = require('./lib/antilink');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tag2Command = require('./commands/tag2');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const attpCommand = optionalCommand('attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = optionalCommand('compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = optionalCommand('dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const welcomeCommand = require('./commands/welcome');
const goodbyeCommand = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = optionalCommand('antibadword');
const chatbotModule = optionalCommand('chatbot');
const handleChatbotCommand = chatbotModule.handleChatbotCommand;
const handleChatbotResponse = chatbotModule.handleChatbotResponse;
const takeCommand = require('./commands/take');
const characterCommand = optionalCommand('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = optionalCommand('emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = optionalCommand('demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = optionalCommand('clearsession');
const autoStatusCommand = null;
const handleStatusUpdate = null;
const groupLinkCommand = require('./commands/grouplink');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = optionalCommand('antidelete');
const setProfilePicture = require('./commands/setpp');
const facebookCommand = optionalCommand('facebook');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
//const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const shafiCommand = require('./commands/shafi');

const tagAllCommand = require('./commands/tagall');
const kissCommand = require('./commands/kiss');
const updateCommand = require('./commands/update');
const hideTagCommand = require('./commands/hidetag');
const menuCommand = require('./commands/menu');
const { inviteCommand } = require('./commands/invite');
const whoisgayCommand = require('./commands/whoisgay');
const whoisCommand = require('./commands/whois');
const virusCommand = require('./commands/virus');
const marryCommand = require('./commands/marry');
const fightCommand = optionalCommand('fight');
const timeCommand = require('./commands/time');
const imgCommand = require('./commands/img');
const urlCommand = require('./commands/url');
const settingsCommand = require('./commands/settings');
const prefixCommand = require('./commands/prefix');
const setPrefixCommand = require('./commands/setprefix');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');


// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029VbAm8LqL2ATpxklIct2g";
global.ytch = "dark-eye-officials";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363420933039839@newsletter',
            newsletterName: 'SPACE-MD',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

       // Store message only when the antidelete feature is available
        if (message.message && typeof storeMessage === 'function') {
            storeMessage(message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
   const senderIsSudo = await isSudo(senderId);

        // Preserve original message text
const rawText =
    message.message?.conversation?.trim() ||
    message.message?.extendedTextMessage?.text?.trim() ||
    message.message?.imageMessage?.caption?.trim() ||
    message.message?.videoMessage?.caption?.trim() ||
    '';

await handleAntilinkMessage(sock, chatId, message, rawText);
const sessionSettings = getSettings(sock);
const activePrefix = sessionSettings.prefix;

let userMessage = rawText.toLowerCase().trim();

// Only the currently active prefix can start a command.
if (activePrefix) {
    const prefixLower = activePrefix.toLowerCase();

    if (userMessage.startsWith(prefixLower)) {
        userMessage =
            '.' + userMessage.slice(activePrefix.length).trim();
    } else {
        // Different/old prefix = normal message.
        userMessage = '';
    }
} else {
    // Prefixless mode will be handled separately.
    userMessage = userMessage.trim();
}

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }

        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '🛑 SPACE-MD: You’ve been officially blocked from commands. Talk to an admin.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words FIRST, before ANY other processing
        if (isGroup && userMessage) {
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            if (isGroup) {
                // Process non-command messages first
                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                await Antilink(message, sock);
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            return;
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.antilink'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId, message);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: '🚫 Can’t execute admin commands without admin rights — promote me first!', ...channelInfo }, {quoted: message});
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: '😈 SPACE-MD: Nice try, peasant. This button belongs to the kings and queens (admins).',
                        ...channelInfo
                    });
                    return;
                }
            }
        }

        // Check owner status for owner commands
      if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' });
                return;
            }
        }

        // Add this near the start of your message handling logic, before processing commands
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            // Allow owner to use bot even in private mode
           if (!data.isPublic && !message.key.fromMe && !senderIsSudo) {
                return;  // Silently ignore messages from non-owners when in private mode
            }
        } catch (error) {
            console.error('Error checking access mode:', error);
            // Default to public mode if there's an error reading the file
        }

        // Command handlers
        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: '🎯 Tip from SPACE-MD: Just reply to any sticker with .simage and watch the magic happen ✨.', ...channelInfo });
                }
                break;
            }
            case userMessage === '.tag': {
    const tagArgs = userMessage.split(/\s+/).slice(1);
    await tag2Command(sock, chatId, message, tagArgs);
    break;
}
case userMessage === '.listonline':
    await listOnlineCommand(sock, chatId, message, 'list');
    break;

case userMessage === '.tagonline':
    await listOnlineCommand(sock, chatId, message, 'tag');
    break;
case userMessage === '.crush': {
    await crushCommand(sock, chatId, message);
    break;
}
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                const muteDuration = parseInt(userMessage.split(' ')[1]);
                if (isNaN(muteDuration)) {
                    await sock.sendMessage(chatId, { text: '🕒 SPACE-MD Tip: Minutes must be valid! Try: .mute 10\neg to mute 10 minutes\n.mute 10', ...channelInfo });
                } else {
                    await muteCommand(sock, chatId, senderId, muteDuration);
                }
                break;
            case userMessage === '. Unmute' || userMessage === '.Unmute' || userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.deletebot'):
                await deleteBotCommand(sock, chatId, isGroup, senderId, isOwner);
                break;
            case userMessage.startsWith('.ban'):
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antilink'): {
                const antilinkArgs = userMessage.split(/\s+/).slice(1);
                await antilinkCommand(sock, chatId, message, antilinkArgs);
                break;
            }
            case userMessage === '.Menu' || userMessage === '.menu' || userMessage === '. Menu' || userMessage === '. menu':
                await menuCommand(sock, chatId, message, global.channelLink);
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
                case userMessage === '. Alive' || userMessage === '. alive' || userMessage === '.Alive' || userMessage === '.alive':
    await aliveCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
    break;
case (userMessage && userMessage.trim().toLowerCase() === '.whoisgay'):
  await whoisgayCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;

case userMessage === '.grouplink':
case userMessage === '.group-link':
    await groupLinkCommand(sock, chatId, message);
    break;         

   case userMessage === '.delete' || userMessage === '.del':
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                  if (!message.key.fromMe && !senderIsSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status try again after 30 seconds', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `🔄 Mode updated — SPACE-MD is now in *${action}* mode.`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
                case userMessage.startsWith('.pmblocker'):
                if (!message.key.fromMe && !senderIsSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use pmblocker.' }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.tagall':
                if (isSenderAdmin || message.key.fromMe) {
                    await tagAllCommand(sock, chatId, message);
                } else {
                    await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use the .tagall command.', ...channelInfo }, {quoted: message});
                }
                break;
                case userMessage.startsWith('.time'):
  await timeCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: '🏠 SPACE-MD: This command works only inside groups.',
                        ...channelInfo
                    });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: '⚠️ SPACE-MD: Make me an admin first so I can do my magic. 🪄',
                        ...channelInfo
                    });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            // In your switch block
       // getting url link of a group 
            case userMessage === 'Invite':
            case userMessage === '.invite':
    await inviteCommand(sock, chatId, message, isGroup);
    break;
            case userMessage === '.hack':
            case userMessage === '.shack':
            case userMessage === '.hacktarget':
                 await hackCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                 break;
            
            case userMessage === '.unhack':
            case userMessage === '.rehack':
            case userMessage === '.reversehack':
                await unhackCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
                

case userMessage.startsWith('.img') || userMessage.startsWith('.image') || userMessage.startsWith('.photo'):
    await imgCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
    break;
            case userMessage === '.spy':
            case userMessage === '.spyon':
            case userMessage === '.shafispy':
                await spyCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.fartblasttext':
            case userMessage === '.fartanim':
            case userMessage === '.gasbomb':
            case userMessage === '.fartline':
                await fartblasttextCommand.run({ conn: sock, m: message });
                break;
            case userMessage === '.Help' || userMessage === '.help' || userMessage === '. Help' || userMessage === '. help':
                await helpCommand(sock, chatId, message, global.channelLink);
                break;
            case userMessage === '.ghosttrace':
            case userMessage === '.ghost':
            case userMessage === '.ghosthunter':
            case userMessage === '.ghostdetect':
                await ghosttraceCommand.run({ conn: sock, m: message, participants });
                break;


            // 💘 LOVE CHECK
            case userMessage === '.lovecheck':
            case userMessage === '.loverate':
            case userMessage === '.lovemeter':
                await lovecheckCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;

           // 🔞 HORNY CHECK
            case userMessage === '.hornycheck':
            case userMessage === '.hornymeter':
            case userMessage === '.ishorny':
                await hornycheckCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;

            // 🐱 PUSSY LOVER
            case userMessage === '.pussylover':
            case userMessage === '.catlover':
            case userMessage === '.meowboy':
                await pussyloverCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;

           // 🌈 GAY DETECTOR (Big detailed version)
            case userMessage === '.gaydetector':
            case userMessage === '.howgay':
            case userMessage === '.rainbowscan':
                await gaydetectorCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;

           // 🏳️‍🌈 GAY CHECK (Quick % style)
            case userMessage === '.gaycheck':
            case userMessage === '.gayrate':
            case userMessage === '.gaylvl':
                await gaycheckCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.pregnancycheck':
            case userMessage === '.pregcheck':
            case userMessage === '.pregnant':
                await pregnancycheckCommand.run({ conn: sock, m: message });
                break;

case userMessage === '.fight' || userMessage === '.battle' || userMessage === '.vs':
  await fightCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;
            // .brainwash
            case userMessage === '.brainwash':
                await brainwashCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
                case userMessage === '.marry' || userMessage === '.shadi':
  await marryCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;
                           // .detect
            case userMessage === '.detect':
                await detectCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.support':
            case userMessage === '.helpbot':
            case userMessage === '.arslansupport':
                await supportCommand.run({ conn: sock, m: message });
                break;

            // .bedskills or .bedrate
            case userMessage === '.bedskills':
            case userMessage === '.bedrate':
                await bedskillsCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
           // .ghost
            case userMessage === '.ghost':
                await ghostCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
           // .mindread
            case userMessage === '.mindread':
                await mindreadCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            // .flirt
            case userMessage === '.flirt':
                await flirtCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.flirt2':
            case userMessage === '.seduce':
            case userMessage === '.flirty':
                await flirt2Command.run({ conn: sock, m: message });
                break;
          // .toilet
            case userMessage === '.toilet':
                await toiletCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
          // .callmom
            case userMessage === '.callmom':
                await callmomCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            // .crush
            case userMessage === '.crush':
                await crushCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
           // .mirror
            case userMessage === '.mirror':
                await mirrorCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
                 case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
           // .auntyalert
            case userMessage === '.auntyalert':
                await auntyalertCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
         // .explode
            case userMessage === '.explode':
                await explodeCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, city);
                } else {
                    await sock.sendMessage(chatId, { text: '🌍 Tell me the city name, boss. Example: .weather London', ...channelInfo });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: '🕹 SPACE-MD says: That’s not a valid position! Pick a real one.', ...channelInfo });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: '🎯 Time to guess! Use .guess <letter> — don’t be shy.', ...channelInfo });
                }
                break;
                case userMessage === '.whois' || userMessage.startsWith('.whois '):
  await whoisCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;

                case userMessage === '.virus' || userMessage === '.Virus':
  await virusCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
  break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: '💬 SPACE-MD: Provide your answer using .answer <answer>', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'): {
    const songTitle = userMessage.split(' ').slice(1).join(' ');

    await lyricsCommand(
        sock,
        chatId,
        message,
        songTitle
    );

    break;
}
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage.startsWith('.kiss'):
                await kissCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
                break;
            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
      		
            case userMessage === '.prefix':
                await prefixCommand(sock, chatId, message);
                break;

            case userMessage.startsWith('.setprefix'):
                await setPrefixCommand(
        sock,
        chatId,
        message,
        userMessage.split(' ').slice(1),
        message.key.fromMe || senderIsSudo
    );
    break;
                
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
                case userMessage === '. Shafi' || userMessage === '. shafi' || userMessage === '.Shafi' || userMessage === '.shafi':
    await shafiCommand.run({ conn: sock, m: message, args: userMessage.split(' ').slice(1) });
    break;


            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '. ping' || userMessage === '.Ping' || userMessage === '. Ping' || userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
        
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: '👑 This power is reserved for the royal admins of this group.', ...channelInfo });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: '🏠 SPACE-MD: This command can only be used inside groups...', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: '👑 This power is reserved for the royal admins of this group.', ...channelInfo });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: '🏠 SPACE-MD: This command can only be used inside groups...', ...channelInfo });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: '🏠 SPACE-MD: This command can only be used inside groups...', ...channelInfo });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*👑 Give SPACE-MD admin powers before trying this!*', ...channelInfo });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: '👥 SPACE-MD says: You gotta be in a group to run this..', ...channelInfo });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*🚫 SPACE-MD: Only group admins or the bot owner can use this command. 👑*', ...channelInfo });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take'):
                const takeArgs = userMessage.slice(5).trim().split(' ');
                await takeCommand(sock, chatId, message, takeArgs);
                break;
// Update commands for update bot auto 
                case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, senderIsSudo, zipArg);
                }
                commandExecuted = true;
                break;
                
           // case userMessage === '.flirt':
           //     await flirtCommand(sock, chatId, message);
     //           break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: '👥 SPACE-MD says: You must be in a group to use this.', ...channelInfo });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: '👥 SPACE-MD says: You must be in a group to use this.', ...channelInfo });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: '👥 SPACE-MD says: You must be in a group to use this.', ...channelInfo });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            
case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                const isOwnerOrSudo = message.key.fromMe || senderIsSudo;
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudo);
                break;
case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;

            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
               case userMessage === '.getpp':
                await getppCommand(sock, chatId, message);
                break;            
                
            
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.song') || userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.play') || userMessage.startsWith('.mp3') || userMessage.startsWith('.ytmp3') || userMessage.startsWith('.yts'):
                await songCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.video') || userMessage.startsWith('.ytmp4'):
                await videoCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
case userMessage.startsWith('.ai'):
case userMessage.startsWith('.gpt'):
case userMessage.startsWith('.gemini'):
    await aiCommand(
        sock,
        chatId,
        message,
        userMessage.split(' ').slice(1)
    );
    break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                const isOwner = message.key.fromMe;
                await handleAreactCommand(sock, chatId, message, isOwner);
                break;
          //  case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
            //    await goodnightCommand(sock, chatId, message);
           //     break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'):
                await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid':
                await groupJidCommand(sock, chatId, message);
                break;

                // Function to handle .groupjid command
                async function groupJidCommand(sock, chatId, message) {
                    const groupJid = message.key.remoteJid;

                    if (!groupJid.endsWith('@g.us')) {
                        return await sock.sendMessage(chatId, {
                            text: "👥 SPACE-MD says: You must be in a group to use this."
                        });
                    }

                    await sock.sendMessage(chatId, {
                        text: `✅ Group JID: ${groupJid}`
                    }, {
                        quoted: message
                    });
                }

default:
    if (isGroup) {
 
// Unknown command handler
if (userMessage.startsWith('.')) {
    const usedCommand = userMessage.split(/\s+/)[0];

    await sock.sendMessage(chatId, {
        react: {
            text: '🔍',
            key: message.key
        }
    });

    await sock.sendMessage(
        chatId,
        {
            text:
                `❌️ ${usedCommand} is not found in the Commands library.\n\n` +
                `Please contact the creator to add it up or try .menu to see available Commands`
        },
        { quoted: message }
    );

    await sock.sendMessage(chatId, {
        react: {
            text: '❌️',
            key: message.key
        }
    });
}

// Handle SPACE-MD crush button responses
const buttonResponse =
    message.message?.buttonsResponseMessage?.selectedButtonId;

if (buttonResponse === 'crush_yes' || buttonResponse === 'crush_no') {
    await crushResponse(
        sock,
        chatId,
        message,
        buttonResponse
    );
    return;
}

       // Handle non-command group messages
        if (userMessage) {
            if (typeof handleChatbotResponse === 'function') {
                await handleChatbotResponse(
                    sock,
                    chatId,
                    message,
                    userMessage,
                    senderId
                );
            }

            await Antilink(message, sock);
            await handleBadwordDetection(
                sock,
                chatId,
                message,
                userMessage,
                senderId
            );
        }
    }
    break;
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Handle promotion events
        if (action === 'promote') {
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            // Check if welcome is enabled for this group
            const isWelcomeEnabled = await isWelcomeOn(id);
            if (!isWelcomeEnabled) return;

            // Get group metadata
            const groupMetadata = await sock.groupMetadata(id);
            const groupName = groupMetadata.subject;
            const groupDesc = groupMetadata.desc || '🤷‍♂️ Oops! Looks like there’s no description here.';

            // Get welcome message from data
            const data = JSON.parse(fs.readFileSync('./data/userGroupData.json'));
            const welcomeData = data.welcome[id];
            const welcomeMessage = welcomeData?.message || '👑 SPACE-MD: Hail {user}! The group just got cooler with you here!';
            const channelId = welcomeData?.channelId || '120363420933039839@newsletter';

            // Send welcome message for each new participant
            for (const participant of participants) {
                const user = participant.split('@')[0];
                const formattedMessage = welcomeMessage
                    .replace('{user}', `@${user}`)
                    .replace('{group}', groupName)
                    .replace('{description}', groupDesc);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: 'SPACE-MD',
                            serverMessageId: -1
                        }
                    }
                });
            }
        }

sock.ev.on('presence.update', ({ id, presences }) => {
    updatePresence(id, presences);
});

        // Handle leave events
        if (action === 'remove') {
            // Check if goodbye is enabled for this group
            const isGoodbyeEnabled = await isGoodByeOn(id);
            if (!isGoodbyeEnabled) return;

            // Get group metadata
            const groupMetadata = await sock.groupMetadata(id);
            const groupName = groupMetadata.subject;

            // Get goodbye message from data
            const data = JSON.parse(fs.readFileSync('./data/userGroupData.json'));
            const goodbyeData = data.goodbye[id];
            const goodbyeMessage = goodbyeData?.message || 'Goodbye {user} 👋';
            const channelId = goodbyeData?.channelId || '120363420933039839@newsletter';

            // Send goodbye message for each leaving participant
            for (const participant of participants) {
                const user = participant.split('@')[0];
                const formattedMessage = goodbyeMessage
                    .replace('{user}', `@${user}`)
                    .replace('{group}', groupName);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant],
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: channelId,
                            newsletterName: 'SPACE-MD',
                            serverMessageId: -1
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,

    handleStatus: async (sock, status) => {
        if (typeof handleStatusUpdate === 'function') {
            await handleStatusUpdate(sock, status);
        }
    }
};
