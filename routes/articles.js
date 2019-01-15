const articlesRouter = require('express').Router();
const {
  sendAllArticles,
  sendArticleById,
  sendArticleVotes,
  deleteArticle,
} = require('../controllers/articles');

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);

articlesRouter.patch('/:article_id', sendArticleVotes);

articlesRouter.delete('/:article_id', deleteArticle);
module.exports = articlesRouter;
