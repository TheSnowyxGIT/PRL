const { EntitySchema } = require('typeorm');

const name = 'MatchFavorites';

const MatchFavorites = new EntitySchema({
  name,
  columns: {
    id: {
      objectId: true,
      primary: true,
    },
    user_id: {
      type: 'string',
      nullable: false,
    },
    favorites: {
      type: 'json',
      default: [],
    },
  },
});

module.exports.MatchFavorites = MatchFavorites;
