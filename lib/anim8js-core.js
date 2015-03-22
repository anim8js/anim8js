/*

var script = document.scripts[document.scripts.length - 1];

var m8prop = script.dataset['prop'] || '$';
var m8access = script.dataset['access'] || 'property';
var m8interval = script.dataset['interval'] || 10;

 */

m8 = anim8 = function(subjects) 
{
  if ( this === window ) 
  {
		var args = Array.prototype.slice.call( arguments );
		
		if ( !anim8.isArray( subjects ) )
		{
			subjects = [];
			
			for (var i = 0; i < args.length; i++)
			{
				subjects.push( args[i] );
			}
		}
		
    var animators = [];
    
    for (var i = 0; i < subjects.length; i++) 
    {
      var arg = subjects[ i ];
      
      if ( arg instanceof anim8.Animator ) 
      {
        animators.push( arg );
      } 
      else
      {
				var factory = anim8.factories( arg );
				
				if (factory !== false)
				{
          factory.parseAnimators( arg, animators );
				}
      }
    }
		
		return new anim8( animators );
  } 
  else 
  {
    for (var i = 0; i < subjects.length; i++) 
    {
      this.push( subjects[ i ] );
    }
  }
};

/*****************************************************************
  UTILITY FUNCTIONS
******************************************************************/


anim8.noop = function() {};

anim8.isDefined = function(x) 
{
  return typeof x !== 'undefined';
};

anim8.isFunction = function(x) 
{
  return typeof x === 'function';
};

anim8.isNumber = function(x) 
{
  return typeof x === 'number';
};

anim8.isString = function(x) 
{
  return typeof x === 'string';
};

anim8.isArray = function(x) 
{
  return x instanceof Array;
};

anim8.isObject = function(x) 
{
  return typeof x === 'object';
};

anim8.isElement = function(x)
{
  return typeof HTMLElement === "object" ? x instanceof HTMLElement :
  x && typeof x === "object" && x !== null && x.nodeType === 1 && typeof x.nodeName === "string";
};

anim8.now = function() 
{
  return new Date().getTime();
};

anim8.copy = function(x) 
{
  if ( anim8.isArray(x) ) 
  {
    var copy = [];
    for (var i = 0; i < x.length; i++) 
    {
      copy.push( anim8.copy( x[i] ) );
    }
    x = copy;
  }
  else if ( anim8.isObject(x) ) 
  {
    var copy = {};
    for (var p in x) 
    {
      copy[p] = anim8.copy( x[p] );
    }
    x = copy;
  }
  
  return x;
};

anim8.clean = function(x)
{
	if ( anim8.isArray( x ) )
	{
		for (var i = x.length - 1; i >= 0; i--)
		{
			if ( !x[i] )
			{
				x.splice( i, 1 );
			}
		}
	}
	else if ( anim8.isObject( x ) )
	{
		for (var prop in x)
		{
			if (!x[prop])
			{
				delete x[prop];
			}
		}
	}
	
	return x;
}

anim8.mapify = function(arr, value)
{
	var map = {};
	
	for (var i = 0; i < arr.length; i++)
	{
		map[ arr[i] ] = value;
	}
	
	return map;
};

anim8.coalesce = function(a, b, c, d) 
{
  if (anim8.isDefined(a)) return a;
  if (anim8.isDefined(b)) return b;
  if (anim8.isDefined(c)) return c;
  return d;
};

anim8.delegate = function(functionName, returnThis) 
{  
  if (returnThis) 
  {
    return function() 
    {
      for (var i = 0; i < this.length; i++) 
      {
        this[i][functionName].apply( this[i], arguments );
      }
      
      return this;  
    };
  }
  
  return function() 
  {
    var results = [];
    
    for (var i = 0; i < this.length; i++) 
    {
      results.push( this[i][functionName].apply( this[i], arguments ) );
    }
    
    return results;
  };
  
};

anim8.extend = function(target)
{
	for (var i = 1; i < arguments.length; i++)
	{
		var a = arguments[i];
		
		if ( anim8.isObject( a ) )
		{
			for (var prop in a)
			{
				if (!(prop in target))
				{
					target[prop] = a[prop];
				}
			}	
		}
	}
	
	return target;
};

anim8.eventize = function(object)
{
  var onListeners = function($this, property, events, callback, context)
  {
    events = events.split(' ');
    
    if ( !anim8.isDefined( $this[ property ] ) )
    {
      $this[property] = {};
    }
    
    for (var i = 0; i < events.length; i++)
    {
      if ( !anim8.isDefined( $this[ property ][ events[i] ] ) )
      {
        $this[ property ][ events[i] ] = [];
      }
      
      $this[ property ][ events[i] ].push( [ callback, context || this ] );
    }
  };
  
  object.on = function(events, callback, context)
  {
    onListeners( this, '$on', events, callback, context );
  };
  
  object.once = function(events, callback, context)
  {
    onListeners( this, '$once', events, callback, context );
  };
  
  var offListeners = function(listeners, event, callback)
  {
    if (listeners && event in listeners)
    {
      var eventListeners = listeners[ event ];
      
      for (var k = eventListeners.length - 1; k >= 0; k--)
      {
        if (eventListeners[ k ][0] === callback)
        {
          eventListeners.splice( k, 1 );
        }
      }  
    }
  };
  
  object.off = function(events, callback)
  {
    events = events.split(' ');
    
    for (var i = 0; i < events.length; i++)
    {
      offListeners( this.$on, events[i] );
      offListeners( this.$once, events[i] );
    }
  };
  
  var triggerListeners = function(listeners, event, argument, clear)
  {
    if (listeners && event in listeners)
    {
      var eventListeners = listeners[ event ];
      
      for (var i = 0; i < eventListeners.length; i++)
      {
        var callback = eventListeners[ i ];
        
        callback[0].call( callback[1], argument );
      }
      
      if ( clear )
      {
        eventListeners.length = 0;
      }
    }
  }
  
  object.trigger = function(event, argument)
  {
    triggerListeners( this.$on, event, argument, false );
    triggerListeners( this.$once, event, argument, true );
  };
};


/*****************************************************************
  REGISTRIES
******************************************************************/

// FACTORY      {is(o), parseAnimators(o, out)}
anim8.factories = function(subject) 
{
	for (var factoryName in anim8.factories) 
	{		
		var factory = anim8.factories[ factoryName ];
			
		if ( factory.is( subject ) )
		{			
			return factory;
		}
	}
	
	throw 'No factory exists for subject ' + subject;
};

/* Attributes are the animatable properties of a subject

  anim8.attribute[name] = {
    // the default value for an attribute if none exists on the subject
    defaultValue: 0,
    // the name of the property this attribute maps to. default value: name of the attribute
    property: propertyName,
    // the name of the calculator this attribute requires for mathematical operations. default value: anim8.calculator.default
    calculator: calculatorName,
    // the name of an applier that must be called each frame to calculate the value of a dynamic attribute
    applier: applier,
    // other values can be specified here that the respective factory might use
    "factory specific attributes"
  }
*/
anim8.attribute = function(attr) 
{
  if ( anim8.isObject(attr) && anim8.isDefined(attr.defaultValue) ) 
	{
    return attr;
  }
  if ( anim8.isString(attr) && attr in anim8.attribute ) 
	{
    return anim8.attribute[ attr ];
  }
	
  return anim8.attribute.default;
};

anim8.attribute.default = {defaultValue: 0};
 
/* Easings are functions that are magic

  anim8.applier[name] = {
    // array of properties required 
    properties: [],
    // function to invoke each frame
    apply: function(e, anim)
  }
*/

anim8.easing = function(easing) 
{
  if ( anim8.isFunction( easing ) ) 
	{
    return easing;
  }
	if ( anim8.isString( easing ) )
	{
		if ( easing in anim8.easing )
		{
			return anim8.easing[ easing ];
		}
		if ( easing.indexOf('-') !== -1 )
		{
			var pair = easing.split('-');
			var e = pair[0];
			var t = pair[1];
			
			if ( pair.length >= 2 && e in anim8.easing && t in anim8.easingType )
			{				
				return anim8.easingType[ t ]( anim8.easing[ e ] );
			}
		}
	}
  if ( anim8.isArray( easing ) && easing.length === 4 ) 
	{
    return anim8.easing.bezier.apply( null, easing );
  }
  if ( !anim8.isDefined( easing ) ) 
	{
    return anim8.easing.default;
  }
	
  throw easing + ' is not a valid easing';
};

/*
 
 
 */
anim8.easingType = function(easingType)
{
	if ( anim8.isFunction( easingType ) )
	{
		return easingType;
	}
	if ( anim8.isString( easingType ) && easingType in anim8.easingType )
	{
		return anim8.easingType[ easingType ];
	}
	
	throw easingType + ' is not a valid easing type';
};


/*
 
 
 */
anim8.calculator = function(calc)
{
	if ( anim8.isObject(calc) )
	{
		return calc;
	}
	if ( anim8.isString( calc ) && calc in anim8.calculator )
	{
		return anim8.calculator[ calc ];
	}
	
	return anim8.calculator.default;
	// throw calc + ' is not a valid calculator';
};


/*
 
 
 */
anim8.parser = function(parser)
{
	if ( anim8.isFunction( parser ) )
	{
		return parser;
	}
	if ( anim8.isString( parser ) && parser in anim8.parser )
	{
		return anim8.parser[ parser ];
	}
	
	return false;
	// throw parser + ' is not a valid parser';
};


/*
 
 
 */
anim8.animation = function(animation, options)
{
  if ( animation instanceof anim8.Animation )
  {
    return animation;
  }
	if ( anim8.isString( animation ) && animation in anim8.animation )
	{
		return anim8.animation[ animation ];
	}
	if ( anim8.isObject( animation ) )
	{
		var events = [];
		
		options = options || {};
		
		for (var parserName in animation)
		{
			var parser = anim8.parser( parserName );
			
			if ( parser !== false )
			{
				parser( animation, options, events );
			}
		}
		
		if (events.length)
		{
			return new anim8.Animation( false, animation, options, events );
		}
	}
	
	return false;
	// throw animation + ' is not a valid animation';
};


/*
 
 
 */
anim8.defaults = 
{
  duration: 1000,
  easing: 'ease',
  teasing: 'linear',
  delay: 0,
  sleep: 0,
  repeat: 1
};


/*****************************************************************
  ANIM8 DEFINITION
******************************************************************/

anim8.prototype = new Array();

anim8.prototype.each = function(iterator) 
{
  for (var i = 0; i < this.length; i++) 
  {
    if ( iterator.call( this[i], this[i], i ) === false ) 
    {
      break;
    }
  }
	
	return this;
};

anim8.prototype.filter = function(func)
{
	for (var i = this.length - 1; i >= 0; i--)
	{
		if ( func(this[i]) )
		{
			this.slice(i, 1);
		}
	}
	
	return this;
};

anim8.prototype.isAnimating = function() 
{
  for (var i = 0; i < this.length; i++)
  {
    if ( this[i].isAnimating() )
    {
      return true;
    }
  }
  
  return false;
};

anim8.prototype.pause 			= anim8.delegate('pause', true);
anim8.prototype.transition 	= anim8.delegate('transition', true);
anim8.prototype.play 				= anim8.delegate('play', true);
anim8.prototype.resume 			= anim8.delegate('resume', true);
anim8.prototype.stop 				= anim8.delegate('stop', true);
anim8.prototype.finish 			= anim8.delegate('finish', true);
anim8.prototype.queue 			= anim8.delegate('queue', true);
anim8.prototype.restore			= anim8.delegate('restore', true);

anim8.prototype.on			    = anim8.delegate('on', true);
anim8.prototype.once		    = anim8.delegate('once', true);
anim8.prototype.off			    = anim8.delegate('off', true);
anim8.prototype.trigger     = anim8.delegate('trigger', true);

/*****************************************************************
  ANIM8 ANIMATION LOOP
******************************************************************/

anim8.running = false;
anim8.animating = anim8();

anim8.add = function(animator)
{
  if ( !animator.active )
  {
    anim8.animating.push( animator );
    
    animator.active = true;
  }
  
  if ( !anim8.running )
  {
    anim8.running = true;
		
    requestAnimationFrame( anim8.run );
  }
}

anim8.run = function() 
{
  var now = anim8.now();
  
  // notify animators that we're about to update
  anim8.animating.each(function(animator)
  {
    animator.preupdate();
  });
  
  // update animating based on the current time
  anim8.animating.each(function(animator)
  {
    animator.update( now );
  });
  
  // apply the attributes calculated
  anim8.animating.each(function(animator)
  {
    animator.apply();
  });
  
  // if the animator is done remove it
  anim8.animating.filter(function(animator)
  {
    if ( animator.finished )
    {
			animator.cleanup();
      animator.active = false;
    }
    
    return animator.finished;
  });
  
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