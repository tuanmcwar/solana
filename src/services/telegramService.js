import TelegramBot from 'node-telegram-bot-api';
import ChatModel from '../models/Chat.js';
import { TELEGRAM_BOT_TOKEN } from '../config/config.js';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Hàm lưu chatId và gửi tin nhắn kết nối
export const connectChat = async (chatId) => {
    try {
        const existingChat = await ChatModel.findOne({ chatId });
        if (!existingChat) {
            await ChatModel.create({ chatId });
        }
    } catch (error) {
        console.error('Error saving chatId to database:', error);
    }
    bot.sendMessage(chatId, `Connected to server ${chatId}`);
};

// Bot event handlers
bot.onText(/\/echo (.+)/, (msg) => {
    connectChat(msg.chat.id);
});

bot.on('message', (msg) => {
    if (['init', '/start'].includes(msg.text)) {
        connectChat(msg.chat.id);
    }
});

// Gửi tin nhắn tới tất cả các chat đã lưu
export const sendMessageToAllChats = async (message) => {
    try {
        const chats = await ChatModel.find({});
        for (const { chatId } of chats) {
            await bot.sendMessage(chatId, message);
        }
        console.warn('Message sent to all chat IDs.');
    } catch (error) {
        console.error('Error sending message to chat IDs:', error);
    }
};
