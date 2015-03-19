
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
  this.delay 			= anim8.coalesce( delay, 0 );
  this.duration 	= anim8.coalesce( duration, 1000 );
  this.sleep 			= anim8.coalesce( sleep, 0 );
  this.repeat 		= anim8.coalesce( repeat, 1 );
};

anim8.Event.prototype = 
{
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
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
      
      if (delta >= 1) 
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
          } 
					else 
					{
            elapsed = this.progress( elapsed, this.duration, anim8.EventState.ANIMATING );
            delta -= 1;
          }
        }
      }
      
      frame[this.attribute] = this.path.compute( frame[this.attribute], this.easing( delta ) );
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
    frame[this.attribute] = this.getEnd();
		
    this.state = anim8.EventState.FINISHED;
  },
  getEnd: function() 
	{
    return this.path.compute( this.path.calculator.create(), this.easing( 1 ) );
  },
	startup: function(now)
	{
    if (this.state === anim8.EventState.CREATED) 
		{
      this.time = now;
			
      if (this.delay) 
			{
        this.state = anim8.EventState.DELAYED;
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
        elapsed = this.progress( elapsed, this.delay, anim8.EventState.ANIMATING );
      }
    }
		
    if (this.isSleeping()) 
		{
      if (elapsed > this.sleep)
			{
        elapsed = this.progress( elapsed, this.sleep, anim8.EventState.ANIMATING );
      }
    }
		
		/*
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
    switch(this.state) {
      case anim8.EventState.CREATED:            return "created";
      case anim8.EventState.DELAYED:            return "delayed";
      case anim8.EventState.ANIMATING:          return "animating";
      case anim8.EventState.SLEEPING:           return "sleeping";
      case anim8.EventState.FINISHED:           return "finished";
    }
  }
};