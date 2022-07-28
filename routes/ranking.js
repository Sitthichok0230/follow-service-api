const redis = require('redis');
const redisClient = redis.createClient({url: process.env.REDISCLOUD_URL});
const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const {ranking} = db;
db.sequelize.sync();

router.route('/cacheclear').get(async (req, res) => {
  redisClient.flushdb();
  res.send('OK');
});

router.route('/ranking?').get(async (req, res) => {
  redisClient.get('ranking', async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        res.json({data: JSON.parse(data)});
      } else {
        rankingData = await ranking.findAll({
          limit: 100,
          order: [['score', 'DESC']],
        });
        rankingData = rankingData.map((item) => item.word);
        redisClient.setex('ranking', 60 * 60, JSON.stringify(rankingData));
        res.json({data: rankingData});
      }
    }
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
      .then(function (data) {
        if (!data) {
          res.send();
        } else {
          res.send(data);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  })
  .put(async (req, res) => {
    word = await ranking.findOne({
      attributes: ['score'],
      where: {word: res.word},
    });
    if (word) {
      await ranking
        .update(
          {
            score: word.score + 1,
          },
          {
            where: {word: res.word},
          }
        )
        .then(function (data) {
          res.sendStatus(200);
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      await ranking
        .create({
          word: res.word,
          score: 1,
        })
        .then(function (data) {
          res.sendStatus(200);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  });

module.exports = router;
