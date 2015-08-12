
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
anim8.PathJump = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.override( anim8.PathJump.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },
  copy: function() 
  {
    return new anim8.PathJump( this.name, this.calculator, anim8.copy(this.points) );
  }
});

/**
 * Parses an object for a jump path.
 * 
 * @param {Object} path
 * @return {PathJump}
 */
anim8.path['jump'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[ i ], defaultValue );
  }
  
  return new anim8.PathJump(
    path.name, 
    calc,
    path.points
  );
};

