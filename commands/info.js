const settings = require('../settings');

const GITHUB_OWNER = 'DARK-EYE-OFC';
const GITHUB_REPO = 'SPACE-MD';

function formatDate(dateString) {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown';
    }

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

async function getGithubInfo() {
    const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'SPACE-MD'
    };

    const repoUrl =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

    const commitsUrl =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?per_page=1`;

    const [repoResponse, commitsResponse] = await Promise.all([
        fetch(repoUrl, { headers }),
        fetch(commitsUrl, { headers })
    ]);

    if (!repoResponse.ok) {
        throw new Error(`GitHub repository request failed: ${repoResponse.status}`);
    }

    if (!commitsResponse.ok) {
        throw new Error(`GitHub commits request failed: ${commitsResponse.status}`);
    }

    const repo = await repoResponse.json();
    const commits = await commitsResponse.json();

    const latestCommit = Array.isArray(commits)
        ? commits[0]
        : null;

    return {
        createdAt: repo.created_at,
        updatedAt: repo.pushed_at,
        latestCommit: latestCommit?.commit?.message || 'Unknown',
        latestCommitDate:
            latestCommit?.commit?.committer?.date ||
            latestCommit?.commit?.author?.date ||
            repo.pushed_at,
        repository: repo.full_name || `${GITHUB_OWNER}/${GITHUB_REPO}`
    };
}

async function infoCommand(sock, chatId, message) {
    const react = async (emoji) => {
        try {
            await sock.sendMessage(chatId, {
                react: {
                    text: emoji,
                    key: message.key
                }
            });
        } catch (error) {
            console.error('Info reaction error:', error);
        }
    };

    try {
        await react('♻️');

        let github;

        try {
            github = await getGithubInfo();
        } catch (error) {
            console.error('GitHub info error:', error);

            github = {
                createdAt: null,
                updatedAt: null,
                latestCommit: 'Unable to fetch',
                latestCommitDate: null,
                repository: `${GITHUB_OWNER}/${GITHUB_REPO}`
            };
        }

        const botName =
            settings.botName || '🚀 SPACE-MD';

        const currentVersion =
            settings.version || '5.6.9';

        const creator =
            'DARK-EYE-OFC';

        const upcomingVersion =
            '6.0.0';

        const caption =
            `╔═══❖•ೋ° °ೋ•❖═══╗\n` +
            `       🇿🇼 *𝐒𝐏𝐀𝐂𝐄 𝐌𝐃* 🇿🇼\n` +
            `╚═══❖•ೋ° °ೋ•❖═══╝\n\n` +

            `╭━━━━❒ 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ❒━━━━╮\n` +
            `┃\n` +
            `┃ 🤖 *BOT NAME:* ${botName}\n` +
            `┃ 👑 *CREATOR:* ${creator}\n` +
            `┃ 🐙 *REPOSITORY:* ${github.repository}\n` +
            `┃\n` +
            `┃ 📅 *CREATED:* ${formatDate(github.createdAt)}\n` +
            `┃ 🔄 *LAST UPDATED:* ${formatDate(github.updatedAt)}\n` +
            `┃ 📝 *LAST COMMIT:* ${github.latestCommit}\n` +
            `┃ 📆 *COMMIT DATE:* ${formatDate(github.latestCommitDate)}\n` +
            `┃\n` +
            `┃ 🚀 *VERSION:* ${currentVersion}\n` +
            `┃ 🔮 *UPCOMING:* ${upcomingVersion}\n` +
            `┃ 📌 *STATUS:* COMING SOON...\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +

            `🔥 _"💦𝐒𝐏𝐀𝐂𝐄 𝐌𝐃🇿🇼 is not just a bot, it's an experience."_\n\n` +

            `✨ _Designed with 💙 by 𝑫𝑨𝑹𝑲 𝑬𝒀𝑬 𝑶𝑭𝑪_\n\n` +

            `🔍 _Use the commands below to explore the magic 🪄._\n\n` +

            `> *♤powered by DARK-EYE OFC DEV*`;

        await sock.sendMessage(
            chatId,
            {
                text: caption
            },
            {
                quoted: message
            }
        );

        await react('✅️');

    } catch (error) {
        console.error('Error in info command:', error);

        await react('❌️');

        await sock.sendMessage(
            chatId,
            {
                text:
                    `❌️ *Unable to load SPACE-MD information.*\n\n` +
                    `Please try *.info* again.`
            },
            {
                quoted: message
            }
        );
    }
}

module.exports = infoCommand;
