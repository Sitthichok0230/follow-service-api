module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define(
    'admin',
    {
      username: {
        type: Sequelize.TEXT,
        field: 'username',
      },
      password: {
        type: Sequelize.TEXT,
        field: 'password',
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
      tableName: 'admin',
    }
  );

  return admin;
};
