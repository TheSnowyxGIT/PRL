const colors = require('colors/safe');
const { appConfig } = require('../config/app.config');

const colorsByType = Object.freeze({
  log: colors.white,
  warn: colors.yellow,
  error: colors.red,
});

module.exports.Logger = class Logger {
  static log(message) {
    new Logger().log(message);
  }

  static warn(message) {
    new Logger().warn(message);
  }

  static error(message) {
    new Logger().error(message);
  }

  constructor(name, color = colors.yellow) {
    this.name = name || 'Logger';
    this.color = color;
  }

  prefix(type) {
    return colorsByType[type](
      `[${appConfig.prefix}] ${process.pid
        .toString()
        .padEnd(6, ' ')} - ${new Date().toLocaleString().padEnd(24, ' ')} ${type
        .toUpperCase()
        .padStart(5, ' ')} ${this.color(`[${this.name}]`)}`,
    );
  }

  log(message) {
    console.log(this.prefix('log'), message);
  }

  warn(message) {
    console.warn(this.prefix('warn'), message);
  }

  error(message) {
    console.error(this.prefix('error'), message);
  }
};
