
var anim8 = require('../build/anim8js.js');

function eqe(a, b)
{
  return Math.abs( a - b ) < 0.0001;
}

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    callback();
  },

  nochange: function(test)
  {
    test.expect(1);

    test.deepEqual(
      anim8.deltas([0, 0.3, 1]),
      [0, 0.3, 1]
    );

    test.done();
  },

  newmax: function(test)
  {
    test.expect(1);

    test.deepEqual(
      anim8.deltas([0, 0.5, 2]),
      [0, 0.25, 1]
    );

    test.done();
  },

  newmin: function(test)
  {
    test.expect(1);

    test.deepEqual(
      anim8.deltas([-1, 0, 1]),
      [0, 0.5, 1]
    );

    test.done();
  },

  allover: function(test)
  {
    test.expect(2);

    test.deepEqual(
      anim8.deltas([3, 4, 5]),
      [0, 0.5, 1]
    );

    test.deepEqual(
      anim8.deltas([-5, -4, -3]),
      [0, 0.5, 1]
    );

    test.done();
  }

};
