const { source } = require('../utils/dbContext');
const { client } = require('../utils/redisContext');
const { Logger } = require('../utils/logger');

const subscriber = client.duplicate();
const channel = 'matches';
const matchesRepository = source.getRepository('Match');
const logger = new Logger('MatchesGateway');

subscriber.connect().then(() => {
  subscriber.subscribe(channel, async (message) => {
    try {
      const match = JSON.parse(message);
      logger.log(`Received match ${match.id} from ${channel}`);
      if (!match.data) {
        return;
      }
      if (match.data.status !== 'LIVE') {
        const foundMatch = await matchesRepository.findOne();
        if (foundMatch) {
          await matchesRepository.remove(foundMatch);
        }
      } else {
        let foundMatch = await matchesRepository.findOne();
        if (foundMatch) {
          foundMatch = Object.assign(foundMatch, match.data);
          await matchesRepository.save(foundMatch);
        } else {
          await matchesRepository.save(match.data);
        }
      }
    } catch (error) {
      logger.warn(error);
    }
  });
});