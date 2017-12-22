
/**
 * Instantiates a new PathPoint.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} point
 * @class PathPoint
 * @constructor
 * @extends Path
 */
function PathPoint(name, calculator, point)
{
  this.name = name;
  this.set( calculator, point );
}

Class.extend( PathPoint, Path,
{
  set: function(calculator, point)
  {
    this.reset( calculator, [point] );
  },

  compute: function(out, delta)
  {
    return this.calculator.copy( out, this.resolvePoint( 0 ) );
  },

  copy: function()
  {
    return new PathPoint( this.name, this.calculator, this.points[0] );
  }
});
