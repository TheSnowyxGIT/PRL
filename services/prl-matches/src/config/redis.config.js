module.exports.redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: undefined,
  username: undefined,
};
