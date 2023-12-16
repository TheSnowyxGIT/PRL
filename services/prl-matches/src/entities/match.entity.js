const { EntitySchema } = require('typeorm');
const { validateMatch } = require('../match-validator');

const name = 'Match';

const Match = new EntitySchema({
  name,
  columns: {
    id: {
      objectId: true,
      primary: true,
    },
    title: {
      type: String,
      nullable: false,
    },
    competitorId1: {
      type: String,
      nullable: false,
    },
    competitorId2: {
      type: String,
      nullable: false,
    },
    startDate: {
      type: Date,
      nullable: false,
    },
    endDate: {
      type: Date,
      nullable: false,
    },
    status: {
      type: String,
      nullable: false,
    },
    homeScore: {
      type: Number,
      nullable: false,
    },
    awayScore: {
      type: Number,
      nullable: false,
    },
  },
});

module.exports.validateMatch = (match) => validateMatch(match);

module.exports.Match = Match;
