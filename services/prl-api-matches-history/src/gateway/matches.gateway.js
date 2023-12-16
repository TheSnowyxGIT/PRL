const { source } = require('../utils/dbContext');
const { client } = require('../utils/redisContext');
const { Logger } = require('../utils/logger');

const subscriber = client.duplicate();
const channel = 'matches';
const matchesHistoryRepository = source.getRepository('MatchHistory');
const logger = new Logger('MatchesGateway');

subscriber.connect().then(() => {
  subscriber.subscribe(channel, async (message) => {
    try {
      const match = JSON.parse(message);
      logger.log(`Received match ${match.id} from ${channel}`);
      const matchHistory = await matchesHistoryRepository.findOne({
        where: { matchId: match.id },
      });
      const data = { ...match.data, receivedAt: new Date() };
      if (matchHistory) {
        matchHistory.history.splice(0, 0, data);
        await matchesHistoryRepository.save(matchHistory);
      } else {
        await matchesHistoryRepository.save({
          matchId: match.id,
          history: [data],
        });
      }
    } catch (error) {
      logger.warn(error);
    }
  });
});
