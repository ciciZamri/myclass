const express = require('express');
const Auth = require('../middlewares/auth');
const Handler = require('../utils/handler');
const CourseController = require('../controllers/courseController');
const PostController = require('../controllers/postController');

const router = express.Router();
router.use(Auth.user());

router.get('/home', Handler(CourseController.get));

router.get('/create', (req, res) => res.render('course/form', { user: req.user }));
router.post('/create', (req, res, next) => CourseController.create(req, res).catch(next));

router.get('/update', Handler(CourseController.updateForm));
router.post('/update', Handler(CourseController.update));

router.get('/view/:courseId', Handler(CourseController.view));

router.get('/join', (req, res) => res.render('course/join', { user: req.user }));
router.post('/join', Handler(CourseController.join));

router.get('/students/:courseId', Handler(CourseController.showStudents));

router.get('/post/create', (req, res) => res.render('course/postForm'));
router.post('/post/create', Handler(PostController.create));

router.get('/post/update', Handler(PostController.updateForm));
router.post('/post/update', Handler(PostController.update));

router.delete('/post/remove', Handler(PostController.remove));

module.exports = router;