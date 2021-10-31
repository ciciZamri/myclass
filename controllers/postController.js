const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Post = require('../models/post');
const Random = require('../utils/random');
const Storage = require('../utils/storage');

class PostController {
    static async createForm(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403');
        return res.render('course/createPost', { user: req.user, course: course });
    }

    static async create(req, res) {
        const course = await Course.findOne({ _id: req.body.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403');
        let content;
        if (req.body.attachment_category === 'pdf' || req.body.attachment_category === 'image') {
            content = await Storage.upload(req, 'posts', false);
        } else {
            content = req.body.attachment_content;
        }
        const post = new Post({
            _id: Random.randomStr(12),
            title: req.body.title,
            body: req.body.body,
            attachment: {
                content: content,
                category: req.body.attachment_category
            },
            userId: req.user.id, // teacher id
            courseId: req.body.courseId,
        });
        await post.save();
        return res.redirect(`/course/view/${req.body.courseId}`);
    }

    static async updateForm(req, res) {
        const post = await Post.findOne({ _id: req.params.postId });
        if (!post) return res.status(404).render('404');
        if (post.userId != req.user.id) return res.status(403).render('403');
        return res.render('course/updatePost', { user: req.user, post: post });
    }

    static async update(req, res) {
        const post = await Post.findOne({ _id: req.body.postId });
        if (!post) return res.status(404).render('404');
        if (post.userId != req.user.id) return res.status(403).render('403');
        let data = { title: req.body.title, body: req.body.body, updatedAt: Date.now() };
        let content;
        if (req.body.update_attachment) {
            if (req.body.attachment_category === 'pdf' || req.body.attachment_category === 'image') {
                content = await Storage.upload(req, 'posts', false);
            } else {
                content = req.body.attachment_content;
            }
        }
        if (content) data.attachment = { category: req.body.attachment_category, content: content };
        await Post.updateOne({ _id: req.body.postId }, { $set: data });
        return res.redirect(`/course/view/${post.courseId}`);
    }

    static async remove(req, res) {
        const post = await Post.findOne({ _id: req.params.postId });
        if (!post) return res.status(404).render('404');
        if (post.userId != req.user.id) return res.status(403).render('403', { message: 'You are not allowed to update this course' });
        await Post.deleteOne({ _id: post._id });
        return res.redirect(`/course/view/${post.courseId}`);
    }
}

module.exports = PostController;