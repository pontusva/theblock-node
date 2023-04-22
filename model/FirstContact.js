const Mongoose = require('mongoose')
require('dotenv').config()
const blockinkURI = process.env.ATLAS_URI_BLOCKINK
const dateDatabase = Mongoose.createConnection(blockinkURI)

const firstContact = dateDatabase.model(
  'FirstContact',
  require('../schemas/FirstContactSchema')
)

module.exports = firstContact
