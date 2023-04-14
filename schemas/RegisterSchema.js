const Mongoose = require('mongoose');

const LoginSchema = new Mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    minlength: 6,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  secret: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    default: 'basic',
    type: String,
  },
});

module.exports = LoginSchema;
