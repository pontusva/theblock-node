const express = require('express');
const Date = require('../model/date');
const User = require('../model/User');
var cors = require('cors');
const bcrypt = require('bcryptjs');
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
  const { date, firstName, lastName } = req.body;
  await Date.create({
    date,
    firstName,
    lastName,
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

//Get all Method
router.get('/getAll', cors(corsOptions), adminAuth, async (req, res) => {
  try {
    const data = await User.find().sort({ username: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/dates', cors(corsOptions), async (req, res) => {
  try {
    const data = await Date.find().sort({ date: 1 });
    res.json(data.map((date) => date.date));
    // console.log(data.map((date) => date.date));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/adminDates', cors(corsOptions), adminAuth, async (req, res) => {
  try {
    const data = await Date.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', cors(corsOptions), async (req, res) => {
  const { username, password, role, firstName, lastName } = req.body;
  console.log(req.body);
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password less than 6 characters' });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
      role,
      firstName,
      lastName,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.json({
          token,
          user,
        });
        // res.status(201).json({
        //   message: 'User successfully created',
        //   user: user._id,
        // });
      })
      .catch((error) =>
        res.status(400).json({
          message: 'User not successful created',
          error: error.message,
        })
      );
  });
});

router.post('/login', cors(corsOptions), async (req, res) => {
  const { username, password } = req.body;
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username or Password not present',
    });
  }
  try {
    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      res.status(400).json({
        message: 'Login not successful',
        error: 'User not found',
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
            expiresIn: maxAge, // 3hrs in sec
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.json({
            token,
            user,
          });
          // res.status(201).json({
          //   message: 'User successfully Logged in',
          //   user: user._id,
          // });
        } else {
          res.status(400).json({ message: 'Login not succesful' });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'An error occurred',
      error: error.message,
    });
  }
});

router.post('/users', cors(corsOptions), async (req, res) => {
  // console.log(req.body);
  // res.send(req.body);
  try {
    const { username, role, age } = req.body;
    // console.log(username, role, age);
    await User.create({
      username,
      role,
      age,
    }).then((user) => {
      const token = jwt.sign({ role }, jwtSecret, {});
      res.cookie('jwt', token, {
        httpOnly: true,
      });
      res.status(200).json({ token, role });
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
