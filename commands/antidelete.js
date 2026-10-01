const fs = require('fs');
const path = require('path');

const {
    downloadMediaMessage
} = require('@whiskeysockets/baileys');

const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(
    DATA_DIR,
    'antideleteSettings.json'
);

const messageCache = new Map();

const MAX_CACHE_SIZE = 500;

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, {
            recursive: true
        });
    }

    if (!fs.existsSync(SETTINGS_FILE)) {
        fs.writeFileSync(
            SETTINGS_FILE,
            JSON.stringify({}, null, 2)
        );
    }
}

function readSettings() {
    ensureDataFile();

    try {
        return JSON.parse(
            fs.readFileSync(
                SETTINGS_FILE,
                'utf8'
            )
        );
    } catch {
        return {};
    }
}

function writeSettings(data) {
    ensureDataFile();

    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(data, null, 2)
    );
}

function getSessionId(sock) {
    return sock?.user?.id || 'default';
}

function getMode(sock) {
    const data = readSettings();
    const sessionId = getSessionId(sock);

    return data[sessionId]?.mode || 'off';
}

function setMode(sock, mode) {
    const data = readSettings();
    const sessionId = getSessionId(sock);

    if (!data[sessionId]) {
        data[sessionId] = {};
    }

    data[sessionId].mode = mode;

    writeSettings(data);

    return mode;
}

async function react(
    sock,
    chatId,
    message,
    emoji
) {
    try {
        if (!message?.key) return;

        await sock.sendMessage(
            chatId,
            {
                react: {
                    text: emoji,
                    key: message.key
                }
            }
        );
    } catch (error) {
        console.log(
            '⚠️ Antidelete reaction error:',
            error?.message
        );
    }
}

/*
 * Store incoming messages.
 */
function storeMessage(message) {
    try {
        if (!message?.key?.id) {
            return;
        }

        const key = message.key;

        if (
            message.message?.protocolMessage
        ) {
            return;
        }

        messageCache.set(
            key.id,
            {
                message,
                chatId: key.remoteJid,
                timestamp: Date.now()
            }
        );

        if (
            messageCache.size >
            MAX_CACHE_SIZE
        ) {
            const firstKey =
                messageCache.keys()
                    .next()
                    .value;

            if (firstKey) {
                messageCache.delete(
                    firstKey
                );
            }
        }
    } catch (error) {
        console.log(
            '⚠️ Antidelete storage error:',
            error?.message
        );
    }
}

/*
 * Find the original deleted message.
 */
function getDeletedMessage(message) {
    try {
        const protocol =
            message?.message?.protocolMessage;

        if (!protocol) {
            return null;
        }

        if (protocol.type !== 0) {
            return null;
        }

        const deletedKey =
            protocol.key;

        if (!deletedKey?.id) {
            return null;
        }

        return (
            messageCache.get(
                deletedKey.id
            ) || null
        );
    } catch {
        return null;
    }
}

/*
 * Get sender JID.
 */
function getSenderJid(message) {
    return (
        message?.key?.participant ||
        message?.key?.remoteJid ||
        'Unknown'
    );
}

/*
 * Convert JID to a readable WhatsApp number.
 */
function formatUser(jid) {
    if (!jid) {
        return 'Unknown';
    }

    return jid
        .split(':')[0]
        .replace('@s.whatsapp.net', '')
        .replace('@lid', '');
}

/*
 * Get the person who performed the deletion.
 */
function getDeletedBy(message) {
    return (
        message?.key?.participant ||
        message?.participant ||
        message?.key?.remoteJid ||
        'Unknown'
    );
}

/*
 * Extract text from a deleted message.
 */
function getDeletedText(original) {
    if (!original?.message) {
        return null;
    }

    const msg = original.message;

    if (msg.conversation) {
        return msg.conversation;
    }

    if (
        msg.extendedTextMessage?.text
    ) {
        return (
            msg.extendedTextMessage.text
        );
    }

    if (msg.imageMessage) {
        return (
            msg.imageMessage.caption ||
            '🖼️ Deleted image'
        );
    }

    if (msg.videoMessage) {
        return (
            msg.videoMessage.caption ||
            '🎥 Deleted video'
        );
    }

    if (msg.audioMessage) {
        return '🎵 Deleted audio';
    }

    if (msg.documentMessage) {
        return (
            msg.documentMessage.fileName ||
            '📄 Deleted document'
        );
    }

    if (msg.stickerMessage) {
        return '🎨 Deleted sticker';
    }

    return '📦 Deleted message';
}

/*
 * Create the SPACE-MD antidelete notification.
 */
function createDeleteNotice(
    original,
    deletedMessage
) {
    const sender = formatUser(
        getSenderJid(original)
    );

    const deletedBy = formatUser(
        getDeletedBy(deletedMessage)
    );

    const deletedText =
        getDeletedText(original);

    return (
        `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
        `      🟢  *𝐒𝐏𝐀𝐂𝐄 𝐌𝐃* 🔵\n` +
        `╚═══❖•ೋ° °ೋ•❖═══╝\n` +
        `║\n` +
        `║🔰 *ANTIDELETE* 🔰\n` +
        `║⚠️ MESSAGE DETECTED\n` +
        `╚═════════════\n` +
        `║\n` +
        `║💬📤 *SENT BY:* ${sender}\n` +
        `║🗨🚮 *DELETED BY:* ${deletedBy}\n` +
        `║\n` +
        `║🗑✉️ *DELETED MESSAGE👇*\n` +
        `║ ${deletedText}\n` +
        `╚═══════════\n` +
        `\n` +
        `> *𝓹𝓸𝔀𝓮𝓻𝓭 𝓫𝔂 𝑫𝑨𝑹𝑲 𝑬𝒀𝑬 𝑶𝑭𝑪 𝑻𝑬𝑪𝑯*`
    );
}

/*
 * Get bot's own WhatsApp JID.
 */
function getBotJid(sock) {
    const id = sock?.user?.id;

    if (!id) {
        return null;
    }

    return (
        id.split(':')[0] +
        '@s.whatsapp.net'
    );
}

/*
 * Restore media.
 */
async function restoreMedia(
    sock,
    targetChat,
    original
) {
    const raw =
        original?.message;

    if (!raw) {
        return false;
    }

    let mediaType = null;
    let mediaMessage = null;

    if (raw.imageMessage) {
        mediaType = 'image';
        mediaMessage =
            raw.imageMessage;
    } else if (
        raw.videoMessage
    ) {
        mediaType = 'video';
        mediaMessage =
            raw.videoMessage;
    } else if (
        raw.audioMessage
    ) {
        mediaType = 'audio';
        mediaMessage =
            raw.audioMessage;
    } else if (
        raw.documentMessage
    ) {
        mediaType = 'document';
        mediaMessage =
            raw.documentMessage;
    } else if (
        raw.stickerMessage
    ) {
        mediaType = 'sticker';
        mediaMessage =
            raw.stickerMessage;
    }

    if (
        !mediaType ||
        !mediaMessage
    ) {
        return false;
    }

    const buffer =
        await downloadMediaMessage(
            original,
            'buffer',
            {},
            {
                logger: console
            }
        );

    if (!buffer) {
        return false;
    }

    if (mediaType === 'image') {
        await sock.sendMessage(
            targetChat,
            {
                image: buffer,
                caption:
                    mediaMessage.caption ||
                    '🖼️ Deleted image recovered.'
            }
        );

        return true;
    }

    if (mediaType === 'video') {
        await sock.sendMessage(
            targetChat,
            {
                video: buffer,
                caption:
                    mediaMessage.caption ||
                    '🎥 Deleted video recovered.'
            }
        );

        return true;
    }

    if (mediaType === 'audio') {
        await sock.sendMessage(
            targetChat,
            {
                audio: buffer,
                mimetype:
                    mediaMessage.mimetype ||
                    'audio/mp4',
                ptt:
                    Boolean(
                        mediaMessage.ptt
                    )
            }
        );

        return true;
    }

    if (
        mediaType === 'document'
    ) {
        await sock.sendMessage(
            targetChat,
            {
                document: buffer,
                mimetype:
                    mediaMessage.mimetype ||
                    'application/octet-stream',
                fileName:
                    mediaMessage.fileName ||
                    'deleted-file'
            }
        );

        return true;
    }

    if (
        mediaType === 'sticker'
    ) {
        await sock.sendMessage(
            targetChat,
            {
                sticker: buffer
            }
        );

        return true;
    }

    return false;
}

/*
 * Handle deleted messages.
 */
async function handleMessageRevocation(
    sock,
    message
) {
    try {
        const mode =
            getMode(sock);

        if (mode === 'off') {
            return;
        }

        const deleted =
            getDeletedMessage(
                message
            );

        if (!deleted?.message) {
            return;
        }

        const original =
            deleted.message;

        const originalChat =
            deleted.chatId ||
            original.key?.remoteJid;

        if (!originalChat) {
            return;
        }

        /*
         * 🛡 MESSAGE DETECTED
         */
        await react(
            sock,
            originalChat,
            message,
            '🛡'
        );

        /*
         * ♻️ PROCESSING
         */
        await react(
            sock,
            originalChat,
            message,
            '♻️'
        );

        /*
         * Determine destination.
         */
        let targetChat =
            originalChat;

        if (mode === 'private') {
            targetChat =
                getBotJid(sock);

            if (!targetChat) {
                await react(
                    sock,
                    originalChat,
                    message,
                    '❌️'
                );

                return;
            }
        }

        /*
         * Send formatted notification.
         */
        await sock.sendMessage(
            targetChat,
            {
                text:
                    createDeleteNotice(
                        original,
                        message
                    )
            }
        );

        /*
         * Check whether it is media.
         */
        const raw =
            original.message || {};

        const hasMedia =
            Boolean(
                raw.imageMessage ||
                raw.videoMessage ||
                raw.audioMessage ||
                raw.documentMessage ||
                raw.stickerMessage
            );

        /*
         * Text message is already
         * included in the notification.
         */
        if (!hasMedia) {
            return;
        }

        /*
         * Restore media underneath
         * the antidelete notice.
         */
        const restored =
            await restoreMedia(
                sock,
                targetChat,
                original
            );

        if (!restored) {
            await react(
                sock,
                originalChat,
                message,
                '❌️'
            );
        }

    } catch (error) {
        console.error(
            '❌ Antidelete recovery error:',
            error
        );

        try {
            const chatId =
                message?.key?.remoteJid;

            if (chatId) {
                await react(
                    sock,
                    chatId,
                    message,
                    '❌️'
                );
            }
        } catch {}
    }
}

/*
 * .antidelete command.
 */
async function handleAntideleteCommand(
    sock,
    chatId,
    message,
    args = ''
) {
    try {
        const option =
            String(args || '')
                .trim()
                .toLowerCase();

        if (!option) {
            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTIDELETE* 🔰\n\n` +
                        `♻️ .antidelete on\n` +
                        `🛡 .antidelete private\n` +
                        `❌️ .antidelete off`
                },
                {
                    quoted: message
                }
            );

            return;
        }

        if (
            option === 'on' ||
            option === 'enable'
        ) {
            setMode(sock, 'on');

            await react(
                sock,
                chatId,
                message,
                '♻️'
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTIDELETE* 🔰\n\n` +
                        `🛡️ Antidelete successfully activated.\n\n` +
                        `Deleted messages will be recovered ` +
                        `and sent back in the same chat.`
                },
                {
                    quoted: message
                }
            );

            return;
        }

        if (
            option === 'private' ||
            option === 'dm'
        ) {
            setMode(
                sock,
                'private'
            );

            await react(
                sock,
                chatId,
                message,
                '♻️'
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTIDELETE PRIVATE* 🔰\n\n` +
                        `🛡️ Private antidelete successfully activated.\n\n` +
                        `Deleted messages will be recovered ` +
                        `and sent to the bot's account chat.`
                },
                {
                    quoted: message
                }
            );

            return;
        }

        if (
            option === 'off' ||
            option === 'disable' ||
            option === 'remove'
        ) {
            setMode(
                sock,
                'off'
            );

            await react(
                sock,
                chatId,
                message,
                '❌️'
            );

            await sock.sendMessage(
                chatId,
                {
                    text:
                        `🔰 *ANTIDELETE* 🔰\n\n` +
                        `❌️ Antidelete has been disabled.`
                },
                {
                    quoted: message
                }
            );

            return;
        }

        await react(
            sock,
            chatId,
            message,
            '❌️'
        );

        await sock.sendMessage(
            chatId,
            {
                text:
                    `❌️ Invalid antidelete option.\n\n` +
                    `.antidelete on\n` +
                    `.antidelete private\n` +
                    `.antidelete off`
            },
            {
                quoted: message
            }
        );

    } catch (error) {
        console.error(
            '❌ Antidelete command error:',
            error
        );

        await react(
            sock,
            chatId,
            message,
            '❌️'
        );
    }
}

module.exports = {
    handleAntideleteCommand,
    handleMessageRevocation,
    storeMessage
};
