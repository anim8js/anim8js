
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
	this.elapsed		      = 0;
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
    return this.totalTime() - this.elapsed;
  },

  /**
   * [update description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  update: function(now, frame) 
	{
    var updated = false;
    var elapsed = this.catchup( now );
    
    if ( this.isAnimating() ) 
		{			
      var delta = elapsed / this.duration;
      
      if (delta >= 1 || this.duration === 0)
			{
        if (!this.isInfinite() && --this.repeat === 0) 
				{
          this.finish(frame);
					
          return true;
        } 
				else 
				{
          if (this.sleep)
					{
            elapsed = this.progress( elapsed, this.duration, anim8.EventState.SLEEPING ); 
            delta = 1;
            
            this.trigger('sleeping', this);
          } 
					else 
					{
            elapsed = this.progress( elapsed, this.duration, anim8.EventState.ANIMATING );
            delta -= 1;
          }
        }
      }
      
      this.applyValue( frame, frame[this.attribute], delta );
      updated = true;
    }
    
    return updated;
  },

  /**
   * [catchup description]
   * @param  {[type]}
   * @return {[type]}
   */
  catchup: function(now)
  {
    if ( this.isPaused() )
    {
      return;
    }
    
    if ( this.state === anim8.EventState.CREATED )
    {
      this.time = now;
      
      if ( this.delay )
      {
        this.state = anim8.EventState.DELAYED;
        
        this.trigger('delaying', this);
      } 
      else
      {
        this.state = anim8.EventState.ANIMATING;
      }
    }
    
    var elapsed = now - this.time;
    
    if ( this.isDelayed() )
    {
      if ( elapsed > this.delay ) 
      {
        this.trigger('delayed', this);
        
        elapsed = this.progress( elapsed, this.delay, anim8.EventState.ANIMATING );
      }
    }
    
    if ( this.isSleeping() )
    {
      if ( elapsed > this.sleep )
      {
        this.trigger('slept', this);
        
        elapsed = this.progress( elapsed, this.sleep, anim8.EventState.ANIMATING );
      }
    }
    
    if ( this.isAnimating() && this.duration )
    {
      var cycle = this.duration + this.sleep;
      var cycleCount = Math.floor( ( elapsed + this.sleep ) / cycle );
      var maxCycles = Math.min( this.repeat, cycleCount );
            
      elapsed = this.progress( elapsed, maxCycles * cycle, anim8.EventState.ANIMATING );
      
      if ( !this.isInfinite() )
      { 
        if (maxCycles === this.repeat)
        {
          elapsed = this.duration;
          this.repeat = 1;
        }
        else
        {
          this.repeat -= cycleCount;
        }
      }
      
      if ( elapsed > this.duration )
      {
        elapsed = this.progress( elapsed, this.duration, anim8.EventState.SLEEPING );
        
        this.trigger('sleeping', this);
      }
    }
    
    return elapsed;
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
   * [progress description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  progress: function(elapsed, time, newState) 
  {
    this.time += time;
    this.elapsed += time;
    this.state = newState;
    
    return elapsed - time;
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
      frame[this.attribute] = value;
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