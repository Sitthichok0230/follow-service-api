module.exports = (sequelize, Sequelize) => {
  const news = sequelize.define(
    'news',
    {
      url: {
        type: Sequelize.TEXT,
        field: 'url',
      },
      logo: {
        type: Sequelize.BYTES,
        field: 'logo',
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
      tableName: 'news',
    }
  );

  return news;
};
