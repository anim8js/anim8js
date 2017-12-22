
var anim8 = require('../build/anim8js.js');

var OBJECT = anim8.Factories['object'];
var DEFAULT = anim8.Factories['default'];
var FAKE = {is: function(){return false;}};

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
  none: function(test)
  {
    var none = anim8.factory();

    test.strictEqual( none, OBJECT );

    test.done();
  },

  forObject: function(test)
  {
    anim8.Factories['default'] = FAKE;

    var none = anim8.factory();

    test.strictEqual( none, FAKE );

    var subject = {
      x: 0
    };
    var animator = anim8(subject);
    animator.play({
      point: {
        x: function() {
          return 1
        }
      }
    });
    animator.applyInitialState();

    test.equal( animator.frame.x, 1 );

    animator.stop();
    anim8.Factories['default'] = DEFAULT;

    test.done();
  }

};
