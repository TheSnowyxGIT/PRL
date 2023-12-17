const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { appConfig } = require('./config/app.config');
const { Logger } = require('./utils/logger');
const { open } = require('./utils/dbContext');

const app = express();
const { port, domain } = appConfig;

const logger = new Logger('APP');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'PRL Favorites Matches API',
    // eslint-disable-next-line global-require
    version: require('../package.json').version,
  },
};

const options = {
  swaggerDefinition,
  apis: ['**/*.controller.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
logger.log(`Swagger docs available at ${domain}/docs`);

// routes
const matchesRouter = require('./controllers/matches.controller');

app.use('/', matchesRouter);

app.listen(port, async () => {
  logger.log(`App listening at ${domain}`);
  await open();
  require('./gateway/matches.gateway');
});
