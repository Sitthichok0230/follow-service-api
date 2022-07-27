module.exports = (sequelize, Sequelize) => {
  const ranking = sequelize.define(
    'ranking',
    {
      word: {
        type: Sequelize.TEXT,
        primaryKey: true,
        field: 'word',
      },
      count: {
        type: Sequelize.INTEGER,
        field: 'count',
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
