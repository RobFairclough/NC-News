const { DB_URL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews_dev',
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: './src/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './src/migrations',

      seeds: {
        directory: './src/seeds',
      },
    },
  },
};
