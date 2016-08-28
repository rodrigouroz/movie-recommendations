/**
 * Created by rodrigouroz on 28/8/16.
 */
const express = require('express');
const app = express();
const recommendation = require('./recommendation');

app.set('port', (process.env.PORT || 5000));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.json([
    '/getMovies',
    '/getRecommendation'
  ]);
});

app.get('/getMovies', function (req, res) {
  res.json(recommendation.getMovies());
});

app.get('/getRecommendation', function (req, res) {

  if (!req.query.hasOwnProperty('movie') || !req.query.hasOwnProperty('threshold')) {
    res.status(409).json({
      error: 'Parameters "movie" and "threshold" are mandatory'
    });
  } else if (req.query.threshold < 0 || req.query.threshold > 1) {
    res.status(409).json({
      error: 'Parameter "threshold" must be a number between 0 and 1'
    });
  } else {
    res.json(recommendation.getRecommendation(req.query.movie, req.query.threshold));
  }

});

app.listen(app.get('port'), function () {
  console.log('Movie Recommendations API running');
});