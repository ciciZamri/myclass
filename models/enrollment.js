const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    courseId: { type: String, required: true },
    studentId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'enrollments', versionKey: false });

module.exports = mongoose.model('enrollments', enrollmentSchema);