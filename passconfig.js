const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    JWT_SECRET: 'banana',
  },
  test: {
    JWT_SECRET: 'orange',
  },
  production: {
    JWT_SECRET: process.env,
  },
};

module.exports = config[env];
