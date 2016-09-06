
/**
 * Path class computes a value given a delta value [0, 1].
 *
 * @class Path
 * @constructor
 */
function Path()
{
}

Class.define( Path,
{

  /**
   * Resets the path with the given name, calculator, and points.
   *
   * @method reset
   * @param {String|false} name
   * @param {anim8.Calculator} calculator
   * @param {Array} points
   */
  reset: function(calculator, points)
  {
    this.calculator = $calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
    this.deterministic = this.isDeterministic();
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
   * @method hasComputed
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return this.examinePoints( isComputed, true, false );
  },

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   *
   * @method isDeterministic
   * @return {Boolean}
   */
  isDeterministic: function()
  {
    return this.examinePoints( isFunction, false, true );
  },

  /**
   * Examines the points in the path by passing each point to the examiner
   * function. If the examiner function returns true then `returnOnTrue` true
   * is returned immediately, otherwise `returnOnFalse` is returned.
   *
   * @method examinePoints
   * @param {Function} examiner
   * @param {Any} returnOnTrue
   * @param {Any} returnOnFalse
   * @return {Any}
   */
  examinePoints: function(examiner, returnOnTrue, returnOnFalse)
  {
    var ps = this.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( examiner( ps[ i ] ) )
      {
        return returnOnTrue;
      }
    }

    return returnOnFalse;
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
      if ( isComputed( ps[i] ) )
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
    return resolve( this.points[ i ] );
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
      var delta = deltadelta;
      var prev = calc.clone( this.resolvePoint( 0 ) );
      var temp = calc.create();

      for (var i = 1; i <= granularity; i++)
      {
        var next = this.compute( temp, delta );

        distance += calc.distance( prev, next );
        delta += deltadelta;

        temp = prev;
        prev = next;
      }
    }

    return distance;
  }

});
