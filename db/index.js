// import the Sequelize module
const { Sequelize } = require('sequelize');

// create the sequelize instance, with the remote database connection parameters
sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  
// create a database object to hold our models
const db = {};

// add sequelize and Sequelize objects to the database object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// add the models to the database object
db.admin = require('./models/admin')(sequelize, Sequelize);
db.news = require('./models/news')(sequelize, Sequelize);
db.ranking = require('./models/ranking')(sequelize, Sequelize);

// export the database object
module.exports = db;
