
/**
 * Instantiates a new PointPath.
 * 
 * @param {String|false} name
 * @param {anim8.Calculator} calculator
 * @param {T} point
 */
anim8.PointPath = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.override( anim8.PointPath.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    return this.calculator.copy( out, this.resolvePoint( 0 ) );
  },
  copy: function() 
  {
    return new anim8.PointPath( this.name, this.calculator, this.points[0] );
  }
});


/**
 * Parses an object for a point path.
 * 
 * @param {Object} path
 * @return {anim8.PointPath}
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
