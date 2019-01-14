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
  } else {
    // else {
    //   connection('topics')
    //     .select()
    //     .then((topics) => {
    //       if (topics.some(topic => topic.slug === slug)) {
    //         // duplicate primary key (maybe do this with returned knex error code)
    //       }
    //     });
    // }
    connection('topics')
      .insert({ slug, description })
      .returning('*')
      .then(topic => res.status(201).send({ topic }));
  }
};

module.exports = { sendAllTopics, saveNewTopic };
