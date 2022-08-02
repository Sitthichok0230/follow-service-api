const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const {news} = db;
db.sequelize.sync();

router.route('/news?').get(async (req, res) => {
  newsData = await news.findAll();
  res.json({data: newsData});
});

router
  .route('/news/:url')
  .all((req, res, next) => {
    const url = req.params.url;
    const data = req.body.data;
    res.url = url;
    res.data = data;
    next();
  })
  .get(async (req, res) => {
    await news
      .findOne({where: {url: res.url}})
      .then(function (data) {
        if (!data) {
          res.send();
        } else {
          res.send(data);
        }
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
  })
  .post(async (req, res) => {
    await news
      .create({
        url: res.url,
        logo: res.logo,
      })
      .then(function (data) {
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
  })
  .put(async (req, res) => {
    await news
      .update(
        {
          url: res.data.url,
        },
        {
          where: {url: res.url},
        }
      )
      .then(function (data) {
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
  })
  .delete(async (req, res) => {
    await news
      .destroy({
        where: {url: res.url},
      })
      .then(function (info) {
        res.sendStatus(200);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      });
  });

module.exports = router;
