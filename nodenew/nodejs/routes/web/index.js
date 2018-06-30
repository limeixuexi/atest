
const express = require('express');
const MongoClient = require('mongodb').MongoClient,
    test = require('assert');
  var url = 'mongodb://localhost:27017/node_db';
  var router = express.Router();
  
  router.get('/', (req, res, next) => {
    MongoClient.connect(url, function (err, db) {
      var col = db.collection('articles');
      col.find({}).sort({_id:-1}).limit(6).toArray(function (err, data) {
        if (err) {
          console.log('database error');
        } else {
          res.articles = data;
          db.close();
          next();
        }
      });
    });
  });
  router.get('/', (req, res, next) => {
    res.render('index.ejs', { articles: res.articles });
  });
  

  module.exports = router;
