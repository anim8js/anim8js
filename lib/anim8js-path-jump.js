
/**
 * [JumpPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.JumpPath = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.override( anim8.JumpPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.JumpPath( this.name, this.calculator, anim8.copy(this.points) );
  }

});

/**
 * [jump description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path.jump = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.JumpPath(
    path.name, 
    calc,
    path.points
  );
};

