const {
  DB_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
} = process.env;

// todo does this need to be in .gitignore? no confidentials stored here
// todo docker-compose file different environments?
module.exports = {
  development: {
    client: 'pg',
    connection: {
      // new for docker integration - getting these environment variables from docker-compose
      // host only applicable when not developing locally
      host: DB_HOST || 'localhost',
      // port is default to 5432 and I won't be changing it anyway, just putting here for clarity
      port: DB_PORT || 5432,
      // getting DB_vars from environment means no need to change config for dev/live/test
      database: DB_NAME || 'nc_knews_dev',
      user: DB_USER || 'robfairclough',
      password: DB_PASSWORD || 'postgres',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  //  todo: update test & prod? 🤔 configs
  test: {
    client: 'pg',
    connection: {
      // new for docker integration - getting these environment variables from docker-compose
      // host only applicable when not developing locally
      host: DB_HOST || 'localhost',
      // port is default to 5432 and I won't be changing it anyway, just putting here for clarity
      port: DB_PORT || 5432,
      database: DB_NAME || 'nc_knews_test',
      user: DB_USER || 'robfairclough',
      password: DB_PASSWORD || 'postgres',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './migrations',

      seeds: {
        directory: './seeds',
      },
    },
  },
};
