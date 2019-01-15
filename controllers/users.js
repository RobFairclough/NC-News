const connection = require('../db/connection');

const sendAllUsers = (req, res, next) => {
  connection('users')
    .select('*')
    .then(users => res.send({ users }))
    .catch(next);
};

module.exports = { sendAllUsers };
