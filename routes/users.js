const usersRouter = require('express').Router();
const {
  sendAllUsers,
  sendUserByUsername,
  saveNewUser,
  updateUserDetails,
  sendArticlesByUser
} = require('../controllers/users');
const { handle405 } = require('../errors');

usersRouter.get('/', sendAllUsers);
usersRouter.get('/:username', sendUserByUsername);
usersRouter
  .route('/')
  .get(sendAllUsers)
  .post(saveNewUser)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .patch(updateUserDetails)
  .all(handle405);
usersRouter
  .route('/:username/articles')
  .get(sendArticlesByUser)
  .all(handle405);

module.exports = usersRouter;
