const Mongoose = require('mongoose');

const dataSchema = new Mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  role: {
    // required: true,
    type: String,
  },
});

module.exports = dataSchema;
