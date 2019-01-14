const app = require('express')();
const apiRouter = require('./routes/api');

app.use('/api', apiRouter);

module.exports = app;
