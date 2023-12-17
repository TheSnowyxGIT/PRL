const redis = require('redis');
const { Logger } = require('./logger');
const { redisConfig } = require('../config/redis.config');

const logger = new Logger('Redis');
const client = redis.createClient({
  url: `${redisConfig.url}`,
  password: redisConfig.password,
  username: redisConfig.username,
});

module.exports.client = client;
const publisher = redis.createClient({
  url: `${redisConfig.url}`,
  password: redisConfig.password,
  username: redisConfig.username,
});

module.exports.connect = async () => {
  try {
    await publisher.connect();
    logger.log('Connected to Redis');
  } catch (error) {
    logger.error(error);
  }
};

module.exports.publisher = publisher;
