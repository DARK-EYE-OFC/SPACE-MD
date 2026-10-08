const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpeg = 'ffmpeg';

async function simageCommand(sock, quotedMessage, chatId) {
    let tempSticker;
    let tempOutput;

    try {
        if (!quotedMessage?.stickerMessage) {
            await sock.sendMessage(chatId, {
                text: 'Please reply to a sticker!'
            });
            return;
        }

        const tempDir = path.join(process.cwd(), 'temp');

        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const id = Date.now();

        tempSticker = path.join(tempDir, `temp_${id}.webp`);
        tempOutput = path.join(tempDir, `image_${id}.png`);

        const stream = await downloadContentFromMessage(
            quotedMessage.stickerMessage,
            'sticker'
        );

        const chunks = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        fs.writeFileSync(tempSticker, buffer);

        // Convert WebP sticker to PNG using Termux/system FFmpeg
        await new Promise((resolve, reject) => {
            execFile(
                ffmpeg,
                [
                    '-y',
                    '-i',
                    tempSticker,
                    tempOutput
                ],
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('FFmpeg error:', stderr);
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );
        });

        await sock.sendMessage(chatId, {
            image: fs.readFileSync(tempOutput),
            caption: "✨ Here's your image!"
        });

    } catch (error) {
        console.error('Error in simage command:', error);

        await sock.sendMessage(chatId, {
            text: 'Failed to convert sticker to image!'
        });

    } finally {
        // Always clean temporary files
        if (tempSticker && fs.existsSync(tempSticker)) {
            fs.unlinkSync(tempSticker);
        }

        if (tempOutput && fs.existsSync(tempOutput)) {
            fs.unlinkSync(tempOutput);
        }
    }
}

module.exports = simageCommand;
