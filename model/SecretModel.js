const Mongoose = require('mongoose')
require('dotenv').config()
const userURI = process.env.ATLAS_URI_LOGINTEST

const loginDatabase = Mongoose.createConnection(userURI)
const dbModelUser = loginDatabase.model(
  'secrets',
  require('../schemas/SecretSchema') // loginSchema
)

module.exports = dbModelUser
