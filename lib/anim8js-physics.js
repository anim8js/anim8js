
/**
 * Animates a single attribute over any period of time.
 */
anim8.Physics = function( attribute, parser, calculator, position, velocity, acceleration, terminal, stopTime )
{
  this.reset( attribute, parser, null );

  this.calculator   = calculator;
  this.position     = position;
  this.velocity     = velocity;
  this.acceleration = acceleration;
  this.terminal     = anim8.number( terminal, Number.POSITIVE_INFINITY );
  this.stopTime     = anim8.time( stopTime, Number.POSITIVE_INFINITY );
  this.finished     = false;
};

anim8.override( anim8.Physics.prototype = new anim8.Attrimator(),
{

  /**
   * Prepares this attribute animator for animation on the given subject animator.
   * This is called once in anim8.Animator.preupdate before the first time this
   * animator is updated.
   * 
   * @param  {[type]}
   * @return {[type]}
   */
  start: function(now, animator)
  {
    this.startTime = now;
    this.elapsed = 0;
    this.finished = false;

    var attribute = animator.getAttribute( this.attribute );
    var calc = anim8.calculator( anim8.coalesce( this.calculator, attribute.calculator ) );

    this.calculator     = calc;
    this.position       = this.parseValue( animator, this.position, attribute.defaultValue );
    this.initalPosition = calc.clone( this.position );
    this.velocity       = this.parseValue( animator, this.velocity, calc.ZERO );
    this.acceleration   = this.parseValue( animator, this.acceleration, calc.ZERO );
    this.temp           = calc.create();
  },

  /**
   * Returns whether this animator has computed values which need to be resolved
   * by the subject animator calling prepare on this attribute animator.
   * 
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return anim8.isComputed( this.position ) || 
           anim8.isComputed( this.velocity ) ||
           anim8.isComputed( this.acceleration );
  },

  /**
   * [parseValue description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( anim8.isFunction( parsed ) && parsed.computed )
    {
       parsed = parsed( this, animator );
    }

    return parsed;
  },

  /**
   * 
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  update: function(elapsed, frame)
  {
    var value = this.valueAt( elapsed, true );

    if ( value !== false )
    {
      frame[ this.attribute ] = this.position = value;

      return true;
    }

    var calc = this.calculator;
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, anim8.Physics.MAX_DT );
    var vel = calc.copy( this.temp, this.resolveVelocity() );
    var acc = this.resolveAcceleration();
    var pos = this.position;

    vel = calc.adds( vel, acc, dt );

    if ( this.terminal !== Number.POSITIVE_INFINITY )
    {
      vel = calc.clamp( vel, 0, this.terminal );
    }

    pos = calc.adds( pos, vel, dt );
    
    this.position = pos;

    if ( !anim8.isFunction( this.velocity ) )
    {
      this.velocity = calc.copy( this.velocity, vel );
    }

    frame[ this.attribute ] = pos;

    return true;
  },

  /**
   * [resolveVelocity description]
   * @return {[type]}
   */
  resolveVelocity: function()
  {
    return anim8.resolve( this.velocity );
  },

  /**
   * [resolveAcceleration description]
   * @return {[type]}
   */
  resolveAcceleration: function()
  {
    return anim8.resolve( this.acceleration );
  },

  /**
   * Returns the value at the given time.
   * 
   * @param  {Number} time
   * @return {any}
   */
  valueAt: function(time, usePosition)
  {
    if ( anim8.isFunction( this.velocity ) || anim8.isFunction( this.acceleration ) || this.terminal !== Number.POSITIVE_INFINITY )
    {
      return false;
    }

    time -= this.delay;
    time *= 0.001;

    var calc = this.calculator;
    var value = usePosition ? calc.copy( this.position, this.initalPosition ) : calc.clone( this.initalPosition );
    value = calc.adds( value, this.velocity, time );
    value = calc.adds( value, this.acceleration, time * time );

    return value;
  },

  /**
   * Clones this animator.
   * 
   * @return {anim8.AttributeAnimator}
   */
  clone: function()
  {
    return new anim8.Physics( this.attribute, this.parser, this.calculator, this.position, this.velocity, this.acceleration, this.terminal, this.stopTime );
  },

  /**
   * Sets the final state of the animator to the frame if one exists.
   * 
   * @param  {Object}
   * @return {Boolean}
   */
  finish: function(frame)
  {
    this.finished = true;

    return true;
  },

  /**
   * [isFinished description]
   * @return {Boolean}
   */
  isFinished: function()
  {
    return this.finished;
  }

});

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
anim8.Physics.MAX_DT = 0.1;