const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    _id: { type: String, required: true },
}, { collection: 'announcements', versionKey: false });

module.exports = mongoose.model('announcements', announcementSchema);