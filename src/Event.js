
/**
 * Possible states an event can be in.
 *
 * @type {Object}
 */
var EventState =
{
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  FINISHED: 8
};

/**
 * Instantiates a new Event which extends Attrimator.
 *
 * @param {String} attribute
 * @param {Path} path
 * @param {String|Number} duration
 * @param {String|Function|Array} easing
 * @param {String|Number} delay
 * @param {String|Number} sleep
 * @param {String|Number} offset
 * @param {String|Number} repeat
 * @param {Number} scale
 * @param {T|Number} scaleBase
 * @param {Boolean} hasInitialState
 * @param {Builder} builder
 * @param {Attrimator} next
 * @param {Object} input
 * @param {Number} mergeId
 * @class Event
 * @constructor
 * @extends Attrimator
 */
function Event(attribute, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, hasInitialState, builder, next, input, mergeId)
{
  this.reset( attribute, builder, next );

  /**
   * The path the attribute will be animated along.
   *
   * @property {Path} path
   */
  this.path             = path;

  /**
   * The easing used to modify the delta value passed to the path.
   *
   * **See:** {{#crossLink "Core/anim8.easing:method"}}{{/crossLink}}
   *
   * @property {Function} easing
   */
  this.easing           = $easing( easing );

  /**
   * The amount of time in milliseconds to animate an attribute over the path.
   *
   * **See:** {{#crossLink "Core/anim8.duration:method"}}{{/crossLink}}
   *
   * @property {Number} duration
   */
  this.duration         = $duration( duration );

  /**
   * If this event repeats more than once, this is a pause between animations.
   *
   * **See:** {{#crossLink "Core/anim8.sleep:method"}}{{/crossLink}}
   *
   * @property {Number} sleep
   */
  this.sleep            = $sleep( sleep );

  /**
   * The number of times to repeat the animation.
   *
   * **See:** {{#crossLink "Core/anim8.repeat:method"}}{{/crossLink}}
   *
   * @property {Number} repeat
   */
  this.repeat           = $repeat( repeat );

  /**
   * The amount to scale the value computed from the path.
   *
   * **See:** {{#crossLink "Core/anim8.scale:method"}}{{/crossLink}}
   *
   * @property {T} scale
   */
  this.scale            = $scale( scale );

  /**
   * The base value from which to scale from. This is essentially this data
   * types default value.
   *
   * @property {T} scaleBase
   */
  this.scaleBase        = path.calculator.parse( scaleBase, path.calculator.ZERO );

  /**
   * Whether or not this event has an initial value which can be applied at the
   * start of the animation (or when
   * {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} is invoked).
   *
   * @property {Boolean} hasInitialState
   */
  this.hasInitialState  = coalesce( hasInitialState, true );

  this.delay            = $delay( delay );
  this.offset           = $offset( offset );

  this.input            = input;
  this.mergeId          = mergeId;
}

Class.extend( Event, Attrimator,
{
  /**
   * Returns the computed value given a base value and a delta along the path.
   *
   * @method computeValue
   * @param {T} baseValue
   * @param {Number} delta
   * @return {T}
   */
  computeValue: function(baseValue, delta)
  {
    var value = this.path.compute( baseValue, this.easing( delta ) );

    if ( value !== false && this.scale !== 1.0 )
    {
      var calc = this.path.calculator;
      var baseValue = calc.clone( this.scaleBase );
      var distance = calc.sub( baseValue, value );

      value = calc.adds( value, distance, -this.scale );
    }

    return value;
  },

  /**
   * Applies the value to the frame and returns true, otherwise returns false.
   *
   * @method applyValue
   * @param {Object} frame
   * @param {T} baseValue
   * @param {Number} delta
   * @return {T}
   */
  applyValue: function(frame, baseValue, delta)
  {
    var value = baseValue;

    // TODO pull defaultValue from attribute
    if (!this.path.calculator.isValid( baseValue ))
    {
      value = this.path.calculator.create();
    }

    value = this.computeValue( value, delta );

    if ( value !== false )
    {
      frame[ this.attribute ] = value;
    }

    return value;
  },

  nopeat: function()
  {
    var newRepeat = clamp( Math.ceil( ( this.elapsed - this.delay ) / ( this.duration + this.sleep ) ), 0, this.repeat );

    if ( newRepeat !== this.repeat )
    {
      this.repeat = newRepeat;
      this.prestartNext( true );
    }

    return this;
  },
  finish: function(frame)
  {
    this.applyValue( frame, this.path.calculator.create(), 1.0 );
    this.state = EventState.FINISHED;
  },
  start: function(now, animator)
  {
    this.prestart( now );

    this.state = this.delay ? EventState.DELAYED : EventState.ANIMATING;

    if ( this.hasComputed() )
    {
      this.path = this.path.replaceComputed( this, animator );
    }
  },
  startCycle: function(frame)
  {
    if ( this.hasInitialState )
    {
      this.applyValue( frame, frame[ this.attribute ], 0 );

      return true;
    }

    return false;
  },
  update: function(elapsed, frame)
  {
    var updated = false;
    var delay = this.delay;
    var duration = this.duration;
    var sleep = this.sleep;
    var repeat = this.repeat;
    var oldState = this.state;
    var newState = this.state;
    var delta = 0;

    elapsed -= delay;

    var cycle = duration + sleep;
    var iteration = Math.floor( elapsed / cycle );

    if ( iteration >= repeat )
    {
      newState = EventState.FINISHED;
      delta = 1;
    }
    else
    {
      elapsed -= iteration * cycle;

      if ( elapsed > duration )
      {
        newState = EventState.SLEEPING;
        delta = 1;
      }
      else
      {
        newState = EventState.ANIMATING;
        delta = elapsed / duration;
      }
    }

    if ( newState === EventState.ANIMATING ||
       ( newState !== EventState.ANIMATING && oldState === EventState.ANIMATING ) )
    {
      this.applyValue( frame, frame[ this.attribute ], delta );
      updated = true;
    }

    this.state = newState;

    return updated;
  },
  valueAt: function(time, out)
  {
    time += this.offset;

    if ( time < this.delay && !this.hasInitialState )
    {
      return false;
    }

    var delta = 0;

    if ( time >= this.delay )
    {
      var cycle = (this.duration + this.sleep);
      var elapsed = (time - this.delay);
      var iteration = Math.floor( elapsed / cycle );

      if ( iteration >= this.repeat )
      {
        delta = 1.0;
      }
      else
      {
        delta = Math.min( 1.0, (elapsed % cycle) / this.duration );
      }
    }

    return this.computeValue( out, delta );
  },
  totalTime: function()
  {
    var sleepTime = this.sleep ? ((this.repeat - 1) * this.sleep) : 0;
    var animateTime = (this.repeat * this.duration);

    return Math.min( this.stopTime, this.delay + animateTime + sleepTime - this.offset );
  },
  clone: function()
  {
    return new Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.offset, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.builder, this.next ? this.next.clone() : null, this.input );
  },
  hasComputed: function()
  {
    return this.path.computed;
  },
  isInfinite: function()
  {
    return !isFinite( this.repeat ) && !isFinite( this.stopTime );
  },
  isFinished: function()
  {
    return (this.state === EventState.FINISHED);
  }

});

/**
 * Returns an Event given the attribute, the path, and a parsed options object.
 *
 * **See:** {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method fromOptions
 * @for Event
 * @param  {String} attr
 * @param  {Path} path
 * @param  {Object} options
 * @return {Event}
 */
Event.fromOptions = function(attr, path, options)
{
  return new Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.offset, options.repeat, options.scale, options.scaleBase );
};
