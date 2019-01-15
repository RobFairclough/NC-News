const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

const sendAllTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.send({ topics }));
};

const sendArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const {
    sort_by = 'created_at', order, limit = 10, p = 1,
  } = req.query;
  const offset = limit * (p - 1);
  connection('articles')
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .join('comments', 'articles.article_id', 'comments.article_id')
    .count('comments.body as comment_count')
    .groupBy('articles.article_id')
    .limit(limit)
    .offset(offset)
    .orderBy(sort_by, order === 'asc' ? order : 'desc')
    .where(req.params)
    .then((articles) => {
      // postgres/knex returns dates as js Date objects, this puts back to the intended format
      reformatDate(articles);
      return articles.length
        ? res.status(200).send({ topic, articles })
        : Promise.reject({ status: 404, msg: `404, no articles for ${topic}` });
    })
    .catch(next);
};

const saveNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  connection('topics')
    .insert({ slug, description })
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

const saveNewArticleInTopic = (req, res, next) => {
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
    .then(([article]) => {
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
