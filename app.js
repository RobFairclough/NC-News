const app = require('express')();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser').json();
const apiRouter = require('./routes/api');
const secureRouter = require('./routes/secure');
const {
  handle404, handle400, handle422, handle401, handle500,
} = require('./errors');
const connection = require('./db/connection');
const { JWT_SECRET } = require('./passconfig');

app.use(bodyParser);
app.use('/api', apiRouter);

// auth bonus
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  connection('authorisations')
    .where('username', username)
    .then(([user]) => {
      if (!user || user.password !== password) handle401({ status: 401, msg: 'invalid login' }, req, res, next);
      else {
        // correct details
        const token = jwt.sign({ user: user.username, iat: Date.now() }, JWT_SECRET);
        res.status(200).send({ token });
        console.log({ token });
      }
    });
});
app.use('/secure', (req, res, next) => {
  const { authorization } = req.headers;
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
});
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
