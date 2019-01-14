const topicsRouter = require('express').Router();
const { sendAllTopics, saveNewTopic } = require('../controllers/topics');

topicsRouter.get('/', sendAllTopics);

topicsRouter.post('/', saveNewTopic);

module.exports = topicsRouter;
