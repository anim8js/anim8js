
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
function PathCompiled(name, path, pointCount)
{
  this.name = name;
  this.set( path, pointCount );
}

Class.extend( PathCompiled, Path,
{
  set: function(path, pointCount)
  {
    var calc = path.calculator;
    var compiled = PathCompiled.compile( calc, path, pointCount );

    this.reset( calc, compiled );
    this.path = path;
    this.pointCount = pointCount;
  },

  compute: function(out, delta)
  {
    var n = this.points.length;
    var a = Math.floor( delta * n );
    var index = Math.min( a, n - 1 );

    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  copy: function()
  {
    return new PathCompiled( this.name, this, this.points.length );
  }
});

PathCompiled.compile = function(calc, path, pointCount)
{
  if (path.points.length === pointCount)
  {
    return copy( path.points );
  }

  var points = [];

  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }

  return points;
};
