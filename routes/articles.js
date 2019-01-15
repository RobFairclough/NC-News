const articlesRouter = require('express').Router();
const { sendAllArticles } = require('../controllers/articles');

articlesRouter.get('/', sendAllArticles);

module.exports = articlesRouter;
