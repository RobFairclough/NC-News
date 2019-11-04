import Knex = require("knex");


const ENV = process.env.NODE_ENV || 'development';
const { DATABASE_URL } = process.env;

const dbConfig = ENV === 'production'
  ? {
    client: 'pg',
    connection: `${DATABASE_URL}?ssl=true`,
    migrations: {
      directory: './built/migrations',

      seeds: {
        directory: './built/seeds',
      },
    },
  }
  : require('../knexfile')[ENV]; 

  const instance: Knex = Knex(dbConfig as Knex.Config)
// const KnexConnection = Knex(dbConfig);
module.exports = instance;
export default instance;
