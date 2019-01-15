const app = require('express')();
const bodyParser = require('body-parser').json();
const apiRouter = require('./routes/api');
const { handle404, handle400, handle422 } = require('./errors');

app.use(bodyParser);
app.use('/api', apiRouter);

// error handling

app.use(handle400);
app.use(handle422);
app.use(handle404);
app.use('/*', handle404);
app.use((err, req, res, next) => {
  res.status(500).send({ msg: 'internal server error' });
});
module.exports = app;
