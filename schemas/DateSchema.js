const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  date: {
    required: true,
    type: String,
    // unique: true,
  },
  firstName: [
    {
      required: true,
      type: String,
    },
  ],
  lastName: {
    required: true,
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
  bookedTime: [String],

  fullBooked: {
    type: Boolean,
    default: false,
    required: true,
  },
  halfBooked: {
    type: Boolean,
    default: false,
    required: true,
  },
  halfBookedTime: {
    type: String,
    // required: true,
  },
});

module.exports = dataSchema;
