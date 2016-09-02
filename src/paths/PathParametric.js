
/**
 * Instantiates a new PathParametric.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @param {Array} matrix
 * @param {Number} weight
 * @class PathParametric
 * @constructor
 * @extends Path
 */
function PathParametric(name, calculator, points, loop, matrix, weight)
{
  this.name = name;
  this.set( calculator, points, loop, matrix, weight );
}

Class.extend( PathParametric, Path,
{
  set: function(calculator, points, loop, matrix, weight)
  {
    this.reset( calculator, points );
    this.loop = loop;
    this.matrix = matrix;
    this.weight = weight;
    this.temp = calculator.create();
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var temp = this.temp;
    var matrix = this.matrix;
    var n = this.points.length;
    var a = delta * n;
    var i = clamp( Math.floor( a ), 0, n - 1 );
    var d = a - i;

    var p0 = this.resolvePoint( i - 1 );
    var p1 = this.resolvePoint( i );
    var p2 = this.resolvePoint( i + 1 );
    var p3 = this.resolvePoint( i + 2 );

    var d0 = 1;
    var d1 = d;
    var d2 = d * d1;
    var d3 = d * d2;

    out = calc.zero( out );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[0][0] );
    temp = calc.adds( temp, p1, matrix[0][1] );
    temp = calc.adds( temp, p2, matrix[0][2] );
    temp = calc.adds( temp, p3, matrix[0][3] );
    out = calc.adds( out, temp, d0 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[1][0] );
    temp = calc.adds( temp, p1, matrix[1][1] );
    temp = calc.adds( temp, p2, matrix[1][2] );
    temp = calc.adds( temp, p3, matrix[1][3] );
    out = calc.adds( out, temp, d1 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[2][0] );
    temp = calc.adds( temp, p1, matrix[2][1] );
    temp = calc.adds( temp, p2, matrix[2][2] );
    temp = calc.adds( temp, p3, matrix[2][3] );
    out = calc.adds( out, temp, d2 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[3][0] );
    temp = calc.adds( temp, p1, matrix[3][1] );
    temp = calc.adds( temp, p2, matrix[3][2] );
    temp = calc.adds( temp, p3, matrix[3][3] );
    out = calc.adds( out, temp, d3 );

    out = calc.scale( out, this.weight );

    return out;
  },

  resolvePoint: function(i)
  {
    var points = this.points;
    var n = points.length;
    var k = (this.loops ? (i + n) % n : clamp( i, 0, n - 1 ));

    return resolve( points[ k ] );
  },

  copy: function()
  {
    return new PathParametric( this.name, this.calculator, copy(this.points), this.loop, this.matrix, this.weight );
  },

  isLinear: function()
  {
    return false;
  }
});
