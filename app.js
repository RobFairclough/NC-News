const app = require('express')();
const bodyParser = require('body-parser').json();
const apiRouter = require('./routes/api');
const { handle404, handle400, handle422 } = require('./errors');
const connection = require('./db/connection');

app.use(bodyParser);
app.use('/api', apiRouter);

app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  connection('authorisations')
    .where('username', username)
    .then(([user]) => {
      if (!user || user.password !== password) next({ status: 401, msg: 'invalid login' });
      else {
        // correct details
      }
    });
});

// error handling

app.use(handle400);
app.use(handle422);
app.use(handle404);
app.use('/*', handle404);
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
});
module.exports = app;
