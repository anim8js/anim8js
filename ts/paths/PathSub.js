
/**
 * Instantiates a new PathSub.
 *
 * @param {String|false} name
 * @param {Path} path
 * @param {Number} start
 * @param {Number} end
 * @class PathSub
 * @constructor
 * @extends Path
 */
function PathSub(name, path, start, end)
{
  this.name = name;
  this.set( path, start, end );
}

Class.extend( PathSub, Path,
{
  set: function(path, start, end)
  {
    this.reset( path.calculator, path.points );
    this.path = path;
    this.start = start;
    this.end = end;
  },

  compute: function(out, delta)
  {
    return this.path.compute( out, (this.end - this.start) * delta + this.start );
  },

  copy: function()
  {
    return new PathSub( this.name, this.path, this.start, this.end );
  }
});
