
var anim8 = require('../build/anim8js.js');

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    this.variable = 1; // accessible in any test

    callback();
  },

  parameters: function(test)
  {
    anim8.save('rotateTo', {
      values: {
        rotate: [ true, anim8.param('angle') ]
      }
    });

    var attrs = anim8.attrimatorsFor('rotateTo angle=32 1s linear');
    var attrRotate = attrs.get('rotate');

    var animator = {
      frame: {
        rotate: 5
      },
      getAttribute: function(attr) {
        return {
          calculator: anim8.calculator(),
          parse: function(value) {
            return anim8.calculator().parse( value );
          }
        };
      }
    };

    attrRotate.start( 0, animator );

    test.strictEqual( attrRotate.valueAt( 0 ), 5 );
    test.strictEqual( attrRotate.valueAt( 500 ), 18.5 );
    test.strictEqual( attrRotate.valueAt( 1000 ), 32 );
    test.deepEqual( attrRotate.path.points, [5, 32] );
    test.done();
  }

};
