const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Post = require('../models/post');
const User = require('../models/user');
const Random = require('../utils/random');
const firebase = require('firebase-admin');

class CourseController {
    static async create(req, res) {
        const id = Random.randomStr(7);
        const course = new Course({
            _id: id,
            name: req.body.name,
            description: req.body.description,
            userId: req.user.id
        });
        await course.save();
        firebase.firestore().collection('chats').doc(id).set({ updatedAt: Date.now() });
        return res.redirect(`/course/view/${id}`);
    }

    static async updateForm(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403', { message: 'You are not allowed to update this course' });
        return res.render('course/update', { course: course, user: req.user });
    }

    static async update(req, res) {
        const course = await Course.findOne({ _id: req.body.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403', { message: 'You are not allowed to update this course' });
        await Course.updateOne(
            { _id: req.body.courseId },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description
                }
            }
        );
        return res.redirect(`/course/view/${req.body.courseId}`);
    }

    static async get(req, res) {
        const myCourses = await Course.find({ userId: req.user.id });
        let enrollments = await Enrollment.aggregate([
            { $match: { studentId: req.user.id } },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courses"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "courses.0.userId",
                    foreignField: "_id",
                    as: "instructor"
                }
            },
            {
                $project: {
                    courseId: 1,
                    courseName: { $arrayElemAt: ["$courses.name", 0] },
                    instructor: { $arrayElemAt: ["$instructor.name", 0] }
                }
            }
        ]);
        return res.render('course/home', {
            user: req.user,
            myCourses: myCourses,
            enrollments: enrollments
        });
    }

    static async view(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        const posts = await Post.findByCourse(course._id);
        const instructor = await User.findOne({ _id: course.userId });
        if (course.userId === req.user.id) {
            return res.render(
                'course/view',
                { course: course, posts: posts, isTeacher: true, user: req.user, instructor: instructor }
            );
        }
        let enrollment = await Enrollment.findOne({
            courseId: req.params.courseId,
            studentId: req.user.id
        });
        if (!enrollment) return res.render('course/notRegistered');
        return res.render(
            'course/view',
            { course: course, posts: posts, isTeacher: false, user: req.user, instructor: instructor }
        );
    }

    static async join(req, res) {
        const course = await Course.findOne({ _id: req.body.course_code });
        if (!course) return res.render('course/join', { error: 'No course found', user: req.user });
        if (course.userId === req.user.id) return res.redirect(`/course/view/${course._id}`);
        let enrollment = await Enrollment.findOne({
            courseId: req.body.course_code,
            studentId: req.user.id
        });
        if (!enrollment) {
            enrollment = new Enrollment({
                _id: Random.randomStr(12),
                courseId: req.body.course_code,
                studentId: req.user.id
            });
            await enrollment.save();
        }
        return res.redirect(`/course/view/${enrollment.courseId}`);
    }

    static async showStudents(req, res) {
        const course = await Course.findOne({ _id: req.params.courseId });
        if (!course) return res.status(404).render('404');
        if (course.userId != req.user.id) return res.status(403).render('403', { message: 'You are not allowed to view the students' });
        const students = await Enrollment.aggregate([
            { $match: { courseId: req.params.courseId } },
            {
                $lookup: {
                    from: "users",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "students"
                }
            },
            {
                $project: {
                    courseId: 1,
                    name: { $arrayElemAt: ["$students.name", 0] }
                }
            }
        ]);
        return res.render('course/students', { students: students, user: req.user });
    }

    static async remove() { }
}

module.exports = CourseController;