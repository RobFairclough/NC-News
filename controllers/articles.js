const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

const sendAllArticles = (req, res, next) => {
  const {
    sort_by = 'created_at', order, limit = 10, p = 1,
  } = req.query;
  const offset = limit * (p - 1);
  connection('articles')
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'topic',
    )
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .orderBy(sort_by, order === 'asc' ? order : 'desc')
    .offset(offset)
    .limit(limit)
    .count('comments.comment_id AS comment_count')
    .groupBy('articles.article_id')
    .then((articles) => {
      reformatDate(articles);
      res.send({ articles });
    })
    .catch(next);
};

const sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  connection('articles')
    .select(
      'articles.article_id',
      'articles.username AS author',
      'title',
      'articles.votes',
      'articles.body',
      'articles.created_at',
      'topic',
    )
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .count('comment_id AS comment_count')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then(([article]) => {
      if (article) {
        reformatDate(article);
        res.send({ article });
      } else next({ msg: `404, no article with ID ${article_id}` });
    })
    .catch(next);
};

module.exports = { sendAllArticles, sendArticleById };
