module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define(
    'admin',
    {
      username: {
        type: Sequelize.STRING,
        field: 'username',
      },
      password: {
        type: Sequelize.STRING,
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
