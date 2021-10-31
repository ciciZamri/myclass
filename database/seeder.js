const mongoose = require('mongoose');
const MongoDB = require('./mongodb');
const dotenv = require('dotenv');
const User = require('../models/user');
const Course = require('../models/course');
const Post = require('../models/post');
const Random = require('../utils/random');

dotenv.config();

MongoDB.connect();

async function run() {
    const names = ['ali', 'ahmad', 'abu'];
    const courses = ['Biology', 'Physics', 'Data Structures and Algorithms', 'Multivariable Calculus', 'Thermodynamics', 'Web Development', 'Mathematics'];
    let testUsers = [];
    for (let i = 0; i < names.length; i++) {
        testUsers.push({
            _id: Random.randomStr(12),
            name: names[i],
            age: 24,
            gender: Random.selectRandom(['male', 'female']),
            email: `${names[i]}@gmail.com`,
            password: '$2b$10$IRYsH6rk72CkHTb99DIsa.KNmo./8baVS27f6jRis1X2QMGiXZbWi'
        });
    }
    await User.insertMany(testUsers);
    const userIds = testUsers.map((e) => e._id);

    let testCourses = [];
    let start = Random.number(0, 2);
    for (let i = start; i < start + Random.number(2, 4); i++) {
        testCourses.push({
            _id: Random.randomStr(7),
            name: courses[i],
            description: Random.lorem(200),
            userId: userIds[1], // teacher id
        });
    }
    await Course.insertMany(testCourses);

    const userId = testCourses[0].userId;
    const courseId = testCourses[0]._id;
    await Post.insertMany([
        {
            _id: Random.randomStr(12),
            title: 'Week 1',
            body: Random.lorem(230),
            attachment: {
                category: 'none'
            },
            userId: userId,
            courseId: courseId,
        },
        {
            _id: Random.randomStr(12),
            title: 'Week 2',
            body: Random.lorem(100),
            attachment: {
                content: 'https://www.google.com',
                category: 'url'
            },
            userId: userId,
            courseId: courseId,
        },
        {
            _id: Random.randomStr(12),
            title: 'Week 3',
            body: Random.lorem(80),
            attachment: {
                content: `posts/test/test_pdf.pdf`,
                category: 'pdf'
            },
            userId: userId,
            courseId: courseId,
        },
        {
            _id: Random.randomStr(12),
            title: 'Week 4',
            body: Random.lorem(60),
            attachment: {
                content: 'posts/test/order_created_backend_flow.png',
                category: 'image'
            },
            userId: userId,
            courseId: courseId,
        }
    ]);

    await mongoose.disconnect();
    console.log("Database seeding success");
}

mongoose.connection.once('open', run);