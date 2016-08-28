
/**
 * Instantiates a new PathDelta.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Array} deltas
 * @class PathDelta
 * @constructor
 * @extends Path
 */
function PathDelta(name, calculator, points, deltas)
{
  this.name = name;
  this.set( calculator, points, deltas );
}

Class.extend( PathDelta, Path,
{
  set: function(calculator, points, deltas)
  {
    this.reset( calculator, points );
    this.deltas = deltas;
  },

  compute: function(out, delta)
  {
    var ds = this.deltas;
    var end = ds.length - 2;
    var i = 0;
    while (ds[i + 1] < delta && i < end) {
      i++;
    }
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i );
    var p1 = this.resolvePoint( i + 1 );

    return this.calculator.interpolate( out, p0, p1, pd );
  },

  copy: function()
  {
    return new PathDelta( this.name, copy(this.points), copy(this.deltas), this.calculator );
  }
});
