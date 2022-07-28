module.exports = (sequelize, Sequelize) => {
  const ranking = sequelize.define(
    'ranking',
    {
      word: {
        type: Sequelize.TEXT,
        primaryKey: true,
        field: 'word',
      },
      score: {
        type: Sequelize.INTEGER,
        field: 'score',
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'createdAt',
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updatedAt',
      },
    },
    {
      tableName: 'ranking',
    }
  );

  return ranking;
};
