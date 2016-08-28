
/**
 * Instantiates a new Tween.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} start
 * @param {T} end
 * @class Tween
 * @constructor
 * @extends Path
 */
function Tween(name, calculator, start, end)
{
  this.name = name;
  this.set( calculator, start, end );
}

Class.extend( Tween, Path,
{
  set: function(calculator, start, end)
  {
    this.reset( calculator, [ start, end ] );
  },

  compute: function(out, delta)
  {
    return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
  },

  copy: function()
  {
    return new Tween( this.name, this.calculator, this.points[0], this.points[1] );
  }
});
