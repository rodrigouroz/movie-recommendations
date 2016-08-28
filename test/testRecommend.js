/**
 * Created by rodrigouroz on 28/8/16.
 */
const assert = require('assert');

describe('Recommend Movies', function () {

  const recommendation = require('../recommendation');
  var result = recommendation.getRecommendation('Duro de matar', 0.5);

  console.log(result);

  it('should return an array', function() {
    assert(Array.isArray(result));
  });

  it('each result must be an object with the movie name and the similarity', function() {
    assert(result[0].hasOwnProperty('movie'));
    assert(result[0].hasOwnProperty('score'));
  });

  it('the array must be ordered by score', function() {
    assert(result[0].score >= result[1].score);
  });

});