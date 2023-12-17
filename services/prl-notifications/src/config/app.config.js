module.exports.appConfig = {
  prefix: 'PRL-API-NOTIFICATIONS',
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  get domain() {
    return `${this.protocol}://${this.host}:${this.port}`;
  },
};
