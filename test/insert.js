
var anim8 = require('../build/anim8js.js');

function tick(animator, time) {
  animator.preupdate( time );
  animator.update( time );
  animator.apply();
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
  insert: function(test)
  {
    var subject = {
      x: 0,
      y: 0
    };

    /*
     TIMELINES
       0.0   0.5   1.0   1.5   2.0   2.5   3.0   3.5   4.0   4.5
     UNINTERRUPTED
    x   0     1     2     3    4/0    1     2     3    4/0    1
    y   0    -1   -2/0   -1   -2/0   -1   -2/0   -1   -2/0   -1
     INSERT
    x              -4    -3    -2
    y               6     7     8
     MERGED
    x   0     1    -4    -3    -2     1     2     3    4      4
    y   0    -1     6     7     8   -2/0   -1   -2/0   -1   -2/0
     */

    var animator = anim8( subject );
    animator.tweenTo( 'x', 4, '2s linear' );
    animator.tweenTo( 'y', -2, '1s inf linear' );

    tick( animator, 0 );
    tick( animator, 500 );

    test.equal( subject.x, 1 );
    test.equal( subject.y, -1 );

    animator.insert({
      values: {
        x: [-4, -2],
        y: [6, 8]
      }
    }, '1s linear');

    tick( animator, 1000 );
    tick( animator, 1500 );

    test.equal( subject.x, -3 );
    test.equal( subject.y, 7 );

    tick( animator, 2000 );

    test.equal( subject.x, -2 );
    test.equal( subject.y, 8 );

    tick( animator, 2500 );

    test.equal( subject.x, 1 );
    test.equal( subject.y, -1 );

    tick( animator, 3000 );

    test.equal( subject.x, 2 );
    test.equal( subject.y, 0 );

    tick( animator, 3500 );

    test.equal( subject.x, 3 );
    test.equal( subject.y, -1 );

    tick( animator, 4000 );

    test.equal( subject.x, 4 );
    test.equal( subject.y, 0 );

    // infinite Y still going

    animator.nopeat();

    tick( animator, 4500 );

    // final values

    test.equal( subject.x, 4 );
    test.equal( subject.y, -2 );

    animator.stop();

    test.done();
  }

};
