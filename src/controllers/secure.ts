import * as jwt from 'jsonwebtoken';
import { Handler } from 'express';


import { JWT_SECRET } from '../passconfig';

export const authorise: Handler = (req, res, next) => {
  // uncomment to disable authorisation requirements
  // return next();
  const { authorization } = req.headers;
  if (!authorization) next({ status: 401, msg: 'Unauthorised' });
  else {
    const token = authorization.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors): void => {
      if (err) {
        next({ status: 401, msg: 'Unauthorised' });
      } else {
        next();
      }
    });
  }
};

module.exports = { authorise };
