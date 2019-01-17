const connection = require('../db/connection');

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

module.exports = { sendAllUsers, sendUserByUsername };
