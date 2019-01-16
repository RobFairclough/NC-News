const commentsRouter = require('express').Router();
const {
  sendCommentsByArticleId,
  saveNewComment,
  sendCommentVotes,
  deleteComment,
} = require('../controllers/articles');

// route these into a comments router?
commentsRouter.get('/comments', sendCommentsByArticleId);
commentsRouter.post('/comments', saveNewComment);
commentsRouter.patch('/comments/:comment_id', sendCommentVotes);
commentsRouter.delete('/comments/:comment_id', deleteComment);

module.exports = commentsRouter;
