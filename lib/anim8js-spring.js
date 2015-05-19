/**
 * Returns a spring if the provided argument is a spring, the name of a spring, 
 * or an object with a spring type to be created. If none of these conditions 
 * are true then an error is thrown.
 *
 * @method anim8.spring
 * @for Core
 * @param {Spring|String|Object} spring
 * @return {Spring}
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

  throw spring + ' is not a valid spring';
};


/**
 * A spring has a resting point, a current position, and the velocity currently 
 * enacting on the position based on the implementing classes logic.
 *
 * @class Spring
 * @constructor
 * @extends Attrimator
 */
anim8.Spring = function()
{
};

anim8.override( anim8.Spring.prototype = new anim8.Attrimator(),
{

  /**
   * Resets the spring's properties.
   *
   * @method set
   * @param {String} attribute
   * @param {Calculator|String} calculator
   * @param {T|Function|true} rest
   * @param {T|Function|true} position
   * @param {T|Function|true} velocity
   * @param {T|Function|true} gravity
   * @param {Boolean} finishOnRest
   */
  set: function(attribute, calculator, rest, position, velocity, gravity, finishOnRest)
  { 
    this.reset( attribute, null, null );

    this.calculator   = calculator;
    this.rest         = rest;
    this.position     = position;
    this.gravity      = gravity;
    this.velocity     = velocity;
    this.finishOnRest = finishOnRest;
  },
  
  /**
   * Resolves the rest to the expected format.
   * 
   * @method resolveRest
   * @return {T}
   */
  resolveRest: function()
  {
    return anim8.resolve( this.rest );
  },
  
  /**
   * Method that's invoked on each spring update.
   *
   * @method updateVelocity
   * @param {Number} dt
   */
  updateVelocity: function(dt)
  {
    throw 'Spring.updateVelocity not implemented';
  },

  start: function(now, animator)
  {
    anim8.Attrimator.prototype.start.apply( this, arguments );

    var attribute = animator.getAttribute( this.attribute );
    var calc = anim8.calculator( anim8.coalesce( this.calculator, attribute.calculator ) );

    this.calculator = calc;
    this.rest       = this.parseValue( animator, this.rest, attribute.defaultValue );
    this.position   = this.parseValue( animator, this.position, attribute.defaultValue );
    this.gravity    = this.parseValue( animator, this.gravity, calc.ZERO );
    this.velocity   = this.parseValue( animator, this.velocity, calc.ZERO );
  },

  hasComputed: function()
  {
    return anim8.isComputed( this.rest ) || 
           anim8.isComputed( this.position ) ||
           anim8.isComputed( this.gravity ) ||
           anim8.isComputed( this.velocity );
  },

  update: function(elapsed, frame)
  {
    var calc = this.calculator;
    
    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, anim8.Spring.MAX_DT );
    
    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.clone( this.position );
    
    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );
    
    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, anim8.Spring.EPSILON );
    
    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    else if ( this.finishOnRest && calc.isZero( this.velocity ) )
    {
      this.finished = true;
    }
    
    return updated;
  },

  finish: function(frame)
  {
    this.finished = true;

    return true;
  },

  isFinished: function()
  {
    return this.finished;
  }
});

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
anim8.Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
anim8.Spring.EPSILON = 0.0001;

