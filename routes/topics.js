const topicsRouter = require('express').Router();
const {
  sendAllTopics,
  saveNewTopic,
  sendArticlesByTopic,
  saveNewArticleInTopic,
} = require('../controllers/topics');

topicsRouter.get('/', sendAllTopics);
topicsRouter.get('/:topic/articles', sendArticlesByTopic);

topicsRouter.post('/', saveNewTopic);
topicsRouter.post('/:topic/articles', saveNewArticleInTopic);
module.exports = topicsRouter;
