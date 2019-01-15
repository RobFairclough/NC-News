const articlesRouter = require('express').Router();
const { sendAllArticles, sendArticleById } = require('../controllers/articles');

articlesRouter.get('/', sendAllArticles);
articlesRouter.get('/:article_id', sendArticleById);
module.exports = articlesRouter;
