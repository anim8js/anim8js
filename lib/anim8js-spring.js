/**
 * Returns a spring if the provided argument is a spring, the name of a spring, or
 * an object with a spring type to be created. If none of these conditions are true
 * then false is returned.
 *
 * @param {anim8.Spring|string|object} spring
 */
anim8.spring = function(spring)
{
  if ( spring instanceof anim8.Spring )
  {
    return spring;
  }
  if ( anim8.isString( spring ) && spring in anim8.spring )
  {
    return anim8.spring[ spring ];
  }
  if ( anim8.isObject( spring ) && spring.type in anim8.spring )
  {
    return anim8.spring[ spring.type ]( spring );
  }
  
  return false;
};


/**
 * A spring has a resting point, a current position, and the velocity currently enacting on the position
 * based on the implementing classes logic.
 */
anim8.Spring = function()
{
};

anim8.Spring.prototype = 
{
  /**
   * Resets the spring's properties.
   * 
   * @param {string} attribute
   * @param {string|object} calculator
   * @param {any} rest
   * @param {any} position
   */
  reset: function(attribute, calculator, rest, position, gravity)
  {
    var calc = anim8.calculator( calculator );
    var a = anim8.attribute( attribute );
    
    this.attribute    = attribute;
    this.calculator   = calc;
    this.rest         = calc.parse( rest, a.defaultValue );
    this.position     = calc.parse( position, a.defaultValue );
    this.gravity      = calc.parse( gravity, calc.create() );
    this.velocity     = calc.create();
    this.time         = 0;
  },
  
  /**
   * Updates the spring given the current time in milliseconds and the frame which
   * contains (or will contain) the attribute to which this spring is animating.
   *
   * @param {number} now
   * @param {object} frame
   */
  update: function(now, frame)
  {
    if (this.time === 0)
    {
      this.time = now;
    }
    
    var calc = this.calculator;
    
    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (now - this.time) * 0.001, anim8.Spring.MAX_DT );
    
    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.copy( {}, this.position );
    
    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );
    
    this.time = now;
    
    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, anim8.Spring.EPSILON );
    
    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    
    return updated;
  },
  
  /**
   * Resolves the position to the expected format.
   */
  resolveRest: function()
  {
    return anim8.isFunction( this.rest ) ? this.rest() : this.rest;
  },
  
  /**
   * Method that's invoked on each update.
   *
   * @param {number} dt
   */
  updateVelocity: function(dt)
  {
    throw 'Spring.updateVelocity not implemented';
  }
};

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
anim8.Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
anim8.Spring.EPSILON = 0.0001;

