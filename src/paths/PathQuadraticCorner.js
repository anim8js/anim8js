
/**
 * Instantiates a new PathQuadraticCorner.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Number} midpoint
 * @param {Boolean} loop
 * @class PathQuadraticCorner
 * @constructor
 * @extends Path
 */
function PathQuadraticCorner(name, calculator, points, midpoint, loop)
{
  this.name = name;
  this.set( calculator, points, midpoint, loop );
}

Class.extend( PathQuadraticCorner, Path,
{
  set: function(calculator, points, midpoint, loop)
  {
    this.reset( calculator, points );
    this.midpoint = midpoint;
    this.loop = loop;
    this.temp0 = calculator.create();
    this.temp1 = calculator.create();
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var temp0 = this.temp0;
    var temp1 = this.temp1;
    var midpoint = this.midpoint;
    var negmidpoint = 1.0 - midpoint;
    var halfmidpoint = midpoint * 0.5;
    var n = this.points.length - (this.loops ? 0 : 1);
    var a = delta * n;
    var i = clamp( Math.floor( a ), 0, n - 1 );
    var d = a - i;

    var p0 = this.resolvePoint( i - 1 );
    var p1 = this.resolvePoint( i );
    var p2 = this.resolvePoint( i + 1 );
    var p3 = this.resolvePoint( i + 2 );

    if ( d < midpoint )
    {
      d = (d / midpoint);
      temp0 = calc.interpolate( temp0, p0, p1, d * halfmidpoint + negmidpoint + halfmidpoint );
      temp1 = calc.interpolate( temp1, p1, p2, d * halfmidpoint + halfmidpoint );
      p1 = temp0;
      p2 = temp1;
      d = d * 0.5 + 0.5;
    }
    else if ( d > negmidpoint )
    {
      d = (d - negmidpoint) / midpoint;
      temp0 = calc.interpolate( temp0, p1, p2, d * halfmidpoint + negmidpoint );
      temp1 = calc.interpolate( temp1, p2, p3, d * halfmidpoint );
      p1 = temp0;
      p2 = temp1;
      d = d * 0.5;
    }

    out = calc.interpolate( out, p1, p2, d );

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
    return new PathQuadraticCorner( this.name, this.calculator, copy(this.points), this.midpoint, this.loop );
  },

  isLinear: function()
  {
    return false;
  }
});
