
/**
 * Instantiates a new PathJump.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathJump
 * @constructor
 * @extends Path
 */
function PathJump(name, calculator, points)
{
  this.name = name;
  this.set( calculator, points );
}

Class.extend( PathJump, Path,
{
  set: function(calculator, points)
  {
    this.reset( calculator, points );
  },

  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );

    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  copy: function()
  {
    return new PathJump( this.name, this.calculator, copy(this.points) );
  }
});
