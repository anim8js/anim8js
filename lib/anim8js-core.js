
/**
 * The core object of the framework. It extends Array and the method can be used 
 * to construct an array of animators from subjects.
 * 
 * @param {array} subjects
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

/**
 * A function that does nothing.
 */
anim8.noop = function() {};

/**
 * Returns true if the given variable is defined.
 */
anim8.isDefined = function(x) 
{
  return typeof x !== 'undefined';
};

/**
 * Returns true if the given variable is a function.
 */
anim8.isFunction = function(x) 
{
  return !!(x && x.constructor && x.call && x.apply);
};

/**
 * Returns true if the given variable is a number.
 */
anim8.isNumber = function(x) 
{
  return typeof x === 'number';
};

/**
 * Returns true if the given variable is a string.
 */
anim8.isString = function(x) 
{
  return typeof x === 'string';
};

/**
 * Returns true if the given variable is an array. This should be checked before
 * anim8.isObject since Arrays are objects.
 */
anim8.isArray = function(x) 
{
  return x instanceof Array;
};

/**
 * Returns true if the given variable is an object.
 */
anim8.isObject = function(x) 
{
  return typeof x === 'object';
};

/**
 * Returns true if the given variable is an HTML element.
 */
anim8.isElement = function(x)
{
  return typeof HTMLElement === "object" ? x instanceof HTMLElement :
  x && typeof x === "object" && x !== null && x.nodeType === 1 && typeof x.nodeName === "string";
};

/**
 * Returns the current time in milliseconds.
 */
anim8.now = (function() {

  return Date.now ? Date.now : function() 
  {
    return new Date().getTime();
  };
  
})();


/**
 * Performs a deep copy of the given variable. If the variable is an array or object a new instance
 * of that type is created where the values are copied as well. All other types can't be copied
 * (most likely because they're scalar) so they are returned as-is.
 *
 * @param {any} x
 */
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

/**
 * Returns the first defined variable of a possible 4 variables.
 */
anim8.coalesce = function(a, b, c, d) 
{
  if (anim8.isDefined(a)) return a;
  if (anim8.isDefined(b)) return b;
  if (anim8.isDefined(c)) return c;
  return d;
};

/**
 * Creates a function which calls a method on all elements in the array or on the first element.
 *
 * @param {string} functionName
 * @param {string} returning
 */
anim8.delegate = function(functionName, returning) 
{  
  switch (returning)
  {
  case anim8.delegate.RETURN_THIS:
    return function() 
    {
      for (var i = 0; i < this.length; i++) 
      {
        this[i][functionName].apply( this[i], arguments );
      }
      
      return this;  
    };
    
  case anim8.delegate.RETURN_RESULTS:
    return function() 
    {
      var results = [];
    
      for (var i = 0; i < this.length; i++) 
      {
        results.push( this[i][functionName].apply( this[i], arguments ) );
      }
    
      return results;
    };
    
  case anim8.delegate.RETURN_FIRST:
    return function()
    {
      return this.length === 0 ? undefined : this[0][functionName].apply( this[0], arguments );
    };
  }
  
  return anim8.noop;
};

/**
 * this is returned at the end.
 */
anim8.delegate.RETURN_THIS = 'this';

/**
 * An array of results for each method call is returned.
 */
anim8.delegate.RETURN_RESULTS = 'results';

/**
 * The result of the first element.
 */
anim8.delegate.RETURN_FIRST = 'first';


/**
 * Adds functions to the given object (or prototype) so you can listen for any number of events
 * on the given object, optionally once. Listeners can be removed later.
 */
anim8.eventize = function(object)
{
  var onListeners = function($this, property, events, callback, context)
  {
    events = events.split(' ');
    
    if ( !anim8.isDefined( $this[ property ] ) )
    {
      $this[ property ] = {};
    }
    
    for (var i = 0; i < events.length; i++)
    {
      if ( !anim8.isDefined( $this[ property ][ events[i] ] ) )
      {
        $this[ property ][ events[i] ] = [];
      }
      
      $this[ property ][ events[i] ].push( [ callback, context || $this ] );
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
			var max = eventListeners.length;
      
      for (var i = 0; i < max; i++)
      {
        var callback = eventListeners[ i ];
        
        callback[0].call( callback[1], argument );
      }
      
      if ( clear )
      {
				if ( eventListeners.length !== max )
				{
					listeners[ event ] = eventListeners.slice( max );	
				}
				else
				{
	        eventListeners.length = 0;	
				}
      }
		}
  };
  
  object.trigger = function(event, argument)
  {
    triggerListeners( this.$on, event, argument, false );
    triggerListeners( this.$once, event, argument, true );
  };
};

/**
 * Parses milliseconds from a string or number. If a number is given it's assumed to be milliseconds
 * and is returned immediately.
 *
 * @param {string|number} time
 */
anim8.time = (function()
{
  var regex = /(-?\d*(\.\d+)|-?\d+)(s|sec|min|ms|hr)?/;
  
  var conversions = {
    s:    1000,
    sec:  1000,
    min:  1000 * 60,
    ms:   1,
    hr:   1000 * 60 * 60
  };
  
  return function(time) 
  {  
    if ( anim8.isNumber( time ) )
    {
      return time;
    }
    if ( anim8.isString( time ) )
    {
      var parsed = regex.exec( time );
      
      if ( parsed )
      {
        var time = parseFloat( parsed[1] );
        var unit = parsed[3];
        
        if ( unit in conversions )
        {
          time *= conversions[ unit ];
        }
        
        return Math.floor(time);
      }
    }
    
    return false;
  };
  
})();

/**
 * Provides a way to wrap a variable so calculators don't try copying it on parse.
 *
 * @param {any} variable
 */
anim8.constant = function(variable)
{
  return function() 
  {
    return variable;
  };
};


/*****************************************************************
  REGISTRIES
******************************************************************/

/**
 * Returns a factory for the given subject or throws an error if no factory exists.
 *
 * @param {any} subject
 */
anim8.factories = function(subject, optional) 
{
	for (var factoryName in anim8.factories) 
	{
		var factory = anim8.factories[ factoryName ];
			
		if ( factory.is( subject ) )
		{			
			return factory;
		}
	}
  
  if ( optional )
  {
    return false;
  }
	
	throw 'No factory exists for subject ' + subject;
};

/* Attributes are the animatable properties of a subject

  anim8.attribute[name] = {
    // the default value for an attribute if none exists on the subject
    defaultValue: 0,
    // the name of the calculator this attribute requires for mathematical operations. default value: anim8.calculator.default
    calculator: calculatorName,
    // other values can be specified here that the respective factory might use
    "factory specific attributes"
  }
*/

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {object|string} attr
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

/**
 * The default attribute.
 */
anim8.attribute.default = {defaultValue: 0};

/**
 * The default values for event properties.
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

/**
 * anim8 is an instance of Array. All array methods are supported.
 */
anim8.prototype = new Array();

/**
 * Invokes a callback for each element in the array.
 * 
 * @param {function} iterator
 */
anim8.prototype.each = function(iterator, context) 
{
  for (var i = 0; i < this.length; i++) 
  {
    if ( iterator.call( context || this[i], this[i], i ) === false ) 
    {
      break;
    }
  }
	
	return this;
};

/**
 * Invokes a callback for each element in the array and if true is returned that element is removed from the array.
 *
 * @param {function} filterer
 */
anim8.prototype.filter = function(filterer)
{	
	var alive = 0;
	
	for (var i = 0; i < this.length; i++)
	{
		var remove = filterer( this[i] );
		
		if ( !remove )
		{
			this[alive++] = this[i];
		}
	}
	
	this.length = alive;
	
	return this;
};

/**
 * Returns true if any of the animators in the array are animating.
 */
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

/**
 * Returns the first animator in the array.
 */
anim8.prototype.first = function()
{
  return this[0];
};

/**
 * Plays a sequence of events separated by a delay given an animation to play on all Animators.
 */
anim8.prototype.sequence = function(delay, easing, animation, options)
{
  return new anim8.Sequence( this, delay, easing, animation, options );
};

/**
 * Adds the following methods to anim8 to make an array of Animators appear like a single Animator.
 */
anim8.prototype.pause 			= anim8.delegate( 'pause', anim8.delegate.RETURN_THIS );
anim8.prototype.transition 	= anim8.delegate( 'transition', anim8.delegate.RETURN_THIS );
anim8.prototype.play 				= anim8.delegate( 'play', anim8.delegate.RETURN_THIS );
anim8.prototype.resume 			= anim8.delegate( 'resume', anim8.delegate.RETURN_THIS );
anim8.prototype.stop 				= anim8.delegate( 'stop', anim8.delegate.RETURN_THIS );
anim8.prototype.finish 			= anim8.delegate( 'finish', anim8.delegate.RETURN_THIS );
anim8.prototype.end   			= anim8.delegate( 'end', anim8.delegate.RETURN_THIS );
anim8.prototype.queue 			= anim8.delegate( 'queue', anim8.delegate.RETURN_THIS );
anim8.prototype.restore			= anim8.delegate( 'restore', anim8.delegate.RETURN_THIS );
anim8.prototype.eventsFor   = anim8.delegate( 'eventsFor', anim8.delegate.RETURN_RESULTS );
anim8.prototype.set         = anim8.delegate( 'set', anim8.delegate.RETURN_THIS );
anim8.prototype.get         = anim8.delegate( 'get', anim8.delegate.RETURN_FIRST );
anim8.prototype.spring 			= anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS );
anim8.prototype.unspring 		= anim8.delegate( 'unspring', anim8.delegate.RETURN_THIS );
anim8.prototype.springsFor 	= anim8.delegate( 'springsFor', anim8.delegate.RETURN_RESULTS );
anim8.prototype.tweenTo   	= anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS );
anim8.prototype.applyInitialState = anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS );

anim8.prototype.on			    = anim8.delegate( 'on', anim8.delegate.RETURN_THIS );
anim8.prototype.once		    = anim8.delegate( 'once', anim8.delegate.RETURN_THIS );
anim8.prototype.off			    = anim8.delegate( 'off', anim8.delegate.RETURN_THIS );
anim8.prototype.trigger     = anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS );

/*****************************************************************
  ANIM8 ANIMATION LOOP
******************************************************************/

/**
 * Whether the animation cycle is currently running. This is true
 * when where are active animators and anim8.run is being called
 * and false otherwise.
 */
anim8.running = false;

/**
 * Live Mode keeps the animation cycles running even when there aren't
 * Animators. For highly interactive applications enabling this may
 * take up more resources but it will result in smoother animations. When
 * the animation cycle goes from stopped to running it takes a few frames
 * to smooth out when this is false.
 */
anim8.live = false;

/**
 * The anim8 instance for all active animators.
 */
anim8.animating = anim8();

/**
 * The function to call if animations need to be done.
 *
 * @param {function} callback
 */
anim8.requestRun = (function() 
{  
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var requestor = window.requestAnimationFrame;
  
  for (var x = 0; x < vendors.length && !requestor; ++x) 
  {
    requestor = window[ vendors[x] + 'RequestAnimationFrame' ];
  }
  
  if (!requestor)
  {
    var lastTime = 0;
    
    return function(callback)
    {
      var now = anim8.now();
      var timeToCall = Math.max( 0, 16 - (currTime - lastTime) );
      var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  
  return function(callback)
  {
    requestor( callback );
  };
  
})();

/**
 * Adds an animator to the list if animating if it isn't there already. If the animation
 * loop isn't currently running it's started.
 * 
 * @param {anim8.Animator} animator
 */
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
		anim8.trigger('starting');
		anim8.requestRun( anim8.run );
  }
}

/**
 * Executes an animation cycle which consists of four operations:
 *   1. Call preupdate on all Animators
 *   2. Call update on all Animators
 *   3. Call apply on all Animators
 *   4. Remove finished Animators
 * When there are no more animating the cycle is stopped.
 */
anim8.run = function() 
{
	anim8.trigger('begin');
	
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
			animator.deactivate();
      animator.active = false;
    }
    
    return animator.finished;
  });
	
	anim8.trigger('end');
  
  // if there are animators still remaining call me again!
  if ( anim8.animating.length || anim8.live )
  {
		anim8.requestRun( anim8.run );
  } 
  else 
  {
    anim8.running = false;
		anim8.trigger('finished');
  }
};

/**
 * Add events to the animation cycle: begin, end, finished, starting
 */
anim8.eventize( anim8 );