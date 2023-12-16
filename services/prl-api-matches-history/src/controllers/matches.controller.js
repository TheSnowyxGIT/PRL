const router = require('express').Router();
// const { Logger } = require('../utils/logger');

const { source } = require('../utils/dbContext');

// const logger = new Logger('MatchesController');
const matchesHistoryRepository = source.getRepository('MatchHistory');

/**
 * @swagger
 * /match-history/{id}:
 *  get:
 *    tags:
 *      - match-history
 *    summary: Get match history by ID
 *    description: Retrieve the history of a specific match by its ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of the match to get the history for
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *         description: A successful response with the match history
 *      '404':
 *         description: Match history not found
 */
router.get('/match-history/:id', async (req, res) => {
  const matchId = req.params.id;
  try {
    const matchHistory = await matchesHistoryRepository.findOne({
      where: { matchId },
    });
    if (matchHistory) {
      res.send(matchHistory);
    } else {
      res.status(404).send({ message: 'Match history not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving match history' });
  }
});

module.exports = router;
