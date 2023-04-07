const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  date: {
    required: true,
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Data', dataSchema);
