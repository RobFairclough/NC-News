import bcrypt from 'bcrypt';
import bodyParser from'body-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  handle404, handle400, handle422, handle401, handle500,
} from './errors';

import connection from './db/connection';
import apiRouter from './routes/api';
import secureRouter from './routes/secure';
import { JWT_SECRET} from './passconfig';
import { authorise } from './controllers/secure';

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.get('/', (req: Request, res: Response) => res.send('homepage'));
// auth bonus - should this move to the secure controller really?
app.post('/login', (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password) return next({ status: 401, msg: 'invalid login' });
  return connection('users')
    .where<User[]>('username', username)
    .then(([user]) => {
      if (user) {
        return Promise.all([bcrypt.compare(password, user.password), user]).then(
          ([passwordOk, authorisedUser]) => {
            if (authorisedUser && passwordOk) {
              const token = jwt.sign(
                { user: authorisedUser.username, iat: Date.now() },
                JWT_SECRET,
              );
              return res.status(200).send({ token });
            }
            return next({ status: 401, msg: 'invalid login' });
          },
        );
      }
      return next({ status: 401, msg: 'invalid login' });
    })
    .catch(next);
});
app.use('/secure', authorise);
app.use('/secure', secureRouter);
// error handling

app.use(handle400);
app.use(handle401);
app.use(handle422);
app.use(handle404);
app.use(handle500);
module.exports = app;
