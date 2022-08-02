module.exports = (sequelize, Sequelize) => {
  const news = sequelize.define(
    'news',
    {
      url: {
        type: Sequelize.STRING,
        field: 'url',
      },
      logo: {
        type: Sequelize.BLOB,
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
