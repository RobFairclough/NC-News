const usersRouter = require('express').Router();
const { sendAllUsers, sendUserByUsername, saveNewUser } = require('../controllers/users');
const { handle405 } = require('../errors');

usersRouter.get('/', sendAllUsers);
usersRouter.get('/:username', sendUserByUsername);
usersRouter
  .route('/')
  .get(sendAllUsers)
  .all(handle405);
usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .post(saveNewUser)
  .all(handle405);

module.exports = usersRouter;
