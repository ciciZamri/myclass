const mongoose = require('mongoose');
const Storage = require('../utils/storage');

const postSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    attachment: {
        content: { type: String },
        category: { type: String, enum: ['url', 'pdf', 'image', 'none'] }
    },
    userId: { type: String, required: true }, // teacher id
    courseId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'posts', versionKey: false });

postSchema.statics.findByCourse = async function(courseId){
    const posts = await this.find({ courseId: courseId });
    // console.log(posts);
    let processedPosts = [];
    for (let i = 0; i < posts.length; i++) {
        const e = posts[i];
        const t = new Date(e.updatedAt);
        let content = e.attachment.content;
        let label;
        if (e.attachment.category === 'pdf' || e.attachment.category === 'image') {
            content = await Storage.generateSignedUrl(e.attachment.content, 180);
            label = (e.attachment.content.split('/'))[2];
        }
        processedPosts.push({
            _id: e._id,
            title: e.title,
            body: e.body,
            attachment: {
                content: content,
                label: label,
                category: e.attachment.category
            },
            userId: e.userId,
            updatedAt: `${t.getDate()}/${t.getMonth()}/${t.getFullYear()}, ${t.toLocaleTimeString()}`
        });
    }
    return processedPosts;
};

const Post = mongoose.model('posts', postSchema);

module.exports = Post;