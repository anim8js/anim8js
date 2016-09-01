
/**
 * Instantiates a new PathQuadratic.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @class PathQuadratic
 * @constructor
 * @extends Path
 */
function PathQuadratic(name, calculator, p0, p1, p2)
{
  this.name = name;
  this.set( calculator, p0, p1, p2 );
}

Class.extend( PathQuadratic, Path,
{
  set: function(calculator, p0, p1, p2)
  {
    this.reset( calculator, [p0, p1, p2] );
  },

  compute: function(out, d1)
  {
    var calc = this.calculator;
    var d2 = d1 * d1;
    var i1 = 1 - d1;
    var i2 = i1 * i1;

    out = calc.copy( out, this.resolvePoint( 0 ) );
    out = calc.scale( out, i2 );
    out = calc.adds( out, this.resolvePoint( 1 ), 2 * i1 * d1 );
    out = calc.adds( out, this.resolvePoint( 2 ), d2 );

    return out;
  },

  copy: function()
  {
    return new PathQuadratic( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
  },

  isLinear: function()
  {
    return false;
  }
});
