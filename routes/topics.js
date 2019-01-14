const topicsRouter = require('express').Router();
const { sendAllTopics } = require('../controllers/topics');

topicsRouter.get('/', sendAllTopics);

module.exports = topicsRouter;
