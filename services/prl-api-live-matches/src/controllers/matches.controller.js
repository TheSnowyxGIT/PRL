const router = require('express').Router();
// const { Logger } = require('../utils/logger');

const { source } = require('../utils/dbContext');

// const logger = new Logger('MatchesController');
const matchesRepository = source.getRepository('Match');

/**
 * @swagger
 * /live-matches:
 *  get:
 *    tags:
 *      - live-matches
 *    summary: Get all live matches
 *    description: Get all live matches
 *    responses:
 *      '200':
 *         description: A successful response
 */
router.get('/live-matches', async (req, res) => {
  const matches = await matchesRepository.find();
  res.send(matches);
});

module.exports = router;
