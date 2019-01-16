const articlesRouter = require('express').Router();
const commentsRouter = require('./comments');
const {
  sendAllArticles,
  sendArticleById,
  sendArticleVotes,
  deleteArticle,
} = require('../controllers/articles');

articlesRouter.use('/:article_id/comments', commentsRouter);

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);
articlesRouter.patch('/:article_id', sendArticleVotes);
articlesRouter.delete('/:article_id', deleteArticle);

module.exports = articlesRouter;
