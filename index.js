const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
require('dotenv').config();
const mongoUri = process.env.ATLAS_URI;

const cors = require('cors');
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

//express

// mongo connection
// mongoose.connect(mongoUri);

const connectDB = async () => {
  mongoose.connect(mongoUri);
};
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();

app.use(express.json());
app.use('/api', cors(), routes);

app.use(cors(corsOptions)); // Use this after the variable declaration

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Started at ${3000}`);
  });
});
