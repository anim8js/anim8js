
var anim8 = require('../build/anim8js.js');

module.exports = {

  /**
   * Prepare for all tests in this file
   */
  setUp: function(callback)
  {
    var calc = anim8.calculator('number');
    var calc2d = anim8.calculator('2d');

    this.attrimator = {
      attribute: 'rotate',
      parameters: {}
    };

    this.animator = {
      getAttribute: function(attr) {
        return {
          calculator: calc,
          parse: function(value) {
            return calc.parse( value, calc.ZERO );
          }
        };
      }
    };

    this.attrimator2d = {
      attribute: 'center',
      parameters: {}
    };

    this.animator2d = {
      getAttribute: function(attr) {
        return {
          calculator: calc2d,
          parse: function(value) {
            return calc2d.parse( value, calc.ZERO );
          }
        };
      }
    };

    callback();
  },

  param: function(test)
  {
    var $param = anim8.param( 'angle' );

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), 23 );
    test.done();
  },

  param2d: function(test)
  {
    var $param = anim8.param( 'point' );

    this.attrimator2d.parameters.point = [2, -3];

    test.deepEqual( $param(this.attrimator2d, this.animator2d), {x: 2, y: -3} );
    test.done();
  },

  add: function(test)
  {
    var $param = anim8.param( 'angle' ).add( 10 );

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), 33 );
    test.done();
  },

  add2d: function(test)
  {
    var $param = anim8.param( 'point' ).add( [1, 2] );

    this.attrimator2d.parameters.point = '0,8';

    test.deepEqual( $param(this.attrimator2d, this.animator2d), {x: 1, y: 10} );
    test.done();
  },

  sub: function(test)
  {
    var $param = anim8.param( 'angle' ).sub( 10 );

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), 13 );
    test.done();
  },

  sub2d: function(test)
  {
    var $param = anim8.param( 'point' ).sub( [1, 2] );

    this.attrimator2d.parameters.point = '0,8';

    test.deepEqual( $param(this.attrimator2d, this.animator2d), {x: -1, y: 6} );
    test.done();
  },

  mul: function(test)
  {
    var $param = anim8.param( 'angle' ).mul( 0.5 );

    this.attrimator.parameters.angle = 22;

    test.strictEqual( $param(this.attrimator, this.animator), 11 );
    test.done();
  },

  div: function(test)
  {
    var $param = anim8.param( 'angle' ).div( 4 );

    this.attrimator.parameters.angle = 36;

    test.strictEqual( $param(this.attrimator, this.animator), 9 );
    test.done();
  },

  scale: function(test)
  {
    var $param = anim8.param( 'angle' ).scale( 0.25 );

    this.attrimator.parameters.angle = 36;

    test.strictEqual( $param(this.attrimator, this.animator), 9 );
    test.done();
  },

  adds: function(test)
  {
    var $param = anim8.param( 'angle' ).adds( 10, 0.5 );

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), 28 );
    test.done();
  },

  addsScalar: function(test)
  {
    var $param = anim8.param( 'angle' ).adds( 10, anim8.param( 'scale' ) );

    this.attrimator.parameters.angle = 23;
    this.attrimator.parameters.scale = 0.5;

    test.strictEqual( $param(this.attrimator, this.animator), 28 );
    test.done();
  },

  abs: function(test)
  {
    var $param = anim8.param( 'angle' ).abs();

    this.attrimator.parameters.angle = -23;

    test.strictEqual( $param(this.attrimator, this.animator), 23 );
    test.done();
  },

  neg: function(test)
  {
    var $param = anim8.param( 'angle' ).neg();

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), -23 );
    test.done();
  },

  sqrt: function(test)
  {
    var $param = anim8.param( 'angle' ).sqrt();

    this.attrimator.parameters.angle = 16;

    test.strictEqual( $param(this.attrimator, this.animator), 4 );
    test.done();
  },

  minThis: function(test)
  {
    var $param = anim8.param( 'angle' ).min( 23 );

    this.attrimator.parameters.angle = 16;

    test.strictEqual( $param(this.attrimator, this.animator), 16 );
    test.done();
  },

  minThat: function(test)
  {
    var $param = anim8.param( 'angle' ).min( 5 );

    this.attrimator.parameters.angle = 16;

    test.strictEqual( $param(this.attrimator, this.animator), 5 );
    test.done();
  },

  maxThis: function(test)
  {
    var $param = anim8.param( 'angle' ).max( 5 );

    this.attrimator.parameters.angle = 16;

    test.strictEqual( $param(this.attrimator, this.animator), 16 );
    test.done();
  },

  maxThat: function(test)
  {
    var $param = anim8.param( 'angle' ).max( 23 );

    this.attrimator.parameters.angle = 16;

    test.strictEqual( $param(this.attrimator, this.animator), 23 );
    test.done();
  },

  floor: function(test)
  {
    var $param = anim8.param( 'angle' ).floor();

    this.attrimator.parameters.angle = 3.9;

    test.strictEqual( $param(this.attrimator, this.animator), 3 );
    test.done();
  },

  ceil: function(test)
  {
    var $param = anim8.param( 'angle' ).ceil();

    this.attrimator.parameters.angle = 3.1;

    test.strictEqual( $param(this.attrimator, this.animator), 4 );
    test.done();
  },

  roundUp: function(test)
  {
    var $param = anim8.param( 'angle' ).round();

    this.attrimator.parameters.angle = 3.5;

    test.strictEqual( $param(this.attrimator, this.animator), 4 );
    test.done();
  },

  roundDown: function(test)
  {
    var $param = anim8.param( 'angle' ).round();

    this.attrimator.parameters.angle = 3.4999;

    test.strictEqual( $param(this.attrimator, this.animator), 3 );
    test.done();
  },

  truncate: function(test)
  {
    var $param = anim8.param( 'angle' ).truncate(100);

    this.attrimator.parameters.angle = 3.4999;

    test.strictEqual( $param(this.attrimator, this.animator), 3.49 );
    test.done();
  },

  truncate: function(test)
  {
    var $param = anim8.param( 'angle' ).mod(0.25).truncate(100);

    this.attrimator.parameters.angle = 3.49;

    test.strictEqual( $param(this.attrimator, this.animator), 0.24 );
    test.done();
  },

  toDegrees: function(test)
  {
    var $param = anim8.param( 'angle' ).toDegrees().round();

    this.attrimator.parameters.angle = 3.141592;

    test.strictEqual( $param(this.attrimator, this.animator), 180 );
    test.done();
  },

  toRadians: function(test)
  {
    var $param = anim8.param( 'angle' ).toRadians().truncate(100);

    this.attrimator.parameters.angle = 180;

    test.strictEqual( $param(this.attrimator, this.animator), 3.14 );
    test.done();
  },

  cos: function(test)
  {
    var $param = anim8.param( 'angle' ).cos().round();

    this.attrimator.parameters.angle = 3.141592;

    test.strictEqual( $param(this.attrimator, this.animator), -1 );
    test.done();
  },

  cosDegrees: function(test)
  {
    var $param = anim8.param( 'angle' ).cosDegrees();

    this.attrimator.parameters.angle = 180;

    test.strictEqual( $param(this.attrimator, this.animator), -1 );
    test.done();
  },

  distance: function(test)
  {
    var $param = anim8.param( 'angle' ).distance( 100 );

    this.attrimator.parameters.angle = 180;

    test.strictEqual( $param(this.attrimator, this.animator), 80 );
    test.done();
  },

  property: function(test)
  {
    var $param = anim8.param( 'point' ).property( 'x' );

    this.attrimator2d.parameters.point = [3, 4];

    test.strictEqual( $param(this.attrimator2d, this.animator2d), 3 );
    test.done();
  },

  vector: function(test)
  {
    var $param = anim8.param( 'angle' ).vector().round();

    this.attrimator.parameters.angle = Math.PI;

    test.deepEqual( $param(this.attrimator, this.animator), {x: -1, y: 0} );
    test.done();
  },

  vectorDegrees: function(test)
  {
    var $param = anim8.param( 'angle' ).vectorDegrees().round();

    this.attrimator.parameters.angle = 90;

    test.deepEqual( $param(this.attrimator, this.animator), {x: 0, y: 1} );
    test.done();
  },

  combo1: function(test)
  {
    var $param = anim8.param( 'angle' ).sub( 10 ).add( 5 );

    this.attrimator.parameters.angle = 23;

    test.strictEqual( $param(this.attrimator, this.animator), 18 );
    test.done();
  },

  combo2: function(test)
  {
    var $param = anim8.param( 'distance' ).mul( anim8.param( 'angle' ).cosDegrees() );

    this.attrimator.parameters.angle = 32;
    this.attrimator.parameters.distance = 100;

    test.strictEqual( $param(this.attrimator, this.animator), 84.8048096156426 );
    test.done();
  }

};
