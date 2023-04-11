const Mongoose = require('mongoose');
require('dotenv').config();
const blockinkURI = process.env.ATLAS_URI_BLOCKINK;
const dateDatabase = Mongoose.createConnection(blockinkURI);

const dbModeldate = dateDatabase.model(
  'dates',
  require('../schemas/DateSchema')
);

module.exports = dbModeldate;
