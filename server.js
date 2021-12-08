const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const handleError = require('./middlewares/handleError');
const Auth = require('./middlewares/auth');
const MongoDB = require('./database/mongodb');
const firebase = require('firebase-admin');
const serviceAccount = require('./sandbox-99-firebase-adminsdk-iv38b-9df41acd9f.json');

const userRouter = require('./routes/userRoute');
const courseRouter = require('./routes/courseRoute');
const announcementRouter = require('./routes/announcementRoute');
const chatRouter = require('./routes/chatRoute');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const app = express();
dotenv.config();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(Auth.auth());

app.use('/user', userRouter);
app.use('/announcement', announcementRouter);
app.use('/course', courseRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  return res.render('index', { user: req.user });
});

app.use((req, res) => res.render('404'));
app.use(handleError);

MongoDB.connect();
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT || 8080 : 4000;
app.listen(PORT, () => console.log(`Server is listeneing on port: ${PORT}`));