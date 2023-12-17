const router = require('express').Router();
const { ZodError } = require('zod');
const { Logger } = require('../utils/logger');
const { publisher } = require('../utils/redisContext');

// simple CRUD for matches

const logger = new Logger('MatchesController');

const matchesService = require('../services/matches.service');

/**
 * @swagger
 * /matches:
 *  get:
 *    tags:
 *      - matches
 *    summary: Get all matches
 *    description: Get all matches
 *    responses:
 *      '200':
 *         description: A successful response
 */
router.get('', async (req, res) => {
  const matches = await matchesService.getAllMatches();
  res.send(matches);
});

/**
 * @swagger
 * /matches/{id}:
 *  get:
 *    tags:
 *      - matches
 *    description: Get match by id
 *    summary: Get match by id
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not found
 */
router.get('/:id', async (req, res) => {
  const match = await matchesService.getMatchById(req.params.id);
  if (!match) return res.status(404).send('Not found');
  res.send(match);
});

/**
 * @swagger
 * /matches:
 *  post:
 *    tags:
 *      - matches
 *    description: Create new match
 *    summary: Create new match
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 */
router.post('/', async (req, res) => {
  try {
    const match = await matchesService.createMatch(req.body);
    res.send(match);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).send(e.errors);
    } else {
      logger.error(e);
      res.status(500).send('Internal server error');
    }
  }
});

/**
 * @swagger
 * /matches/{id}:
 *  put:
 *    tags:
 *      - matches
 *    description: Update match by id
 *    summary: Update match by id
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Bad request
 *      '404':
 *        description: Not found
 */
router.put('/:id', async (req, res) => {
  try {
    const match = await matchesService.updateMatch(req.params.id, req.body);
    if (!match) return res.status(404).send('Not found');
    res.send(match);
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).send(e.errors);
    } else {
      logger.error(e);
      res.status(500).send('Internal server error');
    }
  }
});

module.exports = router;
