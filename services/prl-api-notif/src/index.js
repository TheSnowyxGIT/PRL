// const { Logger } = require('./utils/logger');
const { open } = require('./utils/dbContext');

// const logger = new Logger('APP');

open().then(() => {
  require('./gateway/matches.gateway');
  require('./gateway/fav.gateway');
});
