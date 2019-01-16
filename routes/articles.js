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

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);
articlesRouter.patch('/:article_id', sendArticleVotes);
articlesRouter.delete('/:article_id', deleteArticle);

// route these into a comments router?
articlesRouter.get('/:article_id/comments', sendCommentsByArticleId);
articlesRouter.post('/:article_id/comments', saveNewComment);
articlesRouter.patch('/:article_id/comments/:comment_id', sendCommentVotes);
articlesRouter.delete('/:article_id/comments/:comment_id', deleteComment);

module.exports = articlesRouter;
