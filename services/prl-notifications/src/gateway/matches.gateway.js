const { source } = require('../utils/dbContext');
const { client } = require('../utils/redisContext');
const { Logger } = require('../utils/logger');

const subscriber = client.duplicate();
const channelMatches = 'matches';
const channelMatchFavorites = 'matchFavorites';
const matchesRepository = source.getRepository('Match');
const favoriteMatchesRepository = source.getRepository('MatchFavorites');
const logger = new Logger('MatchesGateway');

subscriber.connect().then(() => {
  subscriber.subscribe(channelMatches, async (message) => {
    try {
      const match = JSON.parse(message);
      logger.log(`Received match ${match.id} from ${channelMatches}`);
      if (!match.data) {
        return;
      }

      let foundMatch = await matchesRepository.findOne({
        where: { matchId: match.id },
      });
      if (foundMatch) {
        foundMatch = Object.assign(foundMatch, match.data);
        await matchesRepository.save(foundMatch);
        for (const user of favoriteMatchesRepository) {
          for (const favmatch of user.favorites) {
            if (favmatch === match.id) {
              logger.log(
                `Sending notification for match ${match.id} to ${user.id}`
              );
            }
          }
        }
      } else {
        await matchesRepository.save(match.data);
      }
    } catch (error) {
      logger.warn(error);
    }
  });
});

subscriber.connect().then(() => {
  subscriber.subscribe(channelMatchFavorites, async (message) => {
    try {
      const favorite = JSON.parse(message);
      logger.log(
        `Received favorite match ${favorite.id} from ${channelMatchFavorites}`
      );
      if (!favorite.data) {
        return;
      }

      let foundFavorite = await favoriteMatchesRepository.findOne({
        where: { userId: favorite.userId },
      });
      if (foundFavorite) {
        foundFavorite = Object.assign(foundFavorite, favorite.data);
        await favoriteMatchesRepository.save(foundFavorite);
      } else {
        await favoriteMatchesRepository.save(favorite.data);
      }
    } catch (error) {
      logger.warn(error);
    }
  });
});
