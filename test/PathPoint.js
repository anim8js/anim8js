
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
    var path = anim8.path({type: 'point', point: 5});

    test.ok( path instanceof anim8.PathPoint );
    test.strictEqual( path.resolvePoint(0), 5 );

    test.done();
  },

  live: function(test)
  {
    var path = anim8.path({
      type: 'point',
      point: function(i, dt) {
        return dt;
      }
    });

    test.strictEqual( path.compute(0, 0.25), 0.25 );
    
    test.done();
  }

};
