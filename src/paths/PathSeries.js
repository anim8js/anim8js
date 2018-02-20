
/**
 * Instantiates a new PathSeries.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Array} series
 * @class PathSeries
 * @constructor
 * @extends Path
 */
function PathSeries(name, calculator, points, series)
{
  this.name = name;
  this.set( calculator, points, series );
}

Class.extend( PathSeries, Path,
{
  set: function(calculator, points, series)
  {
    this.reset( calculator, points );
    this.series = series;
  },

  between: function(i, delta)
  {
    var d0 = this.series[i];
    var d1 = this.series[i + 1];
    return delta >= Math.min(d0, d1) && delta <= Math.max(d0, d1);
  },

  compute: function(out, delta)
  {
    var ds = this.series;
    var end = ds.length - 2;
    var i = 0;
    while (!this.between(i, delta) && i < end) {
      i++;
    }

    if (!this.between(i, delta)) {
      return out;
    }

    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i, delta );
    var p1 = this.resolvePoint( i + 1, delta );

    return this.calculator.interpolate( out, p0, p1, pd );
  },

  copy: function()
  {
    return new PathSeries( this.name, this.calculator, copy(this.points), copy(this.series) );
  }
});
