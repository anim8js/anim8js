
/**
 * @module anim8
 */

/**
 * Converts a subject into an animator and returns it. If the subject 
 * is already an animator it's returned immediately.
 *
 * @param {any} subject
 * @return {anim8.Animator|false}
 * @class anim8
 * @static
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
 * @param {Array} subject
 * @return {anim8.Animators}
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
 * @class Core
 */

/**
 * The default values for anim8js properties.
 *
 * @property anim8.defaults
 */
anim8.defaults = 
{

  /**
   * The default animation duration in milliseconds.
   *
   * @property duration
   * @for anim8.defaults
   * @default 1000
   * @type {Number}
   */
  duration: 1000,

  /**
   * The default easing.
   * 
   * @property easing
   * @for anim8.defaults
   * @default 'ease'
   * @type {String|Function}
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   * 
   * @property teasing
   * @for anim8.defaults
   * @default 'linear'
   * @type {String|Function}
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   * 
   * @property delay
   * @for anim8.defaults
   * @default 0
   * @type {Number}
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   * 
   * @property sleep
   * @for anim8.defaults
   * @default 0
   * @type {Number}
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   * 
   * @property repeat
   * @for anim8.defaults
   * @default 1
   * @type {Number}
   */
  repeat: 1,

  /**
   * The default scale for an animation.
   * 
   * @property scale
   * @for anim8.defaults
   * @default 1.0
   * @type {Number}
   */
  scale: 1.0,

  /**
   * The default transition time in milliseconds.
   * 
   * @property transitionTime
   * @for anim8.defaults
   * @default 500
   * @type {Number}
   */
  transitionTime: 500,

  /**
   * The default transition outroduction time in milliseconds.
   * 
   * @property transitionOutro
   * @for anim8.defaults
   * @default 100
   * @type {Number}
   */
  transitionOutro: 100,

  /**
   * The default transition introduction time in milliseconds.
   * 
   * @property transitionIntro
   * @for anim8.defaults
   * @default 100
   * @type {Number}
   */
  transitionIntro: 100,

  /**
   * The default transition easing when none is specified.
   * 
   * @property transitionEasing
   * @for anim8.defaults
   * @default 'linear'
   * @type {String|Function}
   */
  transitionEasing: 'linear',

  /**
   * The default transition granularity. This is used for smooth transitions to
   * provide a smooth transition from the outro velocity to the intro velocity,
   * the cubic or quadratic path between the two is a curve with unknown length
   * so the length needs to be calculated using a maximum number of points to
   * calculate along the path - summing the distances between the consecutive points.
   * 
   * @property transitionGranularity
   * @for anim8.defaults
   * @default 0
   * @type {Number}
   */
  transitionGranularity: 0,

  /**
   * TODO
   * 
   * @property transitionLookup
   * @for anim8.defaults
   * @default 10
   * @type {Number}
   */
  transitionLookup: 10,

  /**
   * Whether animtions are cached whenever possible. Animations that can be
   * cached are strings with options specified in the string and without an
   * option object given. For example 'tada ~1s 3s x3' is cacheable.
   * 
   * @property cache
   * @for anim8.defaults
   * @default false
   * @type {Boolean}
   * @uses anim8.animation
   */
  cache: false,

  /**
   * Whether parsed options are cached whenever possible. Options that can be
   * cached must be strings.
   * 
   * @property cacheOptions
   * @for anim8.defaults
   * @default false
   * @type {Boolean}
   * @uses anim8.options
   */
  cacheOptions: false,

  /**
   * Whether parsed transitions are cached whenever possible. Transitions that can be
   * cached must be strings.
   * 
   * @property cacheTransitions
   * @for anim8.defaults
   * @default false
   * @type {Boolean}
   * @uses anim8.transition
   */
  cacheTransitions: false,

  /**
   * The value to return when options could not be parsed from input.
   * 
   * @property noOptions
   * @for anim8.defaults
   * @default {}
   * @type {Object}
   */
  noOptions: {},

  /**
   * The value to return when a transition could not be parsed from input.
   * 
   * @property noTransition
   * @for anim8.defaults
   * @default {}
   * @type {Object}
   */
  noTransition: {}

};

/**
 * @class Core
 */

/**
 * A function that does nothing.
 * 
 * @property anim8.noop
 */
anim8.noop = function() {};

/**
 * Returns true if the given variable is defined.
 *
 * @method anim8.isDefined
 * @param {any} x
 * @return {Boolean}
 */
anim8.isDefined = function(x) 
{
  return typeof x !== 'undefined';
};

/**
 * Returns true if the given variable is a function.
 *
 * @method anim8.isFunction
 * @param {any} x
 * @return {Boolean}
 */
anim8.isFunction = function(x) 
{
  return !!(x && x.constructor && x.call && x.apply);
};

/**
 * Returns true if the given variable is a number.
 *
 * @method isNumber
 * @for anim8
 * @param {any} x
 * @return {Boolean}
 */
anim8.isNumber = function(x) 
{
  return typeof x === 'number';
};

/**
 * Returns true if the given variable is a string.
 *
 * @method isString
 * @for anim8
 * @param {any} x
 * @return {Boolean}
 */
anim8.isString = function(x) 
{
  return typeof x === 'string';
};

/**
 * Returns true if the given variable is an array. This should be checked before
 * anim8.isObject since Arrays are objects.
 *
 * @method isArray
 * @for anim8
 * @param {any} x
 * @return {Boolean}
 */
anim8.isArray = function(x) 
{
  return x instanceof Array;
};

/**
 * Returns true if the given variable is an object.
 *
 * @method isObject
 * @for anim8
 * @param {any} x
 * @return {Boolean}
 */
anim8.isObject = function(x) 
{
  return typeof x === 'object';
};

/**
 * Returns true if the given variable is an HTML element.
 *
 * @method isElement
 * @for anim8
 * @param {any} x
 * @return {Boolean}
 */
anim8.isElement = function(x)
{
  return typeof HTMLElement === "object" ? x instanceof HTMLElement :
  x && typeof x === "object" && x !== null && x.nodeType === 1 && typeof x.nodeName === "string";
};

/**
 * Returns the current time in milliseconds.
 *
 * @method now
 * @for anim8
 * @return {Number}
 */
anim8.now = (function() 
{
  return Date.now ? Date.now : function() 
  {
    return new Date().getTime();
  };
  
})();

/**
 * Returns the trimmed version of the given string. A trimmed string has no
 * whitespace in the beginning or end of it.
 * 
 * @method trim
 * @for anim8
 * @param  {String} x
 * @return {String}
 */
anim8.trim = (function()
{ 
  if (String.prototype.trim) {
    return function(x) {
      return x.trim();
    };
  }
  return function(x) {
    return x.replace(/^([\s]*)|([\s]*)$/g, '');
  };
})();

/**
 * Determines whether the given variable is empty.
 *
 * @method isEmpty
 * @for anim8
 * @param {any} x
 * @return {Boolean}
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
 * Performs a deep copy of the given variable. If the variable is an array or 
 * object a new instance of that type is created where the values are copied as 
 * well. All other types can't be copied (most likely because they're scalar) so
 * they are returned as-is.
 *
 * @method copy
 * @for anim8
 * @param {T} x
 * @return {T}
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
 * Extends the given object by merging the following objects into it, avoiding 
 * overriding any existing properties.
 * 
 * @method extend
 * @for anim8
 * @param  {Object} out
 * @return {Object}
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
 * Extends the given object my merging the following objects into, overriding 
 * existing properties where necessary.
 * 
 * @method override
 * @for anim8
 * @param  {Object} out
 * @return {Object}
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
 *
 * @method coalesce
 * @for anim8
 */
anim8.coalesce = function(a, b, c, d) 
{
  if (anim8.isDefined(a)) return a;
  if (anim8.isDefined(b)) return b;
  if (anim8.isDefined(c)) return c;
  return d;
};

/**
 * Parses milliseconds from a string or number. If a number is given it's 
 * assumed to be milliseconds and is returned immediately. If a string is given
 * a unit is looked for to determine how to scale the number into milliseconds.
 * If the given time is invalid and returnOnInvalid is not given then zero is
 * returned.
 *
 * @method anim8.time
 * @for Core
 * @param {String|Number} time
 * @param {any} [returnOnInvalid]
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
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.delay
 * @for Core
 * @param {String|Number} time
 */ 
anim8.delay = function(time)
{
  return anim8.time( time, anim8.defaults.delay );
};

/**
 * Parses sleep from a string or number.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.sleep
 * @for Core
 * @param {String|Number} time
 */ 
anim8.sleep = function(time)
{
  return anim8.time( time, anim8.defaults.sleep );
};

/**
 * Parses duration from a string or number.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 * 
 * @method anim8.duration
 * @for Core
 * @param {String|Number} time
 */ 
anim8.duration = function(time)
{
  return anim8.time( time, anim8.defaults.duration );
};

/**
 * Parses repeats from a string or number.
 *
 * @method anim8.repeat
 * @for Core
 * @param {String|Number} time
 * @param {E} [returnOnInvalid]
 * @return {Number|E}
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
 * Parses a number from the given input and if the input isn't a valid number
 * then returnOnInvalid is returned.
 * 
 * @method anim8.number
 * @for Core
 * @param {String|Number} value
 * @param {E} returnOnInvalid
 * @return {Number|E}
 */
anim8.number = function(value, returnOnInvalid)
{
  var parsed = parseFloat( value );

  return isNaN( parsed ) ? returnOnInvalid : parsed;
};

/**
 * Parses scale from a string or number.
 * 
 * @method anim8.scale
 * @for anim8
 * @param {String|Number} scale
 * @return {Number}
 */
anim8.scale = function(scale)
{
  return anim8.number( scale, anim8.defaults.scale );
};

/**
 * Provides a way to wrap a variable so calculators don't try copying it on parse.
 *
 * @method constant
 * @for anim8
 * @param {T} variable
 * @return {Function}
 */
anim8.constant = function(variable)
{
  return function() 
  {
    return variable;
  };
};

/**
 * Resolves the given variable. If the variable is a function the result is 
 * returned.
 * 
 * @method resolve
 * @for anim8
 * @param  {Function|E} variable
 * @return {E}
 */
anim8.resolve = function(variable)
{
  return anim8.isFunction( variable ) ? variable() : variable;
};

/**
 * Returns a value between the given minimum and maximum.
 * 
 * @method clamp
 * @for anim8
 * @param  {Number} v
 * @param  {Number} min
 * @param  {Number} max
 * @return {Number}
 */
anim8.clamp = function(v, min, max)
{
  return (v < min) ? min : (v > max ? max : v);
};

/**
 * Creates a function which calls a method on all elements in the array or on 
 * the first element.
 *
 * @method delegate
 * @for anim8
 * @param {String} functionName
 * @param {String} returning
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
 *
 * @property RETURN_THIS
 * @for anim8.delegate
 */
anim8.delegate.RETURN_THIS = 'this';

/**
 * An array of results for each method call is returned.
 *
 * @property RETURN_RESULTS
 * @for anim8.delegate
 */
anim8.delegate.RETURN_RESULTS = 'results';

/**
 * The result of the first element.
 *
 * @property RETURN_FIRST
 * @for anim8.delegate
 */
anim8.delegate.RETURN_FIRST = 'first';

/**
 * True if any of the methods return true, otherwise false.
 *
 * @property RETURN_TRUE
 * @for anim8.delegate
 */
anim8.delegate.RETURN_TRUE = 'true';


/**
 * Adds functions to the given object (or prototype) so you can listen for any 
 * number of events on the given object, optionally once. Listeners can be 
 * removed later.
 *
 * The following methods will be added to the given object:
 *
 *     object.on( events, callback, [context] )
 *     object.once( events, callback, [context] )
 *     object.off( events, callback )
 *     object.trigger( event, [argument] )
 *
 * Where... 
 * - `events` is a string of space delimited events.
 * - `callback` is a function to invoke when the event is triggered.
 * - `context` is an object that should be the `this` when the callback is 
 *   invoked. If no context is given the default value is the object which has 
 *   the trigger function that was invoked.
 *
 * @method eventize
 * @for anim8
 * @param {Object} object The object to add `on`, `once`, `off`, and `trigger` 
 *    functions to.
 */
anim8.eventize = function(object)
{
  // Adds a listener to $this
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
  
  /**
   * Listens for every occurrence of the given events and invokes the callback
   * each time any of them are triggered.
   * 
   * @method on
   * @for anim8.eventize
   * @param {String} events
   * @param {Function} callback
   * @param {Object} context
   * @chainable
   */
  object.on = function(events, callback, context)
  {
    onListeners( this, '$on', events, callback, context );

    return this;
  };
  
  /**
   * Listens for the next occurrence for each of the given events and invokes
   * the callback when any of the events are triggered.
   * 
   * @method once
   * @for anim8.eventize
   * @param {String} events
   * @param {Function} callback
   * @param {Object} context
   * @chainable
   */
  object.once = function(events, callback, context)
  {
    onListeners( this, '$once', events, callback, context );

    return this;
  };
  
  // Removes a listener from an array of listeners.
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
  
  /**
   * Stops listening for a given callback for a given set of events.
   *
   * @method off
   * @for anim8.eventize
   * @param {String} events
   * @param {Function} callback
   * @chainable
   */
  object.off = function(events, callback)
  {
    events = events.split(' ');
    
    for (var i = 0; i < events.length; i++)
    {
      offListeners( this.$on, events[i] );
      offListeners( this.$once, events[i] );
    }

    return this;
  };
  
  // Triggers listeneers for the given event
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
          delete listeners[ event ];  
        }
      }
    }
  };
  
  /**
   * Triggers a single event optionally passing an argument to any listeners.
   * 
   * @method trigger
   * @for anim8.eventize
   * @param {String} event
   * @param {any} argument
   * @chainable
   */
  object.trigger = function(event, argument)
  {
    triggerListeners( this.$on, event, argument, false );
    triggerListeners( this.$once, event, argument, true );

    return this;
  };
};

