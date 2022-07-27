const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const {ranking} = db;
db.sequelize.sync();

router
  .route('/ranking?')
  .get(async (req, res) => {
    await ranking
      .findAll()
      .then(function (info) {
        res.json({
          status: 200,
          data: info,
        });
      })
      .catch(function (err) {
        res.json({error: err});
      });
  })
  .post(async (req, res) => {
    const data = req.body.data;
    await ranking
      .create({
        word: data.word,
        count: data.count,
        datetime: data.datetime,
      })
      .then(function (info) {
        res.json({
          status: 200,
        });
      })
      .catch(function (err) {
        res.json({error: err});
      });
  });

router
  .route('/ranking/:word')
  .all((req, res, next) => {
    const word = req.params.word;
    res.word = word;
    next();
  })
  .get(async (req, res) => {
    await ranking
      .findByPk(res.word)
      .then(function (info) {
        res.json({
          status: 200,
          data: info,
        });
      })
      .catch(function (err) {
        res.json({error: err});
      });
  })
  .put(async (req, res) => {
    word = await ranking.findOne({
      attributes: ['count'],
      where: {word: res.word},
    });
    await ranking
      .update(
        {
          count: word.count + 1,
          datetime: Date.now(),
        },
        {
          where: {word: res.word},
        }
      )
      .then(function (info) {
        res.json({
          status: 200,
        });
      })
      .catch(function (err) {
        res.json({error: err});
      });
  });

module.exports = router;
