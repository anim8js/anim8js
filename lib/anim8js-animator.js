

anim8.Animator = function(e) 
{
	this.reset( e );
};

anim8.Animator.prototype = 
{
	reset: function(e)
	{
	  this.e = e;
	  this.events = [];
	  this.options = {};
	  this.animating = {};
	  this.attributes = {};
	  this.initial = {};
	  this.frame = {};
	  this.properties = {};
	  this.finished = false;
		this.factory = null;
	},
  initialize: function() 
	{
    for (var attr in this.attributes) 
		{	
      var attribute = this.attributes[attr];
			
      this.frame[attr] = attribute.defaultValue;
      this.initial[attr] = attribute.defaultValue;
    }
  },
  update: function(now) 
	{  
    this.finished = true;
		
    for (var i = 0; i < this.events.length; i++) 
		{
      var e = this.events[i];
      
      e.update( now, this.frame );
      
      if (!e.isFinished()) 
			{
        this.finished = false;
      }
    }
  },
  apply: function() 
	{
    for (var prop in this.properties) 
		{
      this.properties[prop].set( this.e, this );
    }
  },
	cleanup: function()
	{
		// TODO
	},
	play: function(animation, options)
	{
		// TODO
	},
	transition: function(transitionTime, animation, options)
	{
		// TODO
	},
	queue: function(animation, options)
	{
		// TODO
	},
	eventsFor: function(attributes, callback)
	{
		if ( anim8.isString( attributes ) )
		{
			attributes = attributes.split( ' ' );
		}
		if ( !anim8.isArray( attributes ) )
		{
			return false;
		}
		
		attributes = anim8.mapify( anim8.clean( attributes ), true );
		
		var events = this.events;
		var eventCount = 0;
		
		for (var i = 0; i < events.length; i++)
		{
			if ( events[i].attribute in attributes )
			{
				callback.call( this, events[i] );
				
				eventCount++;
			}
		}
		
		return eventCount;
	},
	stop: function(attributes)
	{
		return this.eventsFor(attributes, function(event) 
		{
			while (event.next)
			{
				event = event.next;
			}
			
			event.end();
		});
	},
	end: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.end();
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
	}
};