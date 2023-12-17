const router = require('express').Router();
const { publisher } = require('../../../prl-matches/src/utils/redisContext');
// const { Logger } = require('../utils/logger');

const { source } = require('../utils/dbContext');

// const logger = new Logger('MatchesController');
const matchesFavoritesRepository = source.getRepository('MatchFavorites');
const matchesRepository = source.getRepository('Match');

/**
 * @swagger
 * /match-favorites:
 *  get:
 *    tags:
 *      - match-favorites
 *    summary: Get favorites matches by user ID
 *    description: Retrieve the favorites matches of a specific user by its ID
 *    parameters:
 *      - in: header
 *        name: user_id
 *        required: true
 *        description: Numeric ID of the user to get the favorites matches for
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *         description: A successful response with the list of favorites matches
 *      '401':
 *        description: User ID is required
 *      '404':
 *         description: User not found
 */
router.get('/match-favorites/', async (req, res) => {
  const user_id = req.headers['user_id'];
  try {
    if (!user_id) {
      res.status(401).send({ message: 'User ID is required' });
    }
    const favorites_matches = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (favorites_matches) {
      let matches = [];
      for (const match_id of favorites_matches.favorites) {
        const match = await matchesRepository.findOne({
          where: { id: match_id },
        });
        matches.push(match);
      }
      res.send(matches);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving favorites' });
  }
});

/**
 * @swagger
 * /match-favorites/{match_id}:
 *  post:
 *    tags:
 *      - match-favorites
 *    summary: Post a new favorites match to user
 *    description: Post a new favorite match to a specific user by its ID
 *    parameters:
 *      - in: header
 *        name: user_id
 *        required: true
 *        description: Numeric ID of the user to add a favorite match for
 *        schema:
 *          type: string
 *      - in: path
 *        name: match_id
 *        required: true
 *        description: Numeric ID of the match to add to favorites
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: A successful response with the list of favorites matches
 *      '404':
 *        description: User not found
 */
router.post('/match-favorites/:match_id', async (req, res) => {
  const user_id = req.headers['user_id'];
  const match_id = req.params.match_id;
  try {
    if (!user_id) {
      res.status(401).send({ message: 'User ID is required' });
    }
    const user = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (user) {
      if (user.favorites.includes(match_id)) {
        res.send(await matchesRepository.findOne({ where: { id: match_id } }));
        return;
      } else {
        user.favorites.push(match_id);
        await matchesFavoritesRepository.save(user);
        res.send(await matchesRepository.findOne({ where: { id: match_id } }));
        publisher.publish(
          'favs',
          JSON.stringify({
            type: 'ADD',
            matchId: match_id,
            userId: user_id,
          })
        );
        return;
      }
    } else {
      const new_favorites_matches = matchesFavoritesRepository.create({
        user_id,
        favorites: [match_id],
      });
      await matchesFavoritesRepository.save(new_favorites_matches);
      res.send(await matchesRepository.findOne({ where: { id: match_id } }));
      publisher.publish(
        'favs',
        JSON.stringify({
          type: 'ADD',
          matchId: match_id,
          userId: user_id,
        })
      );
    }
  } catch (error) {
    res.status(500).send({ message: 'Error posting favorites' });
  }
});

/**
 * @swagger
 * /match-favorites/{match_id}:
 *  delete:
 *    tags:
 *      - match-favorites
 *    summary: Delete a favorite match from user
 *    description: Delete a favorite match from a specific user by its ID
 *    parameters:
 *      - in: header
 *        name: user_id
 *        required: true
 *        description: Numeric ID of the user to delete a favorite match for
 *        schema:
 *          type: string
 *      - in: path
 *        name: match_id
 *        required: true
 *        description: Numeric ID of the match to delete from favorites
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: A successful response with the list of favorites matches
 *      '404':
 *        description: User not found
 */
router.delete('/match-favorites/:match_id', async (req, res) => {
  const user_id = req.headers['user_id'];
  const match_id = req.params.match_id;
  try {
    if (!user_id) {
      res.status(401).send({ message: 'User ID is required' });
    }
    const favorites_matches = await matchesFavoritesRepository.findOne({
      where: { user_id },
    });
    if (favorites_matches) {
      const index = favorites_matches.favorites.indexOf(match_id);
      if (index > -1) {
        favorites_matches.favorites.splice(index, 1);
        publisher.publish(
          'favs',
          JSON.stringify({
            type: 'REMOVE',
            matchId: match_id,
            userId: user_id,
          })
        );
      }
      await matchesFavoritesRepository.save(favorites_matches);
      res.send(favorites_matches.favorites);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error deleting favorite' });
  }
});

module.exports = router;
