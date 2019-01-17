const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const dbConfig = ENV === 'production'
  ? {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: './seeds/migrations',

      seeds: {
        directory: './seeds',
      },
    },
  }
  :require('../knexfile')[ENV];

const connection = knex(dbConfig);
module.exports = connection;

ENV === 'production'
  ? {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: './seeds/migrations',

      seeds: {
        directory: './seeds',
      },
    },
  }
  :
