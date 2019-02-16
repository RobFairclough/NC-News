const ENV = process.env.NODE_ENV || 'development';
const { DATABASE_URL } = process.env;
const knex = require('knex');
const dbConfig = ENV === 'production'
  ? {
    client: 'pg',
    connection: `${DATABASE_URL}?ssl=true`,
    migrations: {
      directory: './src/migrations',

      seeds: {
        directory: './src/seeds',
      },
    },
  }
  : require('../knexfile')[ENV];

// const knexConnection = knex(dbConfig);
module.exports = knex(dbConfig);
