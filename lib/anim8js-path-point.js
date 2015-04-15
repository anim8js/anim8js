
/**
 * Instantiates a new PathPoint.
 * 
 * @param {String|false} name
 * @param {anim8.Calculator} calculator
 * @param {T} point
 */
anim8.PathPoint = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.override( anim8.PathPoint.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    return this.calculator.copy( out, this.resolvePoint( 0 ) );
  },
  copy: function() 
  {
    return new anim8.PathPoint( this.name, this.calculator, this.points[0] );
  }
});


/**
 * Parses an object for a point path.
 * 
 * @param {Object} path
 * @return {anim8.PathPoint}
 */
anim8.path['point'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PathPoint(
    path.name,
    calc,
    calc.parse( path.point )
  );
};
