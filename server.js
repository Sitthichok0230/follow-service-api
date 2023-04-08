require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const app = express();
const cors = require('cors');
const {Op} = require('sequelize');
const db = require('./db/index.js');
const {ranking, admin} = db;

db.sequelize.sync();

const port = process.env.PORT || 3000;

app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const rankingRouter = require('./routes/ranking');
const newsRouter = require('./routes/news');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api', rankingRouter);
app.use('/api', newsRouter);
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
  res.render('login', {error: null});
});

app.post('/admin', async function (req, res) {
  const incredental = req.body;
  if (incredental) {
    await admin
      .findOne({
        attributes: ['username', 'password'],
        where: {
          username: req.body.username,
          password: req.body.password,
        },
      })
      .then(function (info) {
        if (info) {
          res.render('admin', {username: req.body.username});
        } else {
          res.render('login', {error: 'Invalid username or password'});
        }
      })
      .catch(function (err) {
        res.sendStatus(500);
      });
  } else {
    res.redirect('/admin');
  }
});

app.get('/admin/news', async function (req, res) {
  ejs.renderFile('views/news-admin.ejs', function (err, data) {
    res.send(data);
  });
});

app.get('/admin/ranking', async function (req, res) {
  ejs.renderFile('views/ranking-admin.ejs', function (err, data) {
    res.send(data);
  });
});

async function myTimer() {
  await ranking.destroy({
    where: {
      updatedAt: {[Op.lte]: Date.now() - 1 * 60 * 60 * 1000},
    },
  });
}

setInterval(myTimer, 1 * 60 * 1000);

app.listen(port, () => {
  console.log(`API server listening at port: ${port}`);
});
