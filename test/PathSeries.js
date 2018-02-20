
var anim8 = require('../build/anim8js.js');

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    callback();
  },

  /**
   * Example test
   */
  parse: function(test)
  {
    var path = anim8.path({type: 'series', points: [0, 2, 8]});

    test.ok( path instanceof anim8.PathSeries );
    test.strictEqual( path.compute(0, 0), 0 );
    test.strictEqual( path.compute(0, 0.25), 1 );
    test.strictEqual( path.compute(0, 0.5), 2 );
    test.strictEqual( path.compute(0, 0.75), 5 );
    test.strictEqual( path.compute(0, 1.0), 8 );

    test.done();
  },

  tricky: function(test)
  {
    var path = anim8.path({
      type: 'series',
      series: [-1000, 500, 4000],
      points: [10, 40, 5]
    });

    test.ok( path instanceof anim8.PathSeries );
    test.strictEqual( path.compute(0, -1000), 10 );
    test.strictEqual( path.compute(0, 500), 40 );
    test.strictEqual( path.compute(0, 4000), 5 );
    test.strictEqual( path.compute(0, 0), 30 );
    test.strictEqual( path.compute(0, 2000), 25 );

    test.done();
  }

};
