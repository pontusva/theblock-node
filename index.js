const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes/routes')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const User = require('./model/User')
const cors = require('cors')
// const { Storage } = require('@google-cloud/storage');
// const Multer = require('multer');
const PORT = process.env.PORT || 3000
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  Connection: 'keep-alive',
  methods: ['POST', 'GET'],
}

// Google CLoud Storage
// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
//   },
// });
// let projectId = 'theblock-383510'; // Get this from Google Cloud
// let keyFilename = 'theblock.json'; // Get this from Google Cloud -> Credentials -> Service Accounts
// const storage = new Storage({
//   projectId,
//   keyFilename,
// });
// const bucket = storage.bucket('blockcustomerpicutres'); // Get this from Google Cloud -> Storage

// app.post(
//   '/api/postimage',
//   cors(corsOptions),
//   multer.single('imgfile'),
//   (req, res) => {
//     console.log('Made it /upload');
//     try {
//       if (req.file) {
//         console.log('File found, trying to upload...');
//         const blob = bucket.file(req.file.originalname);
//         const blobStream = blob.createWriteStream();

//         blobStream.on('finish', () => {
//           res.status(200).send('Success');
//           console.log('Success');
//         });
//         blobStream.end(req.file.buffer);
//       } else throw 'error with img';
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   }
// );

// // google cloud storage

const blockinkURI = process.env.ATLAS_URI_BLOCKINK
const userURI = process.env.ATLAS_URI_LOGINTEST

app.use(cookieParser())
app.use(express.json())
app.use('/api', cors(corsOptions), routes)
// mongo connection
// mongoose.connect(mongoUri);

const connectDB = async () => {
  mongoose.createConnection(blockinkURI) // dates
  mongoose.createConnection(userURI)
}

const db = mongoose.connection
// console.log(db);
const dateDatabase = mongoose.createConnection(blockinkURI)

const loginDatabase = mongoose.createConnection(userURI)

dateDatabase.on('error', (error) => {
  console.log(error)
})

dateDatabase.once('connected', () => {
  console.log('Database Connected')
})

loginDatabase.on('error', (error) => {
  console.log(error)
})

loginDatabase.once('connected', () => {
  console.log('Database Connected')
})

// funkar
app.post('/test', async (req, res) => {
  console.log(req.body)
  const { username } = req.body
  res.send('Post User API')
  await User.create({
    username,
  })
})

app.get('/', function (req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})

app.use(cors(corsOptions)) // Use this after the variable declaration

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
  })
})
