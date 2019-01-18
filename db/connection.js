const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;
const knex = require('knex');
const dbConfig = ENV === 'production'
  ? {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './migrations',

      seeds: {
        directory: './seeds',
      },
    },
  }
  : require('../knexfile')[ENV];

const connection = knex(dbConfig);
module.exports = connection;
