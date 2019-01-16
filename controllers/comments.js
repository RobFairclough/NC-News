const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

const sendCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  // sort_ascending asked for in spec but inconsistent with other GET queries
  const {
    limit = 10, sort_by = 'created_at', p = 1, sort_ascending = false,
  } = req.query;
  const offset = limit * (p - 1);
  connection('comments')
    .select('comment_id', 'votes', 'created_at', 'username AS author', 'body')
    .where('article_id', article_id)
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, sort_ascending === 'true' ? 'asc' : 'desc')
    .then((comments) => {
      if (!comments.length) return Promise.reject({ status: 404, msg: '404 not found' });
      reformatDate(comments);
      return res.send({ article_id, comments });
    })
    .catch(next);
};

const saveNewComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const obj = { username, body, article_id };
  connection('comments')
    .insert(obj)
    .returning('*')
    .then(([comment]) => {
      reformatDate(comment);
      return res.status(201).send({ comment });
    })
    .catch(next);
};

const sendCommentVotes = (req, res, next) => {
  const { comment_id, article_id } = req.params;
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 0;
  if (isNaN(parseInt(inc_votes, 10))) return next({ status: 400, msg: 'invalid inc_votes' });
  connection('comments')
    .leftJoin('articles', 'articles.article_id', 'comments.article_id')
    .where('comment_id', comment_id)
    .andWhere('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (!comment) return Promise.reject({ status: 404, msg: '404 not found' });

      reformatDate(comment);
      return res.send({ comment });
    })
    .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  connection('comments')
    .where('comment_id', comment_id)
    .del()
    .then((response) => {
      if (response === 0) return Promise.reject({ status: 404, msg: 'comment not found' });
      return res.status(204).send({ msg: 'comment deleted' });
    })
    .catch(next);
};

module.exports = {
  sendCommentsByArticleId,
  saveNewComment,
  sendCommentVotes,
  deleteComment,
};
