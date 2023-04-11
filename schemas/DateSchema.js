const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  date: {
    required: true,
    type: String,
    unique: true,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
});

module.exports = dataSchema;
