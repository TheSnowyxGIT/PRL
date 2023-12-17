const { source } = require('../utils/dbContext');
const { client } = require('../utils/redisContext');
const { Logger } = require('../utils/logger');

const subscriber = client.duplicate();
const channel = 'favs';
const matchFavRepository = source.getRepository('MatchFav');
const logger = new Logger('MatchFavGateway');

subscriber.connect().then(() => {
  subscriber.subscribe(channel, async (message) => {
    try {
      const matchFav = JSON.parse(message);
      logger.log(`Received match fav ${matchFav.matchId} from ${channel}`);
      if (!matchFav) {
        return;
      }

      let foundMatchFav = await matchFavRepository.findOne({
        where: { matchId: matchFav.matchId },
      });
      if (!foundMatchFav) {
        const mf = matchFavRepository.create({
          matchId: matchFav.matchId,
          users: [],
        });
        foundMatchFav = await matchFavRepository.save(mf);
      }
      if (matchFav.type === 'ADD') {
        if (!foundMatchFav.users.includes(matchFav.userId)) {
          logger.log(
            `Add user ${matchFav.userId} to match favs ${matchFav.matchId}`,
          );
          foundMatchFav.users.push(matchFav.userId);
        }
      } else if (matchFav.type === 'REMOVE') {
        foundMatchFav.users = foundMatchFav.users.filter(
          (u) => u !== matchFav.userId,
        );
        logger.log(
          `Remove user ${matchFav.userId} from match favs ${matchFav.matchId}`,
        );
      }
      await matchFavRepository.save(foundMatchFav);
    } catch (error) {
      logger.warn(error);
    }
  });
});
