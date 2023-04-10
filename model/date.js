const Mongoose = require('mongoose');

const dateDatabase = Mongoose.createConnection(
  'mongodb+srv://pontus:pg66ZAc9jvnYqdzP@plants.vohijne.mongodb.net/blockink'
);

const dbModeldate = dateDatabase.model(
  'dates',
  require('../schemas/UserSchema')
);

module.exports = dbModeldate;
