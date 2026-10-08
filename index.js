/**
 * DARK-EYE TECH  Bots - A WhatsApp Bot
 * Copyright (c) 2024 dark-eye-officials
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by DARK-EYE-Tech & SPACE-MD
 */
require('dotenv').config()
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')

// Ignore messages that existed before this bot process started
const BOT_START_TIME = Date.now();

const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus
} = require('./main');

const { updatePresence } = require('./commands/listonline');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
// Using a lightweight persisted store instead of makeInMemoryStore (compat across versions)
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// 🌐 SPACE-MD BOT PANEL + HOSTING SERVER

const http = require('http');
const crypto = require('crypto');

let pairingSocket = null;
let reconnectTimer = null;
let isReconnecting = false;

/*
 * Simple in-memory rate limiter.
 *
 * This protects the public pairing endpoint from
 * being spammed with requests.
 */
const pairingAttempts = new Map();

const PAIR_RATE_LIMIT = 60 * 1000; // 1 minute
const MAX_PAIR_ATTEMPTS = 3;

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];

    if (forwarded) {
        return String(forwarded).split(',')[0].trim();
    }

    return req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
    const now = Date.now();
    const record = pairingAttempts.get(ip);

    if (!record || now - record.time > PAIR_RATE_LIMIT) {
        pairingAttempts.set(ip, {
            time: now,
            count: 1
        });

        return false;
    }

    record.count++;

    return record.count > MAX_PAIR_ATTEMPTS;
}

function sendJson(res, status, data) {
    const body = JSON.stringify(data);

    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(body);
}

function sendHtml(res, html) {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
    });

    res.end(html);
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk;

            if (body.length > 10_000) {
                reject(new Error('Request body too large'));
                req.destroy();
            }
        });

        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });

        req.on('error', reject);
    });
}

const panelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>SPACE-MD Bot Panel</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    background:
        radial-gradient(circle at top, #182b45 0%, #07101c 45%, #03070c 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.panel {
    width: 100%;
    max-width: 470px;
    background: rgba(12, 24, 39, 0.96);
    border: 1px solid rgba(0, 170, 255, 0.25);
    border-radius: 24px;
    padding: 30px 24px;
    box-shadow: 0 20px 70px rgba(0, 0, 0, 0.45);
}

.logo {
    text-align: center;
    font-size: 54px;
    margin-bottom: 5px;
}

h1 {
    text-align: center;
    margin: 0;
    font-size: 28px;
}

.subtitle {
    text-align: center;
    color: #9eb1c7;
    margin: 8px 0 25px;
}

.status {
    text-align: center;
    padding: 10px;
    border-radius: 12px;
    background: rgba(0, 255, 140, 0.08);
    color: #54f7a5;
    margin-bottom: 24px;
    font-size: 14px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #cbd8e7;
    font-size: 14px;
}

input {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #29445f;
    background: #07121f;
    color: white;
    font-size: 16px;
    outline: none;
}

input:focus {
    border-color: #009dff;
}

button {
    width: 100%;
    margin-top: 15px;
    padding: 15px;
    border: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, #009dff, #0067ff);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

button:disabled {
    opacity: 0.55;
    cursor: wait;
}

.result {
    display: none;
    margin-top: 22px;
    padding: 20px;
    border-radius: 16px;
    background: #071522;
    border: 1px solid #1d3d57;
    text-align: center;
}

.code {
    margin: 12px 0;
    font-size: 32px;
    letter-spacing: 5px;
    font-weight: bold;
    color: #54f7ff;
}

.instructions {
    color: #9eb1c7;
    font-size: 13px;
    line-height: 1.7;
}

.error {
    color: #ff7777;
}

.footer {
    text-align: center;
    margin-top: 25px;
    color: #657991;
    font-size: 12px;
}
</style>
</head>

<body>

<div class="panel">

    <div class="logo">🚀</div>

    <h1>SPACE-MD</h1>

    <div class="subtitle">
        WhatsApp Bot Control Panel
    </div>

    <div class="status">
        🟢 Online • v${settings.version}
    </div>

    <form id="pairForm">

        <label for="phone">
            WhatsApp Number
        </label>

        <input
            id="phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="2637XXXXXXXX"
            maxlength="20"
            required
        >

        <button id="pairButton" type="submit">
            🔗 REQUEST PAIRING CODE
        </button>

    </form>

    <div id="result" class="result">
        <div>Pairing Code</div>

        <div id="code" class="code"></div>

        <div id="message" class="instructions"></div>
    </div>

    <div class="footer">
        DARK-EYE-OFC • SPACE-MD
    </div>

</div>

<script>
const form = document.getElementById('pairForm');
const phone = document.getElementById('phone');
const button = document.getElementById('pairButton');
const result = document.getElementById('result');
const code = document.getElementById('code');
const message = document.getElementById('message');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const number = phone.value.replace(/[^0-9]/g, '');

    if (!number || number.length < 8) {
        result.style.display = 'block';
        code.textContent = '';
        message.innerHTML =
            '<span class="error">Enter a valid WhatsApp number with country code.</span>';
        return;
    }

    button.disabled = true;
    button.textContent = '⏳ REQUESTING CODE...';

    result.style.display = 'block';
    code.textContent = '';
    message.textContent = 'Contacting WhatsApp...';

    try {

        const response = await fetch('/api/pair', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: number
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || 'Unable to request pairing code.'
            );
        }

        code.textContent = data.code;

        message.innerHTML =
            'Open WhatsApp → Settings → Linked Devices → ' +
            'Link a Device → Link with phone number instead → ' +
            'enter this code.';

    } catch (error) {

        code.textContent = '';

        message.innerHTML =
            '<span class="error">' +
            (error.message || 'Pairing request failed.') +
            '</span>';

    } finally {

        button.disabled = false;
        button.textContent = '🔗 REQUEST PAIRING CODE';

    }
});
</script>

</body>
</html>`;

const healthServer = http.createServer(async (req, res) => {

    /*
     * Health check
     */
    if (req.method === 'GET' && req.url === '/health') {

        sendJson(res, 200, {
            status: 'ok',
            bot: 'SPACE-MD',
            version: settings.version,
            uptime: Math.floor(process.uptime()),
            pairingReady: !!pairingSocket
        });

        return;
    }

    /*
     * Main panel
     */
    if (req.method === 'GET' && req.url === '/') {
        sendHtml(res, panelHtml);
        return;
    }

    /*
     * Pairing API
     */
    if (req.method === 'POST' && req.url === '/api/pair') {

        const ip = getClientIp(req);

        if (isRateLimited(ip)) {
            sendJson(res, 429, {
                success: false,
                error: 'Too many pairing requests. Please wait one minute.'
            });

            return;
        }

        try {

            const data = await getRequestBody(req);

            let requestedNumber =
                String(data.phoneNumber || '')
                    .replace(/[^0-9]/g, '');

            if (requestedNumber.length < 8 || requestedNumber.length > 15) {
                sendJson(res, 400, {
                    success: false,
                    error: 'Invalid WhatsApp number.'
                });

                return;
            }

            if (!pairingSocket) {
                sendJson(res, 503, {
                    success: false,
                    error: 'SPACE-MD WhatsApp connection is not ready yet. Please try again shortly.'
                });

                return;
            }

            if (pairingSocket.authState?.creds?.registered) {
                sendJson(res, 409, {
                    success: false,
                    error: 'This SPACE-MD session is already registered. Log out the current session before pairing another number.'
                });

                return;
            }

            console.log(
                `🔗 Pairing request received for +${requestedNumber}`
            );

            let code =
                await pairingSocket.requestPairingCode(
                    requestedNumber
                );

            code =
                code?.match(/.{1,4}/g)?.join('-') ||
                code;

            sendJson(res, 200, {
                success: true,
                code
            });

        } catch (error) {

            console.error(
                '❌ Web pairing error:',
                error
            );

            sendJson(res, 500, {
                success: false,
                error: 'Failed to generate pairing code. Check the Render logs.'
            });
        }

        return;
    }

    /*
     * Unknown route
     */
    sendJson(res, 404, {
        success: false,
        error: 'Not found'
    });
});

healthServer.listen(settings.port, '0.0.0.0', () => {
    console.log(
        `🌐 SPACE-MD Bot Panel running on port ${settings.port}`
    );
});

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000) // every 1 minute

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1) // Panel will auto-restart
    }
}, 30_000) // check every 30 seconds

let phoneNumber = process.env.PAIRING_NUMBER || ""
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "SPACE-MD"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        // In non-interactive environment, use ownerNumber from settings
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}


async function startXeonBotInc() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    pairingSocket = XeonBotInc;
    pairingSocket.authState = {
        creds: state.creds
    };

    store.bind(XeonBotInc.ev)

XeonBotInc.ev.on('presence.update', ({ id, presences }) => {
    updatePresence(id, presences);
});

    // Message handling
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, chatUpdate);
                return;
            }
           
// Ignore anything that is not a live incoming message.
// This prevents WhatsApp history synchronization from replaying old commands.
if (chatUpdate.type !== 'notify') return

// Ignore messages created before this bot process started
const messageTimestamp = Number(mek.messageTimestamp || 0) * 1000;

if (messageTimestamp && messageTimestamp < BOT_START_TIME) {
    return;
}

if (!XeonBotInc.public && !mek.key.fromMe) return

if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

// Clear message retry cache to prevent memory bloat

            // Clear message retry cache to prevent memory bloat
            if (XeonBotInc?.msgRetryCounterCache) {
                XeonBotInc.msgRetryCounterCache.clear()
            }

            try {
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                // Only try to send error message if we have a valid chatId
                if (mek.key && mek.key.remoteJid) {
                    await XeonBotInc.sendMessage(mek.key.remoteJid, {
                        text: '❌ An error occurred while processing your message.',
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363420933039839@newsletter',
                                newsletterName: 'SPACE-MD',
                                serverMessageId: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    // Add these event handlers for better functionality
    XeonBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    XeonBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    XeonBotInc.getName = (jid, withoutContact = false) => {
        let id = XeonBotInc.decodeJid(jid)
        withoutContact = XeonBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
            XeonBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    XeonBotInc.public = true

    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

    // Handle pairing code
    if (pairingCode && !XeonBotInc.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

let requestedPhoneNumber = phoneNumber

if (!requestedPhoneNumber && global.phoneNumber) {
    requestedPhoneNumber = global.phoneNumber
}

if (!requestedPhoneNumber) {
    requestedPhoneNumber = await question(
        chalk.bgBlack(
            chalk.greenBright(
                `Please type your WhatsApp number 😍\nFormat: 263XXXXXXXXX (without + or spaces) : `
            )
        )
    )
}

phoneNumber = requestedPhoneNumber

        // Clean the phone number - remove any non-digit characters
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        // Validate the phone number using awesome-phonenumber
const pn = require('awesome-phonenumber');

if (!pn('+' + phoneNumber).isPossible()) {
    console.log(chalk.yellow('⚠️ Phone number could not be verified by awesome-phonenumber. Continuing with WhatsApp pairing...'));
}

        setTimeout(async () => {
            try {
                let code = await XeonBotInc.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
            }
        }, 3000)
    }

    // Connection handling
    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))

            const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
            await XeonBotInc.sendMessage(botNumber, {
                text: `> 🚀 _*SPACE-MD Connected!*_\n\n> ⏰ *Time*: ${new Date().toLocaleString()}\n> ✅ *Status*: Online and Ready!
                \n> ✅Make sure to join below channel`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363420933039839@newsletter',
                        newsletterName: 'SPACE-MD',
                        serverMessageId: -1
                    }
                }
            });

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'SPACE-MD'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: DARK-EYE-OFC`))
	    console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: DARK-EYE-OFC`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: DARK-EYE-OFC`))
 	    console.log(chalk.green(`${global.themeemoji || '•'}> 🤖 SPACE-MD Connected Successfully! ✅`))
            console.log(chalk.blue(`Bot Version: ${settings.version}`))
        }
if (connection === 'close') {
    const statusCode =
        lastDisconnect?.error?.output?.statusCode

    console.log(
        chalk.red(
            `⚠️ SPACE-MD connection closed. Status: ${statusCode || 'unknown'}`
        )
    )

    // WhatsApp session was genuinely logged out.
    // Do NOT keep reconnecting with an invalid session.
    if (
        statusCode === DisconnectReason.loggedOut ||
        statusCode === 401
    ) {
        pairingSocket = null

        try {
            rmSync('./session', {
                recursive: true,
                force: true
            })
        } catch {}

        console.log(
            chalk.red(
                '❌ Session logged out. Please pair SPACE-MD again.'
            )
        )

        return
    }

    // Prevent multiple reconnect timers.
    if (isReconnecting) {
        console.log(
            chalk.yellow(
                '⏳ Reconnect already scheduled...'
            )
        )
        return
    }

    isReconnecting = true

    console.log(
        chalk.yellow(
            '🔄 Reconnecting SPACE-MD in 5 seconds...'
        )
    )

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null
        isReconnecting = false

        try {
            await startXeonBotInc()
        } catch (error) {
            console.error(
                '❌ Reconnect failed:',
                error
            )
        }
    }, 5000)

}

})
    // Track recently-notified callers to avoid spamming messages
    const antiCallNotified = new Set();

    // Anticall handler: block callers when enabled
    XeonBotInc.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                try {
                    // First: attempt to reject the call if supported
                    try {
                        if (typeof XeonBotInc.rejectCall === 'function' && call.id) {
                            await XeonBotInc.rejectCall(call.id, callerJid);
                        } else if (typeof XeonBotInc.sendCallOfferAck === 'function' && call.id) {
                            await XeonBotInc.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    // Notify the caller only once within a short window
                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await XeonBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                } catch {}
                // Then: block after a short delay to ensure rejection and message are processed
                setTimeout(async () => {
                    try { await XeonBotInc.updateBlockStatus(callerJid, 'block'); } catch {}
                }, 800);
            }
        } catch (e) {
            // ignore
        }
    });




    XeonBotInc.ev.on('creds.update', saveCreds)

    XeonBotInc.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(XeonBotInc, update);
    });

    XeonBotInc.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(XeonBotInc, m);
        }
    });

    XeonBotInc.ev.on('status.update', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    XeonBotInc.ev.on('messages.reaction', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    return XeonBotInc
}


// Start the bot with error handling
startXeonBotInc().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
