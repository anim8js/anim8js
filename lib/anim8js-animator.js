

anim8.Animator = function(e) 
{
	this.reset( e );
};

anim8.Animator.prototype = 
{
	reset: function(e)
	{
	  this.e = e;
	  this.events = {};
    this.springs = {};
	  this.options = {};
	  this.attributes = {};
	  this.frame = {};
    this.updated = {};
	  this.finished = false;
		this.factory = null;
    this.active = false;
	},
  restore: function()
  {
    
  },
  preupdate: function()
  {
    // 
  },
  update: function(now) 
	{  
    this.wasFinished = this.finished;
    
    this.finished = true;
		
    for (var attr in this.events)
    {
      var e = this.events[ attr ];
      
      this.updated[ attr ] = e.update( now, this.frame );
      
      this.finished = this.finished && e.isFinished();
    }
    
    for (var attr in this.springs)
    {
      var s = this.springs[ attr ];
      
      this.updated[ attr ] = s.update( now, this.frame );
      
      this.finished = false;
    }
  },
  placeSpring: function(s)
  {
    var attr = s.attribute;
    
    this.springs[ attr ] = s;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
  },
  placeEvent: function(e)
  {
    var attr = e.attribute;
    
    this.events[ attr ] = e;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
  },
  apply: function()
	{
    for (var attr in this.frame)
    {
      if ( this.updated[attr] )
      {
        this.e[ attr ] = this.frame[ attr ]; 
      }
    }
    
    this.trimEvents();
  },
  trimEvents: function()
  {
    for (var attr in this.events)
    {
      var e = this.events[attr];
      
      if ( e.isFinished() )
      {
        if ( e.next )
        {                    
          this.placeEvent( e.next );
          this.finished = false;
        }
        else
        {
          delete this.events[attr];
        }
      }
    }
    
    if ( !this.wasFinished && this.finished )
    {
      this.trigger( 'finished', this );
    }
  },
  value: function(attr)
  {
    return this.frame[ attr ];
  },
	cleanup: function()
	{
    // implemented by child classes
    
    this.trigger('cleanup', this);
	},
  createEvents: function(animation, options)
  {
    options = options || {};
    
    var animation = anim8.animation( animation, options );
  
    if (animation === false)
    {
      return false;
    }
    
    var events = animation.newEvents();
    
    if ( animation.isSaved() )
    {
      animation.mergeOptions( options, events );
    }
    
    this.onAnimation( animation, options, events );
    
		anim8.extend( this.options, options );	  
    
    return events;
  },
  onAnimation: function(animation, options, events)
  {
    
  },
  spring: function(spring)
  {
    var spring = anim8.spring( spring );
    
    if ( spring === false )
    {
      return false;
    }

    this.placeSpring( spring );
    
    anim8.add( this );
    
    return spring;
  },
  unspring: function(attributes)
  {
    return this.springsFor( attributes, function(s)
    {
      delete this.springs[ s.attribute ];
    });
  },
	play: function(animation, options, all)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    var attrs = {};
    
    for (var i = 0; i < events.length; i++)
    { 
      this.placeEvent( events[i] );
      
      attrs[ events[i].attribute ] = true;
    }
    
    if ( all )
    {
      for (var attr in this.events)
      {
        if ( !(attr in attrs) )
        {
          this.events[ attr ].finish( this.frame );
        }
      }
    }
    
    anim8.add( this );
    
    return events;
	},
	queue: function(animation, options)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
        
    var maxRemaining = 0.0;
    
    for (var attr in this.events)
    {
      maxRemaining = Math.max( maxRemaining, this.events[attr].timeRemainingInChain() );
    }
        
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      
      if ( attr in this.events )
      {    
        e.delay += (maxRemaining - this.events[attr].timeRemainingInChain());
        
        this.events[attr].queue( e );
      }
      else
      {
        e.delay += maxRemaining;
        
        this.placeEvent( e );
      }
    }
    
    anim8.add( this );
    
    return events;
	},
	transition: function(transitionTime, transitionDelta, transitionEasing, animation, options, all)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    for (var i = 0; i < events.length; i++)
    {
      var e1 = events[i];
      var attr = e1.attribute;
      
      if ( attr in this.events )
      {
        var path = e1.path;
        var calc = path.calculator;
        var e2 = this.events[attr];
        
        var p0 = calc.copy( calc.create(), this.frame[attr] );
        var p1 = e2.getFuture( transitionDelta );
        var p2 = e1.getPoint( 0 );
        
        var transitionPath = new anim8.QuadraticPath( attr, calc, p0, p1, p2 );
        var transitionEvent = new anim8.Event( attr, transitionPath, transitionTime, transitionEasing, 0, 0, 1 ).newInstance();
        
        transitionEvent.next = e1;
        
        this.placeEvent( transitionEvent );
      }
      else
      {
        e1.delay += transitionTime;
     
        this.placeEvent( e1 );
      }
    }
    
    anim8.add( this );
    
    return events;
	},
  objectsFor: function(attributes, callback, objects)
  {
		if ( anim8.isString( attributes ) )
		{
			attributes = attributes.split( ' ' );
		}
    
    var objectCount = 0;
    
		if ( anim8.isArray( attributes ) )
		{
      for (var i = 0; i < attributes.length; i++)
      {
        var attr = attributes[i];
        
        if ( attr in objects )
        {
          callback.call( this, objects[attr] );
        
          objectCount++;
        }
      }
		}
    else
    {
      for (var attr in objects)
      {
        callback.call( this, objects[attr] );
        
        objectCount++;
      }
    }
    
		return objectCount;
  },
	eventsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.events );
	},
	springsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.springs );
	},
	stop: function(attributes)
	{
		return this.eventsFor(attributes, function(event) 
		{
			while (event.next)
			{
				event = event.next;
			}
			
			event.finish( this.frame );
		});
	},
	finish: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.finish( this.frame );
		});
	},
	pause: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.pause();
		});
	},
	resume: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.resume();
		});
	},
  set: function(attributes)
  {
    for (var attr in attributes)
    {
      this.frame[ attr ] = attributes[ attr ];
    }
    
    this.apply();
  },
  hasEvents: function()
  {
    for (var attr in this.events)
    {
      return true;
    }
    
    return false;
  },
  isAnimating: function()
  {
    for (var attr in this.events)
    {
      if ( this.events[attr].isAnimating() )
      {
        return true;
      }
    }
    
    return false;
  }
  
};

anim8.eventize( anim8.Animator.prototype );