const topicsRouter = require('express').Router();
const { sendAllTopics, saveNewTopic, sendArticlesByTopic } = require('../controllers/topics');

topicsRouter.get('/', sendAllTopics);
topicsRouter.get('/:topic/articles', sendArticlesByTopic);

topicsRouter.post('/', saveNewTopic);

module.exports = topicsRouter;
