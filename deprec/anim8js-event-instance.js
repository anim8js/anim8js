
/**
 * [EventInstance description]
 * @param {[type]}
 */
anim8.EventInstance = function(event)
{
	this.event 			      = event;
	this.attribute 	      = event.attribute;
	this.path 			      = event.path;
	this.duration 	      = event.duration;
	this.easing 		      = event.easing;
	this.delay 			      = event.delay;
	this.sleep 			      = event.sleep;
	this.repeat 		      = event.repeat;
  this.scale            = event.scale;
  this.scaleBase        = event.scaleBase;
  this.hasInitialState  = event.hasInitialState;
  this.next             = null;
  this.state 			      = anim8.EventState.CREATED;
  this.time 			      = 0;
  this.pauseTime 	      = 0;
  this.pauseState       = 0;
  this.cycle            = 0;
};

anim8.override( anim8.EventInstance.prototype = new anim8.Event(),
{
  /**
   * [newInstance description]
   * @return {[type]}
   */
  newInstance: function()
  {
    return new anim8.EventInstance( this.event );
  },

  /**
   * [isInstance description]
   * @return {Boolean}
   */
  isInstance: function()
  {
    return true
  },

  /**
   * [clone description]
   * @return {[type]}
   */
  clone: function()
  {
    return new anim8.EventInstance( this.event );
  },

  /**
   * [getParser description]
   * @return {[type]}
   */
  getParser: function()
  {
    return this.event.parser;
  },

  /**
   * [timeRemaining description]
   * @return {[type]}
   */
  timeRemaining: function() 
  {    
    return this.totalTime() - this.elapsed + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * [update description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  update: function(now, frame) 
	{
    return this.setTime( now, frame );
  },

  /**
   * Sets the current time of the event.
   * 
   * @param {Number} now
   * @param {Object} frame
   * @return {Boolean} 
   */
  setTime: function(now, frame)
  {
    if ( this.time === 0 )
    {
      this.time = now;
    }

    var updated = false;
    var elapsed = now - this.time;
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

    return updated;
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
    
    this.trigger('finish', this);
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
   * [getDelta description]
   * @return {[type]}
   */
  getDelta: function()
  {
    return this.isAnimating() ? Math.min( 1.0, (anim8.now() - this.time) / this.duration ) : 0.0;
  },

  /**
   * [getPoint description]
   * @param  {[type]}
   * @return {[type]}
   */
  getPoint: function(delta)
  {
    return this.computeValue( this.path.calculator.create(), delta );
  },

  /**
   * [getFuture description]
   * @param  {[type]}
   * @return {[type]}
   */
  getFuture: function(fdelta)
  {
    return this.getPoint( Math.min( 1.0, this.getDelta() + fdelta ) );
  },

  /**
   * [getStart description]
   * @return {[type]}
   */
  getStart: function()
  {
    return this.getPoint( 0 );
  },

  /**
   * [getEnd description]
   * @return {[type]}
   */
  getEnd: function() 
	{
    return this.getPoint( 1 );
  },

  /**
   * [pause description]
   * @return {[type]}
   */
  pause: function() 
  {
    if (this.state !== anim8.EventState.PAUSED) 
    {
      this.pauseTime = anim8.now();
      this.pauseState = this.state;
      this.state = anim8.EventState.PAUSED; 
    }
  },

  /**
   * [resume description]
   * @return {[type]}
   */
  resume: function() 
  {
    if (this.state === anim8.EventState.PAUSED) 
    {
      this.time += anim8.now() - this.pauseTime;
      this.state = this.pauseState; 
    }
  },

  /**
   * [hasStarted description]
   * @return {Boolean}
   */
  hasStarted: function()
  {
    return (this.state !== anim8.EventState.CREATED && this.state !== anim8.EventState.DELAYED);
  },

  /**
   * [isAnimating description]
   * @return {Boolean}
   */
  isAnimating: function() 
  {
    return (this.state === anim8.EventState.ANIMATING);
  },

  /**
   * [isFinished description]
   * @return {Boolean}
   */
  isFinished: function() 
  {
    return (this.state === anim8.EventState.FINISHED);
  },

  /**
   * [isDelayed description]
   * @return {Boolean}
   */
  isDelayed: function() 
  {
    return (this.state === anim8.EventState.DELAYED);
  },

  /**
   * [isPaused description]
   * @return {Boolean}
   */
  isPaused: function() 
  {
    return (this.state === anim8.EventState.PAUSED);
  },

  /**
   * [isSleeping description]
   * @return {Boolean}
   */
  isSleeping: function() 
  {
    return (this.state === anim8.EventState.SLEEPING);
  },

  /**
   * [hasStates description]
   * @param  {[type]}
   * @return {Boolean}
   */
  hasStates: function(states) 
  {
    return (this.state & states) !== 0;
  },

  /**
   * [stateText description]
   * @return {[type]}
   */
  stateText: function() 
  {
    switch(this.state) 
    {
      case anim8.EventState.CREATED:            return "created";
      case anim8.EventState.DELAYED:            return "delayed";
      case anim8.EventState.ANIMATING:          return "animating";
      case anim8.EventState.SLEEPING:           return "sleeping";
      case anim8.EventState.FINISHED:           return "finished";
    }
  }

});

/**
 * Adds the following event methods to EventInstances: on, once, off, trigger.
 */
anim8.eventize( anim8.EventInstance.prototype );