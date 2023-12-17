const { EntitySchema } = require('typeorm');

const name = 'MatchFav';

const MatchFav = new EntitySchema({
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
    users: {
      type: 'json',
      nullable: false,
      default: [],
    },
  },
});

module.exports.MatchFav = MatchFav;
