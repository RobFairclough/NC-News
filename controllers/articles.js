const connection = require('../db/connection');
const { reformatDate } = require('../db/utils');

const sendAllArticles = (req, res, next) => {
  const { order, limit = 10, p = 1 } = req.query;
  const validColumns = ['username', 'title', 'article_id', 'body', 'votes', 'created_at', 'topic'];
  const sortBy = validColumns.includes(req.query.sort_by) ? `articles.${req.query.sort_by}` : 'created_at';
  const offset = limit * (p - 1);
  connection('articles')
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'topic',
    )
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .orderBy(sortBy, order === 'asc' ? order : 'desc')
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

const sendArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body.inc_votes ? req.body.inc_votes : 0;
  if (Number.isNaN(parseInt(inc_votes, 10))) return next({ status: 400, msg: 'invalid inc_votes' });
  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (article) {
        reformatDate(article);
        return res.send({ article });
      }
      return next({ status: 404, msg: `article not found with id ${article_id}` });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  // connection('comments')
  //   .where('article_id', article_id)
  //   .del()
  //   .then(() => {
  connection('articles')
    .where('article_id', article_id)
    .del()
    .then((response) => {
      if (response === 0) next({ status: 404, msg: 'no articles exist to delete with that id' });
      else res.status(204).send({ msg: 'delete successful' });
    })
    // })
    .catch(next);
};

module.exports = {
  sendAllArticles,
  sendArticleById,
  sendArticleVotes,
  deleteArticle,
};
