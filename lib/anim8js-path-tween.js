
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
anim8.Tween = function(name, calculator, start, end)
{
  this.reset( name, calculator, [ start, end ] );
};

anim8.override( anim8.Tween.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
  },
  copy: function() 
  {
    return new anim8.Tween( this.name, this.calculator, this.points[0], this.points[1] );
  }
});


/**
 * Parses an object for a tween path.
 * 
 * @param {Object} path
 * @return {Tween}
 */
anim8.path['tween'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.Tween(
    path.name, 
    calc,
    calc.parse( path.start, calc.ZERO ),
    calc.parse( path.end, calc.ZERO )
  );
};
