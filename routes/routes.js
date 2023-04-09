const express = require('express');
const Model = require('../model/Model');
var cors = require('cors');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

var corsOptions = {
  origin: true,
  methods: ['POST', 'GET'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//Post Method
router.post('/post', cors(corsOptions), async (req, res) => {
  const data = new Model({
    date: req.body.date,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

//Get all Method
router.get('/getAll', cors(corsOptions), async (req, res) => {
  try {
    const data = await Model.find().sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
  res.send(req.params.id);
});

//Update by ID Method
router.patch('/update/:id', (req, res) => {
  res.send('Update by ID API');
});

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API');
});

module.exports = router;
