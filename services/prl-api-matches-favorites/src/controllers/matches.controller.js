const router = require('express').Router();
// const { Logger } = require('../utils/logger');

const { source } = require('../utils/dbContext');

// const logger = new Logger('MatchesController');
const matchesFavoritesRepository = source.getRepository('MatchFavorites');

/**
 * @swagger
 * /match-favorites/:user_id:
 *  get:
 *    tags:
 *      - match-favorites
 *    summary: Get favorites matches by user ID
 *    description: Retrieve the favorites matches of a specific user by its ID
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        description: Numeric ID of the user to get the favorites matches for
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *         description: A successful response with the list of favorites matches
 *      '404':
 *         description: User not found
 */
router.get('/match-favorites/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const favorites_matches = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (favorites_matches) {
      res.send(favorites_matches);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving favorites' });
  }
});

router.post('/match-favorites/:user_id/:match_id', async (req, res) => {
  const user_id = req.params.user_id;
  const match_id = req.params.match_id;
  try {
    const favorites_matches = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (favorites_matches) {
      favorites_matches.favorites.push(match_id);
      await matchesFavoritesRepository.save(favorites_matches);
      res.send(favorites_matches);
    } else {
      const new_favorites_matches = matchesFavoritesRepository.create({
        user_id,
        favorites: [match_id],
      });
      await matchesFavoritesRepository.save(new_favorites_matches);
      res.send(new_favorites_matches);
    }
  } catch (error) {
    res.status(500).send({ message: 'Error posting favorites' });
  }
});

router.delete('/match-favorites/:user_id/:match_id', async (req, res) => {
  const user_id = req.params.user_id;
  const match_id = req.params.match_id;
  try {
    const favorites_matches = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (favorites_matches) {
      const index = favorites_matches.favorites.indexOf(match_id);
      if (index > -1) {
        favorites_matches.favorites.splice(index, 1);
      }
      await matchesFavoritesRepository.save(favorites_matches);
      res.send(favorites_matches);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting favorite' });
  }
});

module.exports = router;
