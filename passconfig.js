const env = process.env.NODE_ENV || 'development';
const { JWT_SECRET } = process.env || 'orange';

module.exports = JWT_SECRET;
