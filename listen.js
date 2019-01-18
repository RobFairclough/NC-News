const app = require('./app');

console.log(process.env.NODE_ENV);
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
