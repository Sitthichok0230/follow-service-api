const express = require('express');
const router = express.Router();
// var formidable = require('formidable');
// var multer = require('multer');
var fs = require('fs');
request = require('request');
const db = require('../db/index.js');
const {news} = db;
db.sequelize.sync();

router
  .route('/news')
  .all((req, res, next) => {
    const url = req.query.url;
    const data = req.body;
    res.url = url;
    res.data = data;
    next();
  })
  .get(async (req, res) => {
    if (res.url) {
      await news
        .findOne({where: {url: res.url}})
        .then(function (data) {
          if (data) {
            res.json({data: data});
          } else {
            res.send();
          }
        })
        .catch(function (err) {
          res.status(err.status || 500);
          res.render('error');
        });
    } else {
      await news
        .findAll({
          attributes: ['url', 'logo', 'createdAt', 'updatedAt'],
          order: [['createdAt']],
        })
        .then(function (data) {
          if (data) {
            res.json({data: data});
          } else {
            res.send();
          }
        })
        .catch(function (err) {
          res.status(err.status || 500);
          res.render('error');
        });
    }
  })
  .post(async (req, res) => {
    await news
      .create({
        url: res.data.url,
        logo: res.data.logo,
      })
      .then(function (info) {
        res.send();
      })
      .catch(function (err) {
        res.status(err.status || 500);
        res.render('error');
      });
  })
  .put(async (req, res) => {
    await news
      .update(
        {
          url: res.data.url,
          logo: res.data.logo,
        },
        {
          where: {url: res.url},
        }
      )
      .then(function (data) {
        res.send();
      })
      .catch(function (err) {
        res.status(err.status || 500);
        res.render('error');
      });
  })
  .delete(async (req, res) => {
    await news
      .destroy({
        where: {url: res.url},
      })
      .then(function (info) {
        res.send();
      })
      .catch(function (err) {
        res.status(err.status || 500);
        res.render('error');
      });
  });

module.exports = router;
