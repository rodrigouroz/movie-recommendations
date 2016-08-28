/**
 * Created by rodrigouroz on 28/8/16.
 */
const assert = require('assert');

describe('Get Movies', function () {

  const recommendation = require('../recommendation');
  const movies = recommendation.getMovies();

  it('should get the list of movies', function() {
    assert(movies.length);
  });

  it('should return the list ordered', function() {
    assert(movies[0].localeCompare(movies[1]) == 1);
  });
});