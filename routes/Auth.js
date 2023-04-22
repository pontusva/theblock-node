// const Login = require('../model/loginModel');
// const { dbModelUser } = require('../index/dbModelUser');
const { adminAuth } = require('../middleware/auth')
const Login = require('../model/User')

exports.postUser = async (req, res) => {
  res.send('Post User API')
  // const { username } = req.body;
  // try {
  //   console.log(username);
  //   await Login.create({
  //     username,
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     message: 'An error occurred',
  //     error: error.message,
  //   });

  // .then((loger) => {
  //   const maxAge = 3 * 60 * 60;
  //   const token = jwt.sign({ username }, jwtSecret, {
  //     expiresIn: maxAge, // 3hrs in sec
  //   });
  //   res.cookie('jwt', token, {
  //     httpOnly: true,
  //     maxAge: maxAge * 1000, // 3hrs in ms
  //   });
  res.json({ loger })
  // });
}

exports.getsUser = (req, res) => {
  try {
    res.send('Get User API')
  } catch {
    ;(error) => {
      res
        .status(400)
        .json({ message: 'An error occurred', error: error.message })
    }
  }
}
