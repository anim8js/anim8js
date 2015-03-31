
/**
 * Converts a subject into an animator and returns it. If the subject 
 * is already an animator it's returned immediately.
 *
 * @param {any} subject
 */
m8 = anim8 = function(subject) 
{
  if ( subject instanceof anim8.Animator )
  {
    return subject;
  }

  var factory = anim8.factory( subject, true );

  if ( factory === false )
  {
    return false;
  }

  return factory.animatorFor( subject );
};

/**
 * Converts an array of subjects into an array of Animators.
 *
 * @param {array} subject
 */
m8s = anim8s = function(subjects)
{
  var factory = anim8.factory( subjects, true );
  var animators = [];

  if ( factory !== false )
  {
    factory.animatorsFor( subjects, animators );

    return new anim8.Animators( animators );
  }

  if ( !anim8.isArray( subjects ) )
  {
    subjects = [ subjects ];
  }

  var animators = [];

  for (var i = 0; i < subjects.length; i++)
  {
    var animator = anim8( subjects[i] );

    if ( animator !== false )
    {
      animators.push( animator );
    }
  }

  return new anim8.Animators( animators );
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
 * If the user is interested in seeing warnings they can override this by specifying
 * a function which accepts a text argument providing a generc message, a second argument
 * which has the input that caused the warning, and a third agument with the object
 * throwing the warning. Most warnings that are thrown occur when an animation is
 * trying to be parsed an the user provided an invalid animation, time, easing, etc.
 *
 * @param {string} message
 * @param {any} source
 */
anim8.log = false;

/**
 * Returns the size of the variable. The size of a variable is dependent on the variable
 * type. For arrays and strings their length is returned. If it's an object the number of
 * enumerable properties is returned. If it's a number, the number is returned. Otherwise
 * zero is returned.
 *
 * @param {any} x
 */
 anim8.size = function(x)
 {
  if ( anim8.isArray( x ) || anim8.isString( x ) )
  {
    return x.length;
  }
  else if ( x === null )
  {
    return 0;
  }
  else if ( anim8.isObject( x ) )
  {
    var size = 0;

    for (var prop in x)
    {
      size++;
    }

    return size;
  }
  else if ( anim8.isNumber( x ) )
  {
    return x;
  }

  return 0;
};

/**
 * Determines whether the given variable is empty.
 *
 * @param {any} x
 */
anim8.isEmpty = function(x)
{
  if ( anim8.isArray( x ) || anim8.isString( x ) )
  {
    return x.length > 0;
  }
  else if ( x === null )
  {
    return true;
  }
  else if ( anim8.isObject( x ) )
  {
    for (var prop in x)
    {
      return false;
    }
  }
  else if ( anim8.isNumber( x ) )
  {
    return x !== 0.0;
  }

  return true;
};

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

  case anim8.delegate.RETURN_TRUE:
    return function()
    {
      for (var i = 0; i < this.length; i++)
      {
        if ( this[i][functionName].apply( this[i], arguments ) )
        {
          return true;
        }
      }

      return false;
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
 * True if any of the methods return true, otherwise false.
 */
anim8.delegate.RETURN_TRUE = 'true';


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
 * @param [any] returnOnInvalid
 */
anim8.time = (function()
{
  var regex = /^(-?\d*(\.\d+)|-?\d+)(ms|s|c|cs|third|jiffy|sec|m|min|h|hr)?$/;
  
  var conversions = {
    ms:     1,
    c:      100,
    cs:     100,
    jiffy:  1000 / 60,
    third:  1000 / 60,
    s:      1000,
    sec:    1000,
    m:      1000 * 60,
    min:    1000 * 60,
    h:      1000 * 60 * 60,
    hr:     1000 * 60 * 60
  };
  
  return function(time, returnOnInvalid) 
  {  
    if ( anim8.isNumber( time ) )
    {
      // raw numbers are considered milliseconds
      return Math.floor( time );
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
        
        return Math.floor( time );
      }
    }
    
    return anim8.coalesce( returnOnInvalid, 0 );
  };
  
})();

/**
 * Parses repeats from a string or number.
 *
 * @param {string|number}
 * @param [any] returnOnInvalid
 */
anim8.repeat = (function() 
{
  var conversions = {
    inf:        Number.POSITIVE_INFINITY,
    infinity:   Number.POSITIVE_INFINITY,
    infinite:   Number.POSITIVE_INFINITY,
    once:       1,
    twice:      2,
    thrice:     3,
    dozen:      12,
    random:     4 // chosen by fair dice roll. guaranteed to be random.
  };

  return function(repeat, returnOnInvalid)
  {
    if ( anim8.isNumber( repeat ) )
    {
      return repeat;
    }
    if ( anim8.isString( repeat ) )
    {
      repeat = repeat.toLowerCase();

      if ( repeat in conversions )
      {
        return conversions[ repeat ];
      }
      else
      {
        var parsed = parseInt( repeat );

        if ( !isNaN(parsed) )
        {
          return parsed;
        }
      }
    }

    return anim8.coalesce( returnOnInvalid, anim8.defaults.repeat );
  };

})();

/**
 * Parses delay from a string or number.
 *
 * @param {string|number}
 * @param [any] returnOnInvalid
 * @see anim8.time
 */ 
anim8.delay = function(time)
{
  return anim8.time( time, anim8.defaults.delay );
};

/**
 * Parses sleep from a string or number.
 *
 * @param {string|number}
 * @param [any] returnOnInvalid
 * @see anim8.time
 */ 
anim8.sleep = function(time)
{
  return anim8.time( time, anim8.defaults.sleep );
};

/**
 * Parses duration from a string or number.
 *
 * @param {string|number}
 * @param [any] returnOnInvalid
 * @see anim8.time
 */ 
anim8.duration = function(time)
{
  return anim8.time( time, anim8.defaults.duration );
};


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

  /**
   * The default animation duration in milliseconds.
   */
  duration: 1000,

  /**
   * The default easing
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   */
  repeat: 1

};

anim8.Defer = function(factory, methods)
{
	this.$factory = factory;
	
	for (var i = 0; i < methods.length; i++)
	{	
		this[ methods[i] ] = this.$push( methods[i] );
	}
};

anim8.Defer.prototype = 
{	
	$reset: function(eventable, previous, eventType, event, callback)
	{
		this.$eventable = eventable;
		this.$previous = previous;
		this.$eventType = eventType;
		this.$event = event;
    this.$callback = callback;
		this.$calls = [];
		this.$next = [];
		
		if ( this.$isRoot() )
		{
			this.$register();
		}
	},
	$isRoot: function()
	{
		return this.$eventable === this.$previous;
	},
	$register: function()
	{
		this.$eventable[ this.$eventType ]( this.$event, this.$run, this );
	},
	$push: function(methodName)
	{
		return function() 
		{
			this.$calls.push( [methodName, arguments] );
			
			return this;
		};
	},
	$run: function() 
	{
    if ( anim8.isFunction( this.$callback ) )
    {
      this.$callback.call( this.$eventable, this );
    }
    
		for (var i = 0; i < this.$calls.length; i++)
		{
			var call = this.$calls[ i ];
			
			this.$eventable[ call[0] ].apply( this.$eventable, call[1] );
		}
		
		for (var k = 0; k < this.$next.length; k++)
		{
			this.$next[ k ].$register();
		}
	},
	undefer: function()
	{
		return this.$previous;
	},
	defer: function(eventType, event, callback)
	{
		var next = new this.$factory( this.$eventable, this, eventType, event, callback );
		
		this.$next.push( next );
		
		return next;
	}
};

/**
 * Returns an easing based on the given input. If the input is a function it's assumed to be an easing function and is
 * returned immediately. If the input is a string the easing with that name is returned. If the input is a string in the
 * format 'easing-easingType' then an easing is returned that is a combination of the easing with the given name and the
 * easingType with the given name. If the given input is an array with 4 elements it's assumed to be a bezier path and
 * one is created and returned. If no input is given the default easing is returned. If an easing cannot be determined
 * then an error is thrown.
 * 
 * @param {function|string|array} easing
 */
anim8.easing = function(easing, returnOnInvalid) 
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
  if ( anim8.isArray( easing ) && easing.length === 4 && anim8.isNumber( easing[0] ) && anim8.isNumber( easing[1] ) && anim8.isNumber( easing[2] ) && anim8.isNumber( easing[3] ) ) 
	{
    return anim8.easing.bezier.apply( null, easing );
  }
  if ( !anim8.isDefined( easing ) ) 
	{
    return anim8.easing.default;
  }
	
  if ( anim8.isDefined( returnOnInvalid ) )
  {
    return returnOnInvalid;
  }
  
  throw easing + ' is not a valid easing';
};

/**
 * Returns true if the given string would result in returning an easing.
 * 
 * @see anim8.easing
 * @param {string} easing
 */
anim8.isEasingName = function(easing)
{
  if ( easing in anim8.easing )
  {
    return true;
  }
  
	var pair = easing.split('-');
	var e = pair[0];
	var t = pair[1];
	
	if ( pair.length >= 2 && e in anim8.easing && t in anim8.easingType )
	{				
    return true;
	}
  
  return false;
};

/**
 * Returns an easing type based on the input. If the input is a function that function is immediately returned. 
 * If the input is a string the easing type with that name is returned. If no easing type could be determined
 * an error is thrown.
 *
 * @param {function|string} easingType
 */
anim8.easingType = function(easingType, optional)
{
	if ( anim8.isFunction( easingType ) )
	{
		return easingType;
	}
	if ( anim8.isString( easingType ) && easingType in anim8.easingType )
	{
		return anim8.easingType[ easingType ];
	}
  
  if ( optional )
  {
    return false;
  }
	
	throw easingType + ' is not a valid easing type';
};


/**
 * Easing & Easing Type functions
 */

anim8.easingType.in = function(easing) 
{
	return function(x) {
		return easing( x );
	};
};

anim8.easingType.out = function(easing) 
{
	return function(x) {
		return 1.0 - easing( 1.0 - x );
	};
};

anim8.easingType.inout = function(easing) 
{
	return function(x) {
	  if ( x < 0.5 ) {
	    return easing( 2.0 * x ) * 0.5;
	  } else {
	    return 1.0 - (easing( 2.0 - 2.0 * x ) * 0.5);
	  }
	};
};

anim8.easingType.pong = function(easing) 
{
	return function(x) {
	  if ( x < 0.5 ) {
	    return easing( 2.0 * x );
	  } else {
	    return easing( 2.0 - 2.0 * x );
	  }
	};
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.linear = function(x) 
{
  return x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.quad = function(x)
{
  return x * x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoKDAuMyooMS14KSooMS14KSp4KSsoMy4wKigxLXgpKngqeCkrKHgqeCp4KSkqKDEteCkreCooMS0oMS14KSooMS14KSooMS14KSooMS14KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.ease = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  var x2 = x * x;
  var eq1 = (0.3 * i2 * x) + (3.0 * i * x2) + (x2 * x);
  var eq2 = 1.0 - i2 * i2;
  
  return eq1 * i + eq2 * x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d
anim8.easing.cubic = function(x) 
{
  return x * x * x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCp4IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.quartic = function(x) 
{
  var x2 = x * x;
  return x2 * x2;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCp4KngiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.quintic = function(x) 
{
  var x2 = x * x;
  return x2 * x2 * x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeCp4KngpKyh4KngpLXgiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.back = function(x) 
{
  var x2 = x * x;
	var x3 = x2 * x;
	return x3 + x2 - x;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJzaW4oeCoxLjU3MDc5NjMyNjc5KSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d
anim8.easing.sine = function(x) 
{
	return Math.sin( x * 1.57079632679 );
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLXgqKDcuMC8xMCkpKngqKDEwLjAvMy4wKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d
anim8.easing.overshot = function(x)
{
  return (1.0 - x * (7.0 / 10)) * x * (10.0 / 3.0);
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeCp4KigoMi4wKngqeCp4KSt4KngtKDQuMCp4KSsyLjApKSotc2luKHgqMTAuOTk1NTc0Mjg3NikiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.elastic = function(x) 
{
  var x2 = x * x;
  var x3 = x2 * x;
  var scale = x2 * ((2.0 * x3) + x2 - (4.0 * x) + 2.0);
	var wave = -Math.sin(x * 10.9955742876);
	return scale * wave;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJhYnMoeC1zaW4oeCozLjE0MTU5MjY1MzU5KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.revisit = function(x) 
{
  return Math.abs( x - Math.sin(x * 3.14159265359) );
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWNvcyh4KngqeCozNi4wKSooMS4wLXgpKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d
anim8.easing.lasso = function(x)
{
  return (1.0 - Math.cos(x * x * x * 36.0) * (1.0 - x));
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS4wLXgqeCkqY29zKHgqeCp4KjE0LjgwNDQwNjYwMTYpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.slowbounce = function(x) 
{
  var x2 = x * x;
  return (1.0 - Math.abs((1.0 - x2) * Math.cos(x2 * x * 14.8044066016)));
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS4wLXgpKmNvcyh4KngqMTQuODA0NDA2NjAxNikpKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d
anim8.easing.bounce = function(x) 
{
  return (1.0 - Math.abs((1.0 - x) * Math.cos(x * x * 14.8044066016)));
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS14KSooMS14KSpjb3MoeCp4KjE0LjgwNDQwNjYwMTYpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.smallbounce = function(x) 
{
  var inv = 1.0 - x;
	return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 14.8044066016)));
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS14KSooMS14KSpjb3MoeCp4KjcpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.tinybounce = function(x) 
{
  var inv = 1.0 - x;
	return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 7.0)));
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoY29zKHgqeCoxMi4wKSp4KigxLjAteCkreCkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.hesitant = function(x) 
{
	return (Math.cos(x * x * 12.0) * x * (1.0 - x) + x);
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJzcXJ0KHgpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.sqrt = function(x)
{
  return Math.sqrt( x );
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoKDEuMC0oMS14KSooMS14KSooMS14KSooMS14KSkreCkqMC41IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.sqrtf = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  return ((1.0 - i2 * i2) + x) * 0.5;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIobG9nKHgpKzIuMCkqMC41IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.log10 = function(x)
{
  return (Math.log10(x) + 2.0) * 0.5;
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeDwwLjc_KHgqLTAuMzU3KTooKCh4LTAuNykqKHgtMC43KSoyNy41LTAuNSkqMC41KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--
anim8.easing.slingshot = function(x)
{
  if (x < 0.7) {
		return (x * -0.357);
  } else {
    var d = x - 0.7;
    return ((d * d * 27.5 - 0.5) * 0.5);
  }
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIxLXNxcnQoMS14KngpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.circular = function(x)
{
  return 1.0 - Math.sqrt( 1 - x * x );
};

// http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMy4wKigxLjAteCkqeCp4KSsoeCp4KngpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-
anim8.easing.gentle = function(x)
{
  return (3.0 * (1.0 - x) * x * x) + (x * x * x);
};

anim8.easing.bezier = function(mX1, mY1, mX2, mY2) 
{
  // https://gist.githubusercontent.com/gre/1926947/raw/KeySpline.js
  
  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function CalcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function GetSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function GetTForX(aX) {
    // Newton raphson iteration
    var aGuessT = aX;
    for (var i = 0; i < 4; ++i) {
      var currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope == 0.0) return aGuessT;
      var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  
  return function(x) {
    return CalcBezier( GetTForX( x ), mY1, mY2 );
  };
};

anim8.easing.cssEase      = anim8.easing.ease;
anim8.easing.cssEaseIn    = anim8.easing.quad;
anim8.easing.cssEaseOut   = anim8.easingType.out( anim8.easing.quad );
anim8.easing.cssEaseInOut = anim8.easingType.inout( anim8.easing.quad );
anim8.easing.cssLinear    = anim8.easing.linear;

anim8.easing.default      = anim8.easing.ease;

/**
 * Instantiates a new color given red, green, blue, and white components.
 * If a component is missed it's default value is either 255 (white) or
 * 1.0 (opaque).
 */
anim8.color = function(r, g, b, a) 
{
  return {
    r: anim8.coalesce( r, 255 ),
    g: anim8.coalesce( g, 255 ),
    b: anim8.coalesce( b, 255 ),
    a: anim8.coalesce( a, 1.0 )
  };
};

/**
 * The array of parsing methods to execute sequentally until a color is returned.
 */
anim8.color.parsers = 
[
  { /* already parsed color */
    parse: function(input) {
      if (typeof input === 'object') {
        var color = {
          r: this.parseComponent(input.r, 'parseInt', 255),
          g: this.parseComponent(input.g, 'parseInt', 255),
          b: this.parseComponent(input.b, 'parseInt', 255),
          a: this.parseComponent(input.a, 'parseFloat', 1.0)
        };
        return color;
      }
      return false;
    },
    parseComponent: function(c, parseFunction, max) {
      var t = typeof c;
      var v = max;
      if (t === 'string') {
        var vparsed = window[parseFunction](t, 10);
        if (!isNaN(vparsed)) {
          v = vparsed;
        }
      }
      else if (t === 'number') {
        v = c;
      }
      if (v > max) {
        v = max;
      }
      if (v < 0) {
        v = 0;
      }
      return v;
    }
  }, 
  { /* colorname */
    names: {
      transparent:{r:255,g:256,b:255,a:0.0},
      aliceblue:{r:240,g:248,b:255,a:1.0},
      antiquewhite:{r:250,g:235,b:215,a:1.0},
      aqua:{r:0,g:255,b:255,a:1.0},
      aquamarine:{r:127,g:255,b:212,a:1.0},
      azure:{r:240,g:255,b:255,a:1.0},
      beige:{r:245,g:245,b:220,a:1.0},
      bisque:{r:255,g:228,b:196,a:1.0},
      black:{r:0,g:0,b:0,a:1.0},
      blanchedalmond:{r:255,g:235,b:205,a:1.0},
      blue:{r:0,g:0,b:255,a:1.0},
      blueviolet:{r:138,g:43,b:226,a:1.0},
      brown:{r:165,g:42,b:42,a:1.0},
      burlywood:{r:222,g:184,b:135,a:1.0},
      cadetblue:{r:95,g:158,b:160,a:1.0},
      chartreuse:{r:127,g:255,b:0,a:1.0},
      chocolate:{r:210,g:105,b:30,a:1.0},
      coral:{r:255,g:127,b:80,a:1.0},
      cornflowerblue:{r:100,g:149,b:237,a:1.0},
      cornsilk:{r:255,g:248,b:220,a:1.0},
      crimson:{r:220,g:20,b:60,a:1.0},
      cyan:{r:0,g:255,b:255,a:1.0},
      darkblue:{r:0,g:0,b:139,a:1.0},
      darkcyan:{r:0,g:139,b:139,a:1.0},
      darkgoldenrod:{r:184,g:134,b:11,a:1.0},
      darkgray:{r:169,g:169,b:169,a:1.0},
      darkgreen:{r:0,g:100,b:0,a:1.0},
      darkkhaki:{r:189,g:183,b:107,a:1.0},
      darkmagenta:{r:139,g:0,b:139,a:1.0},
      darkolivegreen:{r:85,g:107,b:47,a:1.0},
      darkorange:{r:255,g:140,b:0,a:1.0},
      darkorchid:{r:153,g:50,b:204,a:1.0},
      darkred:{r:139,g:0,b:0,a:1.0},
      darksalmon:{r:233,g:150,b:122,a:1.0},
      darkseagreen:{r:143,g:188,b:143,a:1.0},
      darkslateblue:{r:72,g:61,b:139,a:1.0},
      darkslategray:{r:47,g:79,b:79,a:1.0},
      darkturquoise:{r:0,g:206,b:209,a:1.0},
      darkviolet:{r:148,g:0,b:211,a:1.0},
      deeppink:{r:255,g:20,b:147,a:1.0},
      deepskyblue:{r:0,g:191,b:255,a:1.0},
      dimgray:{r:105,g:105,b:105,a:1.0},
      dodgerblue:{r:30,g:144,b:255,a:1.0},
      feldspar:{r:209,g:146,b:117,a:1.0},
      firebrick:{r:178,g:34,b:34,a:1.0},
      floralwhite:{r:255,g:250,b:240,a:1.0},
      forestgreen:{r:34,g:139,b:34,a:1.0},
      fuchsia:{r:255,g:0,b:255,a:1.0},
      gainsboro:{r:220,g:220,b:220,a:1.0},
      ghostwhite:{r:248,g:248,b:255,a:1.0},
      gold:{r:255,g:215,b:0,a:1.0},
      goldenrod:{r:218,g:165,b:32,a:1.0},
      gray:{r:128,g:128,b:128,a:1.0},
      green:{r:0,g:128,b:0,a:1.0},
      greenyellow:{r:173,g:255,b:47,a:1.0},
      honeydew:{r:240,g:255,b:240,a:1.0},
      hotpink:{r:255,g:105,b:180,a:1.0},
      indianred:{r:205,g:92,b:92,a:1.0},
      indigo:{r:75,g:0,b:130,a:1.0},
      ivory:{r:255,g:255,b:240,a:1.0},
      khaki:{r:240,g:230,b:140,a:1.0},
      lavender:{r:230,g:230,b:250,a:1.0},
      lavenderblush:{r:255,g:240,b:245,a:1.0},
      lawngreen:{r:124,g:252,b:0,a:1.0},
      lemonchiffon:{r:255,g:250,b:205,a:1.0},
      lightblue:{r:173,g:216,b:230,a:1.0},
      lightcoral:{r:240,g:128,b:128,a:1.0},
      lightcyan:{r:224,g:255,b:255,a:1.0},
      lightgoldenrodyellow:{r:250,g:250,b:210,a:1.0},
      lightgrey:{r:211,g:211,b:211,a:1.0},
      lightgreen:{r:144,g:238,b:144,a:1.0},
      lightpink:{r:255,g:182,b:193,a:1.0},
      lightsalmon:{r:255,g:160,b:122,a:1.0},
      lightseagreen:{r:32,g:178,b:170,a:1.0},
      lightskyblue:{r:135,g:206,b:250,a:1.0},
      lightslateblue:{r:132,g:112,b:255,a:1.0},
      lightslategray:{r:119,g:136,b:153,a:1.0},
      lightsteelblue:{r:176,g:196,b:222,a:1.0},
      lightyellow:{r:255,g:255,b:224,a:1.0},
      lime:{r:0,g:255,b:0,a:1.0},
      limegreen:{r:50,g:205,b:50,a:1.0},
      linen:{r:250,g:240,b:230,a:1.0},
      magenta:{r:255,g:0,b:255,a:1.0},
      maroon:{r:128,g:0,b:0,a:1.0},
      mediumaquamarine:{r:102,g:205,b:170,a:1.0},
      mediumblue:{r:0,g:0,b:205,a:1.0},
      mediumorchid:{r:186,g:85,b:211,a:1.0},
      mediumpurple:{r:147,g:112,b:216,a:1.0},
      mediumseagreen:{r:60,g:179,b:113,a:1.0},
      mediumslateblue:{r:123,g:104,b:238,a:1.0},
      mediumspringgreen:{r:0,g:250,b:154,a:1.0},
      mediumturquoise:{r:72,g:209,b:204,a:1.0},
      mediumvioletred:{r:199,g:21,b:133,a:1.0},
      midnightblue:{r:25,g:25,b:112,a:1.0},
      mintcream:{r:245,g:255,b:250,a:1.0},
      mistyrose:{r:255,g:228,b:225,a:1.0},
      moccasin:{r:255,g:228,b:181,a:1.0},
      navajowhite:{r:255,g:222,b:173,a:1.0},
      navy:{r:0,g:0,b:128,a:1.0},
      oldlace:{r:253,g:245,b:230,a:1.0},
      olive:{r:128,g:128,b:0,a:1.0},
      olivedrab:{r:107,g:142,b:35,a:1.0},
      orange:{r:255,g:165,b:0,a:1.0},
      orangered:{r:255,g:69,b:0,a:1.0},
      orchid:{r:218,g:112,b:214,a:1.0},
      palegoldenrod:{r:238,g:232,b:170,a:1.0},
      palegreen:{r:152,g:251,b:152,a:1.0},
      paleturquoise:{r:175,g:238,b:238,a:1.0},
      palevioletred:{r:216,g:112,b:147,a:1.0},
      papayawhip:{r:255,g:239,b:213,a:1.0},
      peachpuff:{r:255,g:218,b:185,a:1.0},
      peru:{r:205,g:133,b:63,a:1.0},
      pink:{r:255,g:192,b:203,a:1.0},
      plum:{r:221,g:160,b:221,a:1.0},
      powderblue:{r:176,g:224,b:230,a:1.0},
      purple:{r:128,g:0,b:128,a:1.0},
      red:{r:255,g:0,b:0,a:1.0},
      rosybrown:{r:188,g:143,b:143,a:1.0},
      royalblue:{r:65,g:105,b:225,a:1.0},
      saddlebrown:{r:139,g:69,b:19,a:1.0},
      salmon:{r:250,g:128,b:114,a:1.0},
      sandybrown:{r:244,g:164,b:96,a:1.0},
      seagreen:{r:46,g:139,b:87,a:1.0},
      seashell:{r:255,g:245,b:238,a:1.0},
      sienna:{r:160,g:82,b:45,a:1.0},
      silver:{r:192,g:192,b:192,a:1.0},
      skyblue:{r:135,g:206,b:235,a:1.0},
      slateblue:{r:106,g:90,b:205,a:1.0},
      slategray:{r:112,g:128,b:144,a:1.0},
      snow:{r:255,g:250,b:250,a:1.0},
      springgreen:{r:0,g:255,b:127,a:1.0},
      steelblue:{r:70,g:130,b:180,a:1.0},
      tan:{r:210,g:180,b:140,a:1.0},
      teal:{r:0,g:128,b:128,a:1.0},
      thistle:{r:216,g:191,b:216,a:1.0},
      tomato:{r:255,g:99,b:71,a:1.0},
      turquoise:{r:64,g:224,b:208,a:1.0},
      violet:{r:238,g:130,b:238,a:1.0},
      violetred:{r:208,g:32,b:144,a:1.0},
      wheat:{r:245,g:222,b:179,a:1.0},
      white:{r:255,g:255,b:255,a:1.0},
      whitesmoke:{r:245,g:245,b:245,a:1.0},
      yellow:{r:255,g:255,b:0,a:1.0},
      yellowgreen:{r:154,g:205,b:50,a:1.0}
    },
    parse: function(input) {
      if (typeof input === 'string') {
        input = input.toLowerCase();
        if (input in this.names) {
          var named = this.names[input];
          return {
            r: named.r,
            g: named.g,
            b: named.b,
            a: named.a
          };
        }
      }
      return false;
    }
  },
  { /* #rgb */
    regex: /^#?([0-9A-F])([0-9A-F])([0-9A-F])$/i,
    parse: function(input) {
      var matches = this.regex.exec(input);
      if (matches !== null) {
        return {
          r: parseInt(matches[1] + matches[1], 16),
          g: parseInt(matches[2] + matches[2], 16),
          b: parseInt(matches[3] + matches[3], 16),
          a: 1.0
        };
      }
      return false;
    }
  },
  { /* #rrggbb */
    regex: /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
    parse: function(input) {
      var matches = this.regex.exec(input);
      if (matches !== null) {
        return {
          r: parseInt(matches[1], 16),
          g: parseInt(matches[2], 16),
          b: parseInt(matches[3], 16),
          a: 1.0
        };
      }
      return false;
    }
  },
  { /* RGB(r,g,b) */
    regex: /^rgb\(\s*(\d{3})\s*,\s*(\d{3})\s*,\s*(\d{3})\s*\)$/i,
    parse: function(input) {
      var matches = this.regex.exec(input);
      if (matches !== null) {
        return {
          r: Math.min(255, parseInt(matches[1], 10)),
          g: Math.min(255, parseInt(matches[2], 10)),
          b: Math.min(255, parseInt(matches[3], 10)),
          a: 1.0
        };
      }
      return false;
    }
  },
  { /* RGBA(r,g,b,a) */
    regex: /^rgba\(\s*(\d{3})\s*,\s*(\d{3})\s*,\s*(\d{3})\s*,\s*([01]?\.\d+|[01])\)$/i,
    parse: function(input) {
      var matches = this.regex.exec(input);
      if (matches !== null) {
        return {
          r: Math.min(255, parseInt(matches[1], 10)),
          g: Math.min(255, parseInt(matches[2], 10)),
          b: Math.min(255, parseInt(matches[3], 10)),
          a: Math.min(1.0, parseFloat(matches[4]))
        };
      }
      return false;
    }
  }
];

/**
 * Parses a color from a string.
 *
 * @param {string} input
 */
anim8.color.parse = function(input)
{
  var cp = m8.color.parsers;
  
  for (var i = 0; i < this.parsers.length; i++)
  {
    var parsed = this.parsers[i].parse(input);
    
    if (parsed !== false) 
    {
      return parsed;
    }
  }
  
  return this.invalidColor;
};

/**
 * Formats a color to a string.
 * 
 * @param {object} color
 */
anim8.color.format = function(color)
{
  var ca = anim8.coalesce( color.a, 1.0 );
  var cr = anim8.coalesce( color.r, 255 );
  var cg = anim8.coalesce( color.g, 255 );
  var cb = anim8.coalesce( color.b, 255 );
  
  if (ca === 1.0)
  {
    var r = cr.toString( 16 );
    var g = cg.toString( 16 );
    var b = cb.toString( 16 );
    
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    
    return '#' + r + g + b;
  }
  else
  {
    return 'rgba(' + cr + ',' + cg + ',' + cb + ',' + ca + ')';
  }
};

/**
 * The color to return when input is invalid.
 */
anim8.color.invalidColor = anim8.color.defaultValue =
{
  r: 255,
  g: 255,
  b: 255,
  a: 1.0
};
/**
 * Calculators perform math and basic operations for a specific data structure. Calculators have the following methods.
 *
 *  parse(x, default)
 *  copy(out, copy)
 * -clone(out)
 *  create()
 *  zero(out)
 * -scale(out, scale)
 * -add(out, amount)
 *  adds(out, amount, amountScale)
 * -sub(out, amount)
 *  mul(out, scale)
 * -interpolate(out, start, end, delta)
 *  distanceSq(a, b)
 *  isValid(a)
 *  isNaN(a)
 *  isZero(a, epsilon)
 *  isEqual(a, b, epsilon)
 */

/**
 * Returns a calculator based on the input. If the input is an object that object is immediately returned.
 * If the input is a string the calculator with that name is returned. If no calculator could be determined
 * the default calculator is returned.
 *
 * @param {object|string} calc
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
};

/**
 * Creates a calculator and fills in any missing methods where possible.
 * 
 * @param {string} name
 * @param {object} methods
 */
anim8.calculator.create = function(name, methods)
{
  var defaultMethods = 
	{
	  clone: function(out) 
		{
	    return this.copy( this.create(), out );
	  },
	  scale: function(out, scale) 
		{
	    return this.adds( out, out, scale - 1 );
	  },
	  add: function(out, amount) 
		{
	    return this.adds( out, amount, 1 );
	  },
	  sub: function(out, amount) 
		{
	    return this.adds( out, amount, -1 );
	  },
	  interpolate: function(out, start, end, delta) 
		{
	    out = this.zero( out );
	    out = this.adds( out, start, 1 - delta );
	    out = this.adds( out, end, delta );
	    return out;
	  },
		distance: function(a, b)
		{
			return Math.sqrt( this.distanceSq( a, b ) );
		},
    isPristine: function(x)
    {
      return ( x === true || anim8.isFunction( x ) );
    }
	};
  
  for (var method in defaultMethods)
  {
    if ( !(method in methods) )
    {
      methods[ method ] = defaultMethods[ method ];
    }
  }
  
	anim8.calculator[name] = methods; 
};

/**
 * A calculator for number primitives.
 */
anim8.calculator.create('number', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return x;
		}
		if ( anim8.isString( x ) )
		{
			x = parseFloat( x );
			
			if (!isNaN(x))
			{
				return x;
			}
		}
		
		return defaultValue;
	},
  copy: function(out, copy) 
	{	
    return copy;
  },
  create: function() 
	{
    return 0.0;
  },
  zero: function(out) 
	{
    return 0.0;
  },
  adds: function(out, amount, amountScale) 
	{
    return out += amount * amountScale;
  },
  mul: function(out, scale) 
	{
    return out *= scale;
  },
  distanceSq: function(a, b) 
	{
    var ab = a - b;
    return ab * ab;
  },
  isValid: function(a) 
	{
    return typeof a === 'number';
  },
  isNaN: function(a) 
	{
    return isNaN(a);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a - b) < epsilon;
  }
});

/*
 * A calculator for objects with an x and y component (number)
 */
anim8.calculator.create('2d', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x
			};
		}
		if ( anim8.isObject( x ) )
		{
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y )
			};
		}
    if ( anim8.isString( x ) )
    {
      var aliases = {
        'left':   0,
        'right':  100,
        'middle': 50,
        'center': 50,
        'top':    0,
        'bottom': 100
      };
      
      if ( x.indexOf(' ') === -1 )
      {
        var _x = parseFloat( x );
        
        if ( !isNaN(_x) || x in aliases )
        {
          return {
            x: x in aliases ? aliases[x] : _x,
            y: x in aliases ? aliases[x] : _x
          };
        }
      }
      else
      {
        var pair = x.split(' ');
        var _x = parseFloat( pair[0] );
        var _y = parseFloat( pair[1] );
        
        if ((!isNaN(_x) || pair[0] in aliases) && (!isNaN(_y) || pair[1] in aliases))
        {
          return {
            x: pair[0] in aliases ? aliases[pair[0]] : _x,
            y: pair[1] in aliases ? aliases[pair[1]] : _y
          };
        }
      }
    }
    
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
		
		return false;
	},
  copy: function(out, copy) 
	{
    out.x = copy.x;
    out.y = copy.y;
    return out;
  },
  create: function() 
	{
    return {x: 0.0, y:0.0};
  },
  zero: function(out) 
	{
    out.x = 0.0;
    out.y = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.x *= scale.x;
    out.y *= scale.y;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dx = a.x - b.x;
    var dy = a.y - b.y;    
    return dx * dx + dy * dy;
  },
  isValid: function(a) 
	{
    return typeof a === 'object' && 'x' in a && 'y' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.x) || isNaN(a.y);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.x) < epsilon && 
					 Math.abs(a.y) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.x - b.x) < epsilon && 
					 Math.abs(a.y - b.y) < epsilon;
  }
});

/**
 * A calculator for objects with an x, y, and z component (number)
 */
anim8.calculator.create('3d',
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x,
				z: x
			};
		}
		if ( anim8.isObject( x ) )
		{	
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y ),
				z: anim8.coalesce( x.z, defaultValue.z )
			};
		}
    
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
		
		return false;
	},
  copy: function(out, copy) 
	{
    out.x = copy.x;
    out.y = copy.y;
		out.z = copy.z;
    return out;
  },
  create: function() 
	{
    return {x: 0.0, y:0.0, z:0.0};
  },
  zero: function(out) 
	{ 
    out.x = 0.0;
    out.y = 0.0;
		out.z = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
		out.z += amount.z * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.x *= scale.x;
    out.y *= scale.y;
		out.z *= scale.z;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dx = a.x - b.x;
    var dy = a.y - b.y;   
		var dz = a.z - b.z; 
    return dx * dx + dy * dy + dz * dz;
  },
  isValid: function(a) 
	{
    return typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.x) || isNaN(a.y) || isNaN(a.z);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.x) < epsilon && 
					 Math.abs(a.y) < epsilon && Math.abs(a.z) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.x - b.x) < epsilon && 
		  		 Math.abs(a.y - b.y) < epsilon && 
					 Math.abs(a.z - b.z) < epsilon;
  }
});

/**
 * A calculator for objects with an x, y, z, and angle components.
 */
anim8.calculator.create('quaternion', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: 0,
				y: 0,
				z: 1,
				angle: x
			};
		}
		if ( anim8.isObject( x ) )
		{
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y ),
				z: anim8.coalesce( x.z, defaultValue.z ),
				angle: anim8.coalesce( x.angle, defaultValue.angle )
			};
		}
    
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
		
		return false;
	},
  copy: function(out, copy) 
	{
    out.x = copy.x;
    out.y = copy.y;
		out.z = copy.z;
		out.angle = copy.angle;
    return out;
  },
  create: function() 
	{
    return {x: 0.0, y:0.0, z:0.0, angle:0.0};
  },
  zero: function(out) 
	{
    out.x = 0.0;
    out.y = 0.0;
		out.z = 0.0;
		out.angle = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
		out.z += amount.z * amountScale;
		out.angle += amount.angle * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.x *= scale.x;
    out.y *= scale.y;
		out.z *= scale.z;
		out.angle *= scale.angle;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dx = a.x - b.x;
    var dy = a.y - b.y;   
		var dz = a.z - b.z; 
		var da = a.angle - b.angle;
    return dx * dx + dy * dy + dz * dz + da * da;
  },
  isValid: function(a) 
	{
    return typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a && 'angle' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.x) || isNaN(a.y) || isNaN(a.z) || isNaN(a.angle);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.x) < epsilon && 
		  		 Math.abs(a.y) < epsilon && 
		       Math.abs(a.z) < epsilon && 
		       Math.abs(a.angle) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.x - b.x) < epsilon && 
					 Math.abs(a.y - b.y) < epsilon && 
				   Math.abs(a.z - b.z) < epsilon && 
		       Math.abs(a.angle - b.angle) < epsilon;
  }
});

/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 */
anim8.calculator.create('rgb', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				r: x,
				g: x,
				b: x
			};
		}
		
		return anim8.color.parse( x );
	},
  copy: function(out, copy) 
	{
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    return out;
  },
  create: function() 
	{
    return {r: 0, g:0, b:0};
  },
  zero: function(out) 
	{
    out.r = 0;
    out.g = 0;
    out.b = 0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    return dr * dr + dg * dg + db * db;
  },
  isValid: function(a) 
	{
    return anim8.isObject( a ) && 'r' in a && 'g' in a && 'b' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon;
  }
});

/**
 * A calculator for objects with r, g, & b components 
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 */
anim8.calculator.create('rgba', 
{
	parse: function(a, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( a ) )
		{
			return {
				r: a,
				g: a,
				b: a,
				a: 1.0
			};
		}
		
		return anim8.color.parse( a );
	},
  copy: function(out, copy) 
	{
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    out.a = copy.a;
    return out;
  },
  create: function() 
	{
    return {r: 0, g:0, b:0, a:0};
  },
  zero: function(out) 
	{
    out.r = 0;
    out.g = 0;
    out.b = 0;
    out.a = 0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    out.a += amount.a * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    out.a *= scale.a;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    var da = a.a - b.a;    
    return dr * dr + dg * dg + db * db + da * da;
  },
  isValid: function(a) 
	{
    return anim8.isObject( a ) && 'r' in a && 'g' in a && 'b' in a && 'a' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b) || isNaN(a.a);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon && 
           Math.abs(a.a) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon && 
           Math.abs(a.a - b.a) < epsilon;
  }
});

/**
 * Sets the default calculator to the numeric calculator.
 */
anim8.calculator.default = anim8.calculator.number;
anim8.path = function(path)
{
  if ( path instanceof anim8.Path )
  {
    return path;
  }
  if ( anim8.isString( path ) && path in anim8.path )
  {
    return anim8.path[ spring ];
  }
  if ( anim8.isObject( path ) && path.type in anim8.path )
  {
    return anim8.path[ path.type ]( path );
  }
  
  return false;
};


anim8.Path = function()
{
};

anim8.Path.prototype = 
{
  reset: function(name, calculator, points)
  {
    this.name = name;
    this.calculator = anim8.calculator( calculator );
    this.points = points;
    this.trues = this.hasTrue();
  },
  compute: function(out, delta) 
	{
    return out;
  },
  hasTrue: function() 
	{
    var ps = this.points;
    
    for (var i = 0; i < ps.length; i++) 
    {
      if (ps[i] === true) 
      {
        return true;
      }
    }
    return false;
  },
  reference: function() 
	{
    return this.trues ? this.copy() : this;
  },
  last: function()
  {
    return this.points[ this.points.length - 1 ];
  },
  first: function()
  {
    return this.points[ 0 ];
  },
  point: function(i)
  {
    return this.points[ i ];
  },
  resolvePoint: function(i)
  {
    var p = this.points[ i ];
    
    if ( anim8.isFunction( p ) )
    {
      p = p();
    }
    
    return p;
  }
};





anim8.DeltaPath = function(name, calculator, points, deltas) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
};

anim8.DeltaPath.prototype = new anim8.Path();

anim8.DeltaPath.prototype.compute = function(out, delta) 
{
  var ds = this.deltas;
  var end = ds.length - 2;
  var i = 0;
  while (ds[i + 1] < delta && i < end) i++;
  var d0 = ds[i];
  var d1 = ds[i + 1];
  var pd = (delta - d0) / (d1 - d0);
  var p0 = this.resolvePoint( i );
  var p1 = this.resolvePoint( i + 1 );
  
  return this.calculator.interpolate( out, p0, p1, pd );
};
  
anim8.DeltaPath.prototype.copy = function() 
{
    return new anim8.DeltaPath( this.name, anim8.copy(this.points), anim8.copy(this.deltas), this.calculator );
};

anim8.path.delta = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  if (!path.deltas)
  {
    path.deltas = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.DeltaPath(
    path.name,
    calc,
    path.points,
    path.deltas
  );
};



anim8.PointPath = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.PointPath.prototype = new anim8.Path();

anim8.PointPath.prototype.compute = function(out, delta)
{
  return this.calculator.copy( out, this.resolvePoint( 0 ) );
};
  
anim8.PointPath.prototype.copy = function() 
{
  return new anim8.PointPath( this.name, this.calculator, this.points[0] );
};

anim8.path.point = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PointPath(
    path.name,
    calc,
    calc.parse( path.point )
  );
};



anim8.KeyframePath = function(name, calculator, points, deltas, easings) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
  this.easings = easings;
};

anim8.KeyframePath.prototype = new anim8.Path();

anim8.KeyframePath.prototype.compute = function(out, delta) 
{  
  var ds = this.deltas;
  var end = ds.length - 2;
  
  if ( delta < ds[0] ) {
    return false;
  }
  
  if ( delta > ds[ds.length - 1] ) {
    return this.points[ds.length - 1];
  }
  
  var i = 0;
  while (ds[i + 1] < delta && i < end) i++;
  var d0 = ds[i];
  var d1 = ds[i + 1];
  var pd = (delta - d0) / (d1 - d0);
  var p0 = this.resolvePoint( i );
  var p1 = this.resolvePoint( i + 1 );
  var ea = this.easings[i];
  
  return this.calculator.interpolate( out, p0, p1, ea( pd ) );
};
  
anim8.KeyframePath.prototype.copy = function() 
{
  return new anim8.KeyframePath( this.name, this.calculator, anim8.copy(this.points), anim8.copy(this.deltas), anim8.copy(this.easings) );
};

anim8.path.keyframe = function(point)
{
  var calc = anim8.calculator( path.calculator );
  
  if (!path.deltas)
  {
    path.deltas = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }
  
  var defaultEasing = anim8.easing( path.easings, null );
  
  if ( !anim8.isDefined( path.easings ) || !anim8.isArray( path.easings ) || defaultEasing !== null )
  {
    path.easings = [];
    
    for (var i = 0; i < path.points.length; i++)
    {
      path.easings[ i ] = defaultEasing;
    }
  }
  
  for (var i = 0; i < path.easings.length; i++)
  {
    path.easings[ i ] = anim8.easing( path.easings[ i ] );
  }
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.KeyframePath(
    path.name,
    calc,
    path.points,
    path.deltas,
    path.easings
  );
};




anim8.CubicPath = function(name, calculator, p0, p1, p2, p3)
{
  this.reset( name, calculator, [p0, p1, p2, p3] );
};

anim8.CubicPath.prototype = new anim8.Path();

anim8.CubicPath.prototype.compute = function(out, d1)
{
  var calc = this.calculator;
  var d2 = d1 * d1;
  var d3 = d1 * d2;
  var i1 = 1 - d1;
  var i2 = i1 * i1;
  var i3 = i1 * i2;
  
  out = calc.copy( out, this.resolvePoint( 0 ) );
  out = calc.scale( out, i3 );
  out = calc.adds( out, this.resolvePoint( 1 ), 3 * i2 * d1 );
  out = calc.adds( out, this.resolvePoint( 2 ), 3 * i1 * d2 );
  out = calc.adds( out, this.resolvePoint( 3 ), d3 );
  
  return out;
};
  
anim8.CubicPath.prototype.copy = function() 
{
  return new anim8.CubicPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
};

anim8.path.cubic = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.CubicPath(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 ),
    calc.parse( path.p3 )
  );
};




anim8.QuadraticPath = function(name, calculator, p0, p1, p2)
{
  this.reset( name, calculator, [p0, p1, p2] );
};

anim8.QuadraticPath.prototype = new anim8.Path();

anim8.QuadraticPath.prototype.compute = function(out, d1)
{
  var calc = this.calculator;
  var d2 = d1 * d1;
  var i1 = 1 - d1;
  var i2 = i1 * i1;
  
  out = calc.copy( out, this.resolvePoint( 0 ) );
  out = calc.scale( out, i2 );
  out = calc.adds( out, this.resolvePoint( 1 ), 2 * i1 * d1 );
  out = calc.adds( out, this.resolvePoint( 2 ), d2 );
    
  return out;
};
  
anim8.QuadraticPath.prototype.copy = function() 
{
  return new anim8.QuadraticPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
};

anim8.path.quadratic = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.QuadraticPath(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 )
  );
};



anim8.CompiledPath = function(name, path, pointCount)
{
  var calc = path.calculator;
  var points = [];
  
  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }
  
  this.reset( name, calc, points );
};

anim8.CompiledPath.prototype = new anim8.Path();

anim8.CompiledPath.prototype.compute = function(out, delta)
{
  var a = Math.floor( delta * this.points.length );
  var index = Math.min( a, this.points.length - 1 );
  
  return this.calculator.copy( out, this.resolvePoint( index ) );
};
  
anim8.CompiledPath.prototype.copy = function() 
{
  return new anim8.CompiledPath( this.name, this, this.points.length );
};

anim8.path.compiled = function(path)
{
  return new anim8.CompiledPath(
    path.name,
    anim8.path( path.path ),
    path.pointCount
  );
};





anim8.Tween = function(name, calculator, start, end)
{
  this.reset( name, calculator, [start, end] );
};

anim8.Tween.prototype = new anim8.Path();

anim8.Tween.prototype.compute = function(out, delta)
{
  return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
};
  
anim8.Tween.prototype.copy = function() 
{
    return new anim8.Tween( this.name, this.calculator, this.points[0], this.points[1] );
};

anim8.path.tween = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.Tween(
    path.name, 
    calc,
    calc.parse( path.start ),
    calc.parse( path.end )
  );
};




anim8.JumpPath = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.JumpPath.prototype = new anim8.Path();

anim8.JumpPath.prototype.compute = function(out, delta)
{
  var a = Math.floor( delta * this.points.length );
  var index = Math.min( a, this.points.length - 1 );
  
  return this.calculator.copy( out, this.resolvePoint( index ) );
};
  
anim8.JumpPath.prototype.copy = function() 
{
  return new anim8.JumpPath( this.name, this.calculator, anim8.copy(this.points) );
};

anim8.path.jump = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  for (var i = 0; i < path.points.length; i++)
  {
    path.points[ i ] = calc.parse( path.points[i] );
  }
  
  return new anim8.JumpPath(
    path.name, 
    calc,
    path.points
  );
};


/**
 * Returns a spring if the provided argument is a spring, the name of a spring, or
 * an object with a spring type to be created. If none of these conditions are true
 * then false is returned.
 *
 * @param {anim8.Spring|string|object} spring
 */
anim8.spring = function(spring)
{
  if ( spring instanceof anim8.Spring )
  {
    return spring;
  }
  if ( anim8.isString( spring ) && spring in anim8.spring )
  {
    return anim8.spring[ spring ];
  }
  if ( anim8.isObject( spring ) && spring.type in anim8.spring )
  {
    return anim8.spring[ spring.type ]( spring );
  }
  
  return false;
};


/**
 * A spring has a resting point, a current position, and the velocity currently enacting on the position
 * based on the implementing classes logic.
 */
anim8.Spring = function()
{
};

anim8.Spring.prototype = 
{
  /**
   * Resets the spring's properties.
   * 
   * @param {string} attribute
   * @param {string|object} calculator
   * @param {any} rest
   * @param {any} position
   */
  reset: function(attribute, calculator, rest, position, gravity)
  {
    var calc = anim8.calculator( calculator );
    var a = anim8.attribute( attribute );
    
    this.attribute    = attribute;
    this.calculator   = calc;
    this.rest         = calc.parse( rest, a.defaultValue );
    this.position     = calc.parse( position, a.defaultValue );
    this.gravity      = calc.parse( gravity, calc.create() );
    this.velocity     = calc.create();
    this.time         = 0;
  },
  
  /**
   * Updates the spring given the current time in milliseconds and the frame which
   * contains (or will contain) the attribute to which this spring is animating.
   *
   * @param {number} now
   * @param {object} frame
   */
  update: function(now, frame)
  {
    if (this.time === 0)
    {
      this.time = now;
    }
    
    var calc = this.calculator;
    
    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (now - this.time) * 0.001, anim8.Spring.MAX_DT );
    
    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.copy( {}, this.position );
    
    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );
    
    this.time = now;
    
    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, anim8.Spring.EPSILON );
    
    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    
    return updated;
  },
  
  /**
   * Resolves the position to the expected format.
   */
  resolveRest: function()
  {
    return anim8.isFunction( this.rest ) ? this.rest() : this.rest;
  },
  
  /**
   * Method that's invoked on each update.
   *
   * @param {number} dt
   */
  updateVelocity: function(dt)
  {
    
  }
};

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
anim8.Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
anim8.Spring.EPSILON = 0.0001;




/**
 * A box spring is a simple string
 */
anim8.BoxSpring = function(attribute, calculator, position, rest, constant, gravity)
{
  var a = anim8.attribute( attribute );
    
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.acceleration   = this.calculator.create();
  this.constant       = this.calculator.parse( constant, a.defaultValue );
};

anim8.BoxSpring.prototype = new anim8.Spring();

anim8.BoxSpring.prototype.updateVelocity = function(dt)
{
  var calc = this.calculator;
  
  this.acceleration = calc.copy( this.acceleration, this.resolveRest() );
  this.acceleration = calc.sub( this.acceleration, this.position );
  this.acceleration = calc.mul( this.acceleration, this.constant );
  this.velocity     = calc.adds( this.velocity, this.acceleration, dt );
};

anim8.spring.box = function(spring)
{ 
  return new anim8.BoxSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.constant,
    spring.gravity
  );
};




anim8.LinearSpring = function(attribute, calculator, position, rest, damping, stiffness, gravity)
{
  var a = anim8.attribute( attribute );
  
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.damping      = this.calculator.parse( damping, a.defaultValue );
  this.stiffness    = this.calculator.parse( stiffness, a.defaultValue );
  this.temp0        = this.calculator.create();
  this.temp1        = this.calculator.create();
};

anim8.LinearSpring.prototype = new anim8.Spring();

anim8.LinearSpring.prototype.updateVelocity = function(dt)
{
  // velocity += ((stiffness * (position - rest)) - (damping * velocity)) * elapsed.seconds;
	// position += velocity * elapsed.seconds;
    
  var calc = this.calculator;

  this.temp1 = calc.copy( this.temp1, this.damping );
  this.temp1 = calc.mul( this.temp1, this.velocity );
  
  this.temp0 = calc.copy( this.temp0, this.position );
  this.temp0 = calc.sub( this.temp0, this.resolveRest() );
  this.temp0 = calc.mul( this.temp0, this.stiffness );
  this.temp0 = calc.sub( this.temp0, this.temp1 );
  
  this.velocity = calc.adds( this.velocity, this.temp0, dt );
};

anim8.spring.linear = function(spring)
{ 
  return new anim8.LinearSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};







anim8.DistanceSpring = function(attribute, calculator, position, rest, distance, damping, stiffness, gravity)
{
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = this.calculator.create();
};

anim8.DistanceSpring.prototype = new anim8.Spring();

anim8.DistanceSpring.prototype.updateVelocity = function(dt)
{
  // d = DISTANCE( position, rest )
  // velocity += ((position - rest) / d * stiffness * |distance - d| - (damping * velocity)) * elapsed.seconds;
  // position += velocity * elapsed.seconds;

  var calc = this.calculator;
  var rest = this.resolveRest();
  
  var d = calc.distance( this.position, rest );
  
  this.temp = calc.copy( this.temp, this.position )
  this.temp = calc.sub( this.temp, rest );
  
  if ( d !== 0 )
  {
  	this.temp = calc.scale( this.temp, 1.0 / d );
  	this.temp = calc.scale( this.temp, (d - this.distance) * this.stiffness );
  }

  this.temp = calc.adds( this.temp, this.velocity, -this.damping );

  this.velocity = calc.adds( this.velocity, this.temp, dt );
};

anim8.spring.distance = function(spring)
{ 
  return new anim8.DistanceSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.distance,
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};

anim8.EventState = 
{
  CREATED: 0,
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  PAUSED: 8,
  FINISHED: 16
};

anim8.Event = function(attribute, path, duration, easing, delay, sleep, repeat, hasInitialState, parser) 
{
  this.attribute 	      = attribute;
  this.path 			      = path;
  this.easing 		      = anim8.easing( easing );
  this.delay 			      = anim8.delay( delay );
  this.duration 	      = anim8.duration( duration );
  this.sleep 			      = anim8.sleep( sleep );
  this.repeat 		      = anim8.repeat( repeat );
  this.hasInitialState  = hasInitialState;
  this.parser           = parser;
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
  },
  clone: function()
  {
    return new anim8.Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.repeat, this.hasInitialState, this.parser );
  },
  getParser: function()
  {
    return this.parser;
  }
};

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
  this.state 			      = anim8.EventState.CREATED;
  this.time 			      = 0;
  this.pauseTime 	      = 0;
  this.pauseState       = 0;
	this.elapsed		      = 0;
	this.next				      = null;
};

anim8.EventInstance.prototype = 
{
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
  hasInitialState: function()
  {
    return this.event.hasInitialState;
  },
  getParser: function()
  {
    return this.event.parser;
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
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
	},
  timeRemaining: function() 
	{    
		return this.totalTime() - this.elapsed;
  },
  timeRemainingInChain: function()
  {
    return this.timeRemaining() + (this.next ? this.next.timeRemainingInChain() : 0);
  },
  finiteTimeRemaining: function()
  {
    return this.isInfinite() ? 0 : this.timeRemaining();
  },
  finiteTimeRemainingInChain: function()
  {
    return this.isInfinite() ? 0 : this.timeRemaining() + (this.next ? this.next.finiteTimeRemainingInChain() : 0);
  },
  queue: function(e)
  {
    if ( this.next )
    {
      this.next.queue( e );
    }
    else
    {
      this.next = e;
    }
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
  isInfinite: function()
  {
    return (this.repeat === Number.POSITIVE_INFINITY);
  },
	hasStarted: function()
	{
		return (this.state !== anim8.EventState.CREATED && this.state !== anim8.EventState.DELAYED);
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

/**
 * Adds the following event methods to EventInstances: on, once, off, trigger.
 */
anim8.eventize( anim8.EventInstance.prototype );

/**
 * Returns an animation based on the input. If the input is an instance of anim8.Animation that instance
 * is immediately returned. If the input is a string the animation with that name is returned. If the
 * input is an object an anonymous animation is created using the second options argument. If no animation
 * could be determined then false is returned.
 * 
 * @param {anim8.Animation|string|object} animation
 * @param [object] options
 */
anim8.animation = function(animation, options)
{
  if ( animation instanceof anim8.Animation )
  {
    return animation;
  }
	if ( anim8.isString( animation ) )
	{
    if ( animation in anim8.animation )
    {
      return anim8.animation[ animation ];      
    }

    var animations = animation.split(',');
    var queue = [];

    for (var k = 0; k < animations.length; k++)
    {
      var parsed = anim8.parseAnimationString( animations[ k ] );

      if ( parsed !== false )
      {
        queue.push( anim8.animation( parsed.animation, parsed.options ) );
      }
    }
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
				parser.parse( animation, options, events );
			}
		}
		
		if (events.length)
		{
			return new anim8.Animation( false, animation, options, events );
		}
	}
	
	return false;
};

/**
 * Saves an animation under the given name. It can be played, queued, and transitioned into
 * at a later time providing the name and optionally options to override with.
 *
 * @param {string} name
 * @param {object} animation
 * @param [object] options
 */
anim8.save = function(name, animation, options)
{
  var animation = anim8.animation( animation, options );
  
  animation.name = name;
  
  anim8.animation[name] = animation;
};

/**
 * Parses a string for an animation in the format of:
 *
 * animationName [duration] x[repeat] z[sleep] ~[delay] [easing]
 * 
 * @param {string} animation
 */
anim8.parseAnimationString = function(animation)
{
  var split = animation.split(' ');
  var animation = false;
  var options = {};

  for (var i = 0; i < split.length; i++)
  {
    var part = split[i].toLowerCase();

    if ( part in anim8.animation && !animation )
    {
      animation = anim8.animation[ part ];
    }
    else
    {
      if ( part[0] === 'x' )
      {
        var repeat = anim8.repeat( part.substring(1), false );

        if ( repeat !== false )
        {
          options.repeat = repeat;
        }
      }
      if ( part[0] === 'z' )
      {
        var sleep = anim8.sleep( part.substring(1), false );

        if ( sleep !== false )
        {
          options.sleep = sleep;
        }
      }
      if ( part[0] === '~' )
      {
        var delay = anim8.delay( part.substring(1), false );

        if ( delay !== false )
        {
          options.delay = delay;
        }
      }
      var easing = anim8.easing( part, false );

      if ( easing !== false )
      {
        options.easing = easing;
      }

      var duration = anim8.duration( part, false );

      if ( duration !== false )
      {
        options.duration = duration;
      }
      else
      {
        var repeat = anim8.repeat( part, false );

        if ( repeat !== false )
        {
          options.repeat = repeat;
        }
      }
    }
  }

  if ( animation === false )
  {
    return false;
  }

  return {
    animation: animation,
    options: options
  };
};

/**
 * Instantiates a new Animation given it's name, the input & options passed, and the events that
 * were generated from the input & options. If the name is false this is an anonymous animation.
 * Input & Options are used by parsers to generate events, options allow for an animations
 * default event properties to be overriden.
 *
 * @param {string} name
 * @param {object} input
 * @param [object] options
 * @param {array:anim8.Event} events
 */
anim8.Animation = function(name, input, options, events)
{
	this.name = name;
	this.input = input;
	this.options = options;
	this.events = events;
};

anim8.Animation.prototype = 
{
  
  /**
   * Returns true if this animation was a saved animation, otherwise it's an anonymous one
   * and false is returned.
   */
  isSaved: function()
  {
    return (this.name !== false);
  },
  
  /**
   * Generates an array of event instances from the events in this animation.
   */
  newEvents: function()
  {
    var instances = [];
    
    for (var i = 0; i < this.events.length; i++)
    {
      instances.push( this.events[i].newInstance() );
    }
    
    return instances;
  },

  /**
   * Generates an array of event clones from the events in this animation.
   * 
   * @return {array}
   */
  cloneEvents: function()
  {
    var events = [];

    for (var i = 0; i < this.events.length; i++)
    {
      events.push( this.events[i].clone() );
    }

    return events;
  },

  /**
   * Merges options with the options in this animation and places them in the
   * events.
   * 
   * @param  {object} options
   * @param  {array} events
   * @return {[type]}
   */
  merge: function(options, events)
  {
    for (var parserName in this.input)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false )
      {
        parser.merge( this.input, options, this.options, events );
      }
    }

    return events;
  },

  /**
   * Extends this animation and returns an animation modified with the given options. 
   *
   * @param {object} options
   */
  extend: function(options)
  {
    if ( anim8.isEmpty( options ) )
    {
      return this;
    }

    var events = this.cloneEvents();

    this.merge( options, events );

    return new anim8.Animation( this.name, this.input, options, events );
  }
  
};

/**
 * Instantiates a new Animator given a subject to animate.
 *
 * @param {any} e
 */
anim8.Animator = function(e) 
{
	this.reset( e );
};

anim8.fn = anim8.Animator.prototype = 
{
  /**
   * Resets the animator given a subject to animate.
   *
   * @param {any} e
   */
	reset: function(subject)
	{
	  this.subject = subject;
	  this.events = {};
    this.springs = {};
	  this.attributes = {};
	  this.frame = {};
    this.updated = {};
	  this.finished = false;
		this.factory = null;
    this.active = false;
    
    return this;
	},
  
  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   */
  restore: function()
  {
    
    return this;
  },
  
  /**
   * A method thats invoked along with all other animators before updates are called.
   * This is used to make any necessary preparations before the animator is updated.
   */
  preupdate: function()
  {
		this.trigger('preupdate');
    
    return this;
  },
  
  /**
   * Updates the animator with the current time. All events and springs in this
   * animator are updated.
   *
   * @param {number} now
   */
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
	
		this.trigger('update');
    
    return this;
  },
  
  /**
   * Places the spring in this animator replacing any spring that exists for the same
   * attribute. The next time the animator is updated the spring will be started.
   *
   * @param {anim8.Spring} s
   */
  placeSpring: function(s)
  {
    var attr = s.attribute;
    
    this.springs[ attr ] = s;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
		
		this.finished = false;
  },
  
  /**
   * Places the event in this animator replacing any event that exists for the same
   * attribute. The next time the animator is updated the event will be started.
   *
   * @param {anim8.EventInstance} e
   */
  placeEvent: function(e)
  {
    var attr = e.attribute;
    
    this.events[ attr ] = e;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
		
		this.finished = false;
  },
  
  /**
   * Applies all updated attributes to the subject. This method is invoked with all of the other
   * animators at the end of the animation cycle.
   */
  apply: function()
	{
    for (var attr in this.frame)
    {
      if ( this.updated[ attr ] )
      {
        this.subject[ attr ] = this.frame[ attr ]; 
				this.updated[ attr ] = false;
      }
    }
	
		this.trigger('apply');
	
    this.trimEvents();
    
    return this;
  },
  
  /**
   * Removes any finished events and places queued events. If the animator previously wasn't finished
   * but now it is the 'finished' event will be triggered.
   */
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
  
  /**
   * Returns the current value for the given attribute (or undefined if the attribute is not or 
   * has not animated).
   *
   * @param {string} attr
   */
  value: function(attr)
  {
    return this.frame[ attr ];
  },

  /**
   * Activates this Animator by adding it to the main loop if it isn't there already.
   * 
   * @return {[type]}
   */
  activate: function()
  {
    anim8.add( this );

    return this;
  },
  
  /**
   * A method that is invoked when an animator is finished and is being removed from the list
   * of currently animating Animators.
   */
	deactivate: function()
	{ 
    this.trigger('deactivate', this);
	},
  
  /**
   * A method that can be invoked to destroy an animator - removing any relationship between
   * the subject and animator. The next time an animator is generated for the subject a new
   * one will be created.
   */
  destroy: function()
  {
    this.finished = true;

    this.factory.destroy( this );
    
    this.trigger('destroyed');
  },
  
  /**
   * Creates event instances for the given animation and options. The animation can be an animation
   * object or an animation name. If a name is provided the options are merged in.
   *
   * @param {anim8.Animation|string|object} animation
   * @param [object] options
   */
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
      for (var parserName in animation.input)
      {
        var parser = anim8.parser( parserName );
        
        if ( parser !== false )
        {
          parser.merge( animation.input, options, animation.options, events );
        }
      }
    }
    
    this.onAnimation( animation, options, events );
    
    return events;
  },
  
  /**
   * A method invoked when an animation is about to be played in the Animator.
   * 
   * @param {anim8.Animation} animation
   * @param {object} options
   * @param {array:anim8.EventInstance} events
   */
  onAnimation: function(animation, options, events)
  {
    
  },
  
  /**
   * Adds a spring to this animator replacing any existing spring for the same attribute.
   * A spring object can be given, an instance of anim8.Spring, or a name of a saved Spring.
   * 
   * @param {anim8.Spring|string|object} spring
   */
  spring: function(spring)
  {
    var spring = anim8.spring( spring );
    
    if ( spring === false )
    {
      return false;
    }

    this.placeSpring( spring );
    
    this.activate();
    
    return spring;
  },
  
  /**
   * Removes springs for the specified attributes. If no attributes are specified then all springs
   * are removed. Attributes can be specified as an array of attribute names or a string with attribute
   * names separated by a space.
   *
   * @param {string|Array} attributes
   */
  unspring: function(attributes)
  {
    return this.springsFor( attributes, function(s)
    {
      delete this.springs[ s.attribute ];
    });
  },
  
  /**
   * Adds an animation to this Animator optionally finishing events for attributes not specified in the
   * given attribute. Existing events will be replaced immediately.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all 
   */
	play: function(animation, options, all)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    this.playEvents( events, all );

    return this.activate();
	},

  /**
   * Adds events to this Animator to be played (optionally finishing events for attributes not specified in the given 
   * attribute). Existing events will be replaced immediately. This method will not activate the Animator, that has
   * to be done manually.
   * 
   * @param  {array} events
   * @param  [boolean] all
   * @return {this}
   */
  playEvents: function(events, all)
  {
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
    
    return this;
  },
  
  /**
   * Queues an animation on this Animator. The events generated for the given animation
   * will all start at the same time - at the end of the events currently on the Animator.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   */
	queue: function(animation, options)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
        
    this.queueEvents( events );

    return this;
	},

  /**
   * Queues an array of events on this Animator. The given events will be delayed to start at the same time - at the
   * end of the events currently on the Animator. This method will not activate the Animator, that has to be done 
   * manually.
   * 
   * @param  {array} events
   * @return {this}
   */
  queueEvents: function(events)
  {
    var maxRemaining = this.finiteTimeRemaining();
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      
      if ( attr in this.events  && !this.events[ attr ].isInfinite() )
      {    
        e.delay += (maxRemaining - this.events[ attr ].timeRemainingInChain());
        
        this.events[attr].queue( e );
      }
      else
      {
        e.delay += maxRemaining;
        
        this.placeEvent( e );
      }
    }
    
    return this;
  },
  
  /**
   * Transitions from the currently playing events into the beginning of a new animation. 
   * The transition is made by constructing a quadratic curve from the current value to a 
   * point further on the current path to the starting point of the new animation.
   *
   * @param {number} transitionTime 
   * @param {number} transitionDelta
   * @param {string|function|array} transitionEasing
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all
   */
  transition: function(transitionTime, transitionDelta, transitionEasing, animation, options, all)
  {
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }

    this.transitionEvents( transitionTime, transitionDelta, transitionEasing, events, all );

    return this.activate();
  },

  /**
   * Transitions from the currently playing events into the beginning of a new animation. 
   * The transition is made by constructing a quadratic curve from the current value to a 
   * point further on the current path to the starting point of the new animation. This method will not activate the 
   * Animator, that has to be done manually.
   *
   * @param {number} transitionTime 
   * @param {number} transitionDelta
   * @param {string|function|array} transitionEasing
   * @param [array] events
   * @param [boolean] all
   */
  transitionEvents: function(transitionTime, transitionDelta, transitionEasing, events, all)
  {
    // Check if we even need to transition
    var transition = false;
    
    for (var i = 0; i < events.length && !transition; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transition = true;
      }
    }
    
    // Only transition if we need to
    if ( transition )
    {
      for (var i = 0; i < events.length; i++)
      {
        var e1 = events[i];
        var attr = e1.attribute;
      
        if ( attr in this.events )
        {
          var path = e1.path;
          var calc = path.calculator;
          var e2 = this.events[attr];
        
          var p0 = calc.clone( this.frame[attr] );
          var p1 = e2.getFuture( transitionDelta );
          var p2 = e1.getPoint( 0 );
        
          var transitionPath = new anim8.QuadraticPath( attr, calc, p0, p1, p2 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transitionTime, transitionEasing, 0, 0, 1, true ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transitionTime;
     
          this.placeEvent( e1 );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = 0; i < events.length; i++)
      { 
        this.placeEvent( events[i] );
      }
    }
    
    return this;
  },
  
  /**
   * Transitions from the currently playing events into a new animation. The transition is made
   * by constructing a cubic curve from the current value to a point further on the current
   * path to the starting point of the new animation.
   *
   * @param {number} transitionTime 
   * @param {number} transitionFromDelta
   * @param {number} transitionIntoDelta
   * @param {string|function|array} transitionEasing
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all
   */
  transitionInto: function(transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, animation, options, all)
  {
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    this.transitionIntoEvents( transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, events, all );

    return this.activate();
  },

  /**
   * Transitions from the currently playing events into a new animation. The transition is made
   * by constructing a cubic curve from the current value to a point further on the current
   * path to the starting point of the new animation. This method will not activate the Animator, that has to be done 
   * manually.
   *
   * @param {number} transitionTime 
   * @param {number} transitionFromDelta
   * @param {number} transitionIntoDelta
   * @param {string|function|array} transitionEasing
   * @param {array} events
   * @param [boolean] all
   */
  transitionIntoEvents: function(transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, events, all)
  {
    // Check if we even need to transition
    var transition = false;
    
    for (var i = 0; i < events.length && !transition; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transition = true;
      }
    }
    
    // Only transition if we need to
    if ( transition )
    {
      for (var i = 0; i < events.length; i++)
      {
        var e1 = events[i];
        var attr = e1.attribute;
      
        if ( attr in this.events )
        {
          var path = e1.path;
          var calc = path.calculator;
          var e2 = this.events[attr];
        
          var p0 = calc.clone( this.frame[attr] );
          var p1 = e2.getFuture( transitionFromDelta );
          var p2 = e1.getPoint( 0 );
          var p3 = e1.getPoint( transitionIntoDelta );
          
          var transitionPath = new anim8.CubicPath( attr, calc, p0, p1, p2, p3 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transitionTime, transitionEasing, 0, 0, 1, true ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transitionTime;
     
          this.placeEvent( e1 );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = 0; i < events.length; i++)
      { 
        this.placeEvent( events[i] );
      }
    }
      
    return this;
  },

  /**
   * Tweens a single attribute to a target value.
   *
   * @param {string} attribute
   * @param {any} target
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   */
  tweenTo: function(attribute, target, duration, delay, easing, repeat, sleep)
  {
    var attr = anim8.attribute( attribute );
    var calc = anim8.calculator( attr.calculator );
    var start = attribute in this.frame ? calc.clone( this.frame[ attribute ] ) : true;
    var end = calc.parse( target, attr.defaultValue );

    var path = new anim8.Tween( attribute, calc, start, end );
    var event = new anim8.Event( attribute, path, duration, easing, delay, sleep, repeat, true );
    
    this.placeEvent( event.newInstance() );
    
    return this.activate();
  },

  /**
   * Tweens a multiple attribute to target values.
   *
   * @param {object} targets
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   */
  tweenManyTo: function(targets, duration, delay, easing, repeat, sleep)
  {
    for ( var attribute in targets )
    {
      var attr = anim8.attribute( attribute );
      var calc = anim8.calculator( attr.calculator );
      var start = attribute in this.frame ? calc.clone( this.frame[ attribute ] ) : true;
      var end = calc.parse( targets[ attribute ], attr.defaultValue );      
      
      var path = new anim8.Tween( attribute, calc, start, end );
      var event = new anim8.Event( attribute, path, duration, easing, delay, sleep, repeat, true );
      
      this.placeEvent( event.newInstance() );
    }

    return this.activate();
  },
  
  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * @param {string} attribute
   * @param {any} starts
   * @param {any} ends
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   */
  tween: function(attribute, starts, ends, duration, delay, easing, repeat, sleep)
  {
    var attr = anim8.attribute( attribute );
    var calc = anim8.calculator( attr.calculator );
    var start = calc.parse( starts, attr.defaultValue );
    var end = calc.parse( ends, attr.defaultValue );

    var path = new anim8.Tween( attribute, calc, start, end );
    var event = new anim8.Event( attribute, path, duration, easing, delay, sleep, repeat, true );
    
    this.placeEvent( event.newInstance() );

    return this.activate();
  },
  
  /**
   * Tweens multiple attributes from starting values to ending values.
   *
   * @param {object} starts
   * @param {object} ends
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   */
  tweenMany: function(starts, ends, duration, delay, easing, repeat, sleep)
  {
    for ( var attribute in starts )
    {
      var attr = anim8.attribute( input );
      var calc = anim8.calculator( attr.calculator );
      var start = calc.parse( starts[ attribute ], attr.defaultValue );
      var end = calc.parse( ends[ attribute ], attr.defaultValue );
      
      var path = new anim8.Tween( attribute, calc, start, end );
      var event = new anim8.Event( attribute, path, duration, easing, delay, sleep, repeat, true );
      
      this.placeEvent( event.newInstance() );
    }

    return this.activate();
  },
	
	/**
	 * Applies the initial state of all unstarted current events for the specified attributes immediately. 
	 * Attribute names can be given as an array or a space separated string. If no attributes are given all 
	 * attributes are assumed.
	 *
   * @param {string|array} attributes
	 */
	applyInitialState: function(attributes)
	{
		var eventCount = this.eventsFor( attributes, function(event, attr)
		{
			if ( !event.hasStarted() && event.hasInitialState() )
			{
				event.applyValue( this.frame, this.frame[ attr ], 0.0 );
				
				this.updated[ attr ] = true;
			}
			
		});
		
		this.apply();
		
		return eventCount;
	},

  /**
   * Returns the amount of time remaining for all finite events in this Animator.
   * 
   * @return {number} milliseconds
   */
  finiteTimeRemaining: function()
  {
    var remaining = 0;

    for (var attr in this.events)
    {
      var e = this.events[ attr ];
      
      if ( !e.isInfinite() )
      {
        remaining = Math.max( remaining, this.events[attr].finiteTimeRemainingInChain() );  
      }
    }

    return remaining;
  },
  
  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   * 
   * @param {string} attribute
   */
  ref: function(attribute)
  {
    var animator = this;
    var request = {};
    
    return function()
    {
      if ( attribute in animator.frame )
      {
        return animator.frame[ attribute ];
      }
      
      request[ attribute ] = true;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attribute ] ) )
      {
        return current[ attribute ];
      }
      
      return anim8.attribute( attribute ).defaultValue;
    };
  },
  
  /**
   * Follows the attribute along the given path definition.
   * 
   * @param {string} attribute
   * @param {anim8.Path|object|string} path
   * @param [number] duration
   * @param [number] delay
   * @param [function|string] easing
   * @param [number] repeat
   * @param [number] sleep  
   */
  follow: function(attribute, path, duration, delay, easing, repeat, sleep)
  {
    var path = anim8.path( path );
    
    // attribute, path, duration, easing, delay, sleep, repeat) 
    var event = new anim8.Event( 
      attribute, 
      path, 
      anim8.coalesce( duration, anim8.defaults.duration ),
      anim8.easing( easing ),
      anim8.coalesce( delay, anim8.defaults.delay ),
      anim8.coalesce( sleep, anim8.defaults.sleep ),
      anim8.coalesce( repeat, anim8.defaults.repeat ),
      true
    );
    
    this.placeEvent( event.newInstance() );
    
    return this.activate();
  },
  
  /**
   * Helper method that calls a callback for each object in the given map that exists
   * in the attribute string/array.
   *
   * @param {string|array} attributes
   * @param {function} callback
   * @param {object} objects
   */
  objectsFor: function(attributes, callback, objects)
  {
		if ( anim8.isString( attributes ) )
		{
			attributes = attributes.split( ' ' );
		}
    
    var resulting = !anim8.isFunction( callback );
    var results = [];
    
		if ( anim8.isArray( attributes ) )
		{
      for (var i = 0; i < attributes.length; i++)
      {
        var attr = attributes[i];
        
        if ( attr in objects )
        {
          if ( resulting )
          {
            results.push( objects[attr] );
          }
          else
          {
            callback.call( this, objects[attr], attr );
          }
        }
      }
		}
    else
    {
      for (var attr in objects)
      {
        if ( resulting )
        {
          results.push( objects[attr] );
        }
        else
        {
          callback.call( this, objects[attr], attr );
        }
      }
    }
    
		return resulting ? results : this;
  },
  
  /**
   * Invokes the callback for each event for the given attributes.
   * 
   * @param {string|array} attributes
   * @param {function} callback
   */
	eventsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.events );
	},
  
  /**
   * Invokes the callback for each spring for the given attributes.
   *
   * @param {string|array} attributes
   * @param {function} callback
   */
	springsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.springs );
	},
	
  /**
   * Stops all events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	stop: function(attributes)
	{
		return this.eventsFor( attributes, function(event, attr) 
		{
			delete this.events[ attr ];
		});
	},
  
  /**
   * Ends all events for the specified attributes. If events are queued the last value of the last event
   * is applied to this Animator before being completely removed. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	end: function(attributes)
	{
		return this.eventsFor( attributes, function(event) 
		{
			while (event.next)
			{
				event = event.next;
			}
			
			event.finish( this.frame );
		});
	},
  
  /**
   * Finishes all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	finish: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.finish( this.frame );
		});
	},
  
  /**
   * Pauses all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	pause: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.pause();
		});
	},
  
  /**
   * Resumes all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	resume: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.resume();
		});
	},
  
  /**
   * Sets the given attributes to this Animator immediately.
   *
   * @param {object} attributes
   */
  set: function(attributes)
  {
    for (var attr in attributes)
    {
      this.frame[ attr ] = attributes[ attr ];
			this.updated[ attr ] = true;
    }
    
    this.apply();
    
    return this;
  },
  
  /**
   * Gets the current attribute values for all attributes specified. The argument must be an object
   * where the key is the name of an attribute.
   *
   * @param {object} attributes
   */
  get: function(attributes)
  {
    var out = {};
    
    for (var attr in attributes)
    {
      out[ attr ] = this.frame[ attr ];
    }
    
    return out;
  },
  
  /**
   * Returns true if there are any events on this Animator.
   */
  hasEvents: function()
  {
    for (var attr in this.events)
    {
      return true;
    }
    
    return false;
  },
  
  /**
   * Returns true if there are any springs on this Animator.
   */
  hasSprings: function()
  {
    for (var attr in this.springs)
    {
      return true;
    }
    
    return false;
  },
  
  /**
   * Returns true if there are any springs on this Animator or animating events.
   */
  isAnimating: function()
  {
    if ( this.hasSprings() )
    {
      return true;
    }
    
    for (var attr in this.events)
    {
      if ( this.events[attr].isAnimating() )
      {
        return true;
      }
    }
    
    return false;
  },

  /**
   * Returns the subject of the Animator optionally passing it through a wrapper
   * function before it's returned.
   *
   * @param [function] wrapper
   */
  subject: function(wrapper)
  {
    var subject = this.subject;

    if ( anim8.isFunction( wrapper ) )
    {
      subject = wrapper( subject );
    }

    return subject;
  },
	
	/**
	 * Defers the method calls following this one to when the given event type (on or once) and event.
	 * To return this animator you need to call undefer() as many times as you called defer().
	 *
	 * @param {string} eventType
	 * @param {string} event
   * @param [function] callback
	 */
	defer: function(eventType, event, callback)
	{
		return new anim8.DeferAnimator( this, this, eventType, event, callback );
	}
  
};

/**
 * Adds the following event methods to Animators: on, once, off, trigger.
 */
anim8.eventize( anim8.Animator.prototype );

/**
 * Provides the ability to defer method calls until certain events are triggered.
 */
anim8.DeferAnimator = function(animator, previous, eventType, event)
{
	this.$reset( animator, previous, eventType, event );
};

/**
 * Creates the Defer prototype for the following Animator methods.
 */
anim8.DeferAnimator.prototype = new anim8.Defer( anim8.DeferAnimator, 
[
  'play', 'queue', 'transition', 'restore', 'set', 'resume', 'pause', 
  'finish', 'end', 'stop', 'follow', 'applyInitialState', 'tweenTo', 
  'tween', 'tweenMany', 'tweenManyTo', 'spring', 'unspring', 'apply', 
  'placeSpring', 'placeEvent'
]);


/*****************************************************************
  ANIMATORS DEFINITION
******************************************************************/

anim8.Animators = function(input)
{
  if ( anim8.isArray( input ) )
  {
    this.fill( input );
  }
};

/**
 * Animators is an instance of Array. All array methods are supported.
 */
anim8s.fn = anim8.Animators.prototype = new Array();

/**
 * Invokes a callback for each element in the array.
 * 
 * @param {function} iterator
 */
anim8s.fn.each = function(iterator, context) 
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
 * Appends the array of animators given to the end of this array.
 *
 * @param {array} animators
 */
anim8s.fn.fill = function(animators)
{
  for (var i = 0; i < animators.length; i++)
  {
    this.push( animators[i] );
  }

  return this;
};

/**
 * Invokes a callback for each element in the array and if true is returned that element is removed from the array.
 *
 * @param {function} filterer
 */
anim8s.fn.filter = function(filterer)
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
 * Returns the subjects of the Animators optionally passing them through a wrapper
 * function before it's returned.
 *
 * @param [function] wrapper
 */
anim8s.fn.subjects = function(wrapper)
{
  var subjects = [];

  for (var i = 0; i < this.length; i++)
  {
    subjects.push( this[i] );
  }

  if ( anim8.isFunction( wrapper ) )
  {
    subjects = wrapper( subjects );
  }
  
  return subjects;
};

/**
 * Returns the first animator in the array.
 */
anim8s.fn.first = function()
{
  return this[0];
};

/**
 * Reverses the order of animators in the array.
 */
 anim8s.fn.reverse = function()
 {
  var last = this.length - 1;
  var mid = Math.floor( this.length / 2 );

  for (var i = 0; i < mid; i++)
  {
    var e0 = this[ i ];
    var e1 = this[ last - i ];

    this[ i ] = e1;
    this[ last - i ] = e0;
  }

  return this;
 };

/**
 * Activates all Animators in the array if they aren't active already.
 * 
 * @return {this}
 */
anim8s.fn.activate = function()
{
  for (var i = 0; i < this.length; i++)
  {
    var animator = this[i];

    if ( !animator.active )
    {
      animator.active = true;
      anim8.animating.push( animator ); 
    }
  }
  
  if ( !anim8.running )
  {
    anim8.running = true;
    anim8.trigger('starting');
    anim8.requestRun( anim8.run );
  }
  
  return this;
};

/**
 * Returns an array of the subjects optionally
 */

/**
 * Plays a sequence of events separated by a delay given an animation to play on all Animators.
 */
anim8s.fn.sequence = function(delay, easing, animation, options)
{
  return new anim8.Sequence( this, delay, easing, animation, options );
};

/**
 * Adds the following methods to make an array of Animators appear like a single Animator.
 */
anim8s.fn.restore              = anim8.delegate( 'restore', anim8.delegate.RETURN_THIS );
anim8s.fn.placeSpring          = anim8.delegate( 'placeSpring', anim8.delegate.RETURN_THIS );
anim8s.fn.placeEvent           = anim8.delegate( 'placeEvent', anim8.delegate.RETURN_THIS );
anim8s.fn.preupdate            = anim8.delegate( 'preupdate', anim8.delegate.RETURN_THIS );
anim8s.fn.update               = anim8.delegate( 'update', anim8.delegate.RETURN_THIS );
anim8s.fn.apply                = anim8.delegate( 'apply', anim8.delegate.RETURN_THIS );
anim8s.fn.trimEvents           = anim8.delegate( 'trimEvents', anim8.delegate.RETURN_THIS );
anim8s.fn.deactivate           = anim8.delegate( 'deactivate', anim8.delegate.RETURN_THIS );
anim8s.fn.destroy              = anim8.delegate( 'destroy', anim8.delegate.RETURN_THIS );
anim8s.fn.spring               = anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS );
anim8s.fn.unspring             = anim8.delegate( 'unspring', anim8.delegate.RETURN_THIS );
anim8s.fn.play                 = anim8.delegate( 'play', anim8.delegate.RETURN_THIS );
anim8s.fn.playEvents           = anim8.delegate( 'playEvents', anim8.delegate.RETURN_THIS );
anim8s.fn.queue                = anim8.delegate( 'queue', anim8.delegate.RETURN_THIS );
anim8s.fn.queueEvents          = anim8.delegate( 'queueEvents', anim8.delegate.RETURN_THIS );
anim8s.fn.transition           = anim8.delegate( 'transition', anim8.delegate.RETURN_THIS );
anim8s.fn.transitionEvents     = anim8.delegate( 'transitionEvents', anim8.delegate.RETURN_THIS );
anim8s.fn.transitionInto       = anim8.delegate( 'transitionInto', anim8.delegate.RETURN_THIS );
anim8s.fn.transitionIntoEvents = anim8.delegate( 'transitionIntoEvents', anim8.delegate.RETURN_THIS );
anim8s.fn.tween                = anim8.delegate( 'tween', anim8.delegate.RETURN_THIS );
anim8s.fn.tweenTo              = anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS );
anim8s.fn.tweenMany            = anim8.delegate( 'tweenMany', anim8.delegate.RETURN_THIS );
anim8s.fn.tweenManyTo          = anim8.delegate( 'tweenManyTo', anim8.delegate.RETURN_THIS );
anim8s.fn.applyInitialState    = anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS );
anim8s.fn.follow               = anim8.delegate( 'follow', anim8.delegate.RETURN_THIS );
anim8s.fn.eventsFor            = anim8.delegate( 'eventsFor', anim8.delegate.RETURN_RESULTS );
anim8s.fn.springsFor           = anim8.delegate( 'springsFor', anim8.delegate.RETURN_RESULTS );
anim8s.fn.stop                 = anim8.delegate( 'stop', anim8.delegate.RETURN_THIS );
anim8s.fn.end                  = anim8.delegate( 'end', anim8.delegate.RETURN_THIS );
anim8s.fn.finish               = anim8.delegate( 'finish', anim8.delegate.RETURN_THIS );
anim8s.fn.pause 			         = anim8.delegate( 'pause', anim8.delegate.RETURN_THIS );
anim8s.fn.resume 			         = anim8.delegate( 'resume', anim8.delegate.RETURN_THIS );
anim8s.fn.set                  = anim8.delegate( 'set', anim8.delegate.RETURN_THIS );
anim8s.fn.get                  = anim8.delegate( 'get', anim8.delegate.RETURN_FIRST );
anim8s.fn.isAnimating          = anim8.delegate( 'isAnimating', anim8.delegate.RETURN_TRUE );
anim8s.fn.hasEvents            = anim8.delegate( 'hasEvents', anim8.delegate.RETURN_TRUE );
anim8s.fn.hasSprings           = anim8.delegate( 'hasSprings', anim8.delegate.RETURN_TRUE );
anim8s.fn.on			             = anim8.delegate( 'on', anim8.delegate.RETURN_THIS );
anim8s.fn.once		             = anim8.delegate( 'once', anim8.delegate.RETURN_THIS );
anim8s.fn.off			             = anim8.delegate( 'off', anim8.delegate.RETURN_THIS );
anim8s.fn.trigger              = anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS );


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
anim8.animating = new anim8.Animators();

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
anim8.Sequence = function(animators, delay, easing, animation, options)
{
  this.animators = animators;
  this.delay = anim8.delay( delay );
  this.easing = anim8.easing( easing );
  this.animation = anim8.animation( animation, options );
  this.options = options;
};

anim8.Sequence.prototype =
{
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  createEvents: function(i)
  {
    var events = this.animation.newEvents();
    var delta = i / (this.animators.length - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();
    
    for (var k = 0; k < events.length; k++)
    {
      events[k].delay += delayOffset;
    }
    
    return events;
  },

  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  play: function(all)
  {    
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.playEvents( sequence.createEvents( i ), all );       
    });
    
    return this.add();
  },
  
  queue: function()
  {
    var sequence = this;
    var maxRemaining = 0;
    var remaining = [];
    
    this.animators.each(function(animator, i)
    {
      remaining[i] = animator.finiteTimeRemaining();
      maxRemaining = Math.max( maxRemaining, remaining[i] );
    });

    this.animators.each(function(animator, i)
    {
      var delayOffset = maxRemaining - remaining[i];
      var events = sequence.createEvents( i );
      
      for (var i = 0; i < events.length; i++)
      {
        events[ i ].delay += delayOffset;
      }
      
      animator.queueEvents( events );
    });
    
    return this.add();
  },

  /*
  transition: function(transitionTime, transitionDelta, transitionEasing, animation, options)
  {
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transition( sequence.createEvents( i ), all );
    });
    
    return this.add();
  },
  */
  
  add: function()
  {
    this.animators.activate();
    this.animators.applyInitialState();
    
    return this;
  }
  
};

/**
 * Returns a parser based on the input. If the input is a function that function is immediately returned.
 * If the input is a string the parser with that name is returned. If no parser could be determined then
 * false is returned.
 * 
 * @param {function|string} parser
 */
anim8.parser = function(parser)
{
  if ( parser instanceof anim8.Parser )
  {
    return parser;
  }
	if ( anim8.isString( parser ) && parser in anim8.parser )
	{
		return anim8.parser[ parser ];
	}
	
	return false;
};

/**
 * Instantiates a new Parser.
 */
anim8.Parser = function()
{
  
};

anim8.Parser.prototype = 
{
  
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated events to the given array.
   * 
   * @param {object} animation
   * @param {object} options
   * @param {Array} events
   */
  parse: function( animation, options, events )
  {
    return true;
  },
  
  /**
   * Merges the options with the given event instances. This is when an existing 
   * animation is provided but the user wants to override the animation's options.
   *
   * Because event properties can be specified in several places there's a priority
   * to which one takes precedence. The properties specified in the animation object
   * itself are highest priority, followed by the new options, then by the old
   * options, and finally by the existing property on the event instance.
   *
   * @param {object} animation
   * @param {object} newOptions
   * @param {object} oldOptions
   * @param {Array} events
   */
  merge: function( animation, newOptions, oldOptions, events )
  {
    var durations = animation.durations || {};
    var easings   = animation.easings || {};
    var delays    = animation.delays || {};
    var sleeps    = animation.sleeps || {};
    var repeats   = animation.repeats || {};
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      
      if ( e.getParser() !== this )
      {
        continue;
      }

      e.easing    = anim8.easing( anim8.coalesce( easings[attr],   newOptions.easing,   oldOptions.easing   ), e.easing );
      e.repeat    = anim8.repeat( anim8.coalesce( repeats[attr],   newOptions.repeat,   oldOptions.repeat   ), e.repeat );
      e.delay     = anim8.time(   anim8.coalesce( delays[attr],    newOptions.delay,    oldOptions.delay    ), e.delay );
      e.sleep     = anim8.time(   anim8.coalesce( sleeps[attr],    newOptions.sleep,    oldOptions.sleep    ), e.sleep );
      e.duration  = anim8.time(   anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration ), e.duration );
    }
  }
};

/**
 * Instantiates a new parser for the 'deltas' & 'values' animation type.
 */
anim8.ParserDeltas = function()
{
  
};

// ParserDeltas extends anim8.Parser()
anim8.ParserDeltas.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserDeltas.prototype.parse = function( animation, options, events )
{
  // 1. If deltas wasn't specified, assume a uniform distribution of points
  // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
  // 3. Generate the events
  
	var deltas = animation.deltas;
	var values = animation.values;

  if ( !anim8.isDefined( deltas ) )
  {
    var valueCount = 0;
    
		for (var attr in values)
		{
      valueCount++; 
    }
    
    deltas = [];
    
    for (var i = 0; i < valueCount; i++)
    {
      deltas[i] = i / (valueCount - 1);
    }
  }
	if ( anim8.isArray( deltas ) )
	{
		var deltaObject = {};
		
		for (var attr in values)
		{
			deltaObject[attr] = deltas;	
		}
		
		deltas = deltaObject;
	}
	
  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};
  
	for (var attr in values)
	{
		var value = values[attr];
    var calculator = false;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue = calculator.create();
    }
		
		for (var k = 0; k < value.length; k++)
		{
			value[k] = calculator.parse( value[k], defaultValue );
		}
		
    var duration = anim8.coalesce( durations[attr], options.duration, anim8.defaults.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing, anim8.defaults.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep, anim8.defaults.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat, anim8.defaults.repeat );

    var path     = new anim8.DeltaPath( attr, calculator, values[attr], deltas[attr] );
    var event    = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, true, this );
    
    events.push( event );
	}
};

// Add the parser to the object of possible parsers
anim8.parser.values = new anim8.ParserDeltas();

/**
 * Instantiates a new parser for the 'final' animation type.
 */
anim8.ParserFinal = function()
{
  
};

// ParserFinal extends anim8.Parser()
anim8.ParserFinal.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserFinal.prototype.parse = function( animation, options, events )
{
  // 1. Generate the events, only caring about the delays and durations
  
	var values = animation.final;
	
  var delays = animation.delays || {};
  var durations = animation.durations || {};
  var calculators = {};
	var defaults = {};
  
	for (var attr in values)
	{
		var value = values[attr];
    var calculator = false;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue = calculator.create();
    }

    value = calculator.parse( value, defaultValue ); 
		
    var delay    = anim8.delay( anim8.coalesce( delays[attr], options.delay ) );
    var duration = anim8.duration( anim8.coalesce( durations[attr], options.duration ) );
    
    var path     = new anim8.PointPath( attr, calculator, value );
    var event    = new anim8.Event( attr, path, 0, anim8.easing.default, delay + duration, 0, 1, false, this );
    
    events.push( event );
	}
};

/**
 * Merges the options with the given event instances. This is when an existing 
 * animation is provided but the user wants to override the animation's options.
 *
 * Because event properties can be specified in several places there's a priority
 * to which one takes precedence. The properties specified in the animation object
 * itself are highest priority, followed by the new options, then by the old
 * options, and finally by the existing property on the event instance.
 *
 * @param {object} animation
 * @param {object} newOptions
 * @param {object} oldOptions
 * @param {Array} events
 */
anim8.ParserFinal.prototype.merge = function( animation, newOptions, oldOptions, events )
{
  var durations = animation.durations || {};
  var delays    = animation.delays || {};
  
  for (var i = 0; i < events.length; i++)
  {
    var e = events[i];
    var attr = e.attribute;
      
    if ( e.getParser() !== this )
    {
      continue;
    }

    var delay = anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay );
    var duration = anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration );

    e.delay = anim8.delay( delay ) + anim8.duration( duration );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.final = new anim8.ParserFinal();

/**
 * Instantiates a new parser for the 'initial' animation type.
 */
anim8.ParserInitial = function()
{
  
};

// ParserInitial extends anim8.Parser()
anim8.ParserInitial.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserInitial.prototype.parse = function( animation, options, events )
{
  // 1. Generate the events, only caring about the delays
  
	var values = animation.initial;
	
  var delays = animation.delays || {};
  var calculators = {};
	var defaults = {};
  
	for (var attr in values)
	{
		var value = values[attr];
    var calculator = false;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue = calculator.create();
    }
    
    value = calculator.parse( value, defaultValue ); 
		
    var delay    = anim8.delay( anim8.coalesce( delays[attr], options.delay ) );
    
    var path     = new anim8.PointPath( attr, calculator, value );
    var event    = new anim8.Event( attr, path, 0, anim8.easing.default, delay, 0, 1, true, this );
    
    events.push( event );
	}
};

/**
 * Merges the options with the given event instances. This is when an existing 
 * animation is provided but the user wants to override the animation's options.
 *
 * Because event properties can be specified in several places there's a priority
 * to which one takes precedence. The properties specified in the animation object
 * itself are highest priority, followed by the new options, then by the old
 * options, and finally by the existing property on the event instance.
 *
 * @param {object} animation
 * @param {object} newOptions
 * @param {object} oldOptions
 * @param {Array} events
 */
anim8.ParserInitial.prototype.merge = function( animation, newOptions, oldOptions, events )
{
  var durations = animation.durations || {};
  var delays    = animation.delays || {};
  
  for (var i = 0; i < events.length; i++)
  {
    var e = events[i];
    var attr = e.attribute;
      
    if ( e.getParser() !== this )
    {
      continue;
    }
    
    e.delay = anim8.time( anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay ), e.delay );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.initial = new anim8.ParserInitial();

/**
 * Instantiates a new parser for the 'keyframe' animation type.
 */
anim8.ParserKeyframe = function()
{
  
};

// ParserKeyframe extends anim8.Parser()
anim8.ParserKeyframe.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserKeyframe.prototype.parse = function( animation, options, events )
{
  // 1. Normalize keys by converting aliases to the actual value
  // 2. Split up keys that have commas into multiple entries
  // 3. Validate keys and remove invalid ones - also calculate max key value
  // 4. Sort frames by the key
  // 5. Expand frames to generate delta arrays, value arrays, and easing arrays
  // 6. Generate the events
  
  var kframes = animation.keyframe;
  
  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};
  
  var teasing = anim8.easing( anim8.coalesce( options.teasing, anim8.defaults.teasing ) );
  
  var sort = false;
  
  var aliases = {
    from:     '0',
    start:    '0',
    initial:  '0',
    first:    '0',
    half:     '50',
    middle:   '50',
    to:       '100',
    end:      '100',
    last:     '100'
  };
  
  // split up comma delimited times
  for (var time in kframes)
  {
    if ( time in aliases )
    {
      kframes[ aliases[time] ] = kframes[ time ];
      
      delete kframes[ time ];
    }
    else if ( time.indexOf(',') !== -1 )
    {
      var times = time.split(',');
      
      for (var i = 0; i < times.length; i++)
      {
        kframes[times[i]] = kframes[time];
      }
      
      delete kframes[time];
      
      sort = true;
    }
  }
  
  var times = [];
  
  // validate times
  var lastTime = 0.0;
  var maxTime = 0.0;
  
  for (var time in kframes)
  {
    var t = parseFloat(time);
    
    if (isNaN(t))
    {
      delete kframes[time];
    }
    else
    {
      if (t < lastTime)
      {
        sort = true;
      }
      
      times.push({
        order: t,
        key: time,
        value: kframes[time]
      });
      
      lastTime = t;
      
      maxTime = Math.max( maxTime, t );
    }
  }
  
  // sort if necessary
  if (sort)
  {
    times.sort(function(a, b) {
      return a.order - b.order;
    });
    
    kframes = {};
    
    for (var i = 0; i < times.length; i++)
    {
      kframes[times[i].key] = times[i].value;
    }
  }
  
  // split up into deltas and values
  var deltas = {};
  var values = {};
  var calculators = {};
	var defaults = {};
  var pathEasings = {};
  
  for (var i = 0; i < times.length; i++)
  {
    var frame = times[i];
    var easing = anim8.coalesce( frame.value.easing, options.easing );
    
    delete frame.value.easing;
    
    for (var attr in frame.value)
    {
      if ( !(attr in deltas) )
      {
        deltas[attr] = [];
        values[attr] = [];
        pathEasings[attr] = [];
        
        if (attr in anim8.attribute)
        {
          calculators[attr] = anim8.calculator( anim8.attribute[attr].calculator );
					defaults[attr] = anim8.attribute[attr].defaultValue;
        }
        else
        {
          calculators[attr] = anim8.calculator.default;
					defaults[attr] = calculators[attr].create();
        }
      }
			
      deltas[attr].push( frame.order / maxTime );
      values[attr].push( calculators[attr].parse( frame.value[attr], defaults[attr] ) );
      pathEasings[attr].push( anim8.easing( anim8.coalesce( easings[attr], easing ) ) );
    }
  }
	
  // create events & paths
  for (var attr in deltas)
  {
    var duration = anim8.coalesce( durations[attr], options.duration );
    var delay    = anim8.coalesce( delays[attr], options.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat );
    
    var path     = new anim8.KeyframePath( attr, calculators[attr], values[attr], deltas[attr], pathEasings[attr] );
    var event    = new anim8.Event( attr, path, duration, teasing, delay, sleep, repeat, true, this );
    
    events.push( event );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.keyframe = new anim8.ParserKeyframe();

/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 */
anim8.ParserTween = function()
{
  
};

// ParserTween extends anim8.Parser()
anim8.ParserTween.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserTween.prototype.parse = function( animation, options, events )
{
  // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

  var tweenTo = animation.tweenTo;

  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};

	for (var attr in tweenTo)
	{
    var calculator = null;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue= calculator.create();
    }
		
    var value    = calculator.parse( tweenTo[attr], defaultValue );
    var duration = anim8.coalesce( durations[attr], options.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat );
    
    var path     = new anim8.Tween( attr, calculator, true, value );
    var event    = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, true, this );
    
    events.push( event );
	}
};

// Add the parser to the object of possible parsers
anim8.parser.tweenTo = new anim8.ParserTween();


/**
 * Returns a factory for the given subject or throws an error if no factory exists.
 *
 * @param {any} subject
 */
anim8.factory = function(subject, optional) 
{
  for (var factoryName in anim8.factory) 
  {
    var factory = anim8.factory[ factoryName ];
    
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

/**
 * A factory creates Animator instances for subjects.
 */
anim8.Factory = function()
{

};

anim8.Factory.prototype = 
{

  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return false;
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    return false;
  },

  /**
   * Explodes the given subject to an array of Animators and adds them to the given array.
   * 
   * @param  {any} subject
   * @param  {array} animators
   * @return {void}
   */
  animatorsFor: function(subject, animators)
  {
    animators.push( this.animatorFor( subject ) );
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   * 
   * @param  {anim8.Animator} animator
   * @return {void}
   */
  destroy: function(animator)
  {

  }

};


/**
 * A factory for plain objects.
 */
anim8.ObjectFactory = function()
{

};

// It extends anim8.Factory
anim8.ObjectFactory.prototype = new anim8.Factory();

/**
 * Determines whether the given subject is valid for this factory to create Animators for.
 * 
 * @param  {any} subject
 * @return {boolean}
 */
anim8.ObjectFactory.prototype.is = function(subject)
{
  return anim8.isObject( subject ) && !anim8.isElement( subject ) && !anim8.isArray( subject );
};

/**
 * Returns an animator given a subject.
 * 
 * @param  {any} subject
 * @return {anim8.Animator}
 */
anim8.ObjectFactory.prototype.animatorFor = function(subject)
{
  var animator = subject.$animator;
    
  if ( !animator )
  {
    animator = new anim8.Animator( subject );
    animator.factory = this;
    
    subject.$animator = animator;
  }
  
  return animator;
};

/**
 * Destroys the animator by unlinking the animator from the subject.
 * 
 * @param  {anim8.Animator} animator
 * @return {void}
 */
anim8.ObjectFactory.prototype.destroy = function(animator)
{
  delete animator.subject.$animator;
};

/**
 * Registers the object factory.
 */
anim8.factory.object = new anim8.ObjectFactory();


/**
 * A factory for HTML Elements
 */
anim8.DomFactory = function()
{
  this.cached = {};
  this.ids = 0;
  this.attribute = 'anim8';
};

// It extends anim8.Factory
anim8.DomFactory.prototype = new anim8.Factory();

/**
 * Determines whether the given subject is valid for this factory to create Animators for.
 * 
 * @param  {any} subject
 * @return {boolean}
 */
anim8.DomFactory.prototype.is = function(subject)
{
  return anim8.isElement( subject );
};

/**
 * Returns an animator given a subject.
 * 
 * @param  {any} subject
 * @return {anim8.Animator}
 */
anim8.DomFactory.prototype.animatorFor = function(subject)
{
  var animatorId = subject.getAttribute( this.attribute );
  
  if (!(animatorId in this.cached)) 
  {
    var animator = new anim8.DomAnimator( subject );
    
    subject.setAttribute( this.attribute, animatorId = animator.id = ++this.ids );
    
    animator.factory = this;
    
    this.cached[animatorId] = animator;
  }

  return this.cached[ animatorId ];
};

/**
 * Destroys the animator by unlinking the animator from the subject.
 * 
 * @param  {anim8.Animator} animator
 * @return {void}
 */
anim8.DomFactory.prototype.destroy = function(animator)
{
  delete this.cached[ animator.id ];
};

/**
 * Registers the DOM factory.
 */
anim8.factory.dom = new anim8.DomFactory();


/*
  DOM create styles to apply, then apply them all at the same time
  don't apply styles if they're impercivable (convert value to pixels of applicable)

*/

/**
 * All DOM related
 */
anim8.dom = {};

/* 
  anim8.property[name] = {
    get: function(e, anim) {
      // based on anim.animating, gets one or more value from the entity and places it on anim.frame. this function should only do this for an attribute if
      // anim.animating[attribute] === false. When it successfully gets a value anim.animating[attribute] should be set to true. This is called before an animation
      // begins on attributes that will be animated based on the current value. 
    },
    set: function(e, anim) {
      // applies the applicable attributes in anim.frame to the entity, 
    }
 }
*/
anim8.property = function(prop) 
{
  if ( anim8.isObject( prop ) && anim8.isFunction( prop.get ) && anim8.isFunction( prop.set ) ) 
  {
    return prop;
  }
  if ( anim8.isString( prop ) && prop in anim8.property )
  {
	  return anim8.property[ prop ];
  }
	
  throw prop + ' is not a valid property';
}

/**
 * Computes the desired style of the given element and returns it as a string. The style
 * given must be in hyphenated format like so: anim8.style( element, 'font-size' ) = '12px'
 */
anim8.style = (function()
{
  var hyphenated = {};

  var hyphenize = function(str) 
	{
    if ( str in hyphenated )
    {
      return hyphenated[ str ];
    }

    var key = str;

    str = str.replace(/[a-z][A-Z]/g, function(str, letter)
    {
     return str[0] + '-' + str[1].toLowerCase();
    });
    
    str = str.replace(/^Webkit/, '-webkit');
    str = str.replace(/^Moz/, '-moz');
    str = str.replace(/^Ms/, '-ms');
    str = str.replace(/^O/, '-o');
    str = str.replace(/^Khtml/, '-khtml');
    
    return hyphenated[ key ] = str;
  };
	
	return function(e, style) 
	{
	  if (e.currentStyle)
		{
	    return e.currentStyle[ style ];
	  } 
		else if (document.defaultView && document.defaultView.getComputedStyle) 
		{
	    return document.defaultView.getComputedStyle( e, null ).getPropertyValue( hyphenize( style ) );
	  } 
		else 
		{
	    return e.style[ style ]; 
	  }
	};
	
})();

/**
 * Given an array of styles this will return the first one that is present on elements in the current browser.
 */
anim8.prefix = (function() 
{
  var a = document.createElement('a');
  
  return function(prefixes) 
  {
    for (var i = 0; i < prefixes.length; i++) 
    {
      if ( anim8.isDefined( a.style[ prefixes[ i ] ] ) ) 
      {
        return prefixes[i];
      }
    }
    return false;
  };
  
})();

/**
 * Calculators how many pixels a given value & unit is.
 * 
 * For Example: anim8.toPixels( 100, 'in' ) 
 *    returns how many pixels are in 1 inch, with up to 2 decimal points of accuracy.
 */
anim8.toPixels = function(baseValue, baseUnit, defaultRate)
{
  if ( document.body )
  {
    var div = document.createElement('div');
    document.body.appendChild( div );
    div.style.width = baseValue + baseUnit;
    var pixels = (div.offsetWidth / baseValue);
    document.body.removeChild( div );
    return pixels || defaultRate;
  }
  
  return defaultRate;
};

/**
 * Parses the string for a value and a unit.
 *
 * @param {string} value
 */
anim8.parseValue = (function()
{
  var regex = /(-?\d*(\.\d+)|-?\d+)(px|em|%|vw|ex|cm|mm|in|pt|pc|deg|rad)?/;
  
  return function(x)
  {
    var parsed = regex.exec( x );
    
    if (parsed) 
    {      
      return {
        value: parseFloat( parsed[1] ),
        unit: parsed[3]
      }
    }
    
    return false;
  };
})();


/**
 * Converts one unit to another for a given element.
 *
 * For Example: anim8.convert( element, '100px', '%', 'parentWidth' )
 *    returns how much percent 100px relativeTo parentWidth of the given element
 *
 * @param {HTMLElement} e
 * @param {string} from
 * @param {string} toUnit
 * @param {string} relativeTo
 */
anim8.convert = (function()
{  
  var getFontSize = function(e, notUnit)
  {
    var fontSize = anim8.style( e, 'fontSize' );
    var parsed = anim8.parseValue( fontSize );
    
    if ( !parsed || parsed.unit === notUnit )
    {
      return 12;
    }
    
    if ( parsed.unit === 'px' ) 
    {
      return parsed.value;
    }
    
    return getConverterScale( e, conversions[ parsed.unit ].px, relativeTo );
  };

  var variables = {};
  
  variables.parentWidth = function(e)
  {
    return e.parentNode.scrollWidth;
  };
  variables.parentHeight = function(e)
  {
    return e.parentNode.scrollHeight;
  };
  variables.width = function(e)
  {
    return e.offsetWidth;
  };
  variables.height = function(e)
  {
    return e.offsetHeight;
  };
  variables.fontSize = function(e)
  {
    return getFontSize( e, '%' );
  };
  variables.parentFontSize = function(e)
  {
    return getFontSize( e.parentNode, '%' );
  };
  variables.htmlFontSize = function(e)
  {
    var htmlElement = document.getElementsByTagName("html")[0];
    
    return getFontSize( htmlElement, '%' );
  };
  
  var conversions = {};
  
  conversions.pt  = { px: anim8.toPixels(100, 'pt') };
  conversions.in  = { px: anim8.toPixels(100, 'in') };
  conversions.cm  = { px: anim8.toPixels(1000, 'cm') };
  conversions.mm  = { px: anim8.toPixels(100000, 'mm') };
  conversions.vw  = { px: anim8.toPixels(1000, 'vw') };
  conversions.deg = { rad: Math.PI / 180.0};

  conversions.em = 
  {
    px: function(e, relativeTo) 
    {
      return getFontSize( e, 'em' );
    }
  };
  
  conversions.rem = 
  {
    px: function(e, relativeTo) 
    {
      var htmlElement = document.getElementsByTagName("html")[0];
      
      return getFontSize( htmlElement, 'rem' );
    }
  };
  
  conversions['%'] = 
  {
    px: function(e, relativeTo) 
    {
      if ( anim8.isNumber( relativeTo ) )
      {
        return relativeTo;
      }
      if ( relativeTo in variables )
      {
        return variables[ relativeTo ]( e ) / 100.0;
      }
      
      return 1.0;
    }
  };
  
  // Populate conversions going other way.
  for (var unit in conversions)
  {
    for (var to in conversions[ unit ])
    {
      if ( !(to in conversions) )
      {
        conversions[ to ] = {};
      }
      
      if ( !(unit in conversions[ to ]) )
      {
        var given = conversions[ unit ][ to ];
        
        if ( anim8.isNumber( given ) )
        {
          conversions[ to ][ unit ] = 1.0 / given;  
        }
        if ( anim8.isFunction( given ) )
        {
          conversions[ to ][ unit ] = (function(converter) 
          {
            return function(e, relativeTo) 
            {
              return 1.0 / converter( e, relativeTo );
            };
          })( given );
        }
      }
    }
  }
  
  // Given an element, convert, and relativeTo - return the number we need to multiply by.
  var getConverterScale = function(e, converter, relativeTo)
  {
    if ( anim8.isNumber( converter ) )
    {
      return converter;
    }
    else if ( anim8.isFunction( converter ) )
    {
      return converter( e, relativeTo );
    }
    
    return 1.0;
  };
  
  return function(e, from, toUnit, relativeTo)
  {
    if ( anim8.isNumber( from ) )
    {
      return from;
    }
    
    var parsed = anim8.parseValue( from );
    
    if ( !parsed )
    {
      return false;
    }
    
    var value = parsed.value;
    var fromUnit = parsed.unit;
    
    if ( !fromUnit || fromUnit === toUnit )
    {
      return value;
    }
    
    // First see if we have a direct conversion available...
    if ( fromUnit in conversions && toUnit in conversions[ fromUnit ] )
    {
      var converter = conversions[ fromUnit ][ toUnit ];
      
      value *= getConverterScale( e, converter, relativeTo );
    }
    // Otherwise convert it to px, then to the desired unit
    else if ( fromUnit in conversions && conversions[ fromUnit ].px && toUnit in conversions.px )
    {
      var converter1 = conversions[ fromUnit ].px;
      var converter2 = conversions.px[ toUnit ];
      
      value *= getConverterScale( e, converter1, relativeTo );
      value *= getConverterScale( e, converter2, relativeTo );
    }
    
    return value;
  };
  
})();




anim8.property.factory = function(nm, relativeTo) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.style( e, nm );
        var converted = anim8.convert( e, style, anim.units[ nm ], relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
      }
    },
    set: function(e, anim) 
    { 
      anim.styles[nm] = anim.value( nm );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.factoryDerivable = function(nm, relativeTo, deriver) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.style( e, nm );
        var converted = anim8.convert( e, style, anim.units[ nm ], relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
        else if ( anim8.isFunction( deriver ) )
        {
          converted = anim8.convert( e, deriver( e ), anim.units[ nm ], relativeTo );
          
          if ( converted !== false )
          {
            anim.frame[nm] = converted;
            anim.animating[nm] = true;
          }
        }
      }
    },
    set: function(e, anim) 
    { 
      anim.styles[nm] = anim.value( nm );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.factoryColor = function(nm) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var parsed = anim8.color.parse( e.style[nm] );
        
        if (parsed !== anim8.color.invalidColor) 
        {
          anim.frame[nm] = parsed;
          anim.animating[nm] = true;
        }              
      }
    },
    set: function(e, anim) 
    {
      anim.styles[nm] = anim8.color.format( anim.frame[nm] );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.padding                  = anim8.property.factory( 'padding', 'parentWidth' );
anim8.property.paddingTop               = anim8.property.factory( 'paddingTop', 'parentWidth' );
anim8.property.paddingRight             = anim8.property.factory( 'paddingRight', 'parentWidth' );
anim8.property.paddingBottom            = anim8.property.factory( 'paddingBottom', 'parentWidth' );
anim8.property.paddingLeft              = anim8.property.factory( 'paddingLeft', 'parentWidth' );

anim8.property.margin                   = anim8.property.factory( 'margin', 'parentWidth' );
anim8.property.marginTop                = anim8.property.factory( 'marginTop', 'parentWidth' );
anim8.property.marginRight              = anim8.property.factory( 'marginRight', 'parentWidth' );
anim8.property.marginBottom             = anim8.property.factory( 'marginBottom', 'parentWidth' );
anim8.property.marginLeft               = anim8.property.factory( 'marginLeft', 'parentWidth' );

anim8.property.borderRadius             = anim8.property.factory( 'borderRadius', 'width' );
anim8.property.borderTopLeftRadius      = anim8.property.factory( 'borderTopLeftRadius', 'width' );
anim8.property.borderTopRightRadius     = anim8.property.factory( 'borderTopRightRadius', 'width' );
anim8.property.borderBottomLeftRadius   = anim8.property.factory( 'borderBottomLeftRadius', 'width' );
anim8.property.borderBottomRightRadius  = anim8.property.factory( 'borderBottomRightRadius', 'width' );

anim8.property.borderWidth              = anim8.property.factory( 'borderWidth' );
anim8.property.borderTopWidth           = anim8.property.factory( 'borderTopWidth' );
anim8.property.borderRightWidth         = anim8.property.factory( 'borderRightWidth' );
anim8.property.borderBottomWidth        = anim8.property.factory( 'borderBottomWidth' );
anim8.property.borderLeftWidth          = anim8.property.factory( 'borderLeftWidth' );

anim8.property.outlineWidth             = anim8.property.factory( 'outlineWidth' );
anim8.property.textIndent               = anim8.property.factory( 'textIndent', 'parentWidth' );
anim8.property.borderSpacing            = anim8.property.factory( 'borderSpacing' );
anim8.property.fontSize                 = anim8.property.factory( 'fontSize', 'parentFontSize' );
anim8.property.lineHeight               = anim8.property.factory( 'lineHeight', 'fontSize' );
anim8.property.zIndex                   = anim8.property.factory( 'zIndex' );

anim8.property.color                    = anim8.property.factoryColor( 'color' );
anim8.property.backgroundColor          = anim8.property.factoryColor( 'backgroundColor' );
anim8.property.borderTopColor           = anim8.property.factoryColor( 'borderTopColor' );
anim8.property.borderRightColor         = anim8.property.factoryColor( 'borderRightColor' );
anim8.property.borderBottomColor        = anim8.property.factoryColor( 'borderBottomColor' );
anim8.property.borderLeftColor          = anim8.property.factoryColor( 'borderLeftColor' );
anim8.property.outlineColor             = anim8.property.factoryColor( 'outlineColor' );

anim8.property.minWidth                 = anim8.property.factory( 'minWidth', 'parentWidth' );
anim8.property.maxWidth                 = anim8.property.factory( 'maxWidth', 'parentWidth' );
anim8.property.minHeight                = anim8.property.factory( 'minHeight', 'parentHeight' );
anim8.property.maxHeight                = anim8.property.factory( 'maxHeight', 'parentHeight' );

anim8.property.width                    = anim8.property.factoryDerivable('width', 'parentWidth', function(e) { return e.offsetWidth + 'px'; });
anim8.property.height                   = anim8.property.factoryDerivable('height', 'parentHeight', function(e) { return e.offsetHeight + 'px'; });

anim8.property.top                      = anim8.property.factoryDerivable('top', 'parentHeight', function(e) { return e.offsetTop + 'px'; });
anim8.property.right                    = anim8.property.factoryDerivable('right', 'parentWidth', function(e) { return (e.parentNode.scrollWidth - (e.offsetLeft + e.offsetWidth)) + 'px'; });
anim8.property.bottom                   = anim8.property.factoryDerivable('bottom', 'parentHeight', function(e) { return (e.parentNode.scrollHeight - (e.offsetTop + e.offsetHeight)) + 'px'; });
anim8.property.left                     = anim8.property.factoryDerivable('left', 'parentWidth', function(e) { return e.offsetLeft + 'px'; });

anim8.property.visibility = 
{
  get: function(e, anim) 
  {
    if (anim.animating.visibility === false) 
    {
      var style = anim8.style( e, 'visibility' );
      anim.frame.visibility = style === 'hidden' ? 0.0 : 1.0;
      anim.animating = true;
    }
  },
  set: function(e, anim) 
  {
    anim.styles.visibility = anim.frame.visibility < 0.5 ? 'hidden' : 'visible'
  },
  unset: function(e, anim)
  {
    e.style.visibility = null;
  }
}

anim8.property.backface = (function()
{
  var css = anim8.prefix(['WebkitBackfaceVisibility', 'MozBackfaceVisibility', 'msBackfaceVisibility', 'BackfaceVisibility']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim)
    {
      if ( anim.animating.backface === false )
      {
        var style = anim8.style( e, css ); 
        
        anim.frame.backface = (style === 'visible') ? 1.0 : 0.0;
        anim.animating.backface = true;
      }
    },
    set: function(e, anim)
    {
      anim.styles[css] = anim.frame.backface < 0.5 ? 'none' : 'visible';
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
    
  };
  
})();

anim8.property.transformOrigin = (function() 
{
  var css = anim8.prefix(['WebkitTransformOrigin', 'MozTransformOrigin', 'OTransformOrigin', 'msTransformOrigin', 'transformOrigin']);
  
  if ( !css )
  {
    return false;
  }
  
  var keywords = 
  {
    'left':   '0%',
    'center': '50%',
    'right':  '100%',
    'top':    '0%',
    'bottom': '100%'
  };
  
  var setOriginAttribute = function(e, value, anim, attr, relativeTo ) 
  {
    if (anim.animating[attr] === false) 
    {
      if ( value in keywords )
      {        
        value = keywords[ value ];
      }

      var converted = anim8.convert( e, value, anim.units[ attr ], relativeTo );
      
      if ( converted !== false )
      {
        anim.frame[ attr ] = converted;
        anim.animating[ attr ] = true;
      }
    }
  };
  
  var setOrigin = function(e, split, anim) 
  {
    if (anim.animating.origin === false) 
    {
      if ((split.length === 1) || 
          (split.length === 2 && split[0] === split[1]) || 
          (split.length === 3 && split[0] === split[1] && split[1] === split[2])) 
      {     
        setOriginAttribute( e, split[0], anim, 'origin', 'width' );
      }            
    }
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.style( e, css );
      
      if (style) 
      {
        var origin = style.toLowerCase();
        var split = origin.split(' ');
        
        switch (split.length) 
        {
        case 3:
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[1], anim, 'originY', 'height' );
          setOriginAttribute( e, split[2], anim, 'originZ' );
          setOrigin( e, split, anim );
          break;
        case 2:
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[1], anim, 'originY', 'height' );
          setOrigin( e, split, anim );
          break;
        case 1:
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[0], anim, 'originY', 'height' );
          setOrigin( e, split, anim );
          break;
        }
      }
    },
    set: function(e, anim) 
    {      
      var style = null;
      
      if ( anim8.isDefined( anim.frame.originZ ) )
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' ) + ' ' + anim.valueOr( 'originZ', 'origin', 'z' );
      } 
      else 
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' );
      }
      
      anim.styles[css] = style;
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
  };
  
})();

anim8.property.transform = (function() 
{
  var css = anim8.prefix(['WebkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'transform']);
   
  if ( !css )
  {
    return false;
  }

  var d2 = { translate: true, scale: true };
  var d3 = { translate3d: true, scale3d: true };
  var d4 = { rotate3d: true };
  var axis = ['X', 'Y', 'Z'];
    
  var regex = 
  {
    translate: /translate\(([^,]+)\s*,\s*([^\)]+)\)/i,
    translate3d: /translate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    translateX: /translateX\(([^\)]+)\)/i,
    translateY: /translateY\(([^\)]+)\)/i,
    translateZ: /translateZ\(([^\)]+)\)/i,
    scale: /scale\(([^,]+)\s*,\s*([^\)]+)\)/i,
    scale3d: /scale3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    scaleX: /scaleX\(([^\)]+)\)/i,
    scaleY: /scaleY\(([^\)]+)\)/i,
    scaleZ: /scaleZ\(([^\)]+)\)/i,
    rotate: /rotate\(([^\)]+)\)/i,
    rotate3d: /rotate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    rotateX: /rotateX\(([^\)]+)\)/i,
    rotateY: /rotateY\(([^\)]+)\)/i,
    rotateZ: /rotateZ\(([^\)]+)\)/i,
    skew: /skew\(([^,]+)\s*,\s*([^\)]+)\)/i,
    skewX: /skewX\(([^\)]+)\)/i,
    skewY: /skewY\(([^\)]+)\)/i
  };
  
  var parse = function( e, value, anim, attr, relativeTo )
  {
    var desiredUnit = anim.units[ attr ];
    var converted = anim8.convert( e, value, desiredUnit, relativeTo );
    
    if ( converted !== false )
    {
      return converted;
    }
    
    // TODO show convert this to desiredUnit, however defaultValue may be non-scalar.
    return anim8.attribute( attr ).defaultValue;    
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.style( e, css );
      
      for (var attr in anim.animating) 
      {
        if ( anim.animating[ attr ] === false && attr in regex ) 
        {
          var parsed = regex[ attr ].exec( style );
          
          if ( parsed ) 
          {
            if ( attr in d4 ) 
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' ),
                z: parse( e, parsed[3], anim, attr ),
                angle: parse( e, parsed[4], anim, attr )
              };
            }
            else if ( attr in d3 )
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' ),
                z: parse( e, parsed[3], anim, attr )
              };
            }
            else if ( attr in d2 ) 
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' )
              };
            }
            else 
            {
              anim.frame[attr] = parse( e, parsed[1], anim, attr, 'width' );
            }
            
            anim.animating[attr] = true;
          }
        }
      }
    },
    set: function(e, anim) 
    {  
      // we don't check anim.updated[attr] here since the current value of a transform property is important
      
      var transforms = [];
      
      for (var attr in regex) 
      {
        if (attr in anim.frame) 
        { 
          var value = anim.frame[ attr ];
          var unit = anim.units[ attr ];
          
          if (attr in d4) 
          {
            transforms.push( attr + '(' + value.x + ',' + value.y + ',' + value.z + ',' + value.angle + unit + ')' );
          }
          else if (attr in d3) 
          {
            transforms.push( attr + '(' + value.x + unit + ',' + value.y + unit + ',' + value.z + unit + ')' );
          }
          else if (attr in d2) 
          {
            transforms.push( attr + '(' + value.x + unit + ',' + value.y + unit + ')' );
          }
          else
          {
            transforms.push( attr + '(' + value + unit + ')' );
          }
        }
      }
			
      if (transforms.length) 
      {
        anim.styles[css] = transforms.join(' ');
      }
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
  };
  
})();

anim8.property.opacity = (function() 
{
  var css = anim8.prefix(['WebkitOpacity', 'MozOpacity', 'KhtmlOpacity', 'opacity']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating.opacity === false) 
      {
        var style = anim8.style( e, css );
        var opacity = parseFloat( style );
        
        if ( !isNaN(opacity) ) 
        {
          anim.frame.opacity = opacity
          anim.animating.opacity = true;
        }
      }
    },
    set: function(e, anim) 
    {
      anim.styles[ css ] = anim.frame.opacity;
    },
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
  };
  
})();

anim8.property.filter = (function() 
{
  var css = anim8.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
  
  if ( !css )
  {
    return false;
  }
  
	var methods = 
  {
		grayscale: 	'grayscale',
		sepia: 			'sepia',
		saturate: 	'saturate',
		hueRotate: 	'hue-rotate',
		invert: 		'invert',
		brightness: 'brightness',
		contrast: 	'contrast',
    blur:       'blur'
	};
	
	var patterns = {};
	
	for (var attr in methods) 
  {
		patterns[attr] = new RegExp( methods[attr] + '\(([^\)]+)\)', 'i');
	}
  
	return {
    
		get: function(e, anim) 
    {
			var style = anim8.style( e, css );
      
			for (var attr in patterns) 
      {
				if ( anim.animating[attr] === false ) 
        {
					var parsed = patterns[attr].exec( style );
          
					if (parsed !== false) 
          {
            var converted = anim8.convert( e, parsed[1], anim.units[ attr ] );
            
            if ( converted !== false )
            {
              anim.frame[ attr ] = converted;
              anim.animating[ attr ] = true;
            }
					}
				}
			}
		}, 
		set: function(e, anim) 
    {
      // we don't check anim.updated[attr] here since the current value of a transform property is important
      
			var filters = [];
      
			for (var attr in methods) 
      {
				if ( attr in anim.frame ) 
        {
          filters.push( methods[attr] + '(' + anim.value( attr ) + ')' );
				}
			}
      
			if (filters.length) 
      {
				anim.styles[ css ] = filters.join(' ');
			}
		},
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
	};
	
})();

anim8.property.center = 
{
  get: function(e, anim)
  {
    var cx = (e.offsetLeft + e.offsetWidth * 0.5) + 'px';
    var cy = (e.offsetTop + e.offsetHeight * 0.5) + 'px';
    
    if ( anim.animating.center === false )
    {
      var desiredUnit = anim.units.center;
      var ccx = anim8.convert( e, cx, desiredUnit, 'parentWidth' );
      var ccy = anim8.convert( e, cy, desiredUnit, 'parentHeight' );
    
      if ( ccx !== false && ccy !== false )
      {
        anim.frame.center = {
          x: ccx,
          y: ccy
        };
        anim.animating.center = true;
      }
    }
    if ( anim.animating.centerX === false )
    {
      var desiredUnit = anim.units.centerX;
      var ccx = anim8.convert( e, cx, desiredUnit, 'parentWidth' );
      
      if ( ccx !== false )
      {
        anim.frame.centerX = ccx;
        anim.animating.centerX = true;
      }
    }
    if ( anim.animating.centerY === false )
    {
      var desiredUnit = anim.units.centerY;
      var ccy = anim8.convert( e, cy, desiredUnit, 'parentHeight' );
      
      if ( ccy !== false )
      {
        anim.frame.centerY = ccy;
        anim.animating.centerY = true;
      }
    }
  },
  preset: function(e, anim)
  {
    anim.cached.width  = anim8.convert( e, e.offsetWidth + 'px', anim.units.centerX || anim.units.center, 'parentWidth' );
    anim.cached.height = anim8.convert( e, e.offsetHeight + 'px', anim.units.centerY || anim.units.center, 'parentHeight' );
  },
  set: function(e, anim)
  {
    var rw = anim.cached.width * 0.5;
    var rh = anim.cached.height * 0.5;
        
    if ( anim.updated.center )
    {
      anim.styles.left = (anim.frame.center.x - rw) + anim.units.center;
      anim.styles.top = (anim.frame.center.y - rh) + anim.units.center;
    }
    if ( anim.updated.centerX )
    {
      anim.styles.left = (anim.frame.centerX - rw) + anim.units.centerX;
    }
    if ( anim.updated.centerY )
    {
      anim.styles.top = (anim.frame.centerY - rh) + anim.units.centerY;
    }
  }
};

anim8.property.orbit = 
{
  DEGREE_TO_RADIAN: Math.PI / 180.0,
  
  RADIAN_TO_DEGREE: 180.0 / Math.PI,
  
  get: function(e, anim)
  {
    var ox = (e.parentNode.scrollWidth * 0.5);
    var oy = (e.parentNode.scrollHeight * 0.5); 
    var cx = (e.offsetLeft + e.offsetWidth * 0.5);
    var cy = (e.offsetTop + e.offsetHeight * 0.5);
    var dx = cx - ox;
    var dy = cy - oy;
  
    if ( anim.animating.orbitOffset === false )
    {
      var cunit = anim.units.orbitOffset;
      var cox = anim8.convert( e, ox + 'px', cunit, 'parentWidth' );
      var coy = anim8.convert( e, oy + 'px', cunit, 'parentHeight' );
      
      if ( cox !== false && coy !== false )
      {
        anim.frame.orbitOffset = {
          x: cox,
          y: coy
        };
        anim.animating.orbitOffset = false;
      }
    }
    
    if ( anim.animating.distance === false )
    {
      anim.frame.distance = Math.sqrt( dx * dx + dy * dy );
      anim.animating.distance = true;
    }
    
    if ( anim.animating.angle === false )
    {
      anim.frame.angle = Math.atan2( dy, dx ) * this.RADIAN_TO_DEGREE;
      anim.animating.angle = true;
    }
  },
  
  preset: function(e, anim)
  {  
    anim.cached.parentWidth = e.parentNode.scrollWidth;
    anim.cached.parentHeight = e.parentNode.scrollHeight;
    anim.cached.width = e.offsetWidth;
    anim.cached.height = e.offsetHeight;
  },
  
  set: function(e, anim)
  {
    // TODO calculator this correctly
    var cunit = anim.units.orbitOffset || '%';
    var orbitX = anim.frame.orbitOffset ? anim.frame.orbitOffset.x : 50;
    var orbitY = anim.frame.orbitOffset ? anim.frame.orbitOffset.y : 50;
    
    var originUnit = anim.units.origin || '%';
    var originX = anim.frame.origin ? anim.frame.origin.x : 50;
    var originY = anim.frame.origin ? anim.frame.origin.y : 50;
    
    var cox = anim8.convert( e, orbitX + cunit, 'px', anim.cached.parentWidth / 100.0 );
    var coy = anim8.convert( e, orbitY + cunit, 'px', anim.cached.parentHeight / 100.0 );
    
    var ox = anim8.convert( e, originX + originUnit, 'px', anim.cached.width / 100.0 );
    var oy = anim8.convert( e, originY + originUnit, 'px', anim.cached.height / 100.0 );
    
    var angle = (anim.frame.angle || 0.0) * this.DEGREE_TO_RADIAN;
    var distance = anim.frame.distance || 0.0;
        
    var cos = Math.cos( angle ) * distance;
    var sin = Math.sin( angle ) * distance;
    
    anim.styles.left = (cox + cos - ox) + 'px';
    anim.styles.top = (coy + sin - oy) + 'px';
  }
};

/**
 * All animatable attributes for DomAnimators & HTMLElements.
 */

anim8.attribute.padding                 = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.margin                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.outlineWidth						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.outlineOffset						= {defaultValue: 0};
anim8.attribute.textIndent							= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderSpacing						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.fontSize								= {defaultValue: 1, defaultUnit: 'em'};
anim8.attribute.lineHeight							= {defaultValue: 1, defaultUnit: 'em'};

anim8.attribute.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
anim8.attribute.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
anim8.attribute.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

anim8.attribute.opacity                 = {defaultValue: 1};
anim8.attribute.zIndex                  = {defaultValue: 1};

anim8.attribute.width                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.height                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.angle                   = {defaultValue: 0, property: 'orbit'};
anim8.attribute.distance                = {defaultValue: 0, property: 'orbit'};
anim8.attribute.orbitOffset             = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'orbitOffset', calculator: '2d'};

anim8.attribute.top                     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.right                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.left                    = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.center                  = {defaultValue: {x:0, y:0}, defaultUnit: 'px', property: 'center', calculator: '2d'};
anim8.attribute.centerX                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};
anim8.attribute.centerY                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};

anim8.attribute.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
anim8.attribute.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.brightness              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.contrast                = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

anim8.attribute.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
anim8.attribute.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

anim8.attribute.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
anim8.attribute.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

anim8.attribute.scale                   = {defaultValue: {x: 0, y:0}, property: 'transform', calculator: '2d'};
anim8.attribute.scaleX	                = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleY  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleZ  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

anim8.attribute.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
anim8.attribute.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
anim8.attribute.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

anim8.attribute.backface                = {defaultValue: 0};
anim8.attribute.visibility              = {defaultValue: 1};

anim8.attribute.backgroundColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.color                   = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderTopColor          = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderRightColor        = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderBottomColor       = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderLeftColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.outlineColor            = {defaultValue: anim8.color(), calculator: 'rgba'};

/**
 * Instantiates a new DomAnimator given a subject.
 * 
 * @param {HTMLElement} e
 */
anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
  this.trues = {};
  this.truesUpdated = false;
  this.attributeToProperty = {};
  this.animating = {};
  this.units = {};
  this.cached = {};
  this.styles = {};
  this.styled = false;
  this.stylesUpdated = false;
  this.animation = null;
};

/**
 * Extends anim8.Animator
 */
anim8.DomAnimator.prototype = new anim8.Animator();

/**
 * A method thats invoked along with all other animators before updates are called.
 * This is used to make any necessary preparations before the animator is updated.
 *
 * If any events that were recently added have true values this is where we replace
 * this true values with the values currently on the subject.
 */
anim8.DomAnimator.prototype.preupdate = function()
{
  if ( this.truesUpdated )
  {    
    var properties = {};
  
    for (var attr in this.trues)
    {
      properties[ this.attributeToProperty[attr] ] = true;
      
      this.animating[ attr ] = false;
    }
  
    for (var prop in properties)
    {
      this.properties[ prop ].get( this.subject, this );
    }
    
    for (var attr in this.trues)
    {
      if ( this.animating[attr] === true )
      {
        var calculator = anim8.calculator( this.attributes[ attr ].calculator );

        var e = this.trues[ attr ];
        var p = e.path.copy();
        var ps = p.points;
        
        for (var i = 0; i < ps.length; i++)
        {
          if ( ps[i] === true )
          {
            ps[i] = calculator.clone( this.frame[ attr ] );
          }
        }

        e.path = p;
      }
    
      delete this.trues[ attr ];
    }
    
    this.truesUpdated = false;
  }
  
  for (var prop in this.properties)
  {
    var property = this.properties[ prop ];
    
    if ( anim8.isFunction( property.preset ) )
    {
      property.preset( this.subject, this );
    }
  }
  
  this.trigger('preupdate');
};
  
/**
 * Updates the animator with the current time. All events and springs in this
 * animator are updated.
 *
 * @param {number} now
 */
anim8.DomAnimator.prototype.update = function(now)
{
  anim8.Animator.prototype.update.apply( this, arguments );
    
  this.getStyles();
  this.stylesUpdated = true;
};

/**
 * A method invoked when an animation is about to be played in the Animator.
 * 
 * @param {anim8.Animation} animation
 * @param {object} options
 * @param {array:anim8.EventInstance} events
 */
anim8.DomAnimator.prototype.onAnimation = function(animation, options, events)
{  
  if ( animation.input.units )
  {
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
    
      if ( attr in animation.input.units )
      {
        e.unit = animation.input.units[ attr ];
      }
    }  
  }
};

/**
 * Builds the styles map in preparation to be applied.
 */
anim8.DomAnimator.prototype.getStyles = function()
{
  this.styles = {};
  
  var applyProperties = {};
  
  for (var attr in this.frame)
  {
    if ( this.updated[ attr ] )
    {
      var prop = this.attributeToProperty[ attr ];
      
      if ( prop in this.properties )
      {
        applyProperties[ prop ] = true; 
      }
    }
  }
  
  for (var prop in applyProperties)
  {
    this.properties[ prop ].set( this.subject, this );  
    
    this.styled = true;
  }
};

/**
 * Applies all updated attributes to the subject. This method is invoked with all of the other
 * animators at the end of the animation cycle.
 */
anim8.DomAnimator.prototype.apply = function()
{
  if ( !this.styled && !this.stylesUpdated )
  {
    this.getStyles();
  }
  
  if ( this.styled )
  {    
    for (var prop in this.styles)
    {
       this.subject.style[ prop ] = this.styles[ prop ];
    }
    
    for (var attr in this.frame)
    {
      this.updated[ attr ] = false;
    }
  
    this.styled = false;
  }
  
  this.stylesUpdated = false;
  
  this.trigger('apply');
  
  this.trimEvents();

  return this;
};
  
/**
 * Places the event in this animator replacing any event that exists for the same
 * attribute. The next time the animator is updated the event will be started.
 *
 * @param {anim8.EventInstance} e
 */
anim8.DomAnimator.prototype.placeEvent = function( e )
{
  anim8.Animator.prototype.placeEvent.apply( this, arguments );
  
  var attr = e.attribute;
  var attribute = anim8.attribute( attr );
  var prop = anim8.coalesce( attribute.property, attr );
  var property = anim8.property( prop );
  
  if ( e.hasTrue() )
  {    
    this.trues[ attr ] = e;
    this.truesUpdated = true;
  }
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  this.units[ attr ] = e.unit || attribute.defaultUnit || '';

  return this;
};
  
/**
 * Places the spring in this animator replacing any spring that exists for the same
 * attribute. The next time the animator is updated the spring will be started.
 *
 * @param {anim8.Spring} s
 */
anim8.DomAnimator.prototype.placeSpring = function( s )
{
  anim8.Animator.prototype.placeSpring.apply( this, arguments );
  
  var attr = s.attribute;
  var attribute = anim8.attribute( attr );
  var prop = anim8.coalesce( attribute.property, attr );
  var property = anim8.property( prop );
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  this.units[ attr ] = attribute.defaultUnit || '';

  return this;
};
  
/**
 * Restores any temporary state that may exist on this Animator that
 * is a result from animations.
 */
anim8.DomAnimator.prototype.restore = function()
{
  for (var prop in this.properties)
  {
    this.properties[ prop ].unset( this.subject, this );
  }
	
	this.frame = {};

  return this;
};

/**
 * Sets the given attributes to this Animator immediately.
 *
 * @param {object} attributes
 */
anim8.DomAnimator.prototype.set = function(attributes)
{
  var props = {};
  var updated = {};
  var units = {};
  var styles = {};
  
  for (var attr in attributes)
  {
    var attribute = anim8.attribute( attr );
    var prop      = anim8.coalesce( attribute.property, attr );
    var property  = anim8.property( prop );
    var calc      = anim8.calculator( attribute.calculator );
    var value     = attributes[ attr ];
    
    units[ attr ] = attribute.defaultUnit || '';
    
    if ( anim8.isString( value ) )
    {
      var parsed = anim8.parseValue( value, attribute.defaultUnit );
      
      if ( parsed !== false )
      {
        units[ attr ] = parsed.unit || attribute.defaultUnit || '';
        value = parsed.value;
      }  
    }
    
    var parsed = calc.parse( value, attribute.defaultValue );
    
    if ( parsed !== false )
    {
      props[ prop ] = property;
      attributes[ attr ] = parsed;
      updated[ attr ] = true;
    }
  }
    
  var flash = 
  {
    units: units,
     
    frame: attributes,
    
    updated: updated,
    
    styles: styles,
    
    cached: {},
    
    value: function(attr)
    {
      return attributes[ attr ] + units[ attr ];
    },
    
    valueOr: function(attr, other, subproperty)
    {
      var value = attributes[ attr ];
      
      if ( !anim8.isDefined( value ) )
      {
        value = attributes[ attr = other ];
      
        if ( anim8.isDefined( subproperty ) )
        {
          value = value[ subproperty ];
        }
      }
  
      return value + units[ attr ];
    }
  };
  
  for (var prop in props)
  {
    var property = props[ prop ];
    
    if ( anim8.isFunction( property.preset ) )
    {
      props[ prop ].preset( this.subject, flash );
    }
  }
  
  for (var prop in props)
  {
    props[ prop ].set( this.subject, flash );
  }
  
  for (var prop in styles)
  {
    this.subject.style[ prop ] = styles[ prop ];
  }

  return this;
};

/**
 * Gets the current attribute values for all attributes specified. The argument must be an object
 * where the key is the name of an attribute and the value is the desired unit.
 *
 * @param {object} attributes
 */
anim8.DomAnimator.prototype.get = function(attributes)
{
  var props = {};
  var animating = {};
  var units = {};
  var out = {};
  
  for (var attr in attributes)
  {    
    var attribute = anim8.attribute( attr );
    var prop      = anim8.coalesce( attribute.property, attr );
    var property  = anim8.property( prop );
    var calc      = anim8.calculator( attribute.calculator );
    
    animating[ attr ] = false;    
    units[ attr ] = attributes[ attr ] || attribute.defaultUnit || '';
    props[ prop ] = property;
    out[ attr ] = calc.clone( attribute.defaultValue );
  }
  
  var flash = 
  {    
    units: units,
    
    frame: out,
    
    animating: animating,
    
    unit: function(attr)
    {
      return units[ attr ];
    }
  };
  
  for (var prop in props)
  {
    props[ prop ].get( this.subject, flash );
  }
  
  return out;
};

/**
 * Returns a function that returns the current value for the given attribute when invoked.
 * 
 * @param {string} attribute
 */
anim8.DomAnimator.prototype.ref = function(attribute, desiredUnit, relativeTo)
{
  var animator = this;
  var request = {};
  
  return function()
  {
    if ( attribute in animator.frame && anim8.isNumber( animator.frame[ attribute ] ) )
    {
      return anim8.convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
    }
    
    request[ attribute ] = desiredUnit;
    
    var current = animator.get( request );
    
    if ( anim8.isDefined( current[ attribute ] ) )
    {
      return current[ attribute ];
    }
    
    return anim8.attribute( attribute ).defaultValue;
  };
},

/**
 * Returns the value for the given attribute as a string with the current units.
 *
 * @param {string} attr
 */
anim8.DomAnimator.prototype.value = function(attr)
{
  return this.frame[ attr ] + this.units[ attr ];
};

/**
 * Returns the value for the given attribute as a string with the current units.
 * if the attribute doesn't exist a secondary one is looked up. If that value
 * is an object and contains the given subproperty the value is resolved once again.
 *
 * @param {string} attr
 * @param {string} other
 * @param [string] subproperty
 */
anim8.DomAnimator.prototype.valueOr = function(attr, other, subproperty)
{
  var value = this.frame[ attr ];
    
  if ( !anim8.isDefined( value ) )
  {
    value = this.frame[ attr = other ];
    
    if ( anim8.isDefined( subproperty ) )
    {
      value = value[ subproperty ];
    }
  }
  
  return value + this.units[ attr ];
};

/**
 * Animate.css animations in anim8js.
 *
 * http://daneden.github.io/animate.css/
 */

anim8.save('bounce', {
	keyframe: {
    '0,20,53,80,100': {
      translate3d: 0,
      easing: [0.215, 0.610, 0.355, 1.000]
    },
    '40,43': {
      translate3d: {y:-30},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '70': {
      translate3d: {y:-15},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '90': {
      translate3d: {y:-4}
    }
	}
});

anim8.save('rubberBand', {
	keyframe: {
    '0,100': {
      scale3d: 1
    },
    '30': {
      scale3d: {x:1.25, y:0.75}
    },
    '40': {
      scale3d: {x:0.75, y:1.25}
    },
    '50': {
      scale3d: {x:1.15, y:0.85}
    },
    '65': {
      scale3d: {x:0.95, y:1.05}
    },
    '75': {
      scale3d: {x:1.05, y:0.95}
    }
	}
});

anim8.save('flash', {
  keyframe: {
    '0,50,100': {
      opacity: 1
    },
    '25,75': {
      opacity: 0
    }
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

anim8.save('pulse', {
  keyframe: {
    '0': {
      scale3d: 1.0
    },
    '50': {
      scale3d: 1.05
    },
    '100': {
      scale3d: 1.0
    }
  }
});

anim8.save('shake', {
  keyframe: {
    '0,100': {
      translateX: 0.0
    },
    '10,30,50,70,90': {
      translateX: -10.0
    },
    '20,40,60,80': {
      translateX: 10.0
    } 
  }
});

anim8.save('swing', {
  keyframe: {
    '0': {
      rotate: 0
    },
    '20': {
      rotate: 15
    },
    '40': {
      rotate: -10
    },
    '60': {
      rotate: 5
    },
    '80': {
      rotate: -5
    },
    '100': {
      rotate: 0
    }
  },
  initial: {
    origin: 'center top'
  }
});

anim8.save('tada', {
  keyframe: {
    '0,100': {
      scale3d: 1,
      rotate: 0
    },
    '10,20': {
      scale3d: 0.9,
      rotate: -3
    },
    '30,50,70,90': {
      scale3d: 1.1,
      rotate: 3
    },
    '40,60,80': {
      scale3d: 1.1,
      rotate: -3
    }
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

anim8.save('wobble', {
  keyframe: {
    '0,100': {
      translateX: 0,
      rotate: 0
    },
    '15': {
      translateX: -25,
      rotate: -5
    },
    '30': {
      translateX: 20,
      rotate: 3
    },
    '45': {
      translateX: -15,
      rotate: -3
    },
    '60': {
      translateX: 10,
      rotate: 2
    },
    '75': {
      translateX: -5,
      rotate: -1
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('bounceIn', {
  keyframe: {
    '0': {
      opacity: 0.0,
      scale3d: 0.3
    },
    '20': {
      scale3d: 1.1
    },
    '40': {
      scale3d: 0.9
    },
    '60': {
      opacity: 1,
      scale3d: 1.03
    },
    '80': {
      scale3d: 0.97
    },
    '100': {
      opacity: 1.0,
      scale3d: 1.0
    }
  }
}, {
  easing: [0.215, 0.610, 0.355, 1.000]
});

anim8.save('bounceInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -3000
    },
    '60': {
      opacity: 1,
      translateY: 25
    },
    '75': {
      translateY: -10
    },
    '90': {
      translateY: 5
    },
    '100': {
      translateY: 0
    }
  }
}, {
  duration: 2000,
  easing: [0.215, 0.610, 0.355, 1.000]
});

anim8.save('bounceInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -3000
    },
    '60': {
      opacity: 1,
      translateX: 25
    },
    '75': {
      translateX: -10
    },
    '90': {
      translateX: 5
    },
    '100': {
      translateX: 0
    }
  }
}, {
  duration: 2000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});


anim8.save('bounceInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 3000
    },
    '60': {
      opacity: 1,
      translateX: -25
    },
    '75': {
      translateX: 10
    },
    '90': {
      translateX: -5
    },
    '100': {
      translateX: 0
    }
  }
}, {
  duration: 2000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});

anim8.save('bounceInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 3000
    },
    '60': {
      opacity: 1,
      translateY: -25
    },
    '75': {
      translateY: 10
    },
    '90': {
      translateY: -5
    },
    '100': {
      translateY: 0
    }
  }
}, {
  duration: 1000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});

anim8.save('bounceOut', {
  keyframe: {
    '0': {
      scale3d: 1.0
    },
    '20': {
      scale3d: 0.9
    },
    '50,55': {
      opacity: 1,
      scale3d: 1.1
    },
    '100': {
      opacity: 0,
      scale3d: 0.3
    }
  }
}, {
  duration: 750
});

anim8.save('bounceOutDown', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '20': {
      translateY: 10
    },
    '40,45': {
      opacity: 1,
      translateY: -20
    },
    '100': {
      opacity: 0,
      translateY: 2000
    }
  }
});

anim8.save('bounceOutLeft', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '20': {
      opacity: 1,
      translateX: 20
    },
    '100': {
      opacity: 0,
      translateX: -2000
    }
  }
});

anim8.save('bounceOutRight', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '20': {
      opacity: 1,
      translateX: -20
    },
    '100': {
      opacity: 0,
      translateX: 2000
    }
  }
});

anim8.save('bounceOutUp', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '20': {
      translateY: -10
    },
    '40,45': {
      opacity: 1,
      translateY: 20
    },
    '100': {
      opacity: 0,
      translateY: -2000
    }
  }
});

anim8.save('fadeIn', {
  keyframe: {
    '0': {
      opacity: 0
    },
    '100': {
      opacity: 1
    }
  }
});

anim8.save('fadeInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -100
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  },
  units: {
    translateY: '%'
  }
});

anim8.save('fadeInDownBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -2000
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  }
});

anim8.save('fadeInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -100
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('fadeInLeftBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -2000
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  }
});

anim8.save('fadeInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 100
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('fadeInRightBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 2000
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  }
});

anim8.save('fadeInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 100
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  }, 
  units: {
    translateY: '%'
  }
});

anim8.save('fadeInUpBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 2000
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  }
});

anim8.save('fadeOut', {
  keyframe: {
    '0': {
      opacity: 1
    },
    '100': {
      opacity: 0
    }
  }
});

anim8.save('fadeOutDown', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: 100
    }
  },
  units: {
    translateY: '%'
  }
});

anim8.save('fadeOutDownBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: 2000
    }
  }
});

anim8.save('fadeOutLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: -100
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('fadeOutLeftBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: -2000
    }
  }
});

anim8.save('fadeOutRight', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: 100
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('fadeOutRightBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: 2000
    }
  }
});

anim8.save('fadeOutUp', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: -100
    }
  },
  units: {
    translateY: '%'
  }
});

anim8.save('fadeOutUpBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: -2000
    }
  }
});

anim8.save('flip', {
  keyframe: {
    '0': {
      translateZ: 0,
      rotate3d: {x:0, y:1, z:0, angle:-360},
      scale3d: 1.0,
      easing: 'cssEaseOut'
    },
    '40': {
      translateZ: 150,
      rotate3d: {x:0, y:1, z:0, angle:-190},
      easing: 'cssEaseOut'
    },
    '50': {
      translateZ: 150,
      rotate3d: {x:0, y:1, z:0, angle:-170},
      easing: 'cssEaseIn'
    },
    '80': {
      translateZ: 0,
      rotate3d: {x:0, y:1, z:0, angle:0},
      scale3d: 0.95,
      easing: 'cssEaseIn'
    },
    '100': {
      scale3d: 1.0
    }
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

anim8.save('flipInX', {
  keyframe: {
    '0': {
      opacity: 0,
      rotate3d: {x:1, y:0, z:0, angle:90},
      easing: 'cssEaseIn'
    },
    '40': {
      rotate3d: {x:1, y:0, z:0, angle:-20},
      easing: 'cssEaseIn'
    },
    '60': {
      opacity: 1,
      rotate3d: {x:1, y:0, z:0, angle:10}
    },
    '80': {
      rotate3d: {x:1, y:0, z:0, angle:-5}
    },
    '100': {
      rotate3d: {x:1, y:0, z:0, angle:0}
    }
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

anim8.save('flipInY', {
  keyframe: {
    '0': {
      opacity: 0,
      rotate3d: {x:0, y:1, z:0, angle:90},
      easing: 'cssEaseIn'
    },
    '40': {
      rotate3d: {x:0, y:1, z:0, angle:-20},
      easing: 'cssEaseIn'
    },
    '60': {
      opacity: 1,
      rotate3d: {x:0, y:1, z:0, angle:10}
    },
    '80': {
      rotate3d: {x:0, y:1, z:0, angle:-5}
    },
    '100': {
      rotate3d: {x:0, y:1, z:0, angle:0}
    }
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

anim8.save('flipOutX', {
  keyframe: {
    '0': {
      rotate3d: {x:1, y:0, z:0, angle:0}
    },
    '30': {
      opacity: 1,
      rotate3d: {x:1, y:0, z:0, angle:-20}
    },
    '100': {
      opacity: 0,
      rotate3d: {x:1, y:0, z:0, angle:90}
    }
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
}, {
  duration: 750
});

anim8.save('flipOutY', {
  keyframe: {
    '0': {
      rotate3d: {x:0, y:1, z:0, angle:0}
    },
    '30': {
      opacity: 1,
      rotate3d: {x:0, y:1, z:0, angle:-20}
    },
    '100': {
      opacity: 0,
      rotate3d: {x:0, y:1, z:0, angle:90}
    }
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
}, {
  duration: 750
});

anim8.save('lightSpeedIn', {
  keyframe: {
    '0': {
      translateX: 100,
      skewX: -30,
      opacity: 0
    },
    '60': {
      skewX: 20,
      opacity: 1
    },
    '80': {
      skewX: -5
    },
    '100': {
      translateX: 0,
      skewX: 0
    }
  },
  units: {
    translateX: '%'
  }
}, {
  easing: 'cssEaseOut'
});

anim8.save('lightSpeedOut', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0,
      skewX: 0
    },
    '100': {
      opacity: 0,
      translateX: 100,
      skewX: 30
    }
  },
  units: {
    translateX: '%'
  }
}, {
  easing: 'cssEaseIn'
});

anim8.save('rotateIn', {
  keyframe: {
    '0': {
      rotate: -200,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  initial: {
    origin: 'center'
  }
});

anim8.save('rotateInDownLeft', {
  keyframe: {
    '0': {
      rotate: -45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  initial: {
    origin: 'left bottom'
  }
});

anim8.save('rotateInDownRight', {
  keyframe: {
    '0': {
      rotate: 45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  initial: {
    origin: 'right bottom'
  }
});

anim8.save('rotateInUpLeft', {
  keyframe: {
    '0': {
      rotate: 45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  initial: {
    origin: 'left bottom'
  }
});

anim8.save('rotateInUpRight', {
  keyframe: {
    '0': {
      rotate: -90,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  initial: {
    origin: 'right bottom'
  }
});

anim8.save('rotateOut', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 200
    }
  },
  initial: {
    origin: 'center'
  }
});

anim8.save('rotateOutDownLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 45
    }
  },
  initial: {
    origin: 'left bottom'
  }
})

anim8.save('rotateOutDownRight', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: -45
    }
  },
  initial: {
    origin: 'right bottom'
  }
});

anim8.save('rotateOutUpLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: -45
    }
  },
  initial: {
    origin: 'left bottom'
  }
});

anim8.save('rotateOutUpRight', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 90
    }
  },
  initial: {
    origin: 'right bottom'
  }
});

anim8.save('hinge', {
  keyframe: {
    '0': {
      rotate: 0
    },
    '20,60': {
      rotate: 80
    },
    '40': {
      rotate: 60
    },
    '80': {
      rotate: 60,
      translateY: 0,
      opacity: 1
    },
    '100': {
      rotate: 0,
      translateY: 700,
      opacity: 0
    }
  },
  initial: {
    origin: 'top left'
  }
}, {
  easing: 'cssEaseInOut',
  duration: 2000
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

anim8.save('rollIn', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -100,
      rotate: -120
    },
    '100': {
      opacity: 1,
      translateX: 0,
      rotate: 0
    }
  },
  units: {
    translateX: '%'
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

anim8.save('rollOut', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0,
      rotate: 0
    },
    '100': {
      opacity: 0.0,
      translateX: 100,
      rotate: 120
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('zoomIn', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.3
    },
    '50': {
      opacity: 1
    },
    '100': {
      scale3d: 1
    }
  }
});

anim8.save('zoomInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateY: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateY: 60,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateY: 0
    }
  }
});

anim8.save('zoomInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateX: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateX: 10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateX: 0
    }
  }
});

anim8.save('zoomInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateX: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateX: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateX: 0
    }
  }
});

anim8.save('zoomInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateY: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateY: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateY: 0
    }
  }
});

anim8.save('zoomOut', {
  keyframe: {
    '0': {
      opacity: 1,
      scale3d: 1
    },
    '100': {
      opacity: 0,
      scale3d: 0.3
    }
  }
}, {
  duration: '500ms'
});

anim8.save('zoomOutDown', {
  keyframe: {
    '0': {
      scale3d: 1.0,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateY: -60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateY: 2000,
      origin: 'center bottom'
    }
  }
});

anim8.save('zoomOutLeft', {
  keyframe: {
    '0': {
      scale3d: 1.0,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateX: 42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateX: -2000,
      origin: 'left center'
    }
  }
});

anim8.save('zoomOutRight', {
  keyframe: {
    '0': {
      scale3d: 1.0,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateX: -42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateX: 2000,
      origin: 'right center'
    }
  }
});

anim8.save('zoomOutUp', {
  keyframe: {
    '0': {
      scale3d: 1.0,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateY: 60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateY: -2000,
      origin: 'center bottom'
    }
  }
});

anim8.save('slideInDown', {
  keyframe: {
    '0': {
      translateY: -100
    },
    '100': {
      translateY: 0
    }
  },
  units: {
    translateY: '%'
  }
});

anim8.save('slideInLeft', {
  keyframe: {
    '0': {
      translateX: -100
    },
    '100': {
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('slideInRight', {
  keyframe: {
    '0': {
      translateX: 100
    },
    '100': {
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

anim8.save('slideInUp', {
  keyframe: {
    '0': {
      translateY: 100
    },
    '100': {
      translateY: 0
    }
  },
  units: {
    translateY: '%'
  }
});

anim8.save('slideOutDown', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '100': {
      translateY: 100
    }
  },
  units: {
    translateY: '%'
  },
  final: {
    visibility: 0
  }
});

anim8.save('slideOutLeft', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '100': {
      translateX: -100
    }
  },
  units: {
    translateX: '%'
  },
  final: {
    visibility: 0
  }
});

anim8.save('slideOutRight', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '100': {
      translateX: 100
    }
  },
  units: {
    translateX: '%'
  },
  final: {
    visibility: 0
  }
});

anim8.save('slideOutUp', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '100': {
      translateY: -100
    }
  },
  units: {
    translateY: '%'
  },
  final: {
    visibility: 0
  }
});

/* anim8js animations */

anim8.save('blurOut', {
  keyframe: {
    '0': {
      blur: 0,
      opacity: 1
    },
    '50': {
      blur: 4,
      opacity: 0.9
    },
    '100': {
      blur: 5,
      opacity: 0
    }
  }
});

anim8.save('blurIn', {
  keyframe: {
    '0': {
      blur: 5,
      opacity: 0
    },
    '50': {
      blur: 4,
      opacity: 0.9
    },
    '100': {
      blur: 0,
      opacity: 1
    }
  }
});

/**
 * Generate animations for all permutations of the following concepts:
 *
 * (slide|fade|zoom)(Out|In)(Down|Up)(Right|Left)(|x2|Big)
 */
(function() 
{
  var actions = {
    'slide': {},
    'fade': {opacity:{from:0,to:1}},
    'zoom': {scale3d:{from:0,to:1}}
  };
  
  var directions = {
    'Out':  {from:0, to:1},
    'In':   {from:1, to:0}
  };
  
  var vertical = {
    'Down': 1,
    'Up': -1
  };
  
  var horizontal = {
    'Right': 1,
    'Left': -1
  };
  
  var sizes = {
    '':     {value: 100, unit: '%'},
    'x2':   {value: 200, unit: '%'},
    'Big':  {value: 2000, unit: 'px'}
  };
  
  for ( var a in actions )
  {
    var attrs = actions[ a ];
    
    for ( var d in directions )
    {
      var dir = directions[ d ];
      
      for ( var v in vertical )
      {
        var ver = vertical[ v ];
        
        for ( var h in horizontal )
        {
          var hor = horizontal[ h ];
          
          for ( var s in sizes )
          {
            var siz = sizes[ s ];
            
            var animName = a + d + v + h + s;
            
            if ( animName in anim8.animation )
            {
              continue;
            }
            
            var anim = 
            {
              keyframe: {
                from: {
                  translateX: hor * dir.from * siz.value,
                  translateY: ver * dir.from * siz.value
                },
                to: {
                  translateX: hor * dir.to * siz.value,
                  translateY: ver * dir.to * siz.value
                }
              },
              units: {
                translateX: siz.unit,
                translateY: siz.unit
              }
            };
            
            for (var attr in attrs)
            {
              var attribute = attrs[attr];
              
              anim.keyframe.from[ attr ] = dir.to * attribute.to + dir.to * attribute.from;
              anim.keyframe.to[ attr ]   = dir.from * attribute.from + dir.from * attribute.to;
            }
            
            anim8.save( animName, anim );
          }
        }
      }
    }
  }
  
})();
/**
 * A factory for jQuery objects.
 */
anim8.jQueryFactory = function()
{
};

// It extends anim8.Factory
anim8.jQueryFactory.prototype = new anim8.Factory();

/**
 * Determines whether the given subject is valid for this factory to create Animators for.
 * 
 * @param  {any} subject
 * @return {boolean}
 */
anim8.jQueryFactory.prototype.is = function(subject)
{
  return typeof jQuery !== 'undefined' && subject instanceof jQuery;
};

/**
 * Returns an animator given a subject.
 * 
 * @param  {any} subject
 * @return {anim8.Animator}
 */
anim8.jQueryFactory.prototype.animatorFor = function(subject)
{
  anim8.factory.dom.animatorFor( subject[0] );
};

/**
 * Explodes the given subject to an array of Animators and adds them to the given array.
 * 
 * @param  {any} subject
 * @param  {array} animators
 * @return {void}
 */
anim8.jQueryFactory.prototype.animatorsFor = function(subject, animators)
{
  subject.each(function() 
  {
    var animator = anim8.factory.dom.animatorFor( this );

    if (animator) 
    {
      animators.push( animator );
    }
  });
};

/**
 * Destroys the animator by unlinking the animator from the subject.
 * 
 * @param  {anim8.Animator} animator
 * @return {void}
 */
anim8.jQueryFactory.prototype.destroy = function(animator)
{
  anim8.factory.dom.destroy( animator );
};

/**
 * Registers the jQuery factory.
 */
anim8.factory.jquery = new anim8.jQueryFactory();

(function($, m8)
{
  var SYMBOL = 
  {
    REPEAT: 'x',
    DELAY: '~',
    SLEEP: 'z',
    INFINITY: 'infinite'
  };
  
  $.fn.animators = function()
  {
		return m8( this.get() );		
  };
  
  $.fn.play = function( animationText, all )
  {
    var anim = parseAnimation( animationText );
    
    if ( anim !== false )
    {
      this.animators().play( anim.animation, anim.options, all );
    }
    
    return this; 
  };
  
  $.fn.dataPlay = function( animationAttribute, all )
  {
		return this.filter(function()
	  {
			var animationText = $(this).data( animationAttribute );
		
			if ( animationText )
			{
		    var anim = parseAnimation( animationText );
		
				if ( anim !== false )
				{					
			  	m8( this ).play( anim.animation, anim.options, all );
					
					return true;
				}
			}
			
			return false;
  	});
  };
  
  $.fn.queueAnimation = function( animationText )
  {
    var anim = parseAnimation( animationText );
    
    if ( anim !== false )
    {
      this.animators().queue( anim.animation, anim.options );
    }
    
    return this; 
  };
  
  $.fn.dataQueue = function( animationAttribute )
  {	
  	return this.filter(function()
    {
  		var animationText = $(this).data( animationAttribute );
		
  		if ( animationText )
  		{
  	    var anim = parseAnimation( animationText );
		
				if ( anim !== false )
				{
		   		m8( this ).queue( anim.animation, anim.options );		
					
					return true;
				}
  		}
			
			return false;
    });
  };

  $.fn.transition = function( animationText, transitionText )
  {
    var anim = parseAnimation( animationText );
    var tran = parseTransition( transitionText );
    
    if ( anim !== false )
    {
      this.animators().transition( tran.time, tran.delta, tran.easing, anim.animation, anim.options );
    }
    
    return this; 
  };
  
  $.fn.dataTransition = function( animationAttribute, transitionAttribute )
  {	
		return this.filter(function()
		{
			var animationText = $(this).data( animationAttribute );
			var transitionText = $(this).data( transitionAttribute );
		
			if ( animationText && transitionText )
			{
		    var anim = parseAnimation( animationText );
				var tran = parseTransition( transitionText );

				if ( anim !== false )
				{
			  	m8( this ).transition( tran.time, tran.delta, tran.easing, anim.animation, anim.options );
					
					return true;
				}
			}
			
			return false;
		});
  };
  
  $.fn.pause = function()
  {
    this.animators().pause();
    
    return this;
  };
  
  $.fn.resume = function()
  {
    this.animators().resume();
    
    return this;
  };
  
  $.fn.restore = function()
  {
    this.animators().restore();
    
    return this;
  };
  
  $.fn.stopIt = function()
  {
    this.animators().stop();
    
    return this;
  };
  
  $.fn.finishIt = function()
  {
    this.animators().finish();
    
    return this;
  };
  
  $.fn.endIt = function()
  {
    this.animators().end();
    
    return this;
  };
  
  $.fn.eventsFor = function( attributes, callback, context )
  {
    this.animators().eventsFor( attributes, callback, context );
    
    return this;
  };
  
  $.fn.springsFor = function( attributes, callback, context )
  {
    this.animators().springsFor( attributes, callback, context );
    
    return this;
  };
  
  $.fn.setAttributes = function( attributes )
  {
    this.animators().set( attributes );
    
    return this;
  };
  
  $.fn.getAttributes = function( attributes )
  {
    return this.animators().get( attributes );
  };
  
  $.fn.spring = function( spring  )
  {
    return this.animators().spring( spring );
  };
  
  $.fn.unspring = function( springs )
  {
    this.animators().unspring( springs );
    
    return this;
  };
  
  $.fn.applyInitialState = function( attributes )
  {
    this.animators().applyInitialState( attributes );
	 	 
	  return this;
  };
  
  $.fn.isAnimating = function( attributes )
  {
    return this.animators().isAnimating();
  };
  
  $.fn.hasEvents = function( attributes )
  {
    return this.animators().hasEvents();
  };
  
  var parseAnimation = function( text )
  {
		if ( !anim8.isString( text ) )
		{
			return false;
		}
		
    var parts = text.split(' ');
    var options = {};
    var animation = null;
    
    for (var i = 0; i < parts.length; i++)
    {
      var p = parts[i];
            
      if ( p in m8.animation )
      {
        animation = p;
      }
      else if ( m8.isEasingName( p ) )
      {
        options.easing = p;
      }
      else if ( p.charAt(0) === SYMBOL.REPEAT )
      {
        var repeats = parseInt( p.substring(1) );
        
        if (!isNaN(repeats)) 
        {
          options.repeat = repeats;
        }
      }
      else if ( p.charAt(0) === SYMBOL.SLEEP )
      {
        var sleeps = m8.time( p.substring(1) );
        
        if ( sleeps !== false )
        {
          options.sleep = sleeps;
        }
      }
      else if ( p.charAt(0) === SYMBOL.DELAY )
      {
        var delays = m8.time( p.substring(1) );
        
        if ( delays !== false )
        {
          options.delay = delays;
        }
      }
      else if ( p === SYMBOL.INFINITY )
      {
        options.repeat = Number.POSITIVE_INFINITY;
      }
      else
      {
        var duration = m8.time( p );
        
        if ( duration !== false )
        {
          options.duration = duration;
        }
      }
    }
    
    if ( animation === null )
    {
      return false;
    }
    
    return {
      animation: animation,
      options: options
    };
  };

  var parseTransition = function( text )
  {
		if ( !anim8.isString( text ) )
		{
			return false;
		}
		
    var transition = 
    {
      time: 500,
      delta: 0.2,
      easing: 'ease'
    };
    
    var parts = text.split(' ');
    
    for (var i = 0; i < parts.length; i++)
    {
      var p = parts[i];
      var num = parseFloat(p);
      
      if ( m8.isEasingName( p ) )
      {
        transition.easing = p;
      }
      else if ( !isNaN(num) && num >= 0.0 && num <= 1.0 )
      {
        transition.delta = num;
      }
      else
      {
        var times = m8.time( p );
        
        if ( times !== false )
        {
          transition.time = times;
        }
      }
    }
    
    return transition;
  };
  
})(jQuery, anim8);
