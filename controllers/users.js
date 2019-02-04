const connection = require('../db/connection');
const { formatUsers } = require('../db/utils');

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
    .then(([new_user]) => res.status(201).send({ new_user }))
    .catch(next);
};

const updateUserDetails = (req, res, next) => {
  const { username } = req.params;
  connection('users')
    .where('username', username)
    .update(req.body)
    .returning('*')
    .then(([user]) => (user ? res.send({ user }) : Promise.reject({ status: 404, msg: 'user not found' })))
    .catch(next);
};

module.exports = {
  sendAllUsers,
  sendUserByUsername,
  saveNewUser,
  updateUserDetails,
};
