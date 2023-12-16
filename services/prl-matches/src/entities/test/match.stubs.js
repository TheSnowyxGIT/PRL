const { faker } = require('@faker-js/faker');

module.exports.matchStub = (overwrite) => ({
  title: faker.lorem.words(2),
  competitorId1: faker.string.uuid(),
  competitorId2: faker.string.uuid(),
  startDate: faker.date.past(),
  endDate: faker.date.future(),
  status: faker.string.fromCharacters(['PREMATCH', 'LIVE', 'ENDED']),
  homeScore: faker.number.int(),
  awayScore: faker.number.int(),
  ...overwrite,
});

module.exports.finishedMatchStub = (overwrite) => {
  const startDate = faker.date.recent({ days: 30 });
  const endDate = new Date(
    startDate.getTime() + faker.number.int({ min: 90, max: 140 }) * 60 * 1000,
  );
  return module.exports.matchStub({
    startDate,
    endDate,
    status: 'ENDED',
    ...overwrite,
  });
};

module.exports.liveMatchStub = (overwrite) => {
  const startDate = new Date(
    Date.now() - faker.number.int({ min: 10, max: 80 }) * 60 * 1000,
  );
  return module.exports.matchStub({
    startDate,
    endDate: undefined,
    status: 'LIVE',
    ...overwrite,
  });
};

module.exports.preMatchStub = (overwrite) => {
  const startDate = faker.date.soon({ days: 30 });
  return module.exports.matchStub({
    startDate,
    endDate: undefined,
    status: 'PREMATCH',
    homeScore: 0,
    awayScore: 0,
    ...overwrite,
  });
};
