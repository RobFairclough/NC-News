const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../passconfig');

const authorise = (req, res, next) => {
  // return next();
  const { authorization } = req.headers;
  if (!authorization) next({ status: 401, msg: 'Unauthorised' });
  else {
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, response) => {
      if (err) {
        next({ status: 401, msg: 'Unauthorised' });
      } else {
        next();
      }
    });
  }
};
module.exports = { authorise };
