module.exports.appConfig = {
  prefix: 'PRL-API-MATCHES-HISTORY',
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  get domain() {
    return `${this.protocol}://${this.host}:${this.port}`;
  },
};
