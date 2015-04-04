
/**
 * [PointPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.PointPath = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.override( anim8.PointPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    return this.calculator.copy( out, this.resolvePoint( 0 ) );
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.PointPath( this.name, this.calculator, this.points[0] );
  }

});

/**
 * [point description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['point'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PointPath(
    path.name,
    calc,
    calc.parse( path.point )
  );
};
