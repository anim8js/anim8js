
/**
 * Instantiates a new JumpPath.
 * 
 * @param {String|false} name
 * @param {anim8.Calculator} calculator
 * @param {Array} points
 */
anim8.JumpPath = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.override( anim8.JumpPath.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },
  copy: function() 
  {
    return new anim8.JumpPath( this.name, this.calculator, anim8.copy(this.points) );
  }
});

/**
 * Parses an object for a jump path.
 * 
 * @param {Object} path
 * @return {anim8.JumpPath}
 */
anim8.path['jump'] = function(path)
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

