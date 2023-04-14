const Mongoose = require('mongoose');

const LoginSchema = new Mongoose.Schema({
  secret: {
    required: true,
    type: String,
    unique: true,
  },
});

module.exports = LoginSchema;
