const connection = require('../db/connection');
const formatUsers = require('../db/utils');

const sendAllUsers = (req, res, next) => {
  connection('users')
    .select('username', 'avatar_url', 'name')
    .then(users => res.send({ users }))
    .catch(next);
};

const sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .where('username', username)
    .then(([user]) => {
      if (user) return res.send({ user });
      return Promise.reject({ status: 404, msg: 'user not found' });
    })
    .catch(next);
};

const saveNewUser = (req, res, next) => {
  const {
    username, name, avatar_url, password,
  } = req.body;
  const user = formatUsers([{
    username, name, avatar_url, password,
  }]);
  connection('users').insert([user]);
};

module.exports = { sendAllUsers, sendUserByUsername };
