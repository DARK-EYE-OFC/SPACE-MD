const fetch = require('node-fetch');

module.exports = {
    name: 'image',
    alias: ['img', 'imagesearch', 'googleimage'],

    async execute(sock, m, args) {
        const jid = m.key.remoteJid;
        const query = args.join(' ').trim();

        if (!query) {
            return sock.sendMessage(
                jid,
                { text: '*Example: .image cat*\n*Or: .image 5 cats*' },
                { quoted: m }
            );
        }

        let count = 5;
        let searchQuery = query;

        if (/^\d+$/.test(args[0]) && Number(args[0]) >= 1 && Number(args[0]) <= 10) {
            count = Number(args[0]);
            searchQuery = args.slice(1).join(' ').trim();
        }

        if (!searchQuery) {
            return sock.sendMessage(
                jid,
                { text: 'Please enter a search term, e.g. .image cats' },
                { quoted: m }
            );
        }

        const accessKey = global.APIKeys?.['https://api.unsplash.com'];

        if (!accessKey || accessKey === 'YOUR_UNSPLASH_ACCESS_KEY') {
            return sock.sendMessage(
                jid,
                { text: '❌ Unsplash Access Key is missing from config.js.' },
                { quoted: m }
            );
        }

        try {
            await sock.sendMessage(jid, {
                react: { text: '🔎', key: m.key }
            });

            const url = new URL('https://api.unsplash.com/search/photos');
            url.searchParams.set('query', searchQuery);
            url.searchParams.set('per_page', String(count));
            url.searchParams.set('content_filter', 'high');

            const res = await fetch(url.toString(), {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                    'Accept-Version': 'v1'
                },
                timeout: 20000
            });

            if (!res.ok) {
                const details = await res.text();
                console.error('Unsplash API error:', res.status, details.slice(0, 300));

                throw new Error(
                    res.status === 401 || res.status === 403
                        ? 'Unsplash rejected the Access Key or request. Check your key and API application.'
                        : `Unsplash API returned HTTP ${res.status}.`
                );
            }

            const data = await res.json();
            const results = data.results || [];

            if (!results.length) {
                await sock.sendMessage(jid, {
                    react: { text: '❌', key: m.key }
                });

                return sock.sendMessage(
                    jid,
                    { text: `❌ No photos found for *${searchQuery}*.` },
                    { quoted: m }
                );
            }

            let sent = 0;

            for (let i = 0; i < results.length; i++) {
                const photo = results[i];
                const imageUrl = photo.urls?.regular || photo.urls?.small;

                if (!imageUrl) continue;

                const caption = [
                    i === 0 ? `🔎 *Unsplash results for:* ${searchQuery}` : '',
                    `📷 Photo by SPACE-MD`,
                    photo.links?.html ? `🔗 contact owner` : '',
                    '',
                    '> Powered by DARK EYE TECH 🇿🇼'
                ].filter(Boolean).join('\n');

                try {
                    await sock.sendMessage(
                        jid,
                        {
                            image: { url: imageUrl },
                            caption
                        },
                        { quoted: i === 0 ? m : undefined }
                    );

                    sent++;
                    await new Promise(resolve => setTimeout(resolve, 800));
                } catch (err) {
                    console.error('Failed to send photo:', err.message);
                }
            }

            await sock.sendMessage(jid, {
                react: { text: sent ? '✅' : '❌', key: m.key }
            });

            if (!sent) {
                await sock.sendMessage(
                    jid,
                    { text: '❌ I found photos, but could not send them. Please try again.' },
                    { quoted: m }
                );
            }
        } catch (err) {
            console.error('Image command error:', err.message);

            await sock.sendMessage(jid, {
                react: { text: '❌', key: m.key }
            });

            await sock.sendMessage(
                jid,
                { text: `❌ Image search failed: ${err.message}` },
                { quoted: m }
            );
        }
    }
};
