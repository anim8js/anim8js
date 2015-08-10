
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
anim8.PathCombo = function(name, paths, uniform, granularity)
{
  var calc = paths[0].calculator;
  var points = [];
  var deltas = [];

  for (var i = 0; i < paths.length; i++) 
  {
    points.push.apply( points, paths[ i ].points );
    deltas[ i ] = ( i + 1 ) / paths.length;  
  }

  if ( uniform ) 
  {
    var lengthGranularity = anim8.coalesce( granularity, 100 );
    var lengthTotal = 0;
    var lengths = [];

    for (var i = 0; i < paths.length; i++) 
    {
      lengths[ i ] = paths[ i ].length( lengthGranularity );
      lengthTotal += lengths[ i ];
    }

    var lengthCurrent = 0;

    for (var i = 0; i < paths.length; i++) 
    {
      lengthCurrent += lengths[ i ];
      deltas[ i ] = lengthCurrent / lengthTotal;
    }
  }

  this.reset( name, calc, points );
  this.paths = paths;
  this.deltas = deltas;
  this.uniform = uniform;
  this.granularity = granularity;
};

anim8.override( anim8.PathCompiled.prototype = new anim8.Path(),
{
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

    return paths[ i ].compute( out, ( delta - previousDelta ) / ( deltas[ i ] - previousDelta ) );
  },
  copy: function() 
  {
    return new anim8.PathCombo( this.name, this.paths, this.uniform, this.granularity );
  }
});

/**
 * Parses an object for a combo path.
 * 
 * @param {Object} path
 * @return {PathCombo}
 */
anim8.path['combo'] = function(path)
{
  var paths = path.paths;

  for (var i = 0; i < paths.length; i++)
  {
    paths[ i ] = anim8.path( paths[ i ] );
  }

  return new anim8.PathCombo(
    path.name,
    paths,
    path.uniform,
    path.granularity
  );
};
