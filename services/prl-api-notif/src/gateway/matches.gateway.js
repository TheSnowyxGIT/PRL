const colors = require('colors');
const { source } = require('../utils/dbContext');
const { client } = require('../utils/redisContext');
const { Logger } = require('../utils/logger');

const subscriber = client.duplicate();
const channel = 'matches';
const matchesRepository = source.getRepository('Match');
const matchFavRepository = source.getRepository('MatchFav');
const logger = new Logger('MatchesGateway');
const loggerNotif = new Logger('NOTIF', colors.magenta);

subscriber.connect().then(() => {
  subscriber.subscribe(channel, async (message) => {
    try {
      const match = JSON.parse(message);
      logger.log(`Received match ${match.id} from ${channel}`);
      if (!match.data) {
        return;
      }

      const foundMatch = await matchesRepository.findOne({
        where: { id: match.id },
      });
      if (foundMatch) {
        const newMatch = { ...foundMatch };
        Object.assign(newMatch, match.data);
        if (foundMatch.status !== 'LIVE' && match.data.status === 'LIVE') {
          const matchFav = await matchFavRepository.findOne({
            where: { matchId: match.id },
          });
          if (matchFav) {
            matchFav.users.forEach((user) => {
              loggerNotif.log(
                `Notif user ${user} for match ${match.id} is live`,
              );
            });
          }
        }
        if (foundMatch.status !== 'ENDED' && match.data.status === 'ENDED') {
          const matchFav = await matchFavRepository.findOne({
            where: { matchId: match.id },
          });
          if (matchFav) {
            matchFav.users.forEach((user) => {
              loggerNotif.log(
                `Notif user ${user} for match ${match.id} is ended. FINAL SCORE: ${newMatch.homeScore} - ${newMatch.awayScore}`,
              );
            });
          }
        }
        if (
          foundMatch.homeScore + foundMatch.awayScore !==
          newMatch.homeScore + newMatch.awayScore
        ) {
          const matchFav = await matchFavRepository.findOne({
            where: { matchId: match.id },
          });
          if (matchFav) {
            matchFav.users.forEach((user) => {
              loggerNotif.log(
                `Notif user ${user} for match ${match.id} score update. SCORE: ${newMatch.homeScore} - ${newMatch.awayScore}`,
              );
            });
          }
        }
        await matchesRepository.save(newMatch);
      } else {
        await matchesRepository.save(match.data);
      }
    } catch (error) {
      logger.warn(error);
    }
  });
});
