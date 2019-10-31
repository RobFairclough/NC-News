const app = require('./app');

const port = process.env.PORT || 9000;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`listening on ${port}`);
});
