const express = require('express');
const Auth = require('../middlewares/auth');
const ChatController = require('../controllers/chatController');
const Handler = require('../utils/handler');

const router = express.Router();

router.get('/index/:courseId', Auth.user(), Handler(ChatController.index));
router.get('/read/:courseId', Auth.user(), Handler(ChatController.read));
router.post('/create/:courseId', Auth.user(), Handler(ChatController.create));

module.exports = router;