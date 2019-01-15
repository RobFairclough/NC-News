const usersRouter = require('express').Router();
const { sendAllUsers } = require('../controllers/users');

usersRouter.get('/', sendAllUsers);

module.exports = usersRouter;
