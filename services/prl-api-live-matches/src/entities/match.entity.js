const { EntitySchema } = require('typeorm');

const name = 'Match';

const Match = new EntitySchema({
  name,
  columns: {
    id: {
      objectId: true,
      primary: true,
    },
    matchId: {
      type: String,
      nullable: false,
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

module.exports.Match = Match;
