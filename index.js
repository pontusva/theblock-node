const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const mongoUri = process.env.ATLAS_URI;
const User = require('./model/User');
const cors = require('cors');
const DateDB = require('./model/date');
const UserDB = require('./model/User');
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  Connection: 'keep-alive',
  methods: ['POST', 'GET'],
};
// console.log(DateDB);
console.log(UserDB);
//express

const blockinkURI = process.env.ATLAS_URI_BLOCKINK;
const userURI = process.env.ATLAS_URI_LOGINTEST;

app.use(cookieParser());
app.use(express.json());
app.use('/api', cors(corsOptions), routes);
// mongo connection
// mongoose.connect(mongoUri);

const connectDB = async () => {
  mongoose.createConnection(blockinkURI); // dates
  mongoose.createConnection(userURI);
};

const db = mongoose.connection;
// console.log(db);
const dateDatabase = mongoose.createConnection(blockinkURI);

const loginDatabase = mongoose.createConnection(userURI);

// const dbModeldate = dateDatabase.model('login', require('./model/modelSchema'));

// const dbModelUser = loginDatabase.model(
//   'login',
//   require('./model/loginSchema')
// );

dateDatabase.on('error', (error) => {
  console.log(error);
});

dateDatabase.once('connected', () => {
  console.log('Database Connected');
});

loginDatabase.on('error', (error) => {
  console.log(error);
});

loginDatabase.once('connected', () => {
  console.log('Database Connected');
});

// funkar
app.post('/test', async (req, res) => {
  console.log(req.body);
  const { username } = req.body;
  res.send('Post User API');
  await User.create({
    username,
  });
});

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);
});

app.use(cors(corsOptions)); // Use this after the variable declaration

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
  });
});
