const articlesRouter = require('express').Router();
const {
  sendAllArticles,
  sendArticleById,
  sendArticleVotes,
  deleteArticle,
  sendCommentsByArticleId,
  saveNewComment,
  sendCommentVotes,
} = require('../controllers/articles');

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);
articlesRouter.get('/:article_id/comments', sendCommentsByArticleId);

articlesRouter.patch('/:article_id', sendArticleVotes);
articlesRouter.post('/:article_id/comments', saveNewComment);
articlesRouter.patch('/:article_id/comments/:comment_id', sendCommentVotes);

articlesRouter.delete('/:article_id', deleteArticle);
module.exports = articlesRouter;
