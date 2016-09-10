
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
  parameters: function(test)
  {
    var opts = anim8.options( '~1s 2s x3 z4s linear a=1 b=2');

    test.deepEqual( opts, {
      delay: 1000,
      duration: 2000,
      repeat: 3,
      sleep: 4000,
      easing: anim8.Easings.linear,
      parameters: {
        a: '1',
        b: '2'
      }
    });

    test.done();
  }

};
