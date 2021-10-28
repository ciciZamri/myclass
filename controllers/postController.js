const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Post = require('../models/post');
const Random = require('../utils/random');

class PostController {
    static async create(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403', { message: 'You are not allowed to update this course' });
        
        const post = new Post({
            _id: Random.randomStr(12),
            title: req.body.title,
            body: req.body.body,
            attachment: {
                content: req.body.attachment,
                category: req.body.attachment_category
            },
            userId: req.user.id, // teacher id
            courseId: req.params.courseId,
        });
        return res.render('/course/view/');
    }

    static async updateForm(req, res) { }

    static async update(req, res) { }

    static async remove(req, res) { }
}

module.exports = PostController;