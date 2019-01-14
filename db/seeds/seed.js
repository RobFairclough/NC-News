const {
  topicData, articleData, userData, commentData,
} = require('../data');

const {
  renameColumn, changeTimestampToDate, getArticleIds, setArticleIds,
} = require('../utils');

exports.seed = (knex, Promise) => knex('topics')
  .insert(topicData)
  .then(() => knex('users').insert(userData))
  .then(() => knex('articles')
    .insert(changeTimestampToDate(renameColumn(articleData, 'created_by', 'username')))
    .returning('*'))
  .then((articles) => {
    const dateChanged = changeTimestampToDate(commentData);
    const setUsername = renameColumn(dateChanged, 'created_by', 'username');
    const lookup = getArticleIds(articles);
    const setArticleId = setArticleIds(setUsername, lookup);
    return knex('comments').insert(setArticleId);
  });
