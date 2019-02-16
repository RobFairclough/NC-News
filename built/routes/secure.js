const secureRouter = require('express').Router();
const { authorise } = require('../controllers/secure');
secureRouter.use('/', authorise);
secureRouter.get('/', (req, res, next) => {
    res.send({ msg: 'Authorisation successful' });
});
module.exports = secureRouter;
