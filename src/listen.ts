import app from './app';

const port: string = process.env.PORT || '9000';
app.listen(port, () => {
  // console.log(`listening on ${port}`);
});