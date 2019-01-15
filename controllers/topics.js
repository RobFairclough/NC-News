const connection = require('../db/connection');

const sendAllTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.send({ topics }));
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
const sendArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const {
    sort_by = 'created_at', order = 'desc', limit = 10, p = 1,
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
    .orderBy(sort_by, order)
    .where('articles.topic', topic)
    .then((articles) => {
      if (!articles.length) Promise.reject({ status: 404, msg: `404, no articles for ${topic}` });
      else {
        articles.forEach((article) => {
          // postgres/knex returns dates as js Date objects, this puts back to the intended format
          article.created_at = JSON.stringify(article.created_at).slice(1, 11);
        });
        res.status(200).send({ topic, articles });
      }
    })
    .catch(next);
};

module.exports = { sendAllTopics, saveNewTopic, sendArticlesByTopic };
