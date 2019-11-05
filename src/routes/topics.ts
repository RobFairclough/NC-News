import express from 'express';
import { handle405 } from '../errors';
import { authorise } from '../controllers/secure';

const {
  sendAllTopics,
  saveNewTopic,
  sendArticlesByTopic,
  saveNewArticleInTopic,
} = require('../controllers/topics');

const topicsRouter = express.Router();

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
export default topicsRouter;
