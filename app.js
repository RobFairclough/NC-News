const app = require('express')();
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

// error handling for 404s and 500
app.use('/*', (req, res, next) => {
  res.status(404).send({ msg: '404 not found' });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'internal server error' });
});
module.exports = app;
