
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

/*
 * ╔══════════════════════════════════════╗
 * ║        SPACE-MD REMOTE TERMINAL     ║
 * ║            DARK-EYE-OFC             ║
 * ╚══════════════════════════════════════╝
 *
 * Executes shell commands on the machine
 * where SPACE-MD is running.
 */

const COMMAND_TIMEOUT = 30_000;
const MAX_BUFFER = 5 * 1024 * 1024;
const MAX_OUTPUT = 3500;
const MAX_COMMAND_LENGTH = 1000;

/*
 * Optional terminal-specific sudo numbers.
 *
 * Add numbers here only if you intentionally want
 * additional terminal users.
 *
 * Example:
 * const SUDOS = ['2637xxxxxxxxx'];
 */
const SUDOS = [];

/* -------------------------------------------------
 * Number helpers
 * ------------------------------------------------- */

function normalizeNumber(value) {
    return String(value || '')
        .replace(/[^0-9]/g, '');
}

function getSenderNumber(msg, from) {
    const jid =
        msg?.key?.participant ||
        msg?.participant ||
        msg?.sender ||
        from ||
        '';

    return normalizeNumber(
        String(jid).split('@')[0].split(':')[0]
    );
}

/* -------------------------------------------------
 * Existing SPACE-MD owner information
 * ------------------------------------------------- */

function getOwnerNumbers() {
    const owners = [];

    /*
     * Try the existing owner.json used by SPACE-MD.
     */
    try {
        const ownerData = require('../data/owner.json');

        if (typeof ownerData === 'string') {
            owners.push(ownerData);
        }

        if (Array.isArray(ownerData)) {
            owners.push(...ownerData);
        }

        if (ownerData && typeof ownerData === 'object') {
            if (ownerData.number) owners.push(ownerData.number);
            if (ownerData.ownerNumber) owners.push(ownerData.ownerNumber);
            if (ownerData.owner) owners.push(ownerData.owner);

            if (Array.isArray(ownerData.numbers)) {
                owners.push(...ownerData.numbers);
            }

            if (Array.isArray(ownerData.owners)) {
                owners.push(...ownerData.owners);
            }
        }
    } catch (error) {
        // owner.json may not exist or may use another format.
    }

    /*
     * Also allow an environment variable:
     *
     * TERMINAL_OWNERS=2637xxxxxxx,2637xxxxxxx
     */
    if (process.env.TERMINAL_OWNERS) {
        owners.push(
            ...process.env.TERMINAL_OWNERS.split(',')
        );
    }

    return owners
        .map(normalizeNumber)
        .filter(Boolean);
}

/* -------------------------------------------------
 * Authorization
 * ------------------------------------------------- */

function isAuthorized(msg, from) {
    /*
     * Commands sent by the connected bot itself.
     */
    if (msg?.key?.fromMe) {
        return true;
    }

    const sender = getSenderNumber(msg, from);

    if (!sender) {
        return false;
    }

    const owners = getOwnerNumbers();

    const sudoNumbers = [
        ...SUDOS,
        ...(process.env.TERMINAL_SUDOS
            ? process.env.TERMINAL_SUDOS.split(',')
            : [])
    ]
        .map(normalizeNumber)
        .filter(Boolean);

    return (
        owners.includes(sender) ||
        sudoNumbers.includes(sender)
    );
}

/* -------------------------------------------------
 * Command safety
 * ------------------------------------------------- */

function isDangerousCommand(command) {
    const blockedPatterns = [
        /(^|\s)rm\s+-rf\s+\/(\s|$)/i,
        /(^|\s)mkfs(\.|[\s]|$)/i,
        /(^|\s)shutdown(\s|$)/i,
        /(^|\s)reboot(\s|$)/i,
        /(^|\s)poweroff(\s|$)/i,
        /:\(\)\s*\{\s*:\|:\s*&\s*\};:/,
        />\s*\/dev\/sd[a-z]/i,
        /(^|\s)dd\s+.*of=\/dev\/(sd|nvme|mmcblk)/i
    ];

    return blockedPatterns.some(pattern =>
        pattern.test(command)
    );
}

/* -------------------------------------------------
 * Output formatting
 * ------------------------------------------------- */

function cleanOutput(value) {
    return String(value || '')
        .replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '')
        .trim();
}

function truncateOutput(output) {
    if (!output) {
        return 'Command completed with no output.';
    }

    if (output.length <= MAX_OUTPUT) {
        return output;
    }

    return (
        output.slice(0, MAX_OUTPUT) +
        '\n\n⚠️ [OUTPUT TRUNCATED]'
    );
}

/* -------------------------------------------------
 * Main command
 * ------------------------------------------------- */

const terminalCommand = {
    name: 'terminal',

    alias: [
        'bash',
        'execute',
        'run',
        'shell',
        'cmd',
        'sh',
        '$',
        'node',
        'npm',
        'install',
        'uninstall'
    ],

    category: 'owner',

    desc: 'Remote shell terminal - OWNER/SUDO ONLY',

    async execute(sock, msg, args, from) {
        try {
            /*
             * -----------------------------------------
             * AUTHORIZATION
             * -----------------------------------------
             */

            if (!isAuthorized(msg, from)) {
                await sock.sendMessage(
                    from,
                    {
                        text:
                            '╭──• [ 🔒 TERMINAL LOCKED ]\n' +
                            '│\n' +
                            '│ ❌ Access denied.\n' +
                            '│\n' +
                            '│ Terminal access is restricted\n' +
                            '│ to SPACE-MD owner/sudo users.\n' +
                            '│\n' +
                            '╰──────────────────\n' +
                            '> *DARK-EYE-OFC SECURITY*'
                    },
                    { quoted: msg }
                );

                return;
            }

            /*
             * -----------------------------------------
             * BUILD COMMAND
             * -----------------------------------------
             */

            const shellCmd = Array.isArray(args)
                ? args.join(' ').trim()
                : String(args || '').trim();

            /*
             * -----------------------------------------
             * HELP
             * -----------------------------------------
             */

            if (!shellCmd) {
                await sock.sendMessage(
                    from,
                    {
                        text:
                            '╭──• [ 🔵 SPACE-MD TERMINAL ]\n' +
                            '│\n' +
                            '│ 🖥️ *REMOTE TERMINAL v2.0*\n' +
                            '│\n' +
                            '│ Execute commands directly on\n' +
                            '│ the machine running SPACE-MD.\n' +
                            '│\n' +
                            '│ *ALIASES*\n' +
                            '│ .terminal\n' +
                            '│ .bash\n' +
                            '│ .$ \n' +
                            '│ .sh\n' +
                            '│ .shell\n' +
                            '│ .cmd\n' +
                            '│ .run\n' +
                            '│ .execute\n' +
                            '│ .node\n' +
                            '│ .npm\n' +
                            '│ .install\n' +
                            '│ .uninstall\n' +
                            '│\n' +
                            '│ *EXAMPLES*\n' +
                            '│ .bash pwd\n' +
                            '│ .bash ls -la\n' +
                            '│ .$ git status\n' +
                            '│ .sh cat package.json\n' +
                            '│ .cmd pm2 list\n' +
                            '│ .run npm --version\n' +
                            '│ .node --version\n' +
                            '│ .npm --version\n' +
                            '│ .npm install axios\n' +
                            '│ .terminal git pull\n' +
                            '│\n' +
                            '│ ⏱️ Timeout: 30 seconds\n' +
                            '│ 📦 Output limit: 3500 chars\n' +
                            '│ 🔐 Owner/Sudo only\n' +
                            '│\n' +
                            '╰──────────────────\n' +
                            '> *♤ DARK-EYE-OFC • SPACE-MD*'
                    },
                    { quoted: msg }
                );

                return;
            }

            /*
             * -----------------------------------------
             * LIMIT COMMAND SIZE
             * -----------------------------------------
             */

            if (shellCmd.length > MAX_COMMAND_LENGTH) {
                await sock.sendMessage(
                    from,
                    {
                        text:
                            '❌ *Command too long.*\n\n' +
                            `Maximum length: ${MAX_COMMAND_LENGTH} characters.`
                    },
                    { quoted: msg }
                );

                return;
            }

            /*
             * -----------------------------------------
             * BLOCK KNOWN DESTRUCTIVE COMMANDS
             * -----------------------------------------
             */

            if (isDangerousCommand(shellCmd)) {
                await sock.sendMessage(
                    from,
                    {
                        text:
                            '╭──• [ 🛡️ BLOCKED ]\n' +
                            '│\n' +
                            '│ ❌ Dangerous command detected.\n' +
                            '│\n' +
                            '│ SPACE-MD refused to execute it.\n' +
                            '│\n' +
                            '╰──────────────────\n' +
                            '> *DARK-EYE-OFC SECURITY*'
                    },
                    { quoted: msg }
                );

                return;
            }

            /*
             * -----------------------------------------
             * EXECUTION MESSAGE
             * -----------------------------------------
             */

            await sock.sendMessage(
                from,
                {
                    text:
                        '╭──• [ 🖥️ EXECUTING ]\n' +
                        '│\n' +
                        `│ $ ${shellCmd}\n` +
                        '│\n' +
                        '│ ⏳ Please wait...\n' +
                        '│\n' +
                        '╰──────────────────'
                },
                { quoted: msg }
            );

            const startTime = Date.now();

            /*
             * -----------------------------------------
             * EXECUTE
             * -----------------------------------------
             */

            let result;

            try {
                result = await execAsync(
                    shellCmd,
                    {
                        cwd: process.cwd(),
                        timeout: COMMAND_TIMEOUT,
                        maxBuffer: MAX_BUFFER,
                        shell: '/bin/sh'
                    }
                );
            } catch (error) {
                /*
                 * Preserve stdout/stderr from failed
                 * commands such as npm, git, node, etc.
                 */

                const elapsed =
                    ((Date.now() - startTime) / 1000)
                        .toFixed(2);

                let errorOutput =
                    cleanOutput(
                        error.stderr ||
                        error.stdout ||
                        error.message ||
                        'Unknown error'
                    );

                if (error.killed) {
                    errorOutput =
                        '⏱️ Command terminated because it exceeded the 30 second timeout.';
                }

                errorOutput =
                    truncateOutput(errorOutput);

                await sock.sendMessage(
                    from,
                    {
                        text:
                            '╭──• [ ❌ COMMAND FAILED ]\n' +
                            '│\n' +
                            `│ $ ${shellCmd}\n` +
                            `│ ⏱️ ${elapsed}s\n` +
                            '│\n' +
                            '│ *OUTPUT:*\n' +
                            '│\n' +
                            `${errorOutput}\n` +
                            '│\n' +
                            '╰──────────────────\n' +
                            '> *SPACE-MD TERMINAL*'
                    },
                    { quoted: msg }
                );

                return;
            }

            /*
             * -----------------------------------------
             * SUCCESS RESULT
             * -----------------------------------------
             */

            const elapsed =
                ((Date.now() - startTime) / 1000)
                    .toFixed(2);

            const stdout =
                cleanOutput(result.stdout);

            const stderr =
                cleanOutput(result.stderr);

            let output = '';

            if (stdout) {
                output +=
                    `📤 *STDOUT:*\n${stdout}\n`;
            }

            if (stderr) {
                output +=
                    `${output ? '\n' : ''}` +
                    `⚠️ *STDERR:*\n${stderr}\n`;
            }

            if (!output) {
                output =
                    '✅ Command completed successfully.\n' +
                    'No output was returned.';
            }

            output = truncateOutput(output);

            await sock.sendMessage(
                from,
                {
                    text:
                        '╭──• [ ✅ COMMAND COMPLETE ]\n' +
                        '│\n' +
                        `│ $ ${shellCmd}\n` +
                        `│ ⏱️ ${elapsed}s\n` +
                        '│\n' +
                        `${output}\n` +
                        '│\n' +
                        '╰──────────────────\n' +
                        '> *♤ SPACE-MD TERMINAL*'
                },
                { quoted: msg }
            );

        } catch (error) {
            console.error(
                '❌ Terminal command error:',
                error
            );

            await sock.sendMessage(
                from,
                {
                    text:
                        '╭──• [ ❌ TERMINAL ERROR ]\n' +
                        '│\n' +
                        `│ ${error.message || 'Unknown error'}\n` +
                        '│\n' +
                        '╰──────────────────\n' +
                        '> *SPACE-MD TERMINAL*'
                },
                { quoted: msg }
            );
        }
    }
};

module.exports = terminalCommand;
