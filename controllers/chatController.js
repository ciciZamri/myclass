const Chat = require('../models/chat');
const Course = require('../models/course');
const Random = require('../utils/random');
const firebase = require('firebase-admin');

class ChatController {
    static async index(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        return res.render('chat', { course: course, user: req.user });
    }

    static async create(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        const id = Random.randomStr(15);
        const chat = new Chat({
            _id: id,
            message: req.body.message,
            courseId: req.params.courseId,
            userId: req.user.id
        });
        await chat.save();
        firebase.firestore().collection('chats').doc(course._id).set({ updatedAt: Date.now() });
        return res.json({ chatId: id });
    }

    static async read(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        const messages = await Chat.aggregate([
            { $match: { courseId: req.params.courseId } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $project: {
                    message: 1,
                    createdAt: 1,
                    author: { $arrayElemAt: ["$author.name", 0] }
                }
            }
        ])
        return res.json(messages);
    }
}

module.exports = ChatController;