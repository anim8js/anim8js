
/**
 * [EventState description]
 * @type {[type]}
 */
anim8.EventState = 
{
  CREATED: 0,
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  PAUSED: 8,
  FINISHED: 16
};

/**
 * [Event description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {Boolean}
 * @param {[type]}
 * @param {Function}
 */
anim8.Event = function(attribute, path, duration, easing, delay, sleep, repeat, scale, scaleBase, hasInitialState, parser, next) 
{
  this.reset( attribute, parser, next )

  this.path             = path;
  this.easing           = anim8.easing( easing );
  this.delay            = anim8.delay( delay );
  this.duration         = anim8.duration( duration );
  this.sleep            = anim8.sleep( sleep );
  this.repeat           = anim8.repeat( repeat );
  this.scale            = anim8.scale( scale );
  this.scaleBase        = path.calculator.parse( scaleBase, path.calculator.zero );
  this.hasInitialState  = anim8.coalesce( hasInitialState, true );
  this.elapsed          = 0;
};

anim8.override( anim8.Event.prototype = new anim8.Attrimator(),
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
    this.state = this.delay ? anim8.EventState.DELAYED : anim8.EventState.ANIMATING;

    if ( this.hasComputed() )
    {
      this.path = this.path.replaceComputed( this, animator );
    }
  },

  /**
   * Updates this attribute animator given a time to animate to and the frame to
   * provide with a new value. This method will return true if the attribute
   * this is animating has been updated and needs to be applied to the subject.
   * 
   * @param  {Number} now
   * @param  {Object} frame
   * @return {Boolean}
   */
  setTime: function(now, frame)
  {
    if ( this.paused )
    {
      return false;
    }

    var updated = false;
    var elapsed = now - this.startTime;
    var delay = this.delay;
    var duration = this.duration;
    var sleep = this.sleep;
    var repeat = this.repeat;
    var oldState = this.state;
    var newState = this.state;
    var delta = 0;

    if ( elapsed >= delay )
    {
      elapsed -= delay;

      var cycle = duration + sleep;
      var iteration = Math.floor( ( elapsed + sleep ) / cycle );

      if (iteration >= repeat)
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
    }
    else
    {
      newState = anim8.EventState.DELAYED;
    }

    if ( newState === anim8.EventState.ANIMATING || 
       ( newState !== anim8.EventState.ANIMATING && oldState === anim8.EventState.ANIMATING ) ||
       ( newState === anim8.EventState.DELAYED && this.hasInitialState ) )
    {
      this.applyValue( frame, frame[ this.attribute ], delta );
      updated = true;
    }

    this.state = newState;
    this.elapsed = elapsed;

    return updated;
  },

  /**
   * [getElapsed description]
   * @return {[type]}
   */
  getElapsed: function()
  {
    return this.elapsed;
  },

  /**
   * Computes the value at the given time. The only time when a value won't be
   * returned is if the time is before the delay and the event doesn't have an
   * initial state.
   * 
   * @param  {Number} time
   * @param  {any} out
   * @return {any}
   */
  valueAt: function(time, out)
  {
    if ( time < this.delay && !this.hasInitialState )
    {
      return false;
    }

    var delta = 0;

    if ( time >= this.delay )
    {
      delta = Math.max( 1.0, ((time - this.delay) % (this.duration + this.sleep)) / this.duration );
    }

    return this.computeValue( out, delta );
  },

  /**
   * [computeValue description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
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
   * [finish description]
   * @param  {[type]}
   * @return {[type]}
   */
  finish: function(frame) 
  {
    this.applyValue( frame, this.path.calculator.create(), 1.0 );
    this.state = anim8.EventState.FINISHED;
  },

  /**
   * [applyValue description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  applyValue: function(frame, baseValue, delta)
  {
    var value = this.computeValue( baseValue, delta );
    
    if ( value !== false )
    {
      frame[ this.attribute ] = value;
    }
  },

  /**
   * The total amount of time this animator will take. This may be an infinite number.
   * 
   * @return {Number}
   */
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
	},

  /**
   * The time remaining before this animator and any following will be finished.
   * 
   * @return {Number}
   */
  timeRemaining: function() 
  {    
    return this.totalTime() - this.elapsed + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * [clone description]
   * @return {[type]}
   */
  clone: function()
  {
    return new anim8.Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.parser, this.next ? this.next.clone() : null );
  },

  /**
   * Returns whether this animator has computed values which need to be resolved
   * by the subject animator calling prepare on this attribute animator.
   * 
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return this.path.computed;
  },

  /**
   * [isInfinite description]
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return (this.repeat === Number.POSITIVE_INFINITY);
  },

  /**
   * [isFinished description]
   * @return {Boolean}
   */
  isFinished: function()
  {
    return (this.state === anim8.EventState.FINISHED);
  }

});
