module.exports.appConfig = {
  prefix: 'PRL-MATCHES',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  get domain() {
    return `${this.protocol}://${this.host}:${this.port}`;
  },
};
