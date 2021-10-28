const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // role: { type: String, enum: ['student', 'teacher'], required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'users', versionKey: false });

module.exports = mongoose.model('users', userSchema);