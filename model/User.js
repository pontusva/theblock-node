const Mongoose = require('mongoose');
require('dotenv').config();
const userURI = process.env.ATLAS_URI_LOGINTEST;

const loginDatabase = Mongoose.createConnection(userURI);
const dbModelUser = loginDatabase.model(
  'register',
  require('../schemas/RegisterSchema') // loginSchema
);
// console.log(dbModelUser);

module.exports = dbModelUser;
