const express = require('express');
const Auth = require('../middlewares/auth');
const UserController = require('../controllers/userController');
const Handler = require('../utils/handler');

const router = express.Router();

router.get('/register', (req, res) => res.render('user/register'));
router.post('/register', (req, res, next) => UserController.register(req, res).catch(next));

router.get('/login', (req, res) => res.render('user/login', { url: req.originalUrl }));
router.post('/login', Handler(UserController.login));

router.get('/logout', UserController.logout);

router.get('/profile', Auth.user(), Handler(UserController.view));
router.get('/profile/edit', Auth.user(), Handler(UserController.updateForm));
router.post('/profile/edit', Auth.user(), Handler(UserController.update));

module.exports = router;