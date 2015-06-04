
/**
 * Possible states an event can be in.
 * 
 * @type {Object}
 */
anim8.EventState = 
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
 * @param {Parser} parser
 * @param {Attrimator} next
 * @class Event
 * @constructor
 * @extends Attrimator
 */
anim8.Event = function(attribute, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, hasInitialState, parser, next) 
{
  this.reset( attribute, parser, next );

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
  this.easing           = anim8.easing( easing );

  /**
   * The amount of time in milliseconds to animate an attribute over the path.
   *
   * **See:** {{#crossLink "Core/anim8.duration:method"}}{{/crossLink}}
   * 
   * @property {Number} duration
   */
  this.duration         = anim8.duration( duration );

  /**
   * If this event repeats more than once, this is a pause between animations.
   *
   * **See:** {{#crossLink "Core/anim8.sleep:method"}}{{/crossLink}}
   * 
   * @property {Number} sleep
   */
  this.sleep            = anim8.sleep( sleep );

  /**
   * The number of times to repeat the animation.
   *
   * **See:** {{#crossLink "Core/anim8.repeat:method"}}{{/crossLink}}
   * 
   * @property {Number} repeat
   */
  this.repeat           = anim8.repeat( repeat );

  /**
   * The amount to scale the value computed from the path.
   *
   * **See:** {{#crossLink "Core/anim8.scale:method"}}{{/crossLink}}
   * 
   * @property {T} scale
   */
  this.scale            = anim8.scale( scale );

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
  this.hasInitialState  = anim8.coalesce( hasInitialState, true );

  this.delay            = anim8.delay( delay );
  this.offset           = anim8.offset( offset );
};

anim8.override( anim8.Event.prototype = new anim8.Attrimator(),
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
    var value = this.computeValue( baseValue, delta );
    
    if ( value !== false )
    {
      frame[ this.attribute ] = value;
    }

    return value;
  },

  nopeat: function()
  {
    this.repeat = anim8.clamp( Math.ceil( ( this.elapsed - this.delay ) / ( this.duration + this.sleep ) ), 0, this.repeat );
    
    return this;
  },
  finish: function(frame) 
  {
    this.applyValue( frame, this.path.calculator.create(), 1.0 );
    this.state = anim8.EventState.FINISHED;
  },
  start: function(now, animator)
  {
    anim8.Attrimator.prototype.start.apply( this, arguments );
    
    this.state = this.delay ? anim8.EventState.DELAYED : anim8.EventState.ANIMATING;

    if ( this.hasComputed() )
    {
      this.path = this.path.replaceComputed( this, animator );
    }
  },
  startCycle: function(frame)
  {
    if ( this.hasInitialState )
    {
      return this.applyValue( frame, frame[ this.attribute ], 0 );
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
    var iteration = Math.floor( ( elapsed + sleep ) / cycle );

    if ( iteration >= repeat )
    {
      newState = anim8.EventState.FINISHED;
      delta = 1;
    }
    else
    {
      elapsed -= iteration * cycle;

      if ( elapsed > duration )
      {
        newState = anim8.EventState.SLEEPING;
        delta = 1;
      }
      else
      {
        newState = anim8.EventState.ANIMATING;
        delta = elapsed / duration;
      }
    }
    
    if ( newState === anim8.EventState.ANIMATING || 
       ( newState !== anim8.EventState.ANIMATING && oldState === anim8.EventState.ANIMATING ) )
    {
      this.applyValue( frame, frame[ this.attribute ], delta );
      updated = true;
    }

    this.state = newState;

    return updated;
  },
  valueAt: function(time, out)
  {
    if ( time < this.delay && !this.hasInitialState )
    {
      return false;
    }

    var delta = 0;

    if ( time >= this.delay )
    {
      var cycle = (this.duration + this.sleep);
      var elapsed = (time - this.delay);
      var iteration = Math.floor( ( elapsed + this.sleep ) / cycle );

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
    return Math.min( this.stopTime, this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep) );
  },
  clone: function()
  {
    return new anim8.Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.offset, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.parser, this.next ? this.next.clone() : null );
  },
  hasComputed: function()
  {
    return this.path.computed;
  },
  isInfinite: function()
  {
    return (this.repeat === Number.POSITIVE_INFINITY) && (this.stopTime === Number.POSITIVE_INFINITY);
  },
  isFinished: function()
  {
    return (this.state === anim8.EventState.FINISHED);
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
anim8.Event.fromOptions = function(attr, path, options)
{
  return new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.offset, options.repeat, options.scale, options.scaleBase );
}
