const usersRouter = require('express').Router();
const { sendAllUsers, sendUserByUsername } = require('../controllers/users');

usersRouter.get('/', sendAllUsers);
usersRouter.get('/:username', sendUserByUsername);

module.exports = usersRouter;
