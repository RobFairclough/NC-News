import { Handler } from 'express';

const connection = require('../db/connection');
const { formatUsers, reformatDate } = require('../db/utils');

const sendAllUsers: Handler = (req, res, next) => {
  connection('users')
    .select('username', 'avatar_url', 'name')
    .then((users: User[]) => res.send({ users }))
    .catch(next);
};

const sendUserByUsername: Handler = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .select('username', 'avatar_url', 'name')
    .where('username', username)
    .then((users: User[]) => {
      const [user] = users;
      if (user) return res.send({ user });
      return Promise.reject({ status: 404, msg: 'user not found' });
    })
    .catch(next);
};

const saveNewUser: Handler = (req, res, next) => {
  const {
    username, name, avatar_url, password,
  } = req.body;
  if (!password) return next({ status: 401, msg: 'no password given' });
  const user = formatUsers({
    username,
    name,
    avatar_url,
    password,
  });
  return connection('users')
    .insert([user])
    .returning(['username', 'avatar_url', 'name'])
    .then((users: User[]) => {
      const [new_user] = users;
      return res.status(201).send({ new_user });
    })
    .catch(next);
};

const updateUserDetails: Handler = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .where('username', username)
    .update(req.body)
    .returning(['username', 'avatar_url', 'name'])
    .then((users: User[]) => {
      const [user] = users;
      return user ? res.send({ user }) : Promise.reject({ status: 404, msg: 'user not found' });
    })
    .catch(next);
};

const sendArticlesByUser: Handler = (req, res, next) => {
  const { username } = req.params;
  if (!username) return next();
  return connection('articles')
    .where('articles.username', '=', username)
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'users.avatar_url',
    )
    .rightJoin('users', 'articles.username', 'users.username')
    .groupBy('articles.article_id', 'users.username')
    .whereNotNull('title')
    .then((articles: Article[]) => {
      if (articles && articles.length) {
        reformatDate(articles);
        res.send({ articles });
      } else next({ status: 404, msg: 'articles not found' });
    })
    .catch(next);
};
const deleteUser: Handler = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .where('username', username)
    .del()
    .then((response: number) => {
      if (response === 0) next({ status: 404, msg: 'no users exist to delete with that username' });
      else res.status(204).send({ msg: 'delete successful' });
    })
    // })
    .catch(next);
};

module.exports = {
  sendAllUsers,
  sendUserByUsername,
  sendArticlesByUser,
  saveNewUser,
  updateUserDetails,
  deleteUser,
};
