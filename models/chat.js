const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // chatId
    message: { type: String, required: true },
    userId: { type: String, required: true },
    courseId: { type: String, required: true }, // teacher id
    createdAt: { type: Date, default: Date.now }
}, { collection: 'chats', versionKey: false });

module.exports = mongoose.model('chats', chatSchema);