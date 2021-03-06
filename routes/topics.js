const topicsRouter = require('express').Router();
const {
  sendAllTopics,
  saveNewTopic,
  sendArticlesByTopic,
  saveNewArticleInTopic,
} = require('../controllers/topics');
const { authorise } = require('../controllers/secure');
const { handle405 } = require('../errors');

topicsRouter
  .route('/')
  .get(sendAllTopics)
  .post(authorise)
  .post(saveNewTopic)
  .all(handle405);

topicsRouter
  .route('/:topic/articles')
  .get(sendArticlesByTopic)
  .post(authorise)
  .post(saveNewArticleInTopic)
  .all(handle405);

module.exports = topicsRouter;
