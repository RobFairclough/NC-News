import express from 'express';

const { authorise } = require('../controllers/secure');

const secureRouter = express.Router();

secureRouter.use('/', authorise);
secureRouter.get('/', (_, res) => {
  res.send({ msg: 'Authorisation successful' });
});

module.exports = secureRouter;
export default secureRouter;
