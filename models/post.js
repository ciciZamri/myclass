const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    attachment: {
        content: { type: String },
        category: { type: String, enum: ['url', 'pdf', 'image'] }
    },
    userId: { type: String, required: true }, // teacher id
    courseId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'posts', versionKey: false });

module.exports = mongoose.model('posts', postSchema);