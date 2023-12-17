module.exports.mongoConfig = {
  url: process.env.MONGO_URL || 'mongodb://root:12341234@localhost:27017',
  dbName: process.env.MONGO_DB_NAME || 'prl-notif',
  get uri() {
    return `${this.url}/${this.dbName}?authSource=admin`;
  },
};
