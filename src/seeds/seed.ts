import * as Knex from 'knex';

import {
  renameColumn,
  changeTimestampToDate,
  getArticleIds,
  setArticleIds,
  formatUsers,
} from '../db/utils';

const {
  topicData, articleData, userData, commentData,
} = require('../db/data');

const seed  = (knex: Knex): Promise<number> => knex('topics')
  .insert(topicData)
  .then(() => knex('users').insert(formatUsers(userData)))
  .then(() => knex('articles')
    .insert(changeTimestampToDate(renameColumn(articleData, 'created_by', 'username')))
    .returning<Article[]>('*'))
  .then((articles) => {
    const dateChangedComments = changeTimestampToDate(commentData);
    const setUsernameComments = renameColumn(dateChangedComments, 'created_by', 'username');
    const lookup = getArticleIds(articles);
    const setArticleIdComments = setArticleIds(setUsernameComments as Comment[], lookup);
    return knex('comments').insert(setArticleIdComments);
  });

exports.seed = seed;