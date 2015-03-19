
anim8.Animation = function(name, input, options, events)
{
	this.name = name;
	this.input = input;
	this.options = options;
	this.events = events;
};

anim8.save = function(name, animation, options)
{
	anim8.animation[name] = anim8.animation( animation, options );
};

anim8.play = function(e, animation, options) 
{
	var animators = anim8( e );
	
	if ( animators.length === 0 )
	{
		return false;
	}
		
  var events = [];
  
  if ( !anim8.isObject( options ) )
  {
    options = {};
  }
  
  if ( anim8.isString( animation ) ) 
  {
    events = anim8.animation[ animation ].events;
  } 
  else if ( anim8.isObject( animation ) )
  {
    events = anim8.animation( animation, options ).events;
  }
  else
  {
    return false;
  }
	
	animators.each(function(animator)
	{
		var eventInstances = [];
	
		for (var i = 0; i < events.length; i++)
		{
			eventInstances.push( new anim8.EventInstance( events[i] ) );
		}
		
		anim8.extend( animator.options, options );
		
	  // Mark attributes as animating and grab properties
	  for (var i = 0; i < eventInstances.length; i++)
	  {
	    var attr = eventInstances[i].attribute;
	    var prop = attr;
    
	    animator.animating[ attr ] = false;
    
	    if (attr in anim8.attribute)
	    {
	      var attribute = anim8.attribute[ attr ];
	      animator.attributes[ attr ] = attribute; 
	      prop = anim8.coalesce( attribute.property, attribute );
	    }
	    else
	    {
	      animator.attributes[attr] = anim8.attribute.default;
	    }
    
	    if (!(prop in animator.properties))
	    {
	      if (prop in anim8.property)
	      {
	        animator.properties[ prop ] = anim8.property[ prop ];
	      }
	      else
	      {
	        animator.properties[ prop ] = anim8.property.default( prop );
	      }  
	    }
	  }
		
		for (var i = 0; i < eventInstances.length; i++)
		{
			animator.events.push( eventInstances[i] );
		}
		
		
		anim8.add( animator );
	});
	
  return animators;
};

anim8.running = false;
anim8.animating = [];
anim8.pending = [];

anim8.add = function(animator)
{
  anim8.pending.push( animator );
  
  if (!anim8.running) 
  {
    anim8.running = true;
		
    requestAnimationFrame( anim8.run );
  }
}

anim8.run = function() 
{
  var now = anim8.now();
  
  // initialize any pending and promote them to animating
  for (var i = 0; i < anim8.pending.length; i++)
  {
    var animator = anim8.pending[i];
    
    animator.initialize();
    anim8.animating.push( animator );
  }
  
  anim8.pending.length = 0;
  
  // update animating based on the current time
  for (var i = 0; i < anim8.animating.length; i++)
  {
    var animator = anim8.animating[i];
    
    animator.update( now );
  }
  
  // apply the attributes calculated and if the animator is done remove it
  for (var i = anim8.animating.length - 1; i >= 0; i--)
  {
    var animator = anim8.animating[i];
    
    animator.apply();
    
    if ( animator.finished )
    {
			animator.cleanup();
			
      anim8.animating.splice( i, 1 );
    }
  }
  
  // if there are animators still remaining call me again!
  if ( anim8.animating.length )
  {
    requestAnimationFrame( anim8.run );
  } 
  else 
  {
    anim8.running = false;
  }
};



// IMPLEMENT
anim8.for = function(subject) {
  var as = anim8.animating;
  for (var i = 0; i < as.length; i++) {
    var a = as[i];
    if (a === subject || (a.isEqualNode && a.isEqualNode(subject))) {
      return a;
    }
  }
  return false;
};