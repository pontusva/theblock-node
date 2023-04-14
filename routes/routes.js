const express = require('express');
const Date = require('../model/date');
const User = require('../model/User');
const Secret = require('../model/SecretModel');
const FirstContact = require('../model/FirstContact');
var cors = require('cors');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const { adminAuth, loginAuth } = require('../middleware/auth');

const { postUser, getUser } = require('./Auth');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

var corsOptions = {
  origin: true,
  methods: ['POST', 'GET'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Google CLoud Storage
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});
let projectId = 'theblock-383510'; // Get this from Google Cloud
let keyFilename = 'theblock.json'; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket('blockcustomerpicutres'); // Get this from Google Cloud -> Storage

router.post('/firstcontact', async (req, res) => {
  const { firstName, lastName, phoneNumber, email } = req.body;
  await FirstContact.create({
    firstName,
    lastName,
    phoneNumber,
    email,
  });
  res.json({
    message: 'Success',
  });
});

router.post('/secret', async (req, res) => {
  const { secret } = req.body;
  await Secret.create({
    secret,
  }).then((user) => {
    // const token = jwt.sign({ date }, jwtSecret, {});
    // res.cookie('jwt', token, {
    //   httpOnly: true,
    // });
    res.json({
      secret,
      user,
    });
  });
});

router.get('/secret', async (req, res) => {
  const data = await Secret.find();
  console.log(data);
  res.json(data);
});

router.get('/postimage', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const objectNames = files.map((file) => file.id);
    res.send(objectNames);
    console.log('Success');
  } catch (error) {
    res.send('Error:' + error);
  }
});

router.post(
  '/postimage',
  cors(corsOptions),
  multer.single('imgfile'),
  (req, res) => {
    try {
      if (req.file) {
        console.log('File found, trying to upload...');
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();

        blobStream.on('finish', () => {
          res.status(200).send(req.file.originalname);
          console.log('Success');
        });
        blobStream.end(req.file.buffer);
      } else throw 'error with img';
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

// google cloud storage

//Post Method
router.post('/post', cors(), async (req, res) => {
  const { date, firstName, lastName, token } = req.body;
  console.log(req.body);
  await Date.create({
    date,
    firstName,
    lastName,
    token,
  }).then(async (user) => {
    // delete the user & secret id so there can only be one reservation per account.
    const data = await User.find({});
    const secret = data.map((date) => date.firstName);
    const deleteAccount = await User.deleteOne({ firstName: secret[0] });
    const deleteSecret = await Secret.deleteOne({
      secret: data.map((secret) => secret.secret),
    });

    res.json({
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

    res.json(
      data.map(async (date) => {
        const d = {
          date: date.date,
          id: date._id,
        };
        return d;
      })
    );
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
  const { username, password, role, firstName, lastName, secret } = req.body;

  // match secret with secret in database
  const data = await Secret.find();
  const dataArray = data.map((secret) => secret.secret);

  if (!dataArray.includes(secret)) {
    return res.status(400).json({ message: 'bleat' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password less than 6 characters' });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
      role,
      firstName,
      secret,
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
    // res.status(400).json({
    //   message: 'An error occurred',
    //   error: error.message,
    // });
  }
});

// router.post('/users', cors(corsOptions), async (req, res) => {
//   // console.log(req.body);
//   // res.send(req.body);
//   try {
//     const { username, role, age } = req.body;
//     // console.log(username, role, age);
//     await User.create({
//       username,
//       role,
//       age,
//     }).then((user) => {
//       const token = jwt.sign({ role }, jwtSecret, {});
//       res.cookie('jwt', token, {
//         httpOnly: true,
//       });
//       res.status(200).json({ token, role });
//     });
//   } catch {
//     (error) => {
//       res.status(400).json({
//         message: 'An error occurred',
//         error: error.message,
//       });
//     };
//   }
// });
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
