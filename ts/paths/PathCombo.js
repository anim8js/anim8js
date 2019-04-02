
/**
 * Instantiates a new PathCombo.
 *
 * @param {String|false} name
 * @param {Path[]} paths
 * @param {Boolean} [uniform]
 * @param {Number} [granularity]
 * @class PathCombo
 * @constructor
 * @extends Path
 */
function PathCombo(name, paths, uniform, granularity)
{
  this.name = name;
  this.set( paths, uniform, granularity );
}

Class.extend( PathCombo, Path,
{
  set: function(paths, uniform, granularity)
  {
    var pathCount = paths.length;
    var calc = paths[0].calculator;
    var points = [];
    var deltas = [];
    var linear = true;
    var length = false;

    for (var i = 0; i < pathCount; i++)
    {
      points.push.apply( points, paths[ i ].points );

      deltas[ i ] = ( i + 1 ) / pathCount;

      if ( !paths[ i ].isLinear() )
      {
        linear = false;
      }
    }

    if ( uniform )
    {
      var lengthGranularity = coalesce( granularity, Defaults.comboPathUniformGranularity );
      var lengthTotal = 0;
      var lengths = [];

      for (var i = 0; i < pathCount; i++)
      {
        lengths[ i ] = paths[ i ].length( lengthGranularity );
        lengthTotal += lengths[ i ];
      }

      var lengthCurrent = 0;

      for (var i = 0; i < pathCount; i++)
      {
        lengthCurrent += lengths[ i ];
        deltas[ i ] = lengthCurrent / lengthTotal;
      }

      length = lengthTotal;
    }

    this.reset( calc, points );
    this.paths = paths;
    this.deltas = deltas;
    this.uniform = uniform;
    this.granularity = granularity;
    this.linear = linear;
    this.cachedLength = length;
  },

  isLinear: function()
  {
    return this.linear;
  },

  length: function(granularity)
  {
    return this.cachedLength !== false ? this.cachedLength : this._length( granularity );
  },

  compute: function(out, delta)
  {
    var paths = this.paths;
    var deltas = this.deltas;
    var previousDelta = 0;
    var i = 0;

    while ( i < paths.length - 1 && deltas[ i ] < delta )
    {
      previousDelta = deltas[ i ];
      i++;
    }

    var deltaDistance = delta - previousDelta;
    var deltaGap = deltas[ i ] - previousDelta;
    var pathDelta = deltaDistance / deltaGap;

    return paths[ i ].compute( out, pathDelta );
  },

  copy: function()
  {
    return new PathCombo( this.name, this.paths, this.uniform, this.granularity );
  }
});
