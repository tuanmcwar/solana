import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    chatId: { type: String, unique: true, required: true },
}, { timestamps: true });

const ChatModel = mongoose.model('Chat', chatSchema);
export default ChatModel;
