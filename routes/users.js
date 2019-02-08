const usersRouter = require('express').Router();
const {
  sendAllUsers,
  sendUserByUsername,
  saveNewUser,
  updateUserDetails,
  sendArticlesByUser,
  deleteUser,
} = require('../controllers/users');
const { handle405 } = require('../errors');

usersRouter
  .route('/')
  .get(sendAllUsers)
  .post(saveNewUser)
  .all(handle405);

usersRouter
  .route('/:username')
  .get(sendUserByUsername)
  .delete(deleteUser)
  .patch(updateUserDetails)
  .all(handle405);
usersRouter
  .route('/:username/articles')
  .get(sendArticlesByUser)
  .all(handle405);

module.exports = usersRouter;
