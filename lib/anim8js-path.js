
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
      if ( this.isComputedValue( ps[i] ) )
      {
        return true;
      }
    }

    return false;
  },

  /**
   * [isComputedValue description]
   * @return {Boolean}
   */
  isComputedValue: function(x)
  {
    return anim8.isFunction( x ) && x.computed;
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
      if ( this.isComputedValue( ps[i] ) )
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
  }

};
