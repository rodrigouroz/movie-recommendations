// This has a closure (explain)
function intersect(array1, array2) {
  return array1.filter(function filterNotPresent(element) {
    return array2.indexOf(element) !== -1;
  });
}

// https://en.wikipedia.org/wiki/Jaccard_index
function jaccardIndex(array1, array2) {
  // calculate |array1 ^ array2| / (|array1| + |array2| - |array1 ^ array2|)
  var intersection = intersect(array1, array2);
  return intersection.length / (array1.length + array2.length - intersection.length);

}

// explain pass by reference
function calculateJaccardIndex(data) {

  for (var key in data) {
    data[key].similarities = [];
    for (var key2 in data) {
      // important! (explain)
      if (key != key2) {
        data[key].similarities.push({
          name: key2,
          score: jaccardIndex(data[key].users, data[key2].users)
        });
      }
    }
  }
}

// explain what we're doing here
function prepareDatabase(data) {

  var db = {};

  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].peliculas.length; j++) {
      var key = createKeyForMovie(data[i].peliculas[j]);
      // if the movie does not exist yet we creat it in our new db
      if (!db[key]) {
        db[key] = {
          name: data[i].peliculas[j].charAt(0).toUpperCase() + data[i].peliculas[j].slice(1),
          users: []
        }
      }
      db[key].users.push(data[i].nombre.toLowerCase());
    }
  }

  calculateJaccardIndex(db);

  return db;
}

// why does this function exist? (explain)
function createKeyForMovie(movie) {
  return movie
    .trim()
    .toLowerCase()
    .replace('á', 'a')
    .replace('é', 'e')
    .replace('í', 'i')
    .replace('ó', 'o')
    .replace('ú', 'u')
    .replace(/[^a-zA-Z0-9\-]/g, '-'); // a leap of faith
}

// this looks for recommendations that are over the desired threshold
// TODO make threshold optional
function showRecommendation(movie, threshold) {

  var movieKey = createKeyForMovie(movie);

  var similarities = [];

  if (db[movieKey]) {
    similarities = db[movieKey].similarities;
  }

  var recommendation = similarities
    .filter(function filterAboveThreshold(movie) {
      return movie.score >= threshold;
    })
    .sort(function compare(movie1, movie2) {
      return movie2.score - movie1.score;
    })
    .map(function format(movie) {
      return {
        movie: db[movie.name].name,
        score: movie.score
      }
    });

  return recommendation;
}

function showMovies() {

  var movies = [];

  for (var key in db) {
    movies.push(db[key].name);
  }

  return movies.sort(function (movie1, movie2) {
    if (movie1 > movie2) {
      return 1;
    }

    return -1;
  });

}

var data = require('./data/db.json');
// prepare database of movies
var db = prepareDatabase(data);

module.exports = {
  recommend: showRecommendation,
  getMovies: showMovies
};