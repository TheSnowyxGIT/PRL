const { DataSource } = require('typeorm');
const { mongoConfig } = require('../config/mongo.config');
const { Logger } = require('./logger');

const logger = new Logger('DB');

const source = new DataSource({
  type: 'mongodb',
  url: mongoConfig.uri,
  entities: ['**/*.entity.js'],
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
});

module.exports.source = source;
module.exports.open = async () => {
  await source.initialize();
  logger.log('MongoDB connected');
};
module.exports.close = () => source.destroy();
