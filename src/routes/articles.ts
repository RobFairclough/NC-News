import express from 'express';
import { handle405 } from '../errors';

const {
  sendAllArticles,
  sendArticleById,
  sendArticleVotes,
  deleteArticle,
} = require('../controllers/articles');
const {
  sendCommentsByArticleId,
  saveNewComment,
  sendCommentVotes,
  deleteComment,
} = require('../controllers/comments');

const { authorise } = require('../controllers/secure');


const articlesRouter = express.Router();

articlesRouter
  .route('/')
  .get(sendAllArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(sendArticleVotes)
  .delete(authorise)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(saveNewComment)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(sendCommentVotes)
  .delete(authorise)
  .delete(deleteComment)
  .all(handle405);

module.exports = articlesRouter;
export default articlesRouter;