const jwt = require('jsonwebtoken');
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
