/* MODULE IMPORTS */
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const socketHandler = require('./socket');

/* ROUTE IMPORTS */
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/usersRoutes');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const settingRoutes = require('./routes/settingsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const chatRoutes = require('./routes/chatRoutes');
const commentRoutes = require('./routes/commentRoutes');

/* CONFIGS */
dotenv.config();
const mongoUrl = process.env.DB_URL;
const portNum = process.env.PORT;
const expressSessionSecKey = process.env.EXPRESS_SESSION_SEC_KEY
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'https://omigram.onrender.com',
    methods: ['GET', 'POST', 'DELETE', 'PATCH']
  }
});

/* MIDDLEWARES */
app.use(session({ secret: expressSessionSecKey }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
}));


/* ROUTES */
app.use('*', cors())
app.use('/home', homeRoutes);
app.use('/user/auth/google', googleAuthRoutes);
app.use('/user/auth', authRoutes);
app.use('/friends', friendsRoutes);
app.use('/setting', settingRoutes);
app.use('/chats', chatRoutes)
app.use('/msgs', messageRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

socketHandler(io);

/* DB CONNECTION AND SERVER LISTNING */
mongoose.connect(mongoUrl)
  .then(() => {
    server.listen(portNum, () => {
      console.log(`server running on port: ${portNum}`);
      console.log('DB connection success!');
    });
  })
  .catch((error) => {
    console.log(error);
  });
