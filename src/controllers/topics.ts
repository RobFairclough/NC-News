import { Handler } from 'express';
import connection from '../db/connection';


const { reformatDate } = require('../db/utils');


const sendAllTopics: Handler = (req, res, next) => {
  connection('topics')
    .select<Topic[]>()
    .then((topics) => res.send({ topics }))
    .catch(next);
};

const sendArticlesByTopic: Handler = (req, res, next) => {
  const { topic } = req.params;
  const { order, limit = 10, p = 1 } = req.query;
  const validColumns = ['username', 'title', 'article_id', 'body', 'votes', 'created_at', 'topic'];
  const offset = limit * (p - 1);
  const sortBy = validColumns.includes(req.query.sort_by) ? req.query.sort_by : 'created_at';

  connection('articles')
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'users.avatar_url',
    )
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .rightJoin('users', 'articles.username', 'users.username')
    .count('comments.comment_id as comment_count')
    .groupBy('articles.article_id', 'users.username')
    .limit(limit)
    .offset(offset)
    .orderBy(sortBy, order === 'asc' ? order : 'desc')
    .where(req.params)
    .whereNotNull('title')
    .then((articles: Article[]) => {
      reformatDate(articles);
      return articles.length
        ? res.status(200).send({ topic, articles })
        : Promise.reject({ status: 404, msg: `404, no articles for ${topic}` });
    })
    .catch(next);
};

const saveNewTopic: Handler = (req, res, next) => {
  const { slug, description } = req.body;
  connection('topics')
    .insert({ slug, description })
    .returning<Topic[]>('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

const saveNewArticleInTopic: Handler = (req, res, next) => {
  const { topic } = req.params;
  const { title, username, body } = req.body;
  connection('articles')
    .insert({
      topic,
      title,
      username,
      body,
    })
    .returning<Article[]>('*')
    .then(([article]) => {
      // todo failing tests
      res.status(201).send({ article });
    })
    .catch(next);
};

module.exports = {
  sendAllTopics,
  saveNewTopic,
  sendArticlesByTopic,
  saveNewArticleInTopic,
};
