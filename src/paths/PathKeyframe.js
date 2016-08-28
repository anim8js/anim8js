
/**
 * Instantiates a new PathKeyframe.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Array} deltas
 * @param {Array} easings
 * @class PathKeyframe
 * @constructor
 * @extends Path
 */
function PathKeyframe(name, calculator, points, deltas, easings)
{
  this.name = name;
  this.set( calculator, points, deltas, easings );
}

Class.extend( PathKeyframe, Path,
{
  set: function(calculator, points, deltas, easings)
  {
    this.reset( calculator, points );
    this.deltas = deltas;
    this.easings = easings;
  },

  compute: function(out, delta)
  {
    var ds = this.deltas;
    var end = ds.length - 2;

    if ( delta < ds[0] ) {
      return false;
    }

    if ( delta > ds[ds.length - 1] ) {
      return this.points[ds.length - 1];
    }

    var i = 0;
    while (ds[i + 1] < delta && i < end) {
      i++;
    }
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i );
    var p1 = this.resolvePoint( i + 1 );
    var ea = this.easings[i];

    return this.calculator.interpolate( out, p0, p1, ea( pd ) );
  },
  copy: function()
  {
    return new PathKeyframe( this.name, this.calculator, copy(this.points), copy(this.deltas), copy(this.easings) );
  }
});
