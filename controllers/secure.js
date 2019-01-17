const jwt = require('jsonwebtoken');
const connection = require('../db/connection');
const { JWT_SECRET } = require('../passconfig');

const authorise = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) next({ status: 401, msg: 'Unauthorised' });
  else {
    console.log(authorization);
    const token = authorization.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, response) => {
      if (err) {
        console.log(err);
        next({ status: 401, msg: 'Unauthorised' });
      } else {
        console.log(response);
        next();
      }
    });
  }
};

module.exports = { authorise };
