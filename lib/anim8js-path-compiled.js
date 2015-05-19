
/**
 * Instantiates a new PathCompiled.
 * 
 * @param {String|false} name
 * @param {Path} path
 * @param {Number} pointCount
 * @class PathCompiled
 * @constructor
 * @extends Path
 */
anim8.PathCompiled = function(name, path, pointCount)
{
  var calc = path.calculator;
  var points = [];
  
  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }
  
  this.reset( name, calc, points );
};

anim8.override( anim8.PathCompiled.prototype = new anim8.Path(),
{
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },
  copy: function() 
  {
    return new anim8.PathCompiled( this.name, this, this.points.length );
  }
});

/**
 * Parses an object for a compiled path.
 * 
 * @param {Object} path
 * @return {PathCompiled}
 */
anim8.path['compiled'] = function(path)
{
  return new anim8.PathCompiled(
    path.name,
    anim8.path( path.path ),
    path.pointCount
  );
};
