const articlesRouter = require('express').Router();
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
const { handle405 } = require('../errors');

articlesRouter
  .route('/')
  .get(sendAllArticles)
  .all(handle405);

articlesRouter
  .route('/:article_id')
  .get(sendArticleById)
  .patch(sendArticleVotes)
  .delete(deleteArticle)
  .all(handle405);

articlesRouter
  .route('/:article_id/comments')
  .get(sendCommentsByArticleId)
  .post(saveNewComment);

articlesRouter
  .route('/:article_id/comments/:comment_id')
  .patch(sendCommentVotes)
  .delete(deleteComment);

module.exports = articlesRouter;
