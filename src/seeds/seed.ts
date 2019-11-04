import * as Knex from 'knex';

const {
  topicData, articleData, userData, commentData,
} = require('../db/data');

const {
  renameColumn,
  changeTimestampToDate,
  getArticleIds,
  setArticleIds,
  formatUsers,
} = require('../db/utils');

const seed  = (knex: Knex): Promise<any> => knex('topics')
  .insert(topicData)
  .then(() => knex('users').insert(formatUsers(userData)))
  .then(() => knex('articles')
    .insert(changeTimestampToDate(renameColumn(articleData, 'created_by', 'username')))
    .returning('*'))
  .then((articles: Article[]) => {
    const dateChanged = changeTimestampToDate(commentData);
    const setUsername = renameColumn(dateChanged, 'created_by', 'username');
    const lookup = getArticleIds(articles);
    const setArticleId = setArticleIds(setUsername, lookup);
    return knex('comments').insert<Comment>(setArticleId);
  });

exports.seed = seed;