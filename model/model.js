const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  date: {
    // required: true,
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: 'Admin',
    required: true,
  },
});

const Dates = mongoose.model('Data', dataSchema);

module.exports = Dates;
