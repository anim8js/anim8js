
/**
 * [CompiledPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.CompiledPath = function(name, path, pointCount)
{
  var calc = path.calculator;
  var points = [];
  
  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }
  
  this.reset( name, calc, points );
};

anim8.override( anim8.CompiledPath.prototype = new anim8.Path(),
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
    return new anim8.CompiledPath( this.name, this, this.points.length );
  }

});

/**
 * [compiled description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['compiled'] = function(path)
{
  return new anim8.CompiledPath(
    path.name,
    anim8.path( path.path ),
    path.pointCount
  );
};
