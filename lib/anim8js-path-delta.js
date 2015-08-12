
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
anim8.PathDelta = function(name, calculator, points, deltas) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
};

anim8.override( anim8.PathDelta.prototype = new anim8.Path(),
{
  compute: function(out, delta) 
  {
    var ds = this.deltas;
    var end = ds.length - 2;
    var i = 0;
    while (ds[i + 1] < delta && i < end) i++;
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i );
    var p1 = this.resolvePoint( i + 1 );
    
    return this.calculator.interpolate( out, p0, p1, pd );
  },
  copy: function() 
  {
    return new anim8.PathDelta( this.name, anim8.copy(this.points), anim8.copy(this.deltas), this.calculator );
  }
});

/**
 * Parses an object for a delta path.
 * 
 * @param {Object} path
 * @return {PathDelta}
 */
anim8.path['delta'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );
  
  if (!path.deltas)
  {
    path.deltas = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[ i ], defaultValue );
  }
  
  return new anim8.PathDelta(
    path.name,
    calc,
    path.points,
    path.deltas
  );
};
