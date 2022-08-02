require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const {Op} = require('sequelize');
const db = require('./db/index.js');
const {ranking, admin, news} = db;
db.sequelize.sync();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const rankingRouter = require('./routes/ranking');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', rankingRouter);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/admin', function (req, res) {
  res.render('login');
});

app.post('/admin', async function (req, res) {
  const incredental = req.body;
  if (incredental) {
    await admin
      .findOne({
        where: {username: incredental.username, password: incredental.password},
      })
      .then(function (info) {
        res.render('admin', {username: incredental.username});
      })
      .catch(function (err) {
        res.render('error');
      });
  } else {
    res.redirect('/admin');
  }
});

app.listen(port, () => {
  console.log(`API server listening at port: ${port}`);
});

setInterval(myTimer, 60 * 60 * 1000);

async function myTimer() {
  await ranking.destroy({
    where: {
      updatedAt: {[Op.lte]: Date.now() - 24 * 60 * 60 * 1000},
    },
  });
}
