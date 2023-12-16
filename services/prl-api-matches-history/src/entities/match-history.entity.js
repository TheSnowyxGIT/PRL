const { EntitySchema } = require('typeorm');

const name = 'MatchHistory';

const MatchHistory = new EntitySchema({
  name,
  columns: {
    id: {
      objectId: true,
      primary: true,
    },
    matchId: {
      type: 'string',
      nullable: false,
    },
    history: {
      type: 'json',
      default: [],
    },
  },
});

module.exports.MatchHistory = MatchHistory;
