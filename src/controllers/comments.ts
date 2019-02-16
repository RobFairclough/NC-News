import { Request, Response, NextFunction } from 'express';

const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

interface Comment {
  article_id: number;
  comment_id: number;
  votes: number;
  created_at: string;
  username?: string;
  author?: string;
  body: string;
}

const sendCommentsByArticleId = (req: Request, res: Response, next: NextFunction) => {
  const { article_id } = req.params;
  const {
    limit = 10, sort_by = 'created_at', p = 1, order = 'desc',
  } = req.query;
  const offset = limit * (p - 1);
  connection('comments')
    .select('comment_id', 'votes', 'created_at', 'username AS author', 'body')
    .where('article_id', article_id)
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, order === 'asc' ? 'asc' : 'desc')
    .then((comments: Comment[]) => {
      if (!comments.length) return Promise.reject({ status: 404, msg: '404 not found' });
      reformatDate(comments);
      return res.send({ article_id, comments });
    })
    .catch(next);
};

const saveNewComment = (req: Request, res: Response, next: NextFunction) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  const obj = { username, body, article_id };
  connection('comments')
    .insert(obj)
    .returning('*')
    .then((comments: Comment[]) => {
      const [comment] = comments;
      reformatDate(comment);
      return res.status(201).send({ comment });
    })
    .catch(next);
};

const sendCommentVotes = (req: Request, res: Response, next: NextFunction) => {
  const { comment_id, article_id } = req.params;
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 0;
  if (Number.isNaN(parseInt(inc_votes, 10))) return next({ status: 400, msg: 'invalid inc_votes' });
  return connection('comments')
    .leftJoin('articles', 'articles.article_id', 'comments.article_id')
    .where('comment_id', comment_id)
    .andWhere('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then((comments: Comment[]) => {
      const [comment] = comments;
      if (!comment) return Promise.reject({ status: 404, msg: '404 not found' });

      reformatDate(comment);
      return res.send({ comment });
    })
    .catch(next);
};

const deleteComment = (req: Request, res: Response, next: NextFunction) => {
  const { comment_id, article_id } = req.params;
  connection('comments')
    .where('comment_id', comment_id)
    .andWhere('article_id', article_id)
    .del()
    .then((response: any) => {
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
