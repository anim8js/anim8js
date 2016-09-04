
/**
 * Animates a single attribute with a velocity and acceleration.
 *
 * @param {String} attribute
 * @param {Builder} builder
 * @param {Calculator} calculator
 * @param {T} position
 * @param {T} velocity
 * @param {T} acceleration
 * @param {Number} terminal
 * @param {Number} stopTime
 * @class Physics
 * @constructor
 * @extends Attrimator
 */
function Physics( attribute, builder, calculator, position, velocity, acceleration, terminal, stopTime )
{
  this.reset( attribute, builder, null );

  this.calculator   = calculator;
  this.position     = position;
  this.velocity     = velocity;
  this.acceleration = acceleration;
  this.terminal     = $number( terminal, Number.POSITIVE_INFINITY );
  this.stopTime     = $time( stopTime, Number.POSITIVE_INFINITY );
  this.finished     = false;
}

Class.extend( Physics, Attrimator,
{
  /**
   * Parses a value for the animator given a default value.
   *
   * @method parseValue
   * @param {anim8.Animator} animator.
   * @param {T} value
   * @param {T} defaultValue
   * @return {T}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( isComputed( parsed ) )
    {
       parsed = parsed( this, animator );
    }

    return parsed;
  },

  /**
   * Resolves the velocity to a value.
   *
   * @method resolveVelocity
   * @return {T}
   */
  resolveVelocity: function()
  {
    return resolve( this.velocity );
  },

  /**
   * Resolves the acceleration to a value.
   *
   * @method resolveAcceleration
   * @return {T}
   */
  resolveAcceleration: function()
  {
    return resolve( this.acceleration );
  },

  start: function(now, animator)
  {
    this.prestart( now );

    var attribute = animator.getAttribute( this.attribute );
    var calc = $calculator( coalesce( this.calculator, attribute.calculator ) );

    this.calculator     = calc;
    this.position       = this.parseValue( animator, this.position, attribute.defaultValue );
    this.initalPosition = calc.clone( this.position );
    this.velocity       = this.parseValue( animator, this.velocity, calc.ZERO );
    this.acceleration   = this.parseValue( animator, this.acceleration, calc.ZERO );
    this.temp           = calc.create();
  },

  hasComputed: function()
  {
    return isComputed( this.position ) ||
           isComputed( this.velocity ) ||
           isComputed( this.acceleration );
  },

  update: function(elapsed, frame)
  {
    var value = this.valueAt( elapsed, this.temp, true );

    if ( value !== false )
    {
      frame[ this.attribute ] = this.position = value;

      return true;
    }

    var calc = this.calculator;
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, Physics.MAX_DT );
    var vel = calc.copy( this.temp, this.resolveVelocity() );
    var acc = this.resolveAcceleration();
    var pos = this.position;

    vel = calc.adds( vel, acc, dt );

    if ( isFinite( this.terminal ) )
    {
      vel = calc.clamp( vel, 0, this.terminal );
    }

    pos = calc.adds( pos, vel, dt );

    this.position = pos;

    if ( !isFunction( this.velocity ) )
    {
      this.velocity = calc.copy( this.velocity, vel );
    }

    frame[ this.attribute ] = pos;

    return true;
  },

  valueAt: function(time, out, usePosition)
  {
    if ( isFunction( this.velocity ) || isFunction( this.acceleration ) || this.terminal !== Number.POSITIVE_INFINITY )
    {
      return false;
    }

    time -= this.delay;
    time *= 0.001;

    var calc = this.calculator;
    var value = usePosition ? calc.copy( this.position, this.initalPosition ) : calc.copy( out, this.initalPosition );
    value = calc.adds( value, this.velocity, time );
    value = calc.adds( value, this.acceleration, time * time );

    return value;
  },

  clone: function()
  {
    return new Physics( this.attribute, this.builder, this.calculator, this.position, this.velocity, this.acceleration, this.terminal, this.stopTime );
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
Physics.MAX_DT = 0.1;
