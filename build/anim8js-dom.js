
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

  var factory = anim8.factoryFor( subject, true );

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
  var factory = anim8.factoryFor( subjects, true );
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


/**
 * The default values for event properties.
 */
anim8.defaults = 
{

  /**
   * The default animation duration in milliseconds.
   * 
   * @type {number}
   */
  duration: 1000,

  /**
   * The default easing.
   * 
   * @type {string|function}
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   * 
   * @type {string|function}
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   * 
   * @type {number}
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   * 
   * @type {number}
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   * 
   * @type {number}
   */
  repeat: 1,

  /**
   * The default scale for an animation.
   * 
   * @type {number}
   */
  scale: 1.0,

  /**
   * The default transition time in milliseconds.
   * 
   * @type {number}
   */
  transitionTime: 500,

  /**
   * The default transition delta.
   * 
   * @type {number}
   */
  transitionOutroDelta: 0.1,

  /**
   * The default transition into delta.
   * 
   * @type {number}
   */
  transitionIntoDelta: 0.1,

  /**
   * The default transition into delta.
   * 
   * @type {string|function}
   */
  transitionEasing: 'linear',

  /**
   * The default transition granularity. This is used for smooth transitions to
   * provide a smooth transition from the outro velocity to the intro velocity,
   * the cubic or quadratic path between the two is a curve with unknown length
   * so the length needs to be calculated using a maximum number of points to
   * calculate along the path - summing the distances between the consecutive points.
   * 
   * @type {Number}
   */
  transitionGranularity: 50,

  /**
   * Whether animtions are cached whenever possible. Animations that can be
   * cached are strings with options specified in the string and without an
   * option object given. For example 'tada ~1s 3s x3' is cacheable.
   * 
   * @type {boolean}
   * @see  anim8.animation
   */
  cache: false,

  /**
   * Whether parsed options are cached whenever possible. Options that can be
   * cached must be strings.
   * 
   * @type {Boolean}
   * @see  anim8.options
   */
  cacheOptions: false,

  /**
   * Whether parsed transitions are cached whenever possible. Transitions that can be
   * cached must be strings.
   * 
   * @type {Boolean}
   * @see  anim8.transition
   */
  cacheTransitions: false,

  /**
   * The value to return when options could not be parsed from input.
   * 
   * @type {Object}
   */
  noOptions: {},

  /**
   * The value to return when a transition could not be parsed from input.
   * @type {Object}
   */
  noTransition: {}

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
 * Extends the given object by merging the following objects into it, avoiding overriding any existing properties.
 * 
 * @param  {object} out
 * @return {object}
 */
anim8.extend = function(out)
{
  for (var i = 1; i < arguments.length; i++)
  {
    var o = arguments[ i ];

    if ( anim8.isObject( o ) )
    {
      for (var prop in o)
      {
        if ( !(prop in out) )
        {
          out[prop] = o[prop];
        }
      }
    }
  }

  return out;
};

/**
 * Extends the given object my merging the following objects into, overriding existing properties where necessary.
 * 
 * @param  {object}
 * @return {object}
 */
anim8.override = function(out)
{
  for (var i = 1; i < arguments.length; i++)
  {
    var o = arguments[ i ];

    if ( anim8.isObject( o ) )
    {
      for (var prop in o)
      {
        out[prop] = o[prop];
      }
    }
  }

  return out;
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
 * Parses delay from a string or number.
 *
 * @param {string|number}
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
 * @see anim8.time
 */ 
anim8.duration = function(time)
{
  return anim8.time( time, anim8.defaults.duration );
};

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
 * Parses scale from a string or number.
 * 
 * @param  {string|number}
 * @return {number}
 */
anim8.scale = function(scale, returnOnInvalid)
{
  if ( anim8.isNumber( scale ) )
  {
    return scale;
  }

  return anim8.coalesce( returnOnInvalid, anim8.defaults.scale );
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

/**
 * Returns a value between the given minimum and maximum.
 * 
 * @param  {number} v
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
anim8.clamp = function(v, min, max)
{
  return (v < min) ? min : (v > max ? max : v);
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
    
    if ( !anim8.isDefined( $this[ property ] ) )
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
 * A FastMap has the key-to-value benefits of a map and iteration benefits of an array.
 * This is especially beneficial when most of the time the contents of the structure need to be iterated and order
 * doesn't matter (since removal performs a swap which breaks insertion order).
 */
anim8.FastMap = function()
{
  this.values = [];
  this.keys = [];
  this.indices = {};
};

anim8.FastMap.prototype =
{
  /**
   * Puts the value in the map by the given key.
   * 
   * @param  {string} key
   * @param  {any} value
   * @return {this}
   */
  put: function(key, value)
  {
    if ( key in this.indices )
    {
      this.values[ this.indices[ key ] ] = value;
    }
    else
    {
      this.indices[ key ] = this.values.length;
      this.values.push( value );
      this.keys.push( key );
    }

    return this;
  },

  /**
   * Puts all keys & values on the given map into this map overwriting any existing values mapped by similar keys.
   * 
   * @param  {anim8.FastMap}
   * @return {this}
   */
  putMap: function(map)
  {
    var keys = map.keys;
    var values = map.values;

    for (var i = 0; i < keys.length; i++)
    {
      this.put( keys[ i ], values[ i ] );
    }

    return this;
  },

  /**
   * Returns the value mapped by the given key.
   * 
   * @param  {string} key
   * @return {any}
   */
  get: function(key)
  {
    return this.values[ this.indices[ key ] ];
  },

  /**
   * Removes the value by a given key
   * 
   * @param  {string} key
   * @return {this}
   */
  remove: function(key)
  {
    if ( key in this.indices )
    {
      var index = this.indices[ key ];
      var lastValue = this.values.pop();
      var lastKey = this.keys.pop();

      if ( index < this.values.length )
      {
        this.values[ index ] = lastValue;
        this.keys[ index ] = lastKey;
        this.indices[ lastKey ] = index;
      }

      delete this.indices[ key ];
    }

    return this;
  },

  /**
   * Returns the index of the value in the array given a key.
   * 
   * @param  {string} key
   * @return {number}
   */
  indexOf: function(key)
  {
    return this.indices[ key ];
  },

  /**
   * Returns the number of elements in the map.
   * 
   * @return {number}
   */
  size: function()
  {
    return this.values.length;
  }

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
  return (Math.log10(x + 0.01) + 2.0) * 0.5 / 1.0021606868913213;
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

/**
 * [bezier description]
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
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

/**
 * [default description]
 * @type {[type]}
 */
anim8.easing.default      = anim8.easing.ease;


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

/**
 * Plays the animation forward normally.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.in = function(easing) 
{
	return function(x) 
	{
		return easing( x );
	};
};

/**
 * Plays the animation forward by flipping the easings momentum.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.out = function(easing) 
{
	return function(x) 
	{
		return 1.0 - easing( 1.0 - x );
	};
};

/**
 * Plays the animation forward by flipping the easings momentum halfway.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.inout = function(easing) 
{
	return function(x) 
	{
	  if ( x < 0.5 ) 
	  {
	    return easing( 2.0 * x ) * 0.5;
	  } 
	  else 
	  {
	    return 1.0 - (easing( 2.0 - 2.0 * x ) * 0.5);
	  }
	};
};

/**
 * Plays the aninmation forwards with the given easing, and backwards with the same easing momentum.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.yoyo = function(easing) 
{
	return function(x) 
	{
	  if ( x < 0.5 ) 
	  {
	    return easing( 2.0 * x );
	  } 
	  else 
	  {
	    return easing( 2.0 - 2.0 * x );
	  }
	};
};

/**
 * Plays the animation forwards with the given easing, and backwards reflecting the easing's momentum.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.mirror = function(easing)
{
	return function(x)
	{
		if ( x < 0.5 )
		{
			return easing( 2.0 * x );
		}
		else
		{
			return 1.0 - easing( 2.0 - 2.0 * x );
		}
	};
};

/**
 * Plays the animation backwards with using the same easing momentum.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.reverse = function(easing)
{
	return easing( 1.0 - x );
};

/**
 * Plays the animation backwards by flipping the easing's momentum.
 * 
 * @param  {function} easing
 * @return {function}
 */
anim8.easingType.flip = function(easing)
{
	return 1.0 - easing( x );
};


anim8.easing.cssEase      = anim8.easing.ease;
anim8.easing.cssEaseIn    = anim8.easing.quad;
anim8.easing.cssEaseOut   = anim8.easingType.out( anim8.easing.quad );
anim8.easing.cssEaseInOut = anim8.easingType.inout( anim8.easing.quad );
anim8.easing.cssLinear    = anim8.easing.linear;


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
  
  return false;
};

/**
 * Formats a color to a string.
 * 
 * @param {object} color
 */
anim8.color.format = function(color)
{
  var ca = anim8.clamp( anim8.coalesce( color.a, 1.0 ), 0, 1 );
  var cr = Math.floor( anim8.clamp( anim8.coalesce( color.r, 255 ), 0, 255 ) );
  var cg = Math.floor( anim8.clamp( anim8.coalesce( color.g, 255 ), 0, 255 ) );
  var cb = Math.floor( anim8.clamp( anim8.coalesce( color.b, 255 ), 0, 255 ) );
  
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
 * [computed description]
 * @type {Object}
 */
anim8.computed = {};

/**
 * Calculates the current value for an animator.
 * 
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
anim8.computed.current = function(event, animator)
{
  var attr = event.attribute;
  var attribute = animator.getAttribute( attr );

  if ( attr in animator.frame )
  {
    return attribute.calculator.clone( animator.frame[ attr ] );
  }
  else
  {
    return attribute.cloneDefault();
  }
};

// Marks the function as computed which is a signal to paths & events.
anim8.computed.current.computed = true;

/**
 * Calculates a value relative to the attribute value currenrtly in the animator.
 * 
 * @param  {[type]}
 * @return {[type]}
 */
anim8.computed.relative = function(relativeAmount, mask)
{
  // If the relativeAmount is already a computed value, return it.
  if ( anim8.isComputed( relativeAmount ) )
  {
    return relativeAmount;
  }

  var relativeFunction = function(event, animator)
  { 
    var attr = event.attribute;
    var attribute = animator.getAttribute( attr );
    var calc = attribute.calculator;
    var current = null;

    if ( attr in animator.frame )
    {
      current = calc.clone( animator.frame[ attr ] );
    }
    else
    {
      current = attribute.cloneDefault();
    }

    if ( mask )
    {
      current = calc.mul( current, mask );
    }

    return calc.add( current, relativeAmount );
  };

  // Marks the function as computed which is a signal to paths & events.
  relativeFunction.computed = true;

  // Place the input on the function if the user wants to modify it live
  relativeFunction.relativeAmount = relativeAmount;
  relativeFunction.mask = mask;

  return relativeFunction;
};

/**
 * [isComputed description]
 * @param  {[type]}
 * @return {Boolean}
 */
anim8.isComputed = function(x)
{
  return anim8.isFunction( x ) && x.computed;
};
/**
 * Calculators perform math and basic operations for a specific data structure.
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
  if ( calc instanceof anim8.Calculator )
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
 * Instantiates a new Calculator instance.
 */
anim8.Calculator = function()
{

};

anim8.Calculator.prototype = 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parse: function(x, defaultValue)
  {
    throw 'Calculator.parse not implemented';
  },

  /**
   * [copy description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  copy: function(out, copy)
  {
    throw 'Calculator.copy not implemented';
  },

  /**
   * [clone description]
   * @param  {[type]}
   * @return {[type]}
   */
  clone: function(out) 
  {
    return this.copy( this.create(), out );
  },

  /**
   * [create description]
   * @return {[type]}
   */
  create: function()
  {
    throw 'Calculator.create not implemented';
  },

  /**
   * [scale description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  scale: function(out, scale) 
  {
    return this.adds( out, out, scale - 1 );
  },

  /**
   * [add description]
   * @param {[type]}
   * @param {[type]}
   */
  add: function(out, amount) 
  {
    return this.adds( out, amount, 1 );
  },

  /**
   * [adds description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  adds: function(out, amount, amountScale)
  {
    throw 'Calculator.adds not implemented';
  },

  /**
   * [sub description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  sub: function(out, amount) 
  {
    return this.adds( out, amount, -1 );
  },

  /**
   * [mul description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  mul: function(out, scale)
  {
    throw 'Calculator.mul not implemented';
  },

  /**
   * [interpolate description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  interpolate: function(out, start, end, delta) 
  {
    out = this.zero( out );
    out = this.adds( out, start, 1 - delta );
    out = this.adds( out, end, delta );
    return out;
  },

  /**
   * [distance description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  distance: function(a, b)
  {
    return Math.sqrt( this.distanceSq( a, b ) );
  },

  /**
   * [distanceSq description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  distanceSq: function(a, b)
  {
    throw 'Calculator.distanceSq not implemented';
  },

  /**
   * [isValid description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isValid: function(a)
  {
    throw 'Calculator.isValid not implemented';
  },

  /**
   * [isNaN description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isNaN: function(a)
  {
    throw 'Calculator.isNaN not implemented';
  },

  /**
   * [isZero description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {Boolean}
   */
  isZero: function(a, epsilon)
  {
    throw 'Calculator.isZero not implemented';
  },

  /**
   * [isEqual description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {Boolean}
   */
  isEqual: function(a, b, epsilon)
  {
    throw 'Calculator.isEqual not implemented';
  },

  /**
   * [isRelative description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isRelative: function(x)
  {
    return anim8.isString( x ) && ( x[0] === '-' || x[0] === '+' );
  },

  /**
   * [relativeAmount description]
   * @param  {[type]}
   * @return {[type]}
   */
  getRelativeAmount: function(x)
  {
    var z = parseFloat( x );

    return isNaN(z) ? false : z;
  }

};


/**
 * A calculator for number primitives.
 */
anim8.NumberCalculator = function()
{

};

anim8.override( anim8.NumberCalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // A raw number
    if ( anim8.isNumber( x ) )
    {
      return x;
    }
    // A number in a string or a relative number.
    if ( anim8.isString( x ) )
    {
      var amount = this.getRelativeAmount( x );
      
      if ( amount !== false )
      {
        if ( this.isRelative( x ) )
        {
          return anim8.computed.relative( amount );
        }
        else
        {
          return amount;
        }
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

/**
 * Register the calculators.
 */
anim8.calculator['default'] = anim8.calculator['number'] = new anim8.NumberCalculator();


/*
 * A calculator for objects with an x and y component (number)
 */
anim8.Point2dCalculator = function()
{

};

anim8.override( anim8.Point2dCalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
	parse: function(x, defaultValue)
	{
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // When a number is given a uniform point is returned.
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x
			};
		}
    // When an object is given, check for relative values.
		if ( anim8.isObject( x ) )
		{
      var cx = anim8.coalesce( x.x, defaultValue.x );
      var cy = anim8.coalesce( x.y, defaultValue.y );
      var rx = this.getRelativeAmount( cx );
      var ry = this.getRelativeAmount( cy );

      if ( rx !== false && ry !== false )
      {
        var parsed = { x: rx, y: ry };
        var ix = this.isRelative( cx );
        var iy = this.isRelative( cy );

        if ( ix || iy )
        {
          var mask = {
            x: ix ? 1 : 0,
            y: iy ? 1 : 0
          };

          return anim8.computed.relative( parsed, mask );
        }

        return parsed;
      }
		}
    // Relative values & left/right/middle/center/top/bottom aliases.
    if ( anim8.isString( x ) )
    {
      // If only a relative value is given it will modify the X & Y components evenly.
      if ( this.isRelative( x ) )
      {
        var rx = this.getRelativeAmount( x );

        if ( rx !== false )
        {
          return anim8.computed.relative( { x: rx, y: rx } ); 
        }
      }

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
    
    // If no value was given but the default value was given, clone it.
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
 * Register all calculators.
 */
anim8.calculator['2d'] = new anim8.Point2dCalculator();


/**
 * A calculator for objects with an x, y, and z component (number)
 */
anim8.Point3dCalculator = function()
{

};

anim8.override( anim8.Point3dCalculator.prototype = new anim8.Calculator(), 
{
	parse: function(x, defaultValue)
	{
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // When a number is given a uniform point is returned.
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x,
				z: x
			};
		}
    // When an object is given, check for relative values.
		if ( anim8.isObject( x ) )
		{
      var cx = anim8.coalesce( x.x, defaultValue.x );
      var cy = anim8.coalesce( x.y, defaultValue.y );
      var cz = anim8.coalesce( x.z, defaultValue.z );
      var rx = this.getRelativeAmount( cx );
      var ry = this.getRelativeAmount( cy );
      var rz = this.getRelativeAmount( cz );

      if ( rx !== false && ry !== false && rz !== false )
      {
        var parsed = { x: rx, y: ry, z: rz };
        var ix = this.isRelative( cx );
        var iy = this.isRelative( cy );
        var iz = this.isRelative( cz );

        if ( ix || iy || iz )
        { 
          var mask = {
            x: ix ? 1 : 0,
            y: iy ? 1 : 0,
            z: iz ? 1 : 0
          };

          return anim8.computed.relative( parsed, mask );
        }

        return parsed;
      }
		}
    // If only a relative value is given it will modify the X, Y, & Z components evenly.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return anim8.computed.relative( { x: rx, y: rx, z: rx } ); 
      }
    }
    
    // If no value was given but the default value was given, clone it.
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
 * Register the calculator.
 */
anim8.calculator['3d'] = new anim8.Point3dCalculator();


/**
 * A calculator for objects with an x, y, z, and angle components.
 */
anim8.QuaternionCalculator = function()
{

};

anim8.override( anim8.QuaternionCalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
	parse: function(x, defaultValue)
	{
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // When only a number is given assume it's an angle around the Z-axis.
		if ( anim8.isNumber( x ) )
		{
			return {
				x: 0,
				y: 0,
				z: 1,
				angle: x
			};
		}
    // When an object is given, check for relative values.
		if ( anim8.isObject( x ) )
		{
      var cx = anim8.coalesce( x.x, defaultValue.x );
      var cy = anim8.coalesce( x.y, defaultValue.y );
      var cz = anim8.coalesce( x.z, defaultValue.z );
      var ca = anim8.coalesce( x.angle, defaultValue.angle );
      var rx = this.getRelativeAmount( cx );
      var ry = this.getRelativeAmount( cy );
      var rz = this.getRelativeAmount( cz );
      var ra = this.getRelativeAmount( ca );

      if ( rx !== false && ry !== false && rz !== false && ra !== false )
      {
        var parsed = { x: rx, y: ry, z: rz, angle: ra };
        var ix = this.isRelative( cx );
        var iy = this.isRelative( cy );
        var iz = this.isRelative( cz );
        var ia = this.isRelative( ca );

        if ( ix || iy || iz || ia )
        {
          var mask = {
            x: ix ? 1 : 0,
            y: iy ? 1 : 0,
            z: iz ? 1 : 0,
            angle: ia ? 1 : 0
          };

          return anim8.computed.relative( parsed );
        }

        return parsed;
      }
		}
    // When a relative value is given, assume it's for an angle around the Z-axis.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return anim8.computed.relative( { x:0, y:0, z:1, angle: rx }, { x:0, y:0, z:0, angle:1 } );
      }
    }
    
    // If no value was given but the default value was given, clone it.
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
 * Register the calculator.
 */
anim8.calculator['quaternion'] = new anim8.QuaternionCalculator();


/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 */
anim8.RGBCalculator = function()
{

};

anim8.override( anim8.RGBCalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
	parse: function(x, defaultValue)
	{
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // When a number is given a grayscale color is returned.
		if ( anim8.isNumber( x ) )
		{
			return {
				r: x,
				g: x,
				b: x
			};
		}
    // When an object is given, check for relative values.
    if ( anim8.isObject( x ) )
    {
      var cr = anim8.coalesce( x.r, defaultValue.r );
      var cg = anim8.coalesce( x.g, defaultValue.g );
      var cb = anim8.coalesce( x.b, defaultValue.b );
      var rr = this.getRelativeAmount( cr );
      var rg = this.getRelativeAmount( cg );
      var rb = this.getRelativeAmount( cb );

      if ( rr !== false && rg !== false && rb !== false )
      {
        var parsed = { r: rr, g: rg, b: rb };
        var ir = this.isRelative( cr );
        var ig = this.isRelative( cg );
        var ib = this.isRelative( cb );

        if ( ir || ig || ib )
        {
          var mask = {
            r: ir ? 1 : 0,
            g: ig ? 1 : 0,
            b: ib ? 1 : 0
          };

          return anim8.computed.relative( parsed, mask );
        }

        return parsed;
      }
    }
    // If only a relative value is given it will modify the R, G, & B components.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return anim8.computed.relative( { r: rx, g: rx, b: rx } ); 
      }
    }
		
    // Try to parse the color.
		var parsed = anim8.color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }
    
    // If no value was given but the default value was given, clone it.
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
    
    return false;    
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
 * Register the calculator.
 */
anim8.calculator['rgb'] = new anim8.RGBCalculator();



/**
 * A calculator for objects with r, g, & b components 
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 */
anim8.RGBACalculator = function()
{

};

anim8.override( anim8.RGBACalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
	parse: function(x, defaultValue)
	{
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // When a number is given an opaque grayscale color is returned.
		if ( anim8.isNumber( x ) )
		{
			return {
				r: x,
				g: x,
				b: x,
				a: 1.0
			};
		}
    // When an object is given, check for relative values.
    if ( anim8.isObject( x ) )
    {
      var cr = anim8.coalesce( x.r, defaultValue.r );
      var cg = anim8.coalesce( x.g, defaultValue.g );
      var cb = anim8.coalesce( x.b, defaultValue.b );
      var ca = anim8.coalesce( x.a, defaultValue.a );
      var rr = this.getRelativeAmount( cr );
      var rg = this.getRelativeAmount( cg );
      var rb = this.getRelativeAmount( cb );
      var ra = this.getRelativeAmount( ca );

      if ( rr !== false && rg !== false && rb !== false && ra !== false )
      {
        var parsed = { r: rr, g: rg, b: rb, a: ra };
        var ir = this.isRelative( cr );
        var ig = this.isRelative( cg );
        var ib = this.isRelative( cb );
        var ia = this.isRelative( ca );

        if ( ir || ig || ib || ia )
        {
          var mask = {
            r: ir ? 1 : 0,
            g: ig ? 1 : 0,
            b: ib ? 1 : 0,
            a: ia ? 1 : 0
          };

          return anim8.computed.relative( parsed, mask );
        }

        return parsed;
      }
    }
    // If only a relative value is given it will modify the R, G, & B components.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return anim8.computed.relative( { r: rx, g: rx, b: rx, a: 0 } ); 
      }
    }
    
    // Try to parse the color.
    var parsed = anim8.color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }
    
    // If no value was given but the default value was given, clone it.
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
    
    return false;  
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
 * Register the calculator.
 */
anim8.calculator['rgba'] = new anim8.RGBACalculator();


/**
 * [path description]
 * @param  {[type]}
 * @return {[type]}
 */
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

/**
 * [Path description]
 */
anim8.Path = function()
{
};

anim8.Path.prototype = 
{
  /**
   * [reset description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  reset: function(name, calculator, points)
  {
    this.name = name;
    this.calculator = anim8.calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
  },

  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta) 
	{
    throw 'Path.compute not implemented';
  },

  /**
   * [hasTrue description]
   * @return {Boolean}
   */
  hasComputed: function() 
	{
    var ps = this.points;
    
    for (var i = 0; i < ps.length; i++) 
    {
      if ( anim8.isComputed( ps[i] ) )
      {
        return true;
      }
    }

    return false;
  },

  /**
   * [reference description]
   * @return {[type]}
   */
  reference: function() 
	{
    return this.trues ? this.copy() : this;
  },

  /**
   * [last description]
   * @return {[type]}
   */
  last: function()
  {
    return this.points[ this.points.length - 1 ];
  },

  /**
   * [first description]
   * @return {[type]}
   */
  first: function()
  {
    return this.points[ 0 ];
  },

  /**
   * [point description]
   * @param  {[type]}
   * @return {[type]}
   */
  point: function(i)
  {
    return this.points[ i ];
  },

  /**
   * [replaceComputed description]
   * @return {[type]}
   */
  replaceComputed: function(event, animator)
  {
    var clone = this.copy();
    var ps = clone.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( anim8.isComputed( ps[i] ) )
      {
        ps[i] = ps[i]( event, animator );
      }
    }
    
    return clone;
  },

  /**
   * [resolvePoint description]
   * @param  {[type]}
   * @return {[type]}
   */
  resolvePoint: function(i)
  {
    var p = this.points[ i ];
    
    if ( anim8.isFunction( p ) )
    {
      p = p();
    }
    
    return p;
  },

  /**
   * Returns whether the path is linear. Linear paths go directly from point to
   * point where curved paths do not. Linear paths can have their length calculated
   * fairly easily however curves you must compute length with a given granularity.
   * 
   * @return {Boolean}
   */
  isLinear: function()
  {
    return true;
  },

  /**
   * Computes the length of the Path with a given granularity. Granularity
   * @param  {[type]}
   * @return {[type]}
   */
  length: function(granularity)
  {
    var distance = 0;
    var calc = this.calculator;

    if ( this.isLinear() )
    {
      var prev = this.resolvePoint( 0 );

      for (var i = 1; i < this.points.length; i++)
      {
        var next = this.resolvePoint( i );

        distance += calc.distance( prev, next );

        prev = next;
      }
    }
    else
    {
      var deltadelta = 1.0 / granularity;
      var delta = delta;
      var prev = calc.clone( this.resolvePoint( 0 ) );
      var temp = calc.create();

      for (var i = 1; i <= granularity; i++)
      {
        var next = this.compute( temp, delta );

        distance += calc.distance( prev, next );

        temp = prev;
        prev = next;
      }
    }

    return distance;
  }

};


/**
 * [Tween description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.Tween = function(name, calculator, start, end)
{
  this.reset( name, calculator, [ start, end ] );
};

anim8.override( anim8.Tween.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
  },

  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.Tween( this.name, this.calculator, this.points[0], this.points[1] );
  }

});

/**
 * [tween description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['tween'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  var defaultValue = calc.create();
  
  return new anim8.Tween(
    path.name, 
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.end, defaultValue )
  );
};


/**
 * [CubicPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.CubicPath = function(name, calculator, p0, p1, p2, p3)
{
  this.reset( name, calculator, [p0, p1, p2, p3] );
};

anim8.override( anim8.CubicPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, d1)
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
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.CubicPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
  },

  /**
   * CubicPath is not a linear Path.
   * 
   * @return {Boolean}
   */
  isLinear: function()
  {
    return false;
  }

});

/**
 * [cubic description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['cubic'] = function(path)
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


/**
 * [QuadraticPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.QuadraticPath = function(name, calculator, p0, p1, p2)
{
  this.reset( name, calculator, [p0, p1, p2] );
};

anim8.override( anim8.QuadraticPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, d1)
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
  },

  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.QuadraticPath( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
  },

  /**
   * QuadraticPath is not a linear Path.
   * 
   * @return {Boolean}
   */
  isLinear: function()
  {
    return false;
  }

});

/**
 * [quadratic description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['quadratic'] = function(path)
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


/**
 * [DeltaPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.DeltaPath = function(name, calculator, points, deltas) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
};

anim8.override( anim8.DeltaPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta) 
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
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
      return new anim8.DeltaPath( this.name, anim8.copy(this.points), anim8.copy(this.deltas), this.calculator );
  }

});

/**
 * [delta description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['delta'] = function(path)
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


/**
 * [JumpPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.JumpPath = function(name, calculator, points)
{
  this.reset( name, calculator, points );
};

anim8.override( anim8.JumpPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.JumpPath( this.name, this.calculator, anim8.copy(this.points) );
  }

});

/**
 * [jump description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['jump'] = function(path)
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
 * [CompiledPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
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

anim8.override( anim8.CompiledPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );
    
    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.CompiledPath( this.name, this, this.points.length );
  }

});

/**
 * [compiled description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['compiled'] = function(path)
{
  return new anim8.CompiledPath(
    path.name,
    anim8.path( path.path ),
    path.pointCount
  );
};


/**
 * [KeyframePath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.KeyframePath = function(name, calculator, points, deltas, easings) 
{
  this.reset( name, calculator, points );
  this.deltas = deltas;
  this.easings = easings;
};

anim8.override( anim8.KeyframePath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta) 
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
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.KeyframePath( this.name, this.calculator, anim8.copy(this.points), anim8.copy(this.deltas), anim8.copy(this.easings) );
  }

});

/**
 * [keyframe description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['keyframe'] = function(point)
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


/**
 * [PointPath description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.PointPath = function(name, calculator, point)
{
  this.reset( name, calculator, [point] );
};

anim8.override( anim8.PointPath.prototype = new anim8.Path(),
{
  /**
   * [compute description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  compute: function(out, delta)
  {
    return this.calculator.copy( out, this.resolvePoint( 0 ) );
  },
  
  /**
   * [copy description]
   * @return {[type]}
   */
  copy: function() 
  {
    return new anim8.PointPath( this.name, this.calculator, this.points[0] );
  }

});

/**
 * [point description]
 * @param  {[type]}
 * @return {[type]}
 */
anim8.path['point'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PointPath(
    path.name,
    calc,
    calc.parse( path.point )
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
    this.attribute    = attribute;
    this.calculator   = calculator;
    this.rest         = rest;
    this.position     = position;
    this.gravity      = gravity;
    this.velocity     = null;
    this.time         = 0;
  },

  /**
   * Called the first time preupdate is called on an Animator to prepare the
   * spring to be updated.
   * 
   * @return {[type]}
   */
  preupdate: function(animator)
  {
    var attribute = animator.getAttribute( this.attribute );
    var calc = anim8.calculator( anim8.coalesce( this.calculator, attribute.calculator ) );

    this.calculator = calc;
    this.rest       = this.parseValue( animator, this.rest, attribute.defaultValue );
    this.position   = this.parseValue( animator, this.position, attribute.defaultValue );
    this.gravity    = this.parseValue( animator, this.gravity, calc.create() );
    this.velocity   = calc.create();
  },

  /**
   * [parseValue description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( anim8.isFunction( parsed ) )
    {
      if ( parsed.computed )
      {
        parsed = parsed( this, animator );
      }
    }

    return parsed;
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
    throw 'Spring.updateVelocity not implemented';
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
 * [LinearSpring description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.LinearSpring = function(attribute, calculator, position, rest, damping, stiffness, gravity)
{
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.damping      = damping;
  this.stiffness    = stiffness;
  this.temp0        = null;
  this.temp1        = null;
};

anim8.override( anim8.LinearSpring.prototype = new anim8.Spring(), 
{
  preupdate: function(animator)
  {
    anim8.Spring.prototype.preupdate.apply( this, arguments );

    var attribute = animator.getAttribute( this.attribute );
    var calc = this.calculator;

    this.damping      = this.parseValue( animator, this.damping, attribute.defaultValue );
    this.stiffness    = this.parseValue( animator, this.stiffness, attribute.defaultValue );
    this.temp0        = calc.create();
    this.temp1        = calc.create();
  },

  updateVelocity: function(dt)
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
  }
});

/**
 * Register the spring parser.
 * 
 * @param  {object}
 * @return {anim8.LinearSpring}
 */
anim8.spring['linear'] = function(spring)
{ 
  return new anim8.LinearSpring(
    spring.attribute,
    spring.calculator,
    anim8.coalesce( spring.position, true ),
    anim8.coalesce( spring.rest, true ),
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};

/**
 * [DistanceSpring description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.DistanceSpring = function(attribute, calculator, position, rest, distance, damping, stiffness, gravity)
{
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = null;
};

anim8.override( anim8.DistanceSpring.prototype = new anim8.Spring(), 
{
  preupdate: function(animator)
  {
    anim8.Spring.prototype.preupdate.apply( this, arguments );
    
    this.temp = this.calculator.create();
  },

  updateVelocity: function(dt)
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
  }
});

/**
 * Register the spring parser.
 * 
 * @param  {object}
 * @return {anim8.LinearSpring}
 */
anim8.spring['distance'] = function(spring)
{ 
  return new anim8.DistanceSpring(
    spring.attribute,
    spring.calculator,
    anim8.coalesce( spring.position, true ),
    anim8.coalesce( spring.rest, true ),
    spring.distance,
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};

/**
 * [EventState description]
 * @type {[type]}
 */
anim8.EventState = 
{
  CREATED: 0,
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  PAUSED: 8,
  FINISHED: 16
};

/**
 * [Event description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {Boolean}
 * @param {[type]}
 * @param {Function}
 */
anim8.Event = function(attribute, path, duration, easing, delay, sleep, repeat, scale, scaleBase, hasInitialState, parser, next) 
{
  if ( attribute )
  {
    this.attribute        = attribute;
    this.path             = path;
    this.easing           = anim8.easing( easing );
    this.delay            = anim8.delay( delay );
    this.duration         = anim8.duration( duration );
    this.sleep            = anim8.sleep( sleep );
    this.repeat           = anim8.repeat( repeat );
    this.scale            = anim8.scale( scale );
    this.scaleBase        = path.calculator.parse( scaleBase, path.calculator.create() );
    this.hasInitialState  = anim8.coalesce( hasInitialState, true );
    this.parser           = parser;
    this.next             = next; 
  }
};

anim8.Event.prototype = 
{
  /**
   * [newInstance description]
   * @return {[type]}
   */
  newInstance: function()
  {
    return new anim8.EventInstance( this );
  },

  /**
   * [isInstance description]
   * @return {Boolean}
   */
  isInstance: function()
  {
    return false
  },

  /**
   * [getParser description]
   * @return {[type]}
   */
  getParser: function()
  {
    return this.parser;
  },

  /**
   * [totalTime description]
   * @return {[type]}
   */
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
	},

  /**
   * [clone description]
   * @return {[type]}
   */
  clone: function()
  {
    return new anim8.Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.parser, this.next ? this.next.clone() : null );
  },

  /**
   * [isInfinite description]
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return (this.repeat === Number.POSITIVE_INFINITY);
  },

  /**
   * [timeRemaining description]
   * @return {[type]}
   */
  timeRemaining: function() 
  {    
    return this.totalTime() + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * [hasTrue description]
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return this.path.computed;
  },

  /**
   * [queue description]
   * @param  {[type]}
   * @return {[type]}
   */
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
  }

};


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

/**
 * Returns an animation based on the input. If the input is an instance of anim8.Animation that instance
 * is immediately returned. If the input is a string the animation with that name is returned. If the
 * input is an object an anonymous animation is created using the second options argument. If no animation
 * could be determined then false is returned.
 * 
 * @param {anim8.Animation|string|object} animation
 * @param [object] options
 * @param [boolean] cache
 */
anim8.animation = function(animation, options, cache)
{
  if ( animation instanceof anim8.Animation )
  {
    return animation;
  }
	if ( anim8.isString( animation ) )
	{
    var key = animation.toLowerCase();

    if ( key in anim8.animation )
    {
      return anim8.animation[ key ];
    }

    var animationStrings = animation.split(',');
    var anim = false;
    var last = false;

    for (var k = 0; k < animationStrings.length; k++)
    {
      var split = animationStrings[ k ].toLowerCase().split(' ');
      var parsedAnimation = anim8.animation[ split[ 0 ] ];
      var parsedOptions = anim8.options( split.slice( 1 ) );

      if ( parsedAnimation )
      {
        if ( anim === false )
        {
          last = anim = parsedAnimation.extend( parsedOptions, true );
        }
        else
        {
          last = last.next = parsedAnimation.extend( parsedOptions, true );
        }
      }
    }

    if ( anim8.coalesce( cache, anim8.defaults.cache ) && anim8.isEmpty( options ) )
    {
      anim.name = animation;

      anim8.animation[ key ] = anim;
    }

    return anim;
	}
	if ( anim8.isObject( animation ) )
	{
		var events = [];
		var options = options || {};
		
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
  var key = name.toLowerCase();

  animation.name = name;
  
  anim8.animation[ key ] = animation;
};

/**
 * Parses a value into a transition object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 * [time] [outroDelta] +[introDelta] [easing[-easingType]] ^[granularity]
 *
 * This is also a registry of transitions, you can add your own transitions that
 * can be used later with syntax like:
 *
 * anim8.transition['myTransition'] = anim8.transition('50ms 0.05 linear');
 *
 * So you can use 'myTransition' as the transition input.
 * 
 * @param {object|string|array} options
 * @param {boolean} cache
 * @return {object}
 */
anim8.transition = function(transition, cache)
{
  // 1. If it's a string, convert it into an array.
  // 2. If it's an array, parse it and convert it into an object.
  // 3. If it's an object, fill in any missing values with the defaults.

  var originalInput = transition;

  if ( anim8.isString( transition ) )
  {
    if ( transition in anim8.transition )
    {
      return anim8.transition[ transition ];
    }

    transition = transition.toLowerCase().split(' ');
  }

  if ( anim8.isArray( transition ) )
  {
    var transitionArray = transition;

    transition = {};

    for (var i = 0; i < transitionArray.length; i++)
    {
      var part = transitionArray[i];
      var first = part.charAt( 0 );

      // Introduction Delta (into next event)
      if ( first === '+' )
      {
        var introDelta = parseFloat( part.substring(1) );

        if ( !isNaN( introDelta ) )
        {
          transition.introDelta = introDelta;
        }
      }
      // Granularity (for smooth transitions)
      else if ( first === '^' )
      {
        var granularity = parseInt( part.substring(1) );

        if ( !isNaN( granularity ) && granularity > 0 )
        {
          transition.granularity = granularity;
        }
      }
      else
      {
        // Easing
        var easing = anim8.easing( part, false );

        if ( easing !== false )
        {
          transition.easing = easing;
        }

        // Outroduction Delta
        if ( anim8.isDefined( transition.time ) )
        {
          var outroDelta = parseFloat( part );

          if ( !isNaN( outroDelta ) && outroDelta >= 0 && outroDelta <= 1 )
          {
            transition.outroDelta = outroDelta;
          }
        }
        else
        {
          // Time
          var time = anim8.time( part, false );

          if ( time !== false )
          {
            transition.time = time;
          }
        }

      }
    }
  }

  if ( anim8.isObject( transition ) )
  {
    if ( !anim8.isDefined( transition.time ) )
    {
      transition.time = anim8.time( anim8.defaults.transitionTime );
    }
    if ( !anim8.isDefined( transition.outroDelta ) )
    {
      transition.outroDelta = anim8.defaults.transitionOutroDelta;
    }
    if ( !anim8.isDefined( transition.introDelta ) )
    {
      transition.introDelta = anim8.defaults.transitionIntroDelta;
    }
    if ( !anim8.isDefined( transition.easing ) )
    {
      transition.easing = anim8.easing( anim8.defaults.transitionEasing );
    }
    if ( !anim8.isDefined( transition.granularity ) )
    {
      transition.granularity = anim8.defaults.transitionGranularity;
    }

    if ( anim8.isString( originalInput ) && anim8.coalesce( cache, anim8.defaults.cacheTransitions ) )
    {
      anim8.transition[ originalInput ] = transition;
    }

    return transition;
  }

  return anim8.defaults.noTransition;
};

/**
 * Parses a value into an options object. If the given input is a string it's 
 * expected to be in a similar format to:
 *
 * [duration] x[repeat] z[sleep] ~[delay] ![scale] [easing[-easingType]]
 *
 * This is also a registry of options, you can add your own options that
 * can be used later with syntax like:
 *
 * anim8.option['myOptions'] = anim8.option('1.5s x2 !2');
 *
 * So you can use 'myOptions' as the options input.
 * 
 * @param {object|string|array} options
 * @param {boolean} cache
 * @return {object}
 */
anim8.options = function(options, cache)
{
  var originalInput = options;

  if ( anim8.isString( options ) )
  {
    if ( options in anim8.options )
    {
      return anim8.options[ options ];
    }

    options = options.toLowerCase().split(' ');
  }

  if ( anim8.isArray( options ) )
  {
    var parsed = {};

    for (var i = 0; i < options.length; i++)
    {
      var part = options[i];
      var first = part.charAt( 0 );

      // Repeats
      if ( first === 'x' )
      {
        var repeat = anim8.repeat( part.substring(1), false );

        if ( repeat !== false )
        {
          parsed.repeat = repeat;
        }
      }
      // Sleeping
      else if ( first === 'z' )
      {
        var sleep = anim8.time( part.substring(1), false );

        if ( sleep !== false )
        {
          parsed.sleep = sleep;
        }
      }
      // Delay
      else if ( first === '~' )
      {
        var delay = anim8.time( part.substring(1), false );

        if ( delay !== false )
        {
          parsed.delay = delay;
        }
      }
      // Scaling
      else if ( first === '!' )
      {
        var scale = parseFloat( part.substring(1) );

        if ( !isNaN(scale) )
        {
          parsed.scale = scale;
        }
      }
      else
      {
        // Easing?
        var easing = anim8.easing( part, false );

        if ( easing !== false )
        {
          parsed.easing = easing;
        }

        // Duration?
        var duration = anim8.time( part, false );

        if ( duration !== false )
        {
          parsed.duration = duration;
        }
        else
        {
          // If not a duration, might be an alternative repeat? (doesn't start with x)
          var repeat = anim8.repeat( part, false );

          if ( repeat !== false )
          {
            parsed.repeat = repeat;
          }
        }
      }
    }

    if ( anim8.isString( originalInput ) && anim8.coalesce( cache, anim8.defaults.cacheOptions ) )
    {
      anim8.options[ originalInput ] = parsed;
    }

    return parsed; 
  }

  if ( anim8.isObject( options ) )
  {
    return options;
  }

  return anim8.defaults.noOptions;
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
  this.next = null;
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
  extend: function(options, force)
  {
    if ( anim8.isEmpty( options ) && !force )
    {
      return this;
    }

    var events = this.cloneEvents();

    this.merge( options, events );

    anim8.extend( options, this.options );

    return new anim8.Animation( false, this.input, options, events );
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
    this.eventsAdded = [];
    this.eventsComputed = [];
    this.springs = {};
    this.springsAdded = [];
	  this.frame = {};
    this.updated = {};
	  this.finished = false;
		this.factory = null;
    this.active = false;
    this.cycleCurrent = 0;
    this.cycleNext = 0;
    
    return this;
	},

  /**
   * Starts a new animation cycle. This is done before events & springs are placed
   * to group them together so we know when to apply their initial value.
   * 
   * @return {this}
   */
  newCycle: function()
  {
    this.cycleNext++;

    return this;
  },

  /**
   * Applies the current cycle. This involves finding all events & springs with the same cycle
   * identifier and applying their initial state.
   * 
   * @return {this}
   */
  applyCurrentCycle: function()
  {
    /**
     * Cycle is applied to event before its placed on the animator or queued
     * When no events/springs exist for the current cycle, increment it and apply it
     */

    var cycle = this.cycleCurrent;

    for (var attr in this.events)
    {
      var e = this.events[ attr ];
    }

    return this;
  },

  /**
   * Returns the attribute descriptor
   * @param  {[type]}
   * @return {[type]}
   */
  getAttribute: function(attr)
  {
    return this.factory.attribute( attr );
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
    // If there are events placed on the animator since the last preupdate
    // that has computed values we need to replace the path on the event with
    // a copy containing the computed values. This is where current value & 
    // relative values are injected from the animator into the even'ts path.
    var ce = this.eventsComputed;
    if ( ce.length )
    {
      for (var i = 0; i < ce.length; i++)
      {
        var e = ce[ i ];

        e.path = e.path.replaceComputed( e, this );        
      }

      ce.length = 0;
    }
    
    // If there isn't a value in frame for any of the events on the animator,
    // place the default value.
    var ea = this.eventsAdded;
    if ( ea.length )
    {
      for (var i = 0; i < ea.length; i++)
      {
        this.setDefault( ea[ i].attribute );
      }

      ea.length = 0;
    }

    // Call pre update on any new springs.
    var sa = this.springsAdded;
    if ( sa.length )
    {
      for (var i = 0; i < sa.length; i++)
      {
        var s = sa[i];

        this.setDefault( s.attribute );

        s.preupdate( this );
      }

      sa.length = 0;
    }

    this.trigger('preupdate');
    
    return this;
  },

  /**
   * Sets the default value for the given attribute in the frame of this Animator if there's no value there.
   * 
   * @param {[type]}
   */
  setDefault: function(attr)
  {
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = this.getAttribute( attr ).cloneDefault();
    }
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
    this.springsAdded.push( s );
		
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
    this.eventsAdded.push( e );
    
    if ( e.hasComputed() )
    {
       this.eventsComputed.push( e );
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
  createEvents: function(animation, options, cache)
  {
    var options = anim8.options( options );    
    var animation = anim8.animation( animation, options, cache );
  
    if (animation === false)
    {
      return false;
    }
    
    var events = animation.newEvents();
    
    if ( animation.isSaved() && !anim8.isEmpty( options ) )
    { 
      animation.merge( options, events );
    }
    
    this.onAnimation( animation, options, events );

    if ( animation.next !== null )
    {
      var eventMap = {};

      for (var i = 0; i < events.length; i++)
      {
        var e = events[i];

        eventMap[ e.attribute ] = e;
      }

      while ( animation.next !== null )
      {
        animation = animation.next;

        var queueEvents = animation.newEvents();
        var maxRemaining = 0;

        for (var i = 0; i < events.length; i++)
        {
          var e = events[i];

          if ( !e.isInfinite() )
          {
            maxRemaining = Math.max( maxRemaining, e.timeRemaining() );  
          }
        }

        for (var i = 0; i < queueEvents.length; i++)
        {
          var e = queueEvents[ i ];
          var existing = eventMap[ e.attribute ];

          if ( existing && !existing.isInfinite() )
          {
            e.delay += (maxRemaining - existing.timeRemaining());
            eventMap[ e.attribute ].queue( e );
          }
          else
          {
            e.delay += maxRemaining;
            eventMap[ e.attribute ] = e;
            events.push( e );
          }
        }

        this.onAnimation( animation, options, queueEvents );
      }      
    }

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
   * @param [boolean] cache
   */
	play: function(animation, options, all, cache)
	{
    var events = this.createEvents( animation, options, cache );
    
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
	queue: function(animation, options, cache)
	{
    var events = this.createEvents( animation, options, cache );
    
    if ( events === false )
    {
      return false;
    }
        
    this.queueEvents( events );

    return this.activate();
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
    var maxRemaining = this.timeRemaining();
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      var existing = this.events[ attr ];
      
      if ( attr in this.events  && !existing.isInfinite() )
      {    
        e.delay += (maxRemaining - existing.timeRemaining());
        
        existing.queue( e );
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
  transition: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var events = this.createEvents( animation, options, cache );
    
    if ( events === false )
    {
      return false;
    }

    this.transitionEvents( transition, events, all );

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
  transitionEvents: function(transition, events, all)
  {
    // Check if we even need to transition
    var transitionRequired = false;
    
    for (var i = 0; i < events.length && !transitionRequired; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transitionRequired = true;
      }
    }
    
    // Only transition if we need to
    if ( transitionRequired )
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
          var p1 = e2.getFuture( transition.outroDelta );
          var p2 = e1.getPoint( 0 );
        
          var transitionPath = new anim8.QuadraticPath( attr, calc, p0, p1, p2 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transition.time, transition.easing, 0, 0, 1 ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transition.time;
     
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
  transitionInto: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var events = this.createEvents( animation, options, cache );
    
    if ( events === false )
    {
      return false;
    }
    
    this.transitionIntoEvents( transition, events, all );

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
  transitionIntoEvents: function(transition, events, all)
  {
    // Check if we even need to transition
    var transitionRequired = false;
    
    for (var i = 0; i < events.length && !transitionRequired; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transitionRequired = true;
      }
    }
    
    // Only transition if we need to
    if ( transitionRequired )
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
          var p1 = e2.getFuture( transition.outroDelta );
          var p2 = e1.getPoint( 0 );
          var p3 = e1.getPoint( transition.introDelta );
          
          var transitionPath = new anim8.CubicPath( attr, calc, p0, p1, p2, p3 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transition.time, transition.easing, 0, 0, 1 ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transition.time;
     
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
   * @param {string} attr
   * @param {any} target
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenTo: function(attr, target, options)
  {
    var options   = anim8.options( options );
    var attribute = this.getAttribute( attr );
    var end       = attribute.parse( target );
    var path      = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, end );
    var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
    
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
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenManyTo: function(targets, options)
  {
    var options = anim8.options( options );

    for ( var attr in targets )
    {
      var attribute = this.getAttribute( attr );
      var end       = attribute.parse( targets[ attr ] );
      var path      = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, end );
      var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
      
      this.placeEvent( event.newInstance() );
    }

    return this.activate();
  },
  
  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * @param {string} attr
   * @param {any} starts
   * @param {any} ends
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tween: function(attr, starts, ends, options)
  {
    var options   = anim8.options( options );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starts );
    var end       = attribute.parse( ends );
    var path      = new anim8.Tween( attr, attribute.calculator, start, end );
    var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
    
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
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenMany: function(starts, ends, options)
  {
    var options = anim8.options( options );

    for ( var attr in starts )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( starts[ attr ] );
      var end       = attribute.parse( ends[ attr ] );
      var path      = new anim8.Tween( attr, attribute.calculator, start, end );
      var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
      
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
			if ( !event.hasStarted() && event.hasInitialState )
			{
        this.setDefault( attr );

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
  timeRemaining: function()
  {
    var remaining = 0;

    for (var attr in this.events)
    {
      var e = this.events[ attr ];
      
      if ( !e.isInfinite() )
      {
        remaining = Math.max( remaining, e.timeRemaining() );  
      }
    }

    return remaining;
  },
  
  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   * 
   * @param {string} attribute
   */
  ref: function(attr)
  {
    var animator = this;
    var attribute = this.getAttribute( attr );
    var request = {};
    
    return function()
    {
      if ( attr in animator.frame )
      {
        return animator.frame[ attr ];
      }
      
      request[ attr ] = true;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attr ] ) )
      {
        return current[ attr ];
      }
      
      return attribute.defaultValue;
    };
  },
  
  /**
   * Follows the attribute along the given path definition.
   * 
   * @param {string} attribute
   * @param {anim8.Path|object|string} path
   * @param [number|string] duration
   * @param [number|string] delay
   * @param [function|string] easing
   * @param [number|string] repeat
   * @param [number|string] sleep  
   * @param [number] scale
   */
  follow: function(attribute, path, options)
  {
    var options = anim8.options( options );
    var path = anim8.path( path );
    
    var event = new anim8.Event( 
      attribute, 
      path, 
      options.duration,
      options.easing,
      options.delay, 
      options.sleep,
      options.repeat,
      options.scale,
      options.scaleBase
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
   * Unsets the attribute, array of attributes, or object of attribtues. Unsetting involves removing all events,
   * springs, and the current value in the frame.
   * 
   * @param  {string|array|object}
   * @return {this}
   */
  unset: function(attributes)
  {
    if ( anim8.isString( attributes ) )
    {
      delete this.events[ attributes ];
      delete this.springs[ attributes ];
      delete this.frame[ attribute ];
    }
    else if ( anim8.isArray( attributes ) )
    {
      for (var i = 0; i < attributes.length; i++)
      {
        this.unset( attributes[ i ] );
      }
    }
    else if ( anim8.isObject( attributes ) )
    {
      for (var attr in attributes)
      {
        this.unset( attr );
      }
    }

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
  getSubject: function(wrapper)
  {
    var subject = this.subject;

    if ( anim8.isFunction( wrapper ) )
    {
      subject = wrapper( subject );
    }

    return subject;
  },

  /**
   * Invokes a function with the given context or the context of this Animator if none is given. This is particularly
   * useful for having a function be called on deferred statements.
   * 
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  invoke: function(func, context, arguments)
  {
    if ( anim8.isFunction( func ) )
    {
      func.apply( context || this, arguments || [] );
    }
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
  'play', 'queue', 'transition', 'transitionInto', 'restore', 'set', 'unset', 'resume', 'pause', 
  'finish', 'end', 'stop', 'follow', 'applyInitialState', 'tweenTo', 
  'tween', 'tweenMany', 'tweenManyTo', 'spring', 'unspring', 'apply', 
  'placeSpring', 'placeEvent', 'invoke'
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
anim8.override( anim8s.fn = anim8.Animators.prototype = new Array(),
{
  /**
   * Invokes a callback for each element in the array.
   * 
   * @param {function} iterator
   */
  each: function(iterator, context) 
  {
    for (var i = 0; i < this.length; i++) 
    {
      if ( iterator.call( context || this[i], this[i], i ) === false ) 
      {
        break;
      }
    }
  	
  	return this;
  },

  /**
   * Appends the array of animators given to the end of this array.
   *
   * @param {array} animators
   */
  fill: function(animators)
  {
    for (var i = 0; i < animators.length; i++)
    {
      this.push( animators[i] );
    }

    return this;
  },

  /**
   * Invokes a callback for each element in the array and if true is returned that element is removed from the array.
   *
   * @param {function} filterer
   */
  filter: function(filterer)
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
  },

  /**
   * Returns the subjects of the Animators optionally passing them through a wrapper
   * function before it's returned.
   *
   * @param [function] wrapper
   */
  getSubjects: function(wrapper)
  {
    var subjects = [];

    for (var i = 0; i < this.length; i++)
    {
      subjects.push( this[i].subject );
    }

    if ( anim8.isFunction( wrapper ) )
    {
      subjects = wrapper( subjects );
    }
    
    return subjects;
  },

  /**
   * Returns the first animator in the array.
   */
  first: function()
  {
    return this[0];
  },

  /**
   * Reverses the order of animators in the array.
   */
   reverse: function()
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
   },

  /**
   * Activates all Animators in the array if they aren't active already.
   * 
   * @return {this}
   */
  activate: function()
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
  },

  /**
   * Returns an array of the subjects optionally
   */

  /**
   * Plays a sequence of events separated by a delay given an animation to play on all Animators.
   */
  sequence: function(delay, easing)
  {
    return new anim8.Sequence( this, delay, easing );
  },

  /**
   * Adds the following methods to make an array of Animators appear like a single Animator.
   */
  restore              : anim8.delegate( 'restore', anim8.delegate.RETURN_THIS ),
  placeSpring          : anim8.delegate( 'placeSpring', anim8.delegate.RETURN_THIS ),
  placeEvent           : anim8.delegate( 'placeEvent', anim8.delegate.RETURN_THIS ),
  preupdate            : anim8.delegate( 'preupdate', anim8.delegate.RETURN_THIS ),
  update               : anim8.delegate( 'update', anim8.delegate.RETURN_THIS ),
  apply                : anim8.delegate( 'apply', anim8.delegate.RETURN_THIS ),
  trimEvents           : anim8.delegate( 'trimEvents', anim8.delegate.RETURN_THIS ),
  deactivate           : anim8.delegate( 'deactivate', anim8.delegate.RETURN_THIS ),
  destroy              : anim8.delegate( 'destroy', anim8.delegate.RETURN_THIS ),
  spring               : anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS ),
  unspring             : anim8.delegate( 'unspring', anim8.delegate.RETURN_THIS ),
  play                 : anim8.delegate( 'play', anim8.delegate.RETURN_THIS ),
  playEvents           : anim8.delegate( 'playEvents', anim8.delegate.RETURN_THIS ),
  queue                : anim8.delegate( 'queue', anim8.delegate.RETURN_THIS ),
  queueEvents          : anim8.delegate( 'queueEvents', anim8.delegate.RETURN_THIS ),
  transition           : anim8.delegate( 'transition', anim8.delegate.RETURN_THIS ),
  transitionEvents     : anim8.delegate( 'transitionEvents', anim8.delegate.RETURN_THIS ),
  transitionInto       : anim8.delegate( 'transitionInto', anim8.delegate.RETURN_THIS ),
  transitionIntoEvents : anim8.delegate( 'transitionIntoEvents', anim8.delegate.RETURN_THIS ),
  tween                : anim8.delegate( 'tween', anim8.delegate.RETURN_THIS ),
  tweenTo              : anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS ),
  tweenMany            : anim8.delegate( 'tweenMany', anim8.delegate.RETURN_THIS ),
  tweenManyTo          : anim8.delegate( 'tweenManyTo', anim8.delegate.RETURN_THIS ),
  applyInitialState    : anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS ),
  follow               : anim8.delegate( 'follow', anim8.delegate.RETURN_THIS ),
  eventsFor            : anim8.delegate( 'eventsFor', anim8.delegate.RETURN_RESULTS ),
  springsFor           : anim8.delegate( 'springsFor', anim8.delegate.RETURN_RESULTS ),
  stop                 : anim8.delegate( 'stop', anim8.delegate.RETURN_THIS ),
  end                  : anim8.delegate( 'end', anim8.delegate.RETURN_THIS ),
  finish               : anim8.delegate( 'finish', anim8.delegate.RETURN_THIS ),
  pause 			         : anim8.delegate( 'pause', anim8.delegate.RETURN_THIS ),
  resume 			         : anim8.delegate( 'resume', anim8.delegate.RETURN_THIS ),
  set                  : anim8.delegate( 'set', anim8.delegate.RETURN_THIS ),
  get                  : anim8.delegate( 'get', anim8.delegate.RETURN_FIRST ),
  isAnimating          : anim8.delegate( 'isAnimating', anim8.delegate.RETURN_TRUE ),
  hasEvents            : anim8.delegate( 'hasEvents', anim8.delegate.RETURN_TRUE ),
  hasSprings           : anim8.delegate( 'hasSprings', anim8.delegate.RETURN_TRUE ),
  on			             : anim8.delegate( 'on', anim8.delegate.RETURN_THIS ),
  once		             : anim8.delegate( 'once', anim8.delegate.RETURN_THIS ),
  off			             : anim8.delegate( 'off', anim8.delegate.RETURN_THIS ),
  trigger              : anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS )

});


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


/**
 * [Sequence description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.Sequence = function(animators, delay, easing)
{
  this.animators = animators;
  this.delay = anim8.delay( delay );
  this.easing = anim8.easing( easing );
};

anim8.Sequence.prototype =
{
  /**
   * [maxDelay description]
   * @return {[type]}
   */
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  /**
   * [createEvents description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  createEvents: function(animation, options, i)
  {
    var events = animation.newEvents();
    var delta = i / (this.animators.length - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();
    
    for (var k = 0; k < events.length; k++)
    {
      events[k].delay += delayOffset;
    }

    animation.merge( options, events );
    
    return events;
  },

  /**
   * [reverse description]
   * @return {[type]}
   */
  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  /**
   * [play description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  play: function(animation, options, all, cache)
  {
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.playEvents( sequence.createEvents( anim, options, i ), all );       
    });
    
    return this.add();
  },
  
  /**
   * [queue description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  queue: function(animation, options, cache)
  {
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;
    var maxRemaining = 0;
    var remaining = [];
    
    this.animators.each(function(animator, i)
    {
      remaining[i] = animator.timeRemaining();
      maxRemaining = Math.max( maxRemaining, remaining[i] );
    });

    this.animators.each(function(animator, i)
    {
      var delayOffset = maxRemaining - remaining[i];
      var events = sequence.createEvents( anim, options, i );
      
      for (var i = 0; i < events.length; i++)
      {
        events[ i ].delay += delayOffset;
      }
      
      animator.queueEvents( events );
    });
    
    return this.add();
  },

  /**
   * [transition description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transitionEvents( transition, sequence.createEvents( anim, options, i ), all );
    });
    
    return this.add();
  },

  /**
   * [transitionInto description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  transitionInto: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transitionIntoEvents( transition, sequence.createEvents( anim, options, i ), all );
    });
    
    return this.add();
  },
  
  /**
   * [add description]
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
    throw 'Parser.parse not implemented';
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
    var scales    = animation.scales || {};
    var scaleBases= animation.scaleBases || {};
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      var calc = e.path.calculator;
      
      if ( e.getParser() !== this )
      {
        continue;
      }

      e.easing    = anim8.easing( anim8.coalesce( easings[attr],   newOptions.easing,   oldOptions.easing   ), e.easing );
      e.repeat    = anim8.repeat( anim8.coalesce( repeats[attr],   newOptions.repeat,   oldOptions.repeat   ), e.repeat );
      e.delay     = anim8.time(   anim8.coalesce( delays[attr],    newOptions.delay,    oldOptions.delay    ), e.delay );
      e.sleep     = anim8.time(   anim8.coalesce( sleeps[attr],    newOptions.sleep,    oldOptions.sleep    ), e.sleep );
      e.duration  = anim8.time(   anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration ), e.duration );
      e.scale     =               anim8.coalesce( scales[attr],    newOptions.scale,    oldOptions.scale     , e.scale );
      e.scaleBase = calc.parse(   anim8.coalesce( scaleBases[attr],newOptions.scaleBase,oldOptions.scaleBase), e.scaleBase );
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
anim8.override( anim8.ParserDeltas.prototype = new anim8.Parser(),
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
    // 1. If deltas wasn't specified, assume a uniform distribution of points
    // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
    // 3. Generate the events
    
    var factory = anim8.factory( animation.factory );
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
    var scales = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
  	for (var attr in values)
  	{
  		var value = values[ attr ];
      var attribute = factory.attribute( attr );
  		
  		for (var k = 0; k < value.length; k++)
  		{
  			value[k] = attribute.parse( value[k] );
  		}
  		
      var duration  = anim8.coalesce( durations[attr], options.duration );
      var easing    = anim8.coalesce( easings[attr], options.easing );
      var delay     = anim8.coalesce( delays[attr], options.delay );
      var sleep     = anim8.coalesce( sleeps[attr], options.sleep );
      var repeat    = anim8.coalesce( repeats[attr], options.repeat );
      var scale     = anim8.coalesce( scales[attr], options.scale );
      var scaleBase = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path      = new anim8.DeltaPath( attr, attribute.calculator, values[attr], deltas[attr] );
      var event     = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      events.push( event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['values'] = new anim8.ParserDeltas();


/**
 * Instantiates a new parser for the 'final' animation type.
 */
anim8.ParserFinal = function()
{
  
};

// ParserFinal extends anim8.Parser()
anim8.override( anim8.ParserFinal.prototype = new anim8.Parser(),
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
    // 1. Generate the events, only caring about the delays and durations
    
    var factory = anim8.factory( animation.factory );
  	var values = animation.final;
    var delays = animation.delays || {};
    var durations = animation.durations || {};
    var scales = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    var calculators = {};
  	var defaults = {};
    
  	for (var attr in values)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] ); 
      var delay      = anim8.delay( anim8.coalesce( delays[attr], options.delay ) );
      var duration   = anim8.duration( anim8.coalesce( durations[attr], options.duration ) );
      var scale      = anim8.coalesce( scales[attr], options.scale );
      var scaleBase  = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path       = new anim8.PointPath( attr, attribute.calculator, value );
      var event      = new anim8.Event( attr, path, 0, anim8.easing.default, delay + duration, 0, 1, scale, scaleBase, false, this );
      
      events.push( event );
  	}
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
    var delays    = animation.delays || {};
    var scales    = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      var calc = e.path.calculator;
        
      if ( e.getParser() !== this )
      {
        continue;
      }

      var delay = anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay );
      var duration = anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration );

      e.delay = anim8.delay( delay ) + anim8.duration( duration );
      e.scale = anim8.coalesce( scales[attr], newOptions.scale, oldOptions.scale, e.scale );
      e.scaleBase = calc.parse( anim8.coalesce( scaleBases[attr], newOptions.scaleBase, oldOptions.scaleBase ), e.scaleBase );
    }
  }

});

/**
 * Register the parser.
 */
anim8.parser['final'] = new anim8.ParserFinal();



/**
 * Instantiates a new parser for the 'initial' animation type.
 */
anim8.ParserInitial = function()
{
  
};

// ParserInitial extends anim8.Parser()
anim8.override( anim8.ParserInitial.prototype = new anim8.Parser(),
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
    // 1. Generate the events, only caring about the delays
    
    var factory    = anim8.factory( animation.factory );
  	var values     = animation.initial;
    var delays     = animation.delays || {};
    var scales     = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
  	for (var attr in values)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] ); 
      var delay      = anim8.delay( anim8.coalesce( delays[attr], options.delay ) );
      var scale      = anim8.coalesce( scales[attr], options.scale );
      var scaleBase  = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path       = new anim8.PointPath( attr, attribute.calculator, value );
      var event      = new anim8.Event( attr, path, 0, anim8.easing.default, delay, 0, 1, scale, scaleBase, true, this );
      
      events.push( event );
  	}
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
    var delays    = animation.delays || {};
    var scales = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      var calc = e.path.calculator;
        
      if ( e.getParser() !== this )
      {
        continue;
      }
      
      e.delay = anim8.time( anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay ), e.delay );
      e.scale = anim8.coalesce( scales[attr], newOptions.scale, oldOptions.scale, e.scale );
      e.scaleBase = calc.parse( anim8.coalesce( scaleBases[attr], newOptions.scaleBase, oldOptions.scaleBase ), e.scaleBase );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['initial'] = new anim8.ParserInitial();


/**
 * Instantiates a new parser for the 'keyframe' animation type.
 */
anim8.ParserKeyframe = function()
{
  
};

// ParserKeyframe extends anim8.Parser()
anim8.override( anim8.ParserKeyframe.prototype = new anim8.Parser(),
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
    // 1. Normalize keys by converting aliases to the actual value
    // 2. Split up keys that have commas into multiple entries
    // 3. Validate keys and remove invalid ones - also calculate max key value
    // 4. Sort frames by the key
    // 5. Expand frames to generate delta arrays, value arrays, and easing arrays
    // 6. Generate the events
    
    var factory = anim8.factory( animation.factory );
    var kframes = animation.keyframe;
    
    var durations = animation.durations || {};
    var easings = animation.easings || {};
    var delays = animation.delays || {};
    var sleeps = animation.sleeps || {};
    var repeats = animation.repeats || {};
    var scales = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
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
    var pathEasings = {};
    var attributes = {};
    
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
          attributes[attr] = factory.attribute( attr );
        }
  			
        deltas[attr].push( frame.order / maxTime );
        values[attr].push( attributes[ attr ].parse( frame.value[ attr ] ) );
        pathEasings[attr].push( anim8.easing( anim8.coalesce( easings[ attr ], easing ) ) );
      }
    }
  	
    // create events & paths
    for (var attr in deltas)
    {
      var duration  = anim8.coalesce( durations[attr], options.duration );
      var delay     = anim8.coalesce( delays[attr], options.delay );
      var sleep     = anim8.coalesce( sleeps[attr], options.sleep );
      var repeat    = anim8.coalesce( repeats[attr], options.repeat );
      var scale     = anim8.coalesce( scales[attr], options.scale );
      var scaleBase = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path      = new anim8.KeyframePath( attr, attributes[attr].calculator, values[attr], deltas[attr], pathEasings[attr] );
      var event     = new anim8.Event( attr, path, duration, teasing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      events.push( event );
    }
  }
});

/**
 * Registers the parser.
 */
anim8.parser['keyframe'] = new anim8.ParserKeyframe();


/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 */
anim8.ParserTween = function()
{
  
};

// ParserTween extends anim8.Parser()
anim8.override( anim8.ParserTween.prototype = new anim8.Parser(),
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
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var tweenTo    = animation.tweenTo;
    var durations  = animation.durations || {};
    var easings    = animation.easings || {};
    var delays     = animation.delays || {};
    var sleeps     = animation.sleeps || {};
    var repeats    = animation.repeats || {};
    var scales     = animation.scales || {};
    var scaleBases = animation.scaleBase || {};

  	for (var attr in tweenTo)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenTo[attr] );
      var duration   = anim8.coalesce( durations[attr], options.duration );
      var easing     = anim8.coalesce( easings[attr], options.easing );
      var delay      = anim8.coalesce( delays[attr], options.delay );
      var sleep      = anim8.coalesce( sleeps[attr], options.sleep );
      var repeat     = anim8.coalesce( repeats[attr], options.repeat );
      var scale      = anim8.coalesce( scales[attr], options.scale );
      var scaleBase  = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path       = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, value );
      var event      = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      events.push( event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['tweenTo'] = new anim8.ParserTween();


/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParserMove = function()
{
  
};

// ParserMove extends anim8.Parser()
anim8.override( anim8.ParserMove.prototype = new anim8.Parser(),
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
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var move       = animation.move;
    var durations  = animation.durations || {};
    var easings    = animation.easings || {};
    var delays     = animation.delays || {};
    var sleeps     = animation.sleeps || {};
    var repeats    = animation.repeats || {};
    var scales     = animation.scales || {};
    var scaleBases = animation.scaleBase || {};

  	for (var attr in move)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( move[attr] );
      var duration   = anim8.coalesce( durations[attr], options.duration );
      var easing     = anim8.coalesce( easings[attr], options.easing );
      var delay      = anim8.coalesce( delays[attr], options.delay );
      var sleep      = anim8.coalesce( sleeps[attr], options.sleep );
      var repeat     = anim8.coalesce( repeats[attr], options.repeat );
      var scale      = anim8.coalesce( scales[attr], options.scale );
      var scaleBase  = anim8.coalesce( scaleBases[attr], options.scaleBase );
      var path       = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, anim8.computed.relative( value ) );
      var event      = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      events.push( event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['move'] = new anim8.ParserMove();



/**
 * Returns a factory for the given subject or throws an error if no factory exists.
 *
 * @param {any} subject
 */
anim8.factoryFor = function(subject, optional) 
{
  var highestPriorityFactory = false;

  for (var factoryName in anim8.factory) 
  {
    var factory = anim8.factory[ factoryName ];
    
    if ( factory.is( subject ) && (highestPriorityFactory === false || highestPriorityFactory.priority < factory.priority) )
    {     
      highestPriorityFactory = factory;
    }
  }
  
  if ( highestPriorityFactory )
  {
    return highestPriorityFactory;
  }

  if ( optional )
  {
    return false;
  }
  
  throw 'No factory exists for subject ' + subject;
};

/**
 * Returns a factory given the input and returns the default if none is found.
 * 
 * @param  [string|anim8.Factory]
 * @return {anim8.Factory}
 */
anim8.factory = function(factory)
{
  if ( factory instanceof anim8.Factory )
  {
    return factory;
  }
  if ( anim8.isString( factory ) && factory in anim8.factory )
  {
    return anim8.factory[ factory ];
  }

  return anim8.factory.default;
};

/**
 * A factory creates Animator instances for subjects.
 */
anim8.Factory = function()
{
  this.priority = 0;
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
    throw 'Factory.is not implemented';
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    throw 'Factory.animatorFor not implemented';
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

  },

  /**
   * Returns the attribute descriptor for the given attribute.
   * 
   * @param  {string} attr
   * @return {object}
   */
  attribute: function(attr)
  {
    throw 'Factory.attribute not implemented';
  }

};


/**
 * A factory for plain objects.
 */
anim8.ObjectFactory = function()
{
  this.priority = 0;
  this.attributes = {};
};

anim8.override( anim8.ObjectFactory.prototype = new anim8.Factory(),
{
  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return anim8.isObject( subject ) && !anim8.isElement( subject ) && !anim8.isArray( subject );
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    var animator = subject.$animator;
      
    if ( !animator )
    {
      animator = new anim8.Animator( subject );
      animator.factory = this;
      
      subject.$animator = animator;
    }
    
    return animator;
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   * 
   * @param  {anim8.Animator} animator
   * @return {void}
   */
  destroy: function(animator)
  {
    delete animator.subject.$animator;
  },

  /**
   * Returns the attribute descriptor for the given attribute.
   * 
   * @param  {string} attr
   * @return {object}
   */
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = anim8.object.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = anim8.calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.create() );

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.parse = function(value) {
        return this.calculator.parse( value, this.defaultValue );
      };
      attribute.cloneDefault = function() {
        return this.calculator.clone( this.defaultValue );
      };
    }

    return attribute;
  }

});

/**
 * Registers the object factory.
 */
anim8.factory['default'] = anim8.factory['object'] = new anim8.ObjectFactory();

/**
 * The Object namespace.
 * 
 * @type {Object}
 */
anim8.object = {};

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {object|string} attr
 */
anim8.object.attribute = function(attr) 
{
  if ( anim8.isObject( attr ) && anim8.isDefined( attr.defaultValue ) ) 
  {
    return attr;
  }
  if ( anim8.isString( attr ) && attr in anim8.dom.attribute ) 
  {
    return anim8.object.attribute[ attr ];
  }
  
  return anim8.object.attribute.default;
};

/**
 * The default attribute.
 */
anim8.object.attribute['default']                 = {defaultValue: 0};


/**
 * A factory for HTML Elements
 */
anim8.DomFactory = function()
{
  this.cached = {};
  this.ids = 0;
  this.elementAttribute = 'anim8';
  this.priority = 5;
  this.attributes = {};
};

anim8.override( anim8.DomFactory.prototype = new anim8.Factory(),
{
  
  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return anim8.isElement( subject );
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    var animatorId = subject.getAttribute( this.elementAttribute );
    
    if (!(animatorId in this.cached)) 
    {
      var animator = new anim8.DomAnimator( subject );
      
      subject.setAttribute( this.elementAttribute, animatorId = animator.id = ++this.ids );
      
      animator.factory = this;
      
      this.cached[animatorId] = animator;
    }

    return this.cached[ animatorId ];
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   * 
   * @param  {anim8.Animator} animator
   * @return {void}
   */
  destroy: function(animator)
  {
    delete this.cached[ animator.id ];
  },

  /**
   * Returns the attribute descriptor for the given attribute.
   * 
   * @param  {string} attr
   * @return {object}
   */
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = anim8.dom.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = anim8.calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.create() );
      var propertyName = anim8.coalesce( attribute.property, attr );
      var property = anim8.dom.property( propertyName );
      var defaultUnit = attribute.defaultUnit || '';

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.propertyName = propertyName;
      attribute.property = property;
      attribute.defaultUnit = defaultUnit;
      attribute.parse = function(value) {
        return this.calculator.parse( value, this.defaultValue );
      };
      attribute.cloneDefault = function() {
        return this.calculator.clone( this.defaultValue );
      };
    }

    return attribute;
  }

});

/**
 * Registers the DOM factory.
 */
anim8.factory['default'] = anim8.factory['dom'] = new anim8.DomFactory();

/* TODO don't apply styles if they're impercivable (convert value to pixels of applicable) */

/**
 * All DOM related
 */
anim8.dom = {};

/* 
  anim8.dom.property[name] = {
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
anim8.dom.property = function(prop) 
{
  if ( anim8.isObject( prop ) && anim8.isFunction( prop.get ) && anim8.isFunction( prop.set ) ) 
  {
    return prop;
  }
  if ( anim8.isString( prop ) && prop in anim8.dom.property )
  {
	  return anim8.dom.property[ prop ];
  }
	
  throw prop + ' is not a valid property';
}

/**
 * Computes the desired style of the given element and returns it as a string. The style
 * given must be in hyphenated format like so: anim8.dom.style( element, 'font-size' ) = '12px'
 */
anim8.dom.style = (function()
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
anim8.dom.prefix = (function() 
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
 * Parses the string for a value and a unit.
 *
 * @param {string} value
 */
anim8.dom.parseValue = (function()
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
 * For Example: anim8.dom.convert( element, '100px', '%', 'parentWidth' )
 *    returns how much percent 100px relativeTo parentWidth of the given element
 *
 * @param {HTMLElement} e
 * @param {string} from
 * @param {string} toUnit
 * @param {string} relativeTo
 */
anim8.dom.convert = (function()
{
  /**
   * Calculators how many pixels a given value & unit is.
   * 
   * For Example: anim8.toPixels( 100, 'in' ) 
   *    returns how many pixels are in 1 inch, with up to 2 decimal points of accuracy.
   */
  var toPixels = function(baseValue, baseUnit, defaultRate)
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

  var getFontSize = function(e, notUnit)
  {
    var fontSize = anim8.dom.style( e, 'fontSize' );
    var parsed = anim8.dom.parseValue( fontSize );
    
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
  
  conversions.pt  = { px: toPixels(100, 'pt') };
  conversions.in  = { px: toPixels(100, 'in') };
  conversions.cm  = { px: toPixels(1000, 'cm') };
  conversions.mm  = { px: toPixels(100000, 'mm') };
  conversions.vw  = { px: toPixels(1000, 'vw') };
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
      
      if ( !(unit in conversions[ to ]) )
      {
        var given = conversions[ unit ][ to ];
        
        if ( anim8.isNumber( given ) )
        {
          conversions[ to ][ unit ] = 1.0 / given;  
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
    
    var parsed = anim8.dom.parseValue( from );
    
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




anim8.dom.property.factory = function(nm, relativeTo) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.dom.style( e, nm );
        var converted = anim8.dom.convert( e, style, anim.units[ nm ], relativeTo );
        
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

anim8.dom.property.factoryDerivable = function(nm, relativeTo, deriver) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.dom.style( e, nm );
        var converted = anim8.dom.convert( e, style, anim.units[ nm ], relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
        else if ( anim8.isFunction( deriver ) )
        {
          converted = anim8.dom.convert( e, deriver( e ), anim.units[ nm ], relativeTo );
          
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

anim8.dom.property.factoryColor = function(nm) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var parsed = anim8.color.parse( e.style[nm] );
        
        if (parsed !== false) 
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

anim8.dom.property.padding                  = anim8.dom.property.factory( 'padding', 'parentWidth' );
anim8.dom.property.paddingTop               = anim8.dom.property.factory( 'paddingTop', 'parentWidth' );
anim8.dom.property.paddingRight             = anim8.dom.property.factory( 'paddingRight', 'parentWidth' );
anim8.dom.property.paddingBottom            = anim8.dom.property.factory( 'paddingBottom', 'parentWidth' );
anim8.dom.property.paddingLeft              = anim8.dom.property.factory( 'paddingLeft', 'parentWidth' );

anim8.dom.property.margin                   = anim8.dom.property.factory( 'margin', 'parentWidth' );
anim8.dom.property.marginTop                = anim8.dom.property.factory( 'marginTop', 'parentWidth' );
anim8.dom.property.marginRight              = anim8.dom.property.factory( 'marginRight', 'parentWidth' );
anim8.dom.property.marginBottom             = anim8.dom.property.factory( 'marginBottom', 'parentWidth' );
anim8.dom.property.marginLeft               = anim8.dom.property.factory( 'marginLeft', 'parentWidth' );

anim8.dom.property.borderRadius             = anim8.dom.property.factory( 'borderRadius', 'width' );
anim8.dom.property.borderTopLeftRadius      = anim8.dom.property.factory( 'borderTopLeftRadius', 'width' );
anim8.dom.property.borderTopRightRadius     = anim8.dom.property.factory( 'borderTopRightRadius', 'width' );
anim8.dom.property.borderBottomLeftRadius   = anim8.dom.property.factory( 'borderBottomLeftRadius', 'width' );
anim8.dom.property.borderBottomRightRadius  = anim8.dom.property.factory( 'borderBottomRightRadius', 'width' );

anim8.dom.property.borderWidth              = anim8.dom.property.factory( 'borderWidth' );
anim8.dom.property.borderTopWidth           = anim8.dom.property.factory( 'borderTopWidth' );
anim8.dom.property.borderRightWidth         = anim8.dom.property.factory( 'borderRightWidth' );
anim8.dom.property.borderBottomWidth        = anim8.dom.property.factory( 'borderBottomWidth' );
anim8.dom.property.borderLeftWidth          = anim8.dom.property.factory( 'borderLeftWidth' );

anim8.dom.property.outlineWidth             = anim8.dom.property.factory( 'outlineWidth' );
anim8.dom.property.textIndent               = anim8.dom.property.factory( 'textIndent', 'parentWidth' );
anim8.dom.property.borderSpacing            = anim8.dom.property.factory( 'borderSpacing' );
anim8.dom.property.fontSize                 = anim8.dom.property.factory( 'fontSize', 'parentFontSize' );
anim8.dom.property.lineHeight               = anim8.dom.property.factory( 'lineHeight', 'fontSize' );
anim8.dom.property.zIndex                   = anim8.dom.property.factory( 'zIndex' );

anim8.dom.property.color                    = anim8.dom.property.factoryColor( 'color' );
anim8.dom.property.backgroundColor          = anim8.dom.property.factoryColor( 'backgroundColor' );
anim8.dom.property.borderTopColor           = anim8.dom.property.factoryColor( 'borderTopColor' );
anim8.dom.property.borderRightColor         = anim8.dom.property.factoryColor( 'borderRightColor' );
anim8.dom.property.borderBottomColor        = anim8.dom.property.factoryColor( 'borderBottomColor' );
anim8.dom.property.borderLeftColor          = anim8.dom.property.factoryColor( 'borderLeftColor' );
anim8.dom.property.outlineColor             = anim8.dom.property.factoryColor( 'outlineColor' );

anim8.dom.property.minWidth                 = anim8.dom.property.factory( 'minWidth', 'parentWidth' );
anim8.dom.property.maxWidth                 = anim8.dom.property.factory( 'maxWidth', 'parentWidth' );
anim8.dom.property.minHeight                = anim8.dom.property.factory( 'minHeight', 'parentHeight' );
anim8.dom.property.maxHeight                = anim8.dom.property.factory( 'maxHeight', 'parentHeight' );

anim8.dom.property.width                    = anim8.dom.property.factoryDerivable('width', 'parentWidth', function(e) { return e.offsetWidth + 'px'; });
anim8.dom.property.height                   = anim8.dom.property.factoryDerivable('height', 'parentHeight', function(e) { return e.offsetHeight + 'px'; });

anim8.dom.property.top                      = anim8.dom.property.factoryDerivable('top', 'parentHeight', function(e) { return e.offsetTop + 'px'; });
anim8.dom.property.right                    = anim8.dom.property.factoryDerivable('right', 'parentWidth', function(e) { return (e.parentNode.scrollWidth - (e.offsetLeft + e.offsetWidth)) + 'px'; });
anim8.dom.property.bottom                   = anim8.dom.property.factoryDerivable('bottom', 'parentHeight', function(e) { return (e.parentNode.scrollHeight - (e.offsetTop + e.offsetHeight)) + 'px'; });
anim8.dom.property.left                     = anim8.dom.property.factoryDerivable('left', 'parentWidth', function(e) { return e.offsetLeft + 'px'; });

anim8.dom.property.visibility = 
{
  get: function(e, anim) 
  {
    if (anim.animating.visibility === false) 
    {
      var style = anim8.dom.style( e, 'visibility' );
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

anim8.dom.property.backface = (function()
{
  var css = anim8.dom.prefix(['WebkitBackfaceVisibility', 'MozBackfaceVisibility', 'msBackfaceVisibility', 'BackfaceVisibility']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim)
    {
      if ( anim.animating.backface === false )
      {
        var style = anim8.dom.style( e, css ); 
        
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

anim8.dom.property.transformOrigin = (function() 
{
  var css = anim8.dom.prefix(['WebkitTransformOrigin', 'MozTransformOrigin', 'OTransformOrigin', 'msTransformOrigin', 'transformOrigin']);
  
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

      var converted = anim8.dom.convert( e, value, anim.units[ attr ], relativeTo );
      
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
      var style = anim8.dom.style( e, css );
      
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

anim8.dom.property.transform = (function() 
{
  var css = anim8.dom.prefix(['WebkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'transform']);
   
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
    var converted = anim8.dom.convert( e, value, desiredUnit, relativeTo );
    
    if ( converted !== false )
    {
      return converted;
    }
    
    // TODO show convert this to desiredUnit, however defaultValue may be non-scalar.
    return anim.getAttribute( attr ).defaultValue;    
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.dom.style( e, css );
      
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

anim8.dom.property.opacity = (function() 
{
  var css = anim8.dom.prefix(['WebkitOpacity', 'MozOpacity', 'KhtmlOpacity', 'opacity']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating.opacity === false) 
      {
        var style = anim8.dom.style( e, css );
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
      anim.styles[ css ] = anim8.clamp( anim.frame.opacity, 0, 1 );
    },
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
  };
  
})();

anim8.dom.property.filter = (function() 
{
  var css = anim8.dom.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
  
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
			var style = anim8.dom.style( e, css );
      
			for (var attr in patterns) 
      {
				if ( anim.animating[attr] === false ) 
        {
					var parsed = patterns[attr].exec( style );
          
					if (parsed !== false) 
          {
            var converted = anim8.dom.convert( e, parsed[1], anim.units[ attr ] );
            
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

anim8.dom.property.center = 
{
  get: function(e, anim)
  {
    var cx = (e.offsetLeft + e.offsetWidth * 0.5) + 'px';
    var cy = (e.offsetTop + e.offsetHeight * 0.5) + 'px';
    
    if ( anim.animating.center === false )
    {
      var desiredUnit = anim.units.center;
      var ccx = anim8.dom.convert( e, cx, desiredUnit, 'parentWidth' );
      var ccy = anim8.dom.convert( e, cy, desiredUnit, 'parentHeight' );
    
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
      var ccx = anim8.dom.convert( e, cx, desiredUnit, 'parentWidth' );
      
      if ( ccx !== false )
      {
        anim.frame.centerX = ccx;
        anim.animating.centerX = true;
      }
    }
    if ( anim.animating.centerY === false )
    {
      var desiredUnit = anim.units.centerY;
      var ccy = anim8.dom.convert( e, cy, desiredUnit, 'parentHeight' );
      
      if ( ccy !== false )
      {
        anim.frame.centerY = ccy;
        anim.animating.centerY = true;
      }
    }
  },
  preset: function(e, anim)
  {
    anim.cached.width  = anim8.dom.convert( e, e.offsetWidth + 'px', anim.units.centerX || anim.units.center, 'parentWidth' );
    anim.cached.height = anim8.dom.convert( e, e.offsetHeight + 'px', anim.units.centerY || anim.units.center, 'parentHeight' );
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

anim8.dom.property.orbit = 
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
      var cox = anim8.dom.convert( e, ox + 'px', cunit, 'parentWidth' );
      var coy = anim8.dom.convert( e, oy + 'px', cunit, 'parentHeight' );
      
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
    
    var cox = anim8.dom.convert( e, orbitX + cunit, 'px', anim.cached.parentWidth / 100.0 );
    var coy = anim8.dom.convert( e, orbitY + cunit, 'px', anim.cached.parentHeight / 100.0 );
    
    var ox = anim8.dom.convert( e, originX + originUnit, 'px', anim.cached.width / 100.0 );
    var oy = anim8.dom.convert( e, originY + originUnit, 'px', anim.cached.height / 100.0 );
    
    var angle = (anim.frame.angle || 0.0) * this.DEGREE_TO_RADIAN;
    var distance = anim.frame.distance || 0.0;
        
    var cos = Math.cos( angle ) * distance;
    var sin = Math.sin( angle ) * distance;
    
    anim.styles.left = (cox + cos - ox) + 'px';
    anim.styles.top = (coy + sin - oy) + 'px';
  }
};

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {object|string} attr
 */
anim8.dom.attribute = function(attr) 
{
  if ( anim8.isObject( attr ) && anim8.isDefined( attr.defaultValue ) ) 
  {
    return attr;
  }
  if ( anim8.isString( attr ) && attr in anim8.dom.attribute ) 
  {
    return anim8.dom.attribute[ attr ];
  }
  
  return anim8.dom.attribute.default;
};

/**
 * The default attribute.
 */
anim8.dom.attribute.default                 = {defaultValue: 0};

/**
 * All animatable attributes for DomAnimators & HTMLElements.
 */

anim8.dom.attribute.padding                 = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.margin                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.outlineWidth						= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.outlineOffset						= {defaultValue: 0};
anim8.dom.attribute.textIndent							= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderSpacing						= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.fontSize								= {defaultValue: 1, defaultUnit: 'em'};
anim8.dom.attribute.lineHeight							= {defaultValue: 1, defaultUnit: 'em'};

anim8.dom.attribute.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
anim8.dom.attribute.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
anim8.dom.attribute.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

anim8.dom.attribute.opacity                 = {defaultValue: 1};
anim8.dom.attribute.zIndex                  = {defaultValue: 1};

anim8.dom.attribute.width                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.height                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.angle                   = {defaultValue: 0, property: 'orbit'};
anim8.dom.attribute.distance                = {defaultValue: 0, property: 'orbit'};
anim8.dom.attribute.orbitOffset             = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'orbitOffset', calculator: '2d'};

anim8.dom.attribute.top                     = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.right                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.left                    = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.center                  = {defaultValue: {x:0, y:0}, defaultUnit: 'px', property: 'center', calculator: '2d'};
anim8.dom.attribute.centerX                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};
anim8.dom.attribute.centerY                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};

anim8.dom.attribute.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
anim8.dom.attribute.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.brightness              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.contrast                = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

anim8.dom.attribute.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
anim8.dom.attribute.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

anim8.dom.attribute.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
anim8.dom.attribute.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

anim8.dom.attribute.scale                   = {defaultValue: {x:1, y:1}, property: 'transform', calculator: '2d'};
anim8.dom.attribute.scaleX	                = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scaleY  	              = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scaleZ  	              = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

anim8.dom.attribute.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
anim8.dom.attribute.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
anim8.dom.attribute.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

anim8.dom.attribute.backface                = {defaultValue: 0};
anim8.dom.attribute.visibility              = {defaultValue: 1};

anim8.dom.attribute.backgroundColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.color                   = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderTopColor          = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderRightColor        = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderBottomColor       = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderLeftColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.outlineColor            = {defaultValue: anim8.color(), calculator: 'rgba'};


/**
 * Instantiates a new DomAnimator given a subject.
 * 
 * @param {HTMLElement} e
 */
anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
  this.propertiesPreset = {};
  this.attributeToProperty = {};
  this.animating = {};
  this.cached = {};
  this.units = {};
  this.styles = {};
  this.styled = false;
  this.stylesUpdated = false;
};

/**
 * Extends anim8.Animator
 */
anim8.override( anim8.DomAnimator.prototype = new anim8.Animator(),
{
  /**
   * A method thats invoked along with all other animators before updates are called.
   * This is used to make any necessary preparations before the animator is updated.
   *
   * If any events that were recently added have true values this is where we replace
   * this true values with the values currently on the subject.
   */
  preupdate: function()
  {
    // If there are events with paths that contain computed values we should
    // populate the frame directly from the HTML element.
    var ce = this.eventsComputed;
    if ( ce.length )
    {
      var properties = {};
    
      for (var i = 0; i < ce.length; i++)
      {
        var attr = ce[ i ].attribute;

        if ( !(attr in this.frame) )
        {
          properties[ this.attributeToProperty[ attr ] ] = true;
      
          this.animating[ attr ] = false; 
        }
      }
      
      for (var prop in properties)
      {
        this.properties[ prop ].get( this.subject, this );
      }
    }

    // If a property currently being animated requires some heads up before it
    // gets or sets a value, notify it. TODO removed dead properties.
    for (var prop in this.propertiesPreset)
    { 
      this.propertiesPreset[ prop ].preset( this.subject, this );
    }

    // Finish updating computed events, filling in the frame, and triggering.
    anim8.Animator.prototype.preupdate.apply( this, arguments );

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
    anim8.Animator.prototype.update.apply( this, arguments );
      
    this.getStyles();
    this.stylesUpdated = true;

    return this;
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
  },

  /**
   * Builds the styles map in preparation to be applied.
   */
  getStyles: function()
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
  },

  /**
   * Applies all updated attributes to the subject. This method is invoked with all of the other
   * animators at the end of the animation cycle.
   */
  apply: function()
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
  },
    
  /**
   * Places the event in this animator replacing any event that exists for the same
   * attribute. The next time the animator is updated the event will be started.
   *
   * @param {anim8.EventInstance} e
   */
  placeEvent: function( e )
  {
    anim8.Animator.prototype.placeEvent.apply( this, arguments );
    
    return this.placeProperty( e.attribute, e.unit );
  },
    
  /**
   * Places the spring in this animator replacing any spring that exists for the same
   * attribute. The next time the animator is updated the spring will be started.
   *
   * @param {anim8.Spring} s
   */
  placeSpring: function( s )
  {
    anim8.Animator.prototype.placeSpring.apply( this, arguments );
    
    return this.placeProperty( s.attribute );
  },

  /**
   * Places all necessary property information on the Animator for animating the given attribute.
   * 
   * @param  {string} attr
   * @return {this}
   */
  placeProperty: function( attr, unit )
  {
    var attribute = this.getAttribute( attr );
    
    this.properties[ attribute.propertyName ] = attribute.property;
    this.attributeToProperty[ attr ] = attribute.propertyName;
    this.units[ attr ] = unit || attribute.defaultUnit;

    if ( attribute.property && anim8.isFunction( attribute.property.preset ) )
    {
      this.propertiesPreset[ attribute.propertyName ] = attribute.property;
    }

    return this;
  },
    
  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   */
  restore: function()
  {
    for (var prop in this.properties)
    {
      this.properties[ prop ].unset( this.subject, this );
    }
  	
  	this.frame = {};

    return this;
  },

  /**
   * Sets the given attributes to this Animator immediately.
   *
   * @param {object} attributes
   */
  set: function(attributes)
  {
    var props = {};
    var updated = {};
    var units = {};
    var styles = {};
    
    for (var attr in attributes)
    {
      var attribute = this.getAttribute( attr );
      var value     = attributes[ attr ];
      
      units[ attr ] = attribute.defaultUnit;
      
      if ( anim8.isString( value ) )
      {
        var parsed = anim8.dom.parseValue( value, attribute.defaultUnit );
        
        if ( parsed !== false )
        {
          units[ attr ] = parsed.unit || attribute.defaultUnit;
          value = parsed.value;
        }  
      }
      
      var parsed = attribute.parse( value );
      
      if ( parsed !== false )
      {
        props[ attribute.propertyName ] = attribute.property;
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
  },

  /**
   * Gets the current attribute values for all attributes specified. The argument must be an object
   * where the key is the name of an attribute and the value is the desired unit.
   *
   * @param {object} attributes
   */
  get: function(attributes)
  {
    var props = {};
    var animating = {};
    var units = {};
    var out = {};
    
    for (var attr in attributes)
    {    
      var attribute = this.getAttribute( attr );
      
      animating[ attr ] = false;    
      units[ attr ] = attributes[ attr ] || attribute.defaultUnit;
      props[ attribute.propertyName ] = attribute.property;
      out[ attr ] = attribute.cloneDefault();
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
  },

  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   * 
   * @param {string} attribute
   */
  ref: function(attribute, desiredUnit, relativeTo)
  {
    var animator = this;
    var request = {};
    
    return function()
    {
      if ( attribute in animator.frame && anim8.isNumber( animator.frame[ attribute ] ) )
      {
        return anim8.dom.convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
      }
      
      request[ attribute ] = desiredUnit;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attribute ] ) )
      {
        return current[ attribute ];
      }
      
      return animator.getAttribute( attribute ).defaultValue;
    };
  },

  /**
   * Returns the value for the given attribute as a string with the current units.
   *
   * @param {string} attr
   */
  value: function(attr)
  {
    return this.frame[ attr ] + this.units[ attr ];
  },

  /**
   * Returns the value for the given attribute as a string with the current units.
   * if the attribute doesn't exist a secondary one is looked up. If that value
   * is an object and contains the given subproperty the value is resolved once again.
   *
   * @param {string} attr
   * @param {string} other
   * @param [string] subproperty
   */
  valueOr: function(attr, other, subproperty)
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
  }

});
