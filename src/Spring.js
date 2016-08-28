
/**
 * A spring has a resting point, a current position, and the velocity currently
 * enacting on the position based on the implementing classes logic.
 *
 * @class Spring
 * @constructor
 * @extends Attrimator
 */
function Spring()
{
}

Class.extend( Spring, Attrimator,
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
    return resolve( this.rest );
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
    this.prestart( now );

    var attribute = animator.getAttribute( this.attribute );
    var calc = $calculator( coalesce( this.calculator, attribute.calculator ) );

    this.calculator = calc;
    this.rest       = this.parseValue( animator, this.rest, attribute.defaultValue );
    this.position   = this.parseValue( animator, this.position, attribute.defaultValue );
    this.gravity    = this.parseValue( animator, this.gravity, calc.ZERO );
    this.velocity   = this.parseValue( animator, this.velocity, calc.ZERO );
  },

  hasComputed: function()
  {
    return isComputed( this.rest ) ||
           isComputed( this.position ) ||
           isComputed( this.gravity ) ||
           isComputed( this.velocity );
  },

  update: function(elapsed, frame)
  {
    var calc = this.calculator;

    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, Spring.MAX_DT );

    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.clone( this.position );

    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );

    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, Spring.EPSILON );

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
Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
Spring.EPSILON = 0.0001;
