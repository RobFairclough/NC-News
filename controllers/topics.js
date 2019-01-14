const connection = require('../db/connection');

const sendAllTopics = (req, res, next) => {
  connection('topics')
    .select()
    .then(topics => res.send({ topics }));
};

const saveNewTopic = (req, res, next) => {
  const { slug, description } = req.body;
  if (!slug || !description) {
    // 400 bad request
    res
      .status(400)
      .send({ msg: '400 bad request - missing slug or description from request body' });
  } else {
    connection('topics')
      .insert({ slug, description })
      .returning('*')
      .then((topic) => {
        res.status(201).send({ topic });
      })
      .catch(err => (err.code === '23505' ? res.status(422).send({ msg: err.detail }) : next(err)));
  }
};

module.exports = { sendAllTopics, saveNewTopic };
