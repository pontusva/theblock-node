const mongoose = require('mongoose')

const firstContactSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
    unique: true,
  },
  lastName: {
    required: true,
    type: String,
  },
  phoneNumber: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
})

module.exports = firstContactSchema
