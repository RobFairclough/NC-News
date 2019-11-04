import express from 'express';

const {
  sendAllUsers,
  sendUserByUsername,
  saveNewUser,
  updateUserDetails,
  sendArticlesByUser,
  deleteUser,
} = require('../controllers/users');
const { handle405 } = require('../errors');

const usersRouter = express.Router();

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
export default usersRouter;
