
anim8.EventState = 
{
  CREATED: 0,
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  PAUSED: 8,
  FINISHED: 16
};

anim8.Event = function(attribute, path, duration, easing, delay, sleep, repeat) 
{
  this.attribute 	= attribute;
  this.path 			= path;
  this.easing 		= anim8.easing( easing );
  this.delay 			= anim8.coalesce( delay, anim8.defaults.delay );
  this.duration 	= anim8.coalesce( duration, anim8.defaults.duration );
  this.sleep 			= anim8.coalesce( sleep, anim8.defaults.sleep );
  this.repeat 		= anim8.coalesce( repeat, anim8.defaults.repeat );
};

anim8.Event.prototype = 
{
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
	},
  newInstance: function()
  {
    return new anim8.EventInstance( this );
  }
};

anim8.EventInstance = function(event)
{
	this.event 			= event;
	this.attribute 	= event.attribute;
	this.path 			= event.path;
	this.duration 	= event.duration;
	this.easing 		= event.easing;
	this.delay 			= event.delay;
	this.sleep 			= event.sleep;
	this.repeat 		= event.repeat;
  this.state 			= anim8.EventState.CREATED;
  this.time 			= 0;
  this.pauseTime 	= 0;
  this.pauseState = 0;
	this.elapsed		= 0;
	this.next				= null;
};

anim8.EventInstance.prototype = 
{
  update: function(now, frame) 
	{
    var updated = false;
    
    this.startup( now );
    
    var elapsed = this.catchup( now );
    
    if (this.isAnimating()) 
		{			
      var delta = elapsed / this.duration;
      
      if (delta >= 1 || this.duration === 0)
			{
        if (--this.repeat === 0) 
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
  progress: function(elapsed, time, newState) 
	{
    this.time += time;
		this.elapsed += time;
    this.state = newState;
		
    return elapsed - time;
  },
  finish: function(frame) 
	{
    this.applyValue( frame, this.path.calculator.create(), 1.0 );
    this.state = anim8.EventState.FINISHED;
    
    this.trigger('finish', this);
  },
  getPoint: function(delta)
  {
    return this.path.compute( this.path.calculator.create(), this.easing( delta ) );
  },
  getFuture: function(fdelta)
  {
    return this.getPoint( Math.min( 1.0, this.getDelta() + fdelta ) );
  },
  getDelta: function()
  {
    return this.isAnimating() ? Math.min( 1.0, (anim8.now() - this.time) / this.duration ) : 0.0;
  },
  getStart: function()
  {
    return this.getPoint( 0 );
  },
  getEnd: function() 
	{
    return this.getPoint( 1 );
  },
  applyValue: function(frame, baseValue, delta)
  {
    var value = this.path.compute( baseValue, this.easing( delta ) );
        
    if ( value !== false )
    {
      frame[this.attribute] = value;
    }
  },
	startup: function(now)
	{
    if (this.state === anim8.EventState.CREATED) 
		{
      this.time = now;
			
      if (this.delay) 
			{
        this.state = anim8.EventState.DELAYED;
        
        this.trigger('delaying', this);
      } 
			else 
			{
        this.state = anim8.EventState.ANIMATING;
      }
    }
	},
  catchup: function(now) 
	{
		var elapsed = now - this.time;
		
    if (this.isDelayed()) 
		{
      if (elapsed > this.delay) 
			{
        this.trigger('delayed', this);
        
        elapsed = this.progress( elapsed, this.delay, anim8.EventState.ANIMATING );
      }
    }
		
    if (this.isSleeping()) 
		{
      if (elapsed > this.sleep)
			{
        this.trigger('slept', this);
        
        elapsed = this.progress( elapsed, this.sleep, anim8.EventState.ANIMATING );
      }
    }
		
		/*
    TODO
		if (this.isAnimating())
		{
			var total = (this.sleep + this.duration);
			
			
			
			if (this.sleep)
			{
				var iterations = (this.sleep + this.duration);
			}
		}
		*/
		
		return elapsed;
  },
  timeRemaining: function() 
	{
		return this.event.totalTime() - this.elapsed;
  },
  pause: function() 
	{
    if (this.state !== anim8.EventState.PAUSED) 
		{
      this.pauseTime = anim8.now();
      this.pauseState = this.state;
      this.state = anim8.EventState.PAUSED; 
    }
  },
  resume: function() 
	{
    if (this.state === anim8.EventState.PAUSED) 
		{
      this.time += anim8.now() - this.pauseTime;
      this.state = this.pauseState; 
    }
  },
  isAnimating: function() 
	{
    return (this.state === anim8.EventState.ANIMATING);
  },
  isFinished: function() 
	{
    return (this.state === anim8.EventState.FINISHED);
  },
  isDelayed: function() 
	{
    return (this.state === anim8.EventState.DELAYED);
  },
  isPaused: function() 
	{
    return (this.state === anim8.EventState.PAUSED);
  },
  isSleeping: function() 
	{
    return (this.state === anim8.EventState.SLEEPING);
  },
  hasStates: function(states) 
	{
    return (this.state & states) !== 0;
  },
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
  },
  hasTrue: function()
  {
    return this.path.trues;
  }
};

anim8.eventize( anim8.EventInstance.prototype );