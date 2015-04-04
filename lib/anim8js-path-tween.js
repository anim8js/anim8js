
/**
 * [Tween description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.Tween = function(name, calculator, start, end)
{
  this.reset( name, calculator, [ start, end ] );
};

anim8.override( anim8.Tween.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
  },

  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.Tween( this.name, this.calculator, this.points[0], this.points[1] );
  }

});

/**
 * [tween description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['tween'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  var defaultValue = calc.create();
  
  return new anim8.Tween(
    path.name, 
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.end, defaultValue )
  );
};
