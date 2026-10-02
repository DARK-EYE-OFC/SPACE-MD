const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, message, songTitle) {

    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Lyrics reaction error:', error);
        }
    };

    if (!songTitle) {
        await sock.sendMessage(chatId, {
            text:
                '🔍 Please enter a song name!\n\n' +
                'Usage: *.lyrics <song name>*\n\n' +
                'Example:\n' +
                '*.lyrics Somehow You Want Me*'
        });
        return;
    }

    try {
        await react('♻️');

        const searchUrl =
            `https://lrclib.net/api/search?q=${encodeURIComponent(songTitle)}`;

        const res = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'SPACE-MD/5.6.9'
            }
        });

        if (!res.ok) {
            throw new Error(`LRCLIB returned ${res.status}`);
        }

        const results = await res.json();

        if (!Array.isArray(results) || results.length === 0) {
            await react('❌️');

            await sock.sendMessage(chatId, {
                text:
                    `❌ No lyrics found for:\n` +
                    `🎵 ${songTitle}`
            });
            return;
        }

        // Find the first result that actually contains lyrics
        const result = results.find(
            item => item.plainLyrics && item.plainLyrics.trim()
        );

        if (!result) {
            await react('❌️');

            await sock.sendMessage(chatId, {
                text:
                    `❌ Lyrics were not available for:\n` +
                    `🎵 ${songTitle}`
            });
            return;
        }

        const artist = result.artistName || 'Unknown';
        const song = result.trackName || songTitle;
        const lyrics = result.plainLyrics.trim();

        await sock.sendMessage(
            chatId,
            {
                text:
                    `╭━━━〔 🎵 𝐒𝐏𝐀𝐂𝐄-𝐌𝐃 〕━━━╮\n` +
                    `┃ 🎶 *SONG LYRICS*\n` +
                    `┃\n` +
                    `┃ 🎤 *Artist:* ${artist}\n` +
                    `┃ 🎵 *Song:* ${song}\n` +
                    `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
                    `📜 *LYRICS:*\n\n` +
                    `${lyrics}\n\n` +
                    `> *Powered by DARK-EYE-OFC*`
            },
            { quoted: message }
        );

        await react('✅️');

    } catch (error) {
        console.error('Error in lyrics command:', error);

        await react('❌️');

        await sock.sendMessage(chatId, {
            text:
                `❌ An error occurred while fetching lyrics for:\n` +
                `🎵 ${songTitle}`
        });
    }
}

module.exports = { lyricsCommand };
