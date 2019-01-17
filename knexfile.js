const { DB_URL } = process.env;
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews_dev',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  test: {
    client: 'pg',
    connection: {
      database: 'nc_knews_test',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },

  production: {
    client: 'postgresql',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      tableName: './seed/migrations',
    },
    seeds: {
      directory: './seed',
    },
  },
};
