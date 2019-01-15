const articlesRouter = require('express').Router();
const { sendAllArticles, sendArticleById, sendArticleVotes } = require('../controllers/articles');

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);

articlesRouter.patch('/:article_id', sendArticleVotes);
module.exports = articlesRouter;
