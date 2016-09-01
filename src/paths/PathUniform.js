
/**
 * Instantiates a new PathLinear.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathLinear
 * @constructor
 * @extends PathDelta
 */
function PathUniform(name, path, pointCount)
{
  this.name = name;
  this.set( path, pointCount );
}

Class.extend( PathUniform, PathDelta,
{
  set: function(path, pointCount)
  {
    var calc = path.calculator;
    var points = PathCompiled.compile( calc, path, pointCount );
    var deltas = PathLinear.getTimes( calc, points );

    this._set( calc, points, deltas );
    this.path = path;
    this.pointCount = pointCount;
  },

  copy: function()
  {
    return new PathUniform( this.name, this.path, this.pointCount );
  }
});
