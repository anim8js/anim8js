
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
    var points = [];

    for (var i = 0; i < pointCount; i++)
    {
      points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
    }

    this.reset( calc, points );
  },

  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );

    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  copy: function()
  {
    return new PathCompiled( this.name, this, this.points.length );
  }
});
