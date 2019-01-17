const { DB_URL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews_dev',
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
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
    },
    seeds: {
      directory: './seeds',
    },
  },
};
