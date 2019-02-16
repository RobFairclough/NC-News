const { DB_URL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews_dev',
    },
    migrations: {
      directory: './built/migrations',
    },
    seeds: {
      directory: './built/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
    },
    migrations: {
      directory: './built/migrations',
    },
    seeds: {
      directory: './built/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './built/migrations',

      seeds: {
        directory: './built/seeds',
      },
    },
  },
};
