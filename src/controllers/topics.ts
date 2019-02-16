import { Request, Response, NextFunction } from 'express';

const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

interface Topic {
  slug: string;
  description: string;
}

interface Article {
  username?: string;
  author?: string;
  article_id: number;
  votes: number;
  created_at: string;
  topic: string;
  avatar_url?: string;
}

const sendAllTopics = (req: Request, res: Response, next: NextFunction) => {
  connection('topics')
    .select()
    .then((topics: Topic[]) => res.send({ topics }))
    .catch(next);
};

const sendArticlesByTopic = (req: Request, res: Response, next: NextFunction) => {
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

const saveNewTopic = (req: Request, res: Response, next: NextFunction) => {
  const { slug, description } = req.body;
  connection('topics')
    .insert({ slug, description })
    .returning('*')
    .then((topics: Topic[]) => {
      const [topic] = topics;
      res.status(201).send({ topic });
    })
    .catch(next);
};

const saveNewArticleInTopic = (req: Request, res: Response, next: NextFunction) => {
  const { topic } = req.params;
  const { title, username, body } = req.body;
  connection('articles')
    .insert({
      topic,
      title,
      username,
      body,
    })
    .returning('*')
    .then((articles: Article[]) => {
      const [article] = articles;
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
