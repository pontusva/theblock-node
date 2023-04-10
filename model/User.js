const Mongoose = require('mongoose');

const loginDatabase = Mongoose.createConnection(
  'mongodb+srv://pontus:pg66ZAc9jvnYqdzP@plants.vohijne.mongodb.net/logintest'
);

const dbModelUser = loginDatabase.model(
  'login',
  require('../schemas/loginSchema')
);

module.exports = dbModelUser;
