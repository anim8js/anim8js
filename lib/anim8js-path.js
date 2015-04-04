
/**
 * [path description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path = function(path)
{
  if ( path instanceof anim8.Path )
  {
    return path;
  }
  if ( anim8.isString( path ) && path in anim8.path )
  {
    return anim8.path[ spring ];
  }
  if ( anim8.isObject( path ) && path.type in anim8.path )
  {
    return anim8.path[ path.type ]( path );
  }
  
  return false;
};

/**
 * [Path description]
 */
anim8.Path = function()
{
};

anim8.Path.prototype = 
{
  /**
   * [reset description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  reset: function(name, calculator, points)
  {
    this.name = name;
    this.calculator = anim8.calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
  },

  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta) 
	{
    throw 'Path.compute not implemented';
  },

  /**
   * [hasTrue description]
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
   * [reference description]
   * @return {[type]}
   */
  reference: function() 
	{
    return this.trues ? this.copy() : this;
  },

  /**
   * [last description]
   * @return {[type]}
   */
  last: function()
  {
    return this.points[ this.points.length - 1 ];
  },

  /**
   * [first description]
   * @return {[type]}
   */
  first: function()
  {
    return this.points[ 0 ];
  },

  /**
   * [point description]
   * @param  {[type]}
   * @return {[type]}
   */
  point: function(i)
  {
    return this.points[ i ];
  },

  /**
   * [replaceComputed description]
   * @return {[type]}
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
   * [resolvePoint description]
   * @param  {[type]}
   * @return {[type]}
   */
  resolvePoint: function(i)
  {
    var p = this.points[ i ];
    
    if ( anim8.isFunction( p ) )
    {
      p = p();
    }
    
    return p;
  },

  /**
   * Returns whether the path is linear. Linear paths go directly from point to
   * point where curved paths do not. Linear paths can have their length calculated
   * fairly easily however curves you must compute length with a given granularity.
   * 
   * @return {Boolean}
   */
  isLinear: function()
  {
    return true;
  },

  /**
   * Computes the length of the Path with a given granularity. Granularity
   * @param  {[type]}
   * @return {[type]}
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
