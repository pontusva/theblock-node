const jwt = require('jsonwebtoken');
const Date = require('../model/date');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

exports.adminAuth = (req, res, next) => {
  // const token = req.cookies;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(authHeader);
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    // console.log(req.cookies.jwt);
    // console.log(err);
    // res.send(jwtSecret)
    console.log(decodedToken);
    if (token) {
      if (err) {
        return res.status(401).json({ message: 'Not authorized' });
      } else {
        if (decodedToken.role !== 'admin') {
          return res.status(401).json({ message: 'Not1 authorized' });
        } else {
          next();
        }
      }
    } else {
      return res
        .status(401)
        .json({ message: 'Not authorized, token not available' });
    }
  });
};
exports.loginAuth = async (req, res, next) => {
  const data = await Date.find().sort({ date: 1 });
  console.log(data[0]);

  if (data.some((date) => date.firstName === date.firstName)) {
    return res.status(401).json({ message: 'Not authorized' });
  } else {
    next();
  }

  // console.log(req);
};

// how to compare two values that are insde an object thar inside an array of objects
