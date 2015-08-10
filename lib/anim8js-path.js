
/**
 * Parses a path given the input and returns an instance of anim8.Path or throws
 * an error if the path could not be parsed. If the input is an object and has
 * a type property with a value that maps to a path type the path's parsing
 * function is invoked with the object.
 *
 * @method anim8.path
 * @for Core
 * @param  {anim8.Path|String|Object} path
 * @return {anim8.Path}
 * @throws {String} If the input is not a valid path.
 */
anim8.path = function(path)
{
  if ( path instanceof anim8.Path )
  {
    return path;
  }
  if ( anim8.isString( path ) && path in anim8.path )
  {
    return anim8.path[ path ];
  }
  if ( anim8.isObject( path ) && path.type in anim8.path )
  {
    return anim8.path[ path.type ]( path );
  }
  
  throw path + ' is not a valid path';
};

/**
 * Path class computes a value given a delta value [0, 1].
 *
 * @class Path
 * @constructor
 */
anim8.Path = function()
{
};

anim8.Path.prototype = 
{
  /**
   * Resets the path with the given name, calculator, and points.
   * 
   * @method reset
   * @param {String|false} name
   * @param {anim8.Calculator} calculator
   * @param {Array} points
   */
  reset: function(name, calculator, points)
  {
    this.name = name;
    this.calculator = anim8.calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
  },

  /**
   * Computes a value at the given delta setting and returning out.
   * 
   * @method compute
   * @param {T} out
   * @param {Number} delta
   * @return {T}
   */
  compute: function(out, delta) 
  {
    throw 'Path.compute not implemented';
  },

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   * 
   * @method reset
   * @return {Boolean}
   */
  hasComputed: function() 
  {
    var ps = this.points;
    
    for (var i = 0; i < ps.length; i++) 
    {
      if ( anim8.isComputed( ps[i] ) )
      {
        return true;
      }
    }

    return false;
  },

  /**
   * Replaces any computed values in this path with the result from invoking
   * the function and returns a clone of this path.
   * 
   * @method replaceComputed
   * @return {anim8.Path}
   */
  replaceComputed: function(event, animator)
  {
    var clone = this.copy();
    var ps = clone.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( anim8.isComputed( ps[i] ) )
      {
        ps[i] = ps[i]( event, animator );
      }
    }
    
    return clone;
  },

  /**
   * Resolves and returns the point at the given index.
   * 
   * @method resolvePoint
   * @param {Number} i
   * @return {T}
   */
  resolvePoint: function(i)
  {
    return anim8.resolve( this.points[ i ] );
  },

  /**
   * Returns whether the path is linear. Linear paths go directly from point to
   * point where curved paths do not. Linear paths can have their length 
   * calculated fairly easily however curves you must compute length with a 
   * given granularity.
   * 
   * @method isLinear
   * @return {Boolean}
   */
  isLinear: function()
  {
    return true;
  },

  /**
   * Computes the length of the Path with a given granularity. Granularity is 
   * used for non-linear paths - it's the number of segments are calculated on 
   * the path where the length of the segments are summed and returned as the 
   * length.
   * 
   * @method length
   * @param {Number} granularity
   * @return {Number}
   */
  length: function(granularity)
  {
    var distance = 0;
    var calc = this.calculator;

    if ( this.isLinear() )
    {
      var prev = this.resolvePoint( 0 );

      for (var i = 1; i < this.points.length; i++)
      {
        var next = this.resolvePoint( i );

        distance += calc.distance( prev, next );

        prev = next;
      }
    }
    else
    {
      var deltadelta = 1.0 / granularity;
      var delta = delta;
      var prev = calc.clone( this.resolvePoint( 0 ) );
      var temp = calc.create();

      for (var i = 1; i <= granularity; i++)
      {
        var next = this.compute( temp, delta );

        distance += calc.distance( prev, next );

        temp = prev;
        prev = next;
      }
    }

    return distance;
  }

};
