const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join(process.cwd(), 'baileys_store.json');

const store = {
    contacts: {},
    messages: {},

    readFromFile() {
        try {
            if (fs.existsSync(STORE_FILE)) {
                const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8'));

                this.contacts = data.contacts || {};
                this.messages = data.messages || {};
            }
        } catch (error) {
            console.log('⚠️ Could not read baileys store:', error.message);
        }
    },

    writeToFile() {
        try {
            fs.writeFileSync(
                STORE_FILE,
                JSON.stringify({
                    contacts: this.contacts,
                    messages: this.messages
                }, null, 2)
            );
        } catch (error) {
            console.log('⚠️ Could not write baileys store:', error.message);
        }
    },

    bind(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            for (const message of messages || []) {
                const jid = message?.key?.remoteJid;
                const id = message?.key?.id;

                if (!jid || !id) continue;

                if (!this.messages[jid]) {
                    this.messages[jid] = {};
                }

                this.messages[jid][id] = message;
            }
        });

        ev.on('contacts.upsert', (contacts) => {
            for (const contact of contacts || []) {
                if (contact?.id) {
                    this.contacts[contact.id] = contact;
                }
            }
        });

        ev.on('contacts.update', (contacts) => {
            for (const contact of contacts || []) {
                if (contact?.id) {
                    this.contacts[contact.id] = {
                        ...(this.contacts[contact.id] || {}),
                        ...contact
                    };
                }
            }
        });
    },

    async loadMessage(jid, id) {
        return this.messages?.[jid]?.[id] || null;
    }
};

module.exports = store;
