
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

  /**
   * Example test
   */
  scale: function(test)
  {
    test.expect(3);

    var quad1 = anim8.easing( 'quad' );
    var quad2 = anim8.easing( 'quad*1.5' );
    var quad3 = anim8.easing( 'quad*0' );

    var r1 = quad1(0.4);
    var r2 = quad2(0.4);
    var r3 = quad3(0.4);

    test.ok( eqe( r1, 0.4 * 0.4 ), 'r1=' + r1 );
    test.ok( eqe( r2, 0.04 ), 'r2=' + r2 );
    test.ok( eqe( r3, 0.4 ), 'r3=' + r3 );

    test.done();
  }

};
