
var anim8 = require('../build/anim8js.js');

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    this.calc = anim8.calculator('2d');

    this.attrimator = {
      attribute: 'center'
    };

    this.animator = {
      getAttribute: function(attr) {
        return {
          calculator: anim8.calculator('2d')
        };
      },
      frame: {
        center: {x: 0, y: 0}
      }
    };

    callback();
  },

  registered: function(test)
  {
    test.ok( this.calc );
    test.ok( this.calc instanceof anim8.Calculator );
    test.ok( this.calc instanceof anim8.Calculator2d );
    test.done();
  },

  parse: {

    func: function(test)
    {
      var f = function() {};

      test.strictEqual( this.calc.parse( f ), f );
      test.done();
    },

    current: function(test)
    {
      test.strictEqual( this.calc.parse( true ), anim8.computed.current );
      test.done();
    },

    number: function(test)
    {
      test.deepEqual( this.calc.parse( 0 ), {x: 0, y: 0} );
      test.done();
    },

    array: function(test)
    {
      test.deepEqual( this.calc.parse( [1, 2], this.calc.ZERO ), {x: 1, y: 2} );
      test.done();
    },

    arrayWithoutDefault: function(test)
    {
      test.throws(function() {
        test.deepEqual( this.calc.parse( [1, 2] ), {x: 1, y: 2} );
      });
      test.done();
    },

    object: function(test)
    {
      test.deepEqual( this.calc.parse( {x: 1, y: 2}, this.calc.ZERO ), {x: 1, y: 2} );
      test.deepEqual( this.calc.parse( {x: 1}, this.calc.ZERO ), {x: 1, y: 0} );
      test.deepEqual( this.calc.parse( {y: 2}, this.calc.ZERO ), {x: 0, y: 2} );
      test.deepEqual( this.calc.parse( {x: '1', y: '2'}, this.calc.ZERO ), {x: 1, y: 2} );
      test.done();
    },

    relativeObject: function(test)
    {
      var $relative = this.calc.parse( {x: 1, y: '-2'}, this.calc.ZERO );

      test.ok( anim8.isFunction( $relative ) );

      this.animator.frame.center = {x: 5, y: 2};

      var amt = $relative( this.attrimator, this.animator );

      test.notDeepEqual( amt, this.animator.frame.center );
      test.deepEqual( amt, {x: 1, y: 0} );
      test.done();
    },

    relativeString: function(test)
    {
      var $relative = this.calc.parse( '-2', this.calc.ZERO );

      test.ok( anim8.isFunction( $relative ) );

      this.animator.frame.center = {x: 5, y: 4};

      var amt = $relative( this.attrimator, this.animator );

      test.notDeepEqual( amt, this.animator.frame.center );
      test.deepEqual( amt, {x: 3, y: 2} );
      test.done();
    },

    aliases: function(test)
    {
      test.deepEqual( this.calc.parse('left'), {x: 0, y: 0} );
      test.deepEqual( this.calc.parse('right'), {x: 100, y: 100} );
      test.deepEqual( this.calc.parse('center'), {x: 50, y: 50} );
      test.deepEqual( this.calc.parse('right center'), {x: 100, y: 50} );
      test.deepEqual( this.calc.parse('middle bottom'), {x: 50, y: 100} );
      test.done();
    },

    defaultValue: function(test)
    {
      test.deepEqual( this.calc.parse( undefined, this.calc.ZERO ), {x: 0, y: 0} );
      test.notStrictEqual( this.calc.parse( undefined, this.calc.ZERO ), this.calc.ZERO );
      test.done();
    },

    nothing: function(test)
    {
      test.strictEqual( this.calc.parse(), false );
      test.done();
    }
  },

  copy: function(test)
  {
    var x = {x: 3, y: 5};
    var out = {};
    var result = this.calc.copy( out, x );

    test.strictEqual( out, result );
    test.notStrictEqual( out, x );
    test.deepEqual( x, out );
    test.done();
  },

  create: function(test)
  {
    var x = this.calc.create();

    test.strictEqual( x.x, 0 );
    test.strictEqual( x.y, 0 );
    test.deepEqual( x, {x: 0, y: 0} );
    test.done();
  },

  zero: function(test)
  {
    var out = {};
    var result = this.calc.zero( out );

    test.strictEqual( out, result );
    test.deepEqual( result, {x: 0, y: 0} );
    test.done();
  },

  adds: function(test)
  {
    var b = {x: 10, y: 10};
    var d = {x: 5, y: -5};

    test.deepEqual( this.calc.adds( {x: 2, y: 4}, {x: 1, y: 2}, 1 ), {x: 3, y: 6} );
    test.deepEqual( this.calc.adds( {x: 2, y: 4}, {x: 1, y: 2}, 0 ), {x: 2, y: 4} );
    test.deepEqual( this.calc.adds( {x: 2, y: 4}, {x: 1, y: 2},-1 ), {x: 1, y: 2} );
    test.done();
  },

};
