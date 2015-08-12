
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
anim8.PathKeyframe = function(name, calculator, points, deltas, easings) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
  this.easings = easings;
};

anim8.override( anim8.PathKeyframe.prototype = new anim8.Path(),
{
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
    while (ds[i + 1] < delta && i < end) i++;
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
    return new anim8.PathKeyframe( this.name, this.calculator, anim8.copy(this.points), anim8.copy(this.deltas), anim8.copy(this.easings) );
  }
});

/**
 * Parses an object for a keyframe path.
 * 
 * @param {Object} path
 * @return {PathKeyframe}
 */
anim8.path['keyframe'] = function(point)
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
  
  var defaultEasing = anim8.easing( path.easings, null );
  
  if ( !anim8.isDefined( path.easings ) || !anim8.isArray( path.easings ) || defaultEasing !== null )
  {
    path.easings = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.easings[ i ] = defaultEasing;
    }
  }
  
  for (var i = 0; i < path.easings.length; i++)
  {
    path.easings[ i ] = anim8.easing( path.easings[ i ] );
  }
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[ i ], defaultValue );
  }
  
  return new anim8.PathKeyframe(
    path.name,
    calc,
    path.points,
    path.deltas,
    path.easings
  );
};
