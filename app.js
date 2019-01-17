const app = require('express')();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser').json();
const apiRouter = require('./routes/api');
const secureRouter = require('./routes/secure');
const {
  handle404, handle400, handle422, handle401, handle500,
} = require('./errors');
const connection = require('./db/connection');
const { JWT_SECRET } = require('./passconfig');
const { authorise } = require('./controllers/secure');

app.use(bodyParser);
app.use('/api', apiRouter);

// auth bonus
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  connection('users')
    .where('username', username)
    .then(([user]) => {
      if (user) return Promise.all([bcrypt.compare(password, user.password), user]);
      return next({ status: 401, msg: 'invalid login' });
    })
    .then(([passwordOk, user]) => {
      if (user && passwordOk) {
        const token = jwt.sign({ user: user.username, iat: Date.now() }, JWT_SECRET);
        res.status(200).send({ token });
      } else {
        next({ status: 401, msg: 'invalid login' });
      }
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
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
});
module.exports = app;
