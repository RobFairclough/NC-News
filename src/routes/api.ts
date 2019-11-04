import express from 'express';
import usersRouter from './users';
import topicsRouter from './topics';
import articlesRouter from './articles';

// const articlesRouter = require('./articles');
// const topicsRouter = require('./topics');
// const usersRouter = require('./users');

const { serveJSON } = require('../controllers/api');
const { handle405 } = require('../errors');

const apiRouter = express.Router();

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.get('/', serveJSON);
apiRouter.all('/', handle405);

module.exports = apiRouter;
export default apiRouter;