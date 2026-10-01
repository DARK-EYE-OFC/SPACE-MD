// 🌌 SPACE-MD Session Settings
// Settings are stored separately for each connected WhatsApp account.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'sessionSettings.json');

const DEFAULT_SETTINGS = {
    prefix: '.'
};

function ensureFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, '{}');
    }
}

function readSettings() {
    ensureFile();

    try {
        return JSON.parse(fs.readFileSync(FILE, 'utf8'));
    } catch {
        return {};
    }
}

function saveSettings(data) {
    ensureFile();

    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );
}

function getSessionId(sock) {
    return sock?.user?.id || 'default';
}

function getSettings(sock) {
    const data = readSettings();
    const sessionId = getSessionId(sock);

    if (!data[sessionId]) {
        data[sessionId] = { ...DEFAULT_SETTINGS };
        saveSettings(data);
    }

    return {
        ...DEFAULT_SETTINGS,
        ...data[sessionId]
    };
}

function setSetting(sock, key, value) {
    const data = readSettings();
    const sessionId = getSessionId(sock);

    if (!data[sessionId]) {
        data[sessionId] = { ...DEFAULT_SETTINGS };
    }

    data[sessionId][key] = value;

    saveSettings(data);

    return data[sessionId];
}

function resetSettings(sock) {
    const data = readSettings();
    const sessionId = getSessionId(sock);

    data[sessionId] = { ...DEFAULT_SETTINGS };

    saveSettings(data);

    return data[sessionId];
}

module.exports = {
    DEFAULT_SETTINGS,
    getSettings,
    setSetting,
    resetSettings
};
