const { ObjectId } = require('mongodb');
const { source } = require('../utils/dbContext');
const { validateMatch } = require('../entities/match.entity');
const { publisher } = require('../utils/redisContext');

const matchesRepository = source.getRepository('Match');

module.exports.getAllMatches = async () => {
  const matches = await matchesRepository.find({});
  return matches;
};

module.exports.getMatchById = async (id) => {
  const match = await matchesRepository.findOne({
    where: { _id: new ObjectId(id) },
  });
  return match;
};

module.exports.createMatch = async (match) => {
  const validatedMatch = await validateMatch(match);
  const newMatch = await matchesRepository.save(validatedMatch);
  publisher.publish(
    'matches',
    JSON.stringify({ id: newMatch.id, data: newMatch }),
  );
  return newMatch;
};

module.exports.updateMatch = async (id, match) => {
  let findMatch = await module.exports.getMatchById(id);
  if (!findMatch) return null;
  findMatch = { ...findMatch, ...match };
  findMatch = await validateMatch(findMatch);
  const updatedMatch = await matchesRepository.save(findMatch);
  publisher.publish(
    'matches',
    JSON.stringify({ id: updatedMatch.id, data: match }),
  );
  return updatedMatch;
};
