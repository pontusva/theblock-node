const express = require('express');
const Date = require('../model/date');
const User = require('../model/User');
var cors = require('cors');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { adminAuth } = require('../middleware/auth');

const { postUser, getUser } = require('./Auth');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

var corsOptions = {
  origin: true,
  methods: ['POST', 'GET'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//Post Method
router.post('/post', cors(), async (req, res) => {
  const { date } = req.body;
  await Date.create({
    date,
  }).then((user) => {
    const token = jwt.sign({ date }, jwtSecret, {});
    res.cookie('jwt', token, {
      httpOnly: true,
    });
    res.json({
      token,
      user,
    });
  });
});

// const adminAuth = (req, res, next) => {
// // const token = req.cookies;
// const authHeader = req.headers['authorization'];
// const token = authHeader && authHeader.split(' ')[1];
// console.log(authHeader);
// jwt.verify(token, jwtSecret, (err, decodedToken) => {
//   // console.log(req.cookies.jwt);
//   // console.log(err);
//   // res.send(jwtSecret)
//   console.log(decodedToken);
//   if (token) {
//     if (err) {
//       return res.status(401).json({ message: 'Not authorized' });
//     } else {
//       if (decodedToken.role !== 'admin') {
//         return res.status(401).json({ message: 'Not1 authorized' });
//       } else {
//         next();
//       }
//     }
//   }
// });
// };

//Get all Method
router.get('/getAll', cors(corsOptions), adminAuth, async (req, res) => {
  try {
    const data = await User.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', cors(corsOptions), async (req, res) => {
  // console.log(req.body);
  // res.send(req.body);
  try {
    const { username, role } = req.body;
    console.log(username, role);
    await User.create({
      username,
    }).then((user) => {
      const token = jwt.sign({ role }, jwtSecret, {});
      res.send(token);
      console.log(token);
      console.log(user);
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      res.json({
        token,
        user,
      });
    });
  } catch {
    (error) => {
      res.status(400).json({
        message: 'An error occurred',
        error: error.message,
      });
    };
  }
});
// router.route('/getAll').get(adminAuth(), cors(corsOptions), getUser);

// router.route('/getUser').get(cors(corsOptions), getUser);

router.get('/admin', adminAuth, cors(corsOptions), async (req, res) => {
  try {
    const data = await Model.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
  res.send(req.params.id);
});

//Update by ID Method
router.patch('/update/:id', (req, res) => {
  res.send('Update by ID API');
});

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API');
});

module.exports = router;
