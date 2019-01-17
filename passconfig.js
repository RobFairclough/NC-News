const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    JWT_SECRET: 'banana',
  },
  test: {
    JWT_SECRET: 'orange',
  },
};

module.exports = config[env];
