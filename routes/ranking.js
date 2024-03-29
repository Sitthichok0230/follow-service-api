const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDISCLOUD_URL });
const express = require('express');
const router = express.Router();
const db = require('../db/index.js');
const { ranking } = db;
db.sequelize.sync();

router.route('/ranking/clear-cache').get(async (req, res) => {
  redisClient.flushdb();
  res.send('cache cleared');
});

router
  .route('/ranking/:word?')
  .all((req, res, next) => {
    const word = req.params.word;
    res.word = word;
    next();
  })
  .get(async (req, res) => {
    if (res.word) {
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
          res.status(err.status || 500);
          res.render('error');
        });
    } else {
      const config = req.query.all;
      if (config) {
        rankingData = await ranking
          .findAll({
            order: [['score', 'DESC']],
          })
          .then(function (rankingData) {
            res.json({ data: rankingData });
          })
          .catch(function (err) {
            res.status(err.status || 500);
            res.render('error');
          });
      } else {
        redisClient.get('ranking', async (err, data) => {
          if (err) {
            res.status(err.status || 500);
            res.render('error');
          } else {
            if (data) {
              res.json({ data: JSON.parse(data) });
            } else {
              rankingData = await ranking
                .findAll({
                  limit: 100,
                  order: [['score', 'DESC']],
                })
                .then(function (rankingData) {
                  rankingData = rankingData.map((item) => item.word);
                  redisClient.setex(
                    'ranking',
                    1 * 60,
                    JSON.stringify(rankingData)
                  );
                  res.json({ data: rankingData });
                })
                .catch(function (err) {
                  res.status(err.status || 500);
                  res.render('error');
                });
            }
          }
        });
      }
    }
  })
  .put(async (req, res) => {
    word = await ranking.findOne({
      attributes: ['score'],
      where: { word: res.word },
    });
    if (word) {
      await ranking
        .update(
          {
            score: word.score + 1,
          },
          {
            where: { word: res.word },
          }
        )
        .then(function (data) {
          res.sendStatus(200);
        })
        .catch(function (err) {
          res.status(err.status || 500);
          res.render('error');
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
          res.status(err.status || 500);
          res.render('error');
        });
    }
  });

module.exports = router;
