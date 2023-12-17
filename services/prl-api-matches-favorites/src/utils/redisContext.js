const redis = require('redis');
// const { Logger } = require('./logger');
const { redisConfig } = require('../config/redis.config');

// const logger = new Logger('Redis');
const client = redis.createClient({
  url: `${redisConfig.url}`,
  password: redisConfig.password,
  username: redisConfig.username,
});

module.exports.client = client;
