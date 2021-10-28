const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // course code
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true }, // teacher id
    createdAt: { type: Date, default: Date.now }
}, { collection: 'courses', versionKey: false });

courseSchema.statics.isTeacher = async (userId, courseId) => {
    const result = await this.findOne({_id: courseId});
    return result.userId === userId;
};

module.exports = mongoose.model('courses', courseSchema);