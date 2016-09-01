
var Paths = {};

/**
 * Parses an object for a combo path.
 *
 * @param {Object} path
 * @return {PathCombo}
 */
Paths['combo'] = function(path)
{
  var paths = path.paths;

  for (var i = 0; i < paths.length; i++)
  {
    paths[ i ] = $path( paths[ i ] );
  }

  return new PathCombo(
    path.name,
    paths,
    path.uniform,
    path.granularity
  );
};


/**
 * Parses an object for a compiled path.
 *
 * @param {Object} path
 * @return {PathCompiled}
 */
Paths['compiled'] = function(path)
{
  return new PathCompiled(
    path.name,
    $path( path.path ),
    path.n || path.pointCount
  );
};

/**
 * Parses an object for a cubic path.
 *
 * @param {Object} path
 * @return {PathCubic}
 */
Paths['cubic'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathCubic(
    path.name,
    calc,
    calc.parse( path.p0, defaultValue ),
    calc.parse( path.p1, defaultValue ),
    calc.parse( path.p2, defaultValue ),
    calc.parse( path.p3, defaultValue )
  );
};

/**
 * Parses an object for a delta path.
 *
 * @param {Object} path
 * @return {PathDelta}
 */
Paths['delta'] = function(path)
{
  var calc = $calculator( path.calculator );
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

  return new PathDelta(
    path.name,
    calc,
    path.points,
    path.deltas
  );
};

/**
 * Parses an object for a jump path.
 *
 * @param {Object} path
 * @return {PathJump}
 */
Paths['jump'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[ i ], defaultValue );
  }

  return new PathJump(
    path.name,
    calc,
    path.points
  );
};

/**
 * Parses an object for a keyframe path.
 *
 * @param {Object} path
 * @return {PathKeyframe}
 */
Paths['keyframe'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  if (!path.deltas)
  {
    path.deltas = [];

    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  var defaultEasing = $easing( path.easings, null );

  if ( !isDefined( path.easings ) || !isArray( path.easings ) || defaultEasing !== null )
  {
    path.easings = [];

    for (var i = 0; i < path.points.length; i++)
    {
      path.easings[ i ] = defaultEasing;
    }
  }

  for (var i = 0; i < path.easings.length; i++)
  {
    path.easings[ i ] = $easing( path.easings[ i ] );
  }

  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[ i ], defaultValue );
  }

  return new PathKeyframe(
    path.name,
    calc,
    path.points,
    path.deltas,
    path.easings
  );
};


/**
 * Parses an object for a quadratic path.
 *
 * @param {Object} path
 * @return {PathQuadratic}
 */
Paths['quadratic'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathQuadratic(
    path.name,
    calc,
    calc.parse( path.p0, defaultValue ),
    calc.parse( path.p1, defaultValue ),
    calc.parse( path.p2, defaultValue )
  );
};

/**
 * Parses an object for a tween path.
 *
 * @param {Object} path
 * @return {Tween}
 */
Paths['tween'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new Tween(
    path.name,
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.end, defaultValue )
  );
};

/**
 * Parses an object for a sub path.
 *
 * @param {Object} path
 * @return {PathSub}
 */
Paths['sub'] = function(path)
{
  var parent = $path( path.path );
  var calc = parent.calculator;
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathSub(
    path.name,
    parent,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.end, defaultValue )
  );
};

/**
 * Parses an object for a quadratic corner path.
 *
 * @param {Object} path
 * @return {PathQuadraticCorner}
 */
Paths['quadratic-corner'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );
  var points = [];

  for (var i = 0; i < path.points.length; i++)
  {
    points.push( calc.parse( path.points[ i ], defaultValue ) );
  }

  return new PathQuadraticCorner(
    path.name,
    calc,
    points,
    path.midpoint,
    path.loop
  );
};

/**
 * Parses an object for a linear path.
 *
 * @param {Object} path
 * @return {PathLinear}
 */
Paths['linear'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );
  var points = [];

  for (var i = 0; i < path.points.length; i++)
  {
    points.push( calc.parse( path.points[ i ], defaultValue ) );
  }

  return new PathLinear(
    path.name,
    calc,
    points
  );
};


/**
 * Parses an object for a uniform path.
 *
 * @param {Object} path
 * @return {PathUniform}
 */
Paths['uniform'] = function(path)
{
  var parent = $path( path.path );

  return new PathUniform(
    path.name,
    parent,
    path.n || path.pointCount
  );
};

/**
 * Parses an object for a hermite path.
 *
 * @param {Object} path
 * @return {PathHermite}
 */
Paths['hermite'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathHermite(
    path.name,
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.startTangent, defaultValue ),
    calc.parse( path.end, defaultValue ),
    calc.parse( path.endTangent, defaultValue )
  );
};
