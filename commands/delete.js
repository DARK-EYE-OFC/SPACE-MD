async function deleteCommand(sock, chatId, message) {
    try {
        const quoted =
            message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const quotedKey =
            message.message?.extendedTextMessage?.contextInfo?.stanzaId;

        if (!quoted || !quotedKey) {
            await sock.sendMessage(
                chatId,
                {
                    text: '❌️ Reply to a message with .del or .delete to delete it.'
                },
                { quoted: message }
            );
            return;
        }

        const participant =
            message.message?.extendedTextMessage?.contextInfo?.participant;

        const key = {
            remoteJid: chatId,
            fromMe: participant
                ? participant === sock.user?.id
                : false,
            id: quotedKey,
            participant
        };

        await sock.sendMessage(
            chatId,
            {
                delete: key
            }
        );

    } catch (error) {
        console.error('Error in delete command:', error);

        await sock.sendMessage(
            chatId,
            {
                text: '❌️ Unable to delete that message.'
            },
            { quoted: message }
        );
    }
}

module.exports = deleteCommand;
