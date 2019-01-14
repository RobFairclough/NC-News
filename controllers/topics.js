const connection = require('../db/connection');

const sendAllTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.send({ topics }));
};

module.exports = { sendAllTopics };
