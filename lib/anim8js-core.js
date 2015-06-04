
/**
 * @module anim8
 * @class Core
 */

/**
 * Converts a subject into an animator and returns it. If the subject 
 * is already an animator it's returned immediately. If the subject can't be
 * animated then false is returned.
 *
 * **See:** {{#crossLink "Core/anim8.factoryFor:method"}}{{/crossLink}}
 * 
 * @param {Any} subject
 * @return {Animator|false}
 * @method anim8
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
 * @return {Animators}
 * @method anim8s
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
 * The default values for anim8js properties.
 *
 * @property {Object} anim8.defaults
 */
anim8.defaults = 
{

  /**
   * The default animation duration in milliseconds.
   *
   * @property {Number} duration
   * @for anim8.defaults
   * @default 1000
   */
  duration: 1000,

  /**
   * The default easing.
   * 
   * @property {String|Function|Array} easing
   * @for anim8.defaults
   * @default 'ease'
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   * 
   * @property {String|Function|Array} teasing
   * @for anim8.defaults
   * @default 'linear'
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   * 
   * @property {Number} delay
   * @for anim8.defaults
   * @default 0
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   * 
   * @property {Number} sleep
   * @for anim8.defaults
   * @default 0
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   * 
   * @property {Number} repeat
   * @for anim8.defaults
   * @default 1
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
   * The default animation offset in milliseconds.
   *
   * @property {Number} offset
   * @for anim8.defaults
   * @default 0
   */
  offset: 0,

  /**
   * The default transition time in milliseconds.
   * 
   * @property {Number} transitionTime
   * @for anim8.defaults
   * @default 500
   */
  transitionTime: 500,

  /**
   * The default transition outroduction time in milliseconds.
   * 
   * @property {Number} transitionOutro
   * @for anim8.defaults
   * @default 100
   */
  transitionOutro: 100,

  /**
   * The default transition introduction time in milliseconds.
   * 
   * @property {Number} transitionIntro
   * @for anim8.defaults
   * @default 100
   */
  transitionIntro: 100,

  /**
   * The default transition easing when none is specified.
   * 
   * @property {String|Function|Array} transitionEasing
   * @for anim8.defaults
   * @default 'linear'
   */
  transitionEasing: 'linear',

  /**
   * The default transition granularity. This is used for smooth transitions to
   * provide a smooth transition from the outro velocity to the intro velocity,
   * the cubic or quadratic path between the two is a curve with unknown length
   * so the length needs to be calculated using a maximum number of points to
   * calculate along the path - summing the distances between the consecutive points.
   * 
   * @property {Number} transitionGranularity
   * @for anim8.defaults
   * @default 0
   */
  transitionGranularity: 0,

  /**
   * TODO
   * 
   * @property {Number} transitionLookup
   * @for anim8.defaults
   * @default 10
   */
  transitionLookup: 10,

  /**
   * Whether animtions are cached whenever possible. Animations that can be
   * cached are strings with options specified in the string and without an
   * option object given. For example 'tada ~1s 3s x3' is cacheable.
   * 
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}}
   * 
   * @property {Boolean} cache
   * @for anim8.defaults
   * @default false
   */
  cache: false,

  /**
   * Whether parsed options are cached whenever possible. Options that can be
   * cached must be strings.
   * 
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   * 
   * @property {Boolean} cacheOptions
   * @for anim8.defaults
   * @default false
   */
  cacheOptions: false,

  /**
   * Whether parsed transitions are cached whenever possible. Transitions that can be
   * cached must be strings.
   * 
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}}
   * 
   * @property {Boolean} cacheTransitions
   * @for anim8.defaults
   * @default false
   */
  cacheTransitions: false,

  /**
   * The value to return when options could not be parsed from input.
   * 
   * @property {Object} noOptions
   * @for anim8.defaults
   * @default {}
   */
  noOptions: {},

  /**
   * The value to return when a transition could not be parsed from input.
   * 
   * @property {Object} noTransition
   * @for anim8.defaults
   * @default {}
   */
  noTransition: {},

  /**
   * The target number of milliseconds between frames. This only applies if the
   * browser doesn't support any of the requestAnimationFrame variations.
   * 
   * @property {Number} frameRate
   * @for anim8.defaults
   * @default 33
   */
  frameRate: 16,

  /**
   * The number of milliseconds to pause between looping to let the UI react
   * to user events.
   *
   * @property {Number} pauseTime
   * @for anim8.defaults
   * @default 5
   */
  pauseTime: 5

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
 * **Examples:**
 *
 *     anim8.isDefined( 0 );     // true
 *     anim8.isDefined( false ); // true
 *     anim8.isDefined();        // false
 * 
 * @method anim8.isDefined
 * @param {Any} x
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
 * @param {Any} x
 * @return {Boolean}
 */
anim8.isFunction = function(x) 
{
  return !!(x && x.constructor && x.call && x.apply);
};

/**
 * Returns true if the given variable is a number.
 *
 * **Examples:**
 *
 *     anim8.isNumber( 0 );     // true
 *     anim8.isNumber( -45.6 ); // true
 *     anim8.isNumber( true );  // false
 *     anim8.isNumber( '1' );   // false
 *     anim8.isNumber();        // false
 *
 * @method anim8.isNumber
 * @param {Any} x
 * @return {Boolean}
 */
anim8.isNumber = function(x) 
{
  return typeof x === 'number';
};

/**
 * Returns true if the given variable is a boolean variable.
 *
 * **Examples:**
 *
 *     anim8.isBoolean( 0 );     // false
 *     anim8.isBoolean( -45.6 ); // false
 *     anim8.isBoolean( true );  // true
 *     anim8.isBoolean( false ); // true
 *     anim8.isBoolean( '1' );   // false
 *     anim8.isBoolean();        // false
 *
 * @method anim8.isBoolean
 * @param {Any} x
 * @return {Boolean}
 */
anim8.isBoolean = function(x) 
{
  return typeof x === 'boolean';
};

/**
 * Returns true if the given variable is a string.
 *
 * **Examples:**
 *
 *     anim8.isString( '' );    // true
 *     anim8.isString( '1' );   // true
 *     anim8.isString( 4.5 );   // false
 *     anim8.isString();        // false
 *
 * @method anim8.isString
 * @param {Any} x
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
 * **Examples:**
 *
 *     anim8.isArray( [] );     // true
 *     anim8.isArray( [4, 5] ); // true
 *     anim8.isArray( 4.5 );    // false
 *     anim8.isArray();         // false
 *
 * @method anim8.isArray
 * @param {Any} x
 * @return {Boolean}
 */
anim8.isArray = function(x) 
{
  return x instanceof Array;
};

/**
 * Returns true if the given variable is an object. Arrays are considered 
 * objects.
 *
 * **Examples:**
 *
 *     anim8.isObject( {} );     // true
 *     anim8.isObject( [] );     // true
 *     anim8.isObject( 4.5 );    // false
 *     anim8.isObject();         // false
 *     anim8.isObject( null );   // false
 *
 * @method anim8.isObject
 * @param {Any} x
 * @return {Boolean}
 */
anim8.isObject = function(x) 
{
  return typeof x === 'object' && x !== null;
};

/**
 * Returns true if the given variable is an HTML element.
 *
 * @method anim8.isElement
 * @param {Any} x
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
 * @method anim8.now
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
 * **Examples:**
 *
 *     anim8.trim( 'x' );     // 'x'
 *     anim8.trim( '   x' );  // 'x'
 *     anim8.trim( 'x   ' );  // 'x'
 *     anim8.trim( '  x ' );  // 'x'
 *     anim8.trim( '    ' );  // ''
 * 
 * @method anim8.trim
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
 * **Examples:**
 *
 *     anim8.isEmpty( '' );        // true
 *     anim8.isEmpty( 0 );         // true
 *     anim8.isEmpty( [] );        // true
 *     anim8.isEmpty( {} );        // true
 *     anim8.isEmpty( null );      // true
 *     anim8.isEmpty( true );      // true
 *     anim8.isEmpty( false );     // true
 *     anim8.isEmpty( 'x' );       // false
 *     anim8.isEmpty( 0.3 );       // false
 *     anim8.isEmpty( [0] );       // false
 *     anim8.isEmpty( {x:3} );     // false
 *
 * @method anim8.isEmpty
 * @param {Any} x
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
 * @method anim8.copy
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
 * @method anim8.extend
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
 * @method anim8.override
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
 * **Examples:**
 *
 *     anim8.coalesce( 1, 2, 3 );           // 1
 *     anim8.coalesce( undefined, 2, 3 );   // 2
 *     anim8.coalesce();                    // undefined
 * 
 * @method anim8.coalesce
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
 * **Examples:**
 *
 *     anim8.time( 45 );       // 45
 *     anim8.time( 45.9 );     // 45
 *     anim8.time( -4.1 );     // -5
 *     anim8.time( '5ms' );    // 5
 *     anim8.time( '23' );     // 23
 *     anim8.time( '5c' );     // 500
 *     anim8.time( '5cs' );    // 500
 *     anim8.time( '5jiffy' ); // 833
 *     anim8.time( '5third' ); // 833
 *     anim8.time( '10s' );    // 10000
 *     anim8.time( '10sec' );  // 10000
 *     anim8.time( '1.5m' );   // 90000
 *     anim8.time( '1.5min' ); // 90000
 *     anim8.time( '0.4h' );   // 144000
 *     anim8.time( '0.4hr' );  // 144000
 *
 * @method anim8.time
 * @param {String|Number} time
 * @param {Any} [returnOnInvalid]
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
 * Parses delay from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/delay:property"}}anim8.defaults.delay{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.delay
 * @param {String|Number} time
 */ 
anim8.delay = function(time)
{
  return anim8.time( time, anim8.defaults.delay );
};

/**
 * Parses sleep from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/sleep:property"}}anim8.defaults.sleep{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.sleep
 * @param {String|Number} time
 */ 
anim8.sleep = function(time)
{
  return anim8.time( time, anim8.defaults.sleep );
};

/**
 * Parses duration from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/duration:property"}}anim8.defaults.duration{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 * 
 * @method anim8.duration
 * @param {String|Number} time
 */ 
anim8.duration = function(time)
{
  return anim8.time( time, anim8.defaults.duration );
};

/**
 * Parses offset from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/offset:property"}}anim8.defaults.offset{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 * 
 * @method anim8.offset
 * @param {String|Number} time
 */ 
anim8.offset = function(time)
{
  return anim8.time( time, anim8.defaults.offset );
};

/**
 * Parses repeats from a string or number. If a valid repeat is not given then
 * `returnOnInvalid` is returned, if that is not given then
 * {{#crossLink "anim8.defaults/repeat:property"}}anim8.defaults.repeat{{/crossLink}}
 * is returned.
 *
 * **Examples:**
 *
 *     anim8.repeat( 5 );            // 5
 *     anim8.repeat( 'inf' );        // Infinity
 *     anim8.repeat( 'infinity' );   // Infinity
 *     anim8.repeat( 'infinite' );   // Infinity
 *     anim8.repeat( 'once' );       // 1
 *     anim8.repeat( 'twice' );      // 2
 *     anim8.repeat( 'thrice' );     // 3
 *     anim8.repeat( 'dozen' );      // 12
 *     anim8.repeat( 'random' );     // 4
 *     anim8.repeat( 'invalid', 6 ); // 6
 *     anim8.repeat( false, 7 );     // 7
 *     anim8.repeat();               // anim8.defaults.repeat
 *
 * @method anim8.repeat
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
 * **Examples:**
 *
 *     anim8.number( 5 );       // 5
 *     anim8.number( '5' );     // 5
 *     anim8.number( '5e4' );   // 50000
 *     anim8.number( 'x' );     // undefined
 *     anim8.number( 'x', 23 ); // 23
 * 
 * @method anim8.number
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
 * **See:** {{#crossLink "Core/anim8.number:method"}}anim8.number{{/crossLink}}
 * 
 * @method anim8.scale
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
 * **Examples:**
 *
 *     anim8.constant( 5 );   // function() { return 5; }
 *
 * @method anim8.constant
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
 * **Examples:**
 *
 *     anim8.resolve( 5 );                     // 5
 *     anim8.resolve( true );                  // true
 *     anim8.resolve( function(){return 7;} ); // 7
 * 
 * @method anim8.resolve
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
 * **Examples:**
 *
 *     anim8.clamp( 5, 1, 6 );   // 5
 *     anim8.clamp( 0, 1, 6 );   // 1
 *     anim8.clamp( 7, 1, 6 );   // 6
 * 
 * @method anim8.clamp
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
 * @method anim8.delegate
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
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++) 
      {
        array[i][functionName].apply( array[i], arguments );
      }
      
      return this;  
    };
    
  case anim8.delegate.RETURN_RESULTS:
    return function() 
    {
      var array = this.$ || this;
      var results = [];
    
      for (var i = 0; i < array.length; i++)
      {
        results.push( array[i][functionName].apply( array[i], arguments ) );
      }
    
      return results;
    };
    
  case anim8.delegate.RETURN_FIRST:
    return function()
    {
      var array = this.$ || this;

      return array.length === 0 ? undefined : array[0][functionName].apply( array[0], arguments );
    };

  case anim8.delegate.RETURN_TRUE:
    return function()
    {
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++)
      {
        if ( array[i][functionName].apply( array[i], arguments ) )
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
 * The following methods will be added to the given target:
 *
 *     target.on( events, callback, [context] )
 *     target.once( events, callback, [context] )
 *     target.off( events, callback )
 *     target.trigger( event, [argument] )
 *
 * Where... 
 * - `events` is a string of space delimited events.
 * - `callback` is a function to invoke when the event is triggered.
 * - `context` is an object that should be the `this` when the callback is 
 *   invoked. If no context is given the default value is the object which has 
 *   the trigger function that was invoked.
 *
 * @method anim8.eventize
 * @for Core
 * @param {Object} target The object to add `on`, `once`, `off`, and `trigger` 
 *    functions to.
 */
anim8.eventize = function(target)
{
  /**
   * **See:** {{#crossLink "Core/anim8.eventize:method"}}{{/crossLink}}
   * 
   * @class anim8.eventize
   */

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
  target.on = function(events, callback, context)
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
  target.once = function(events, callback, context)
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

  // Deletes a property from the given object if it exists
  var deleteProperty = function(obj, prop)
  {
    if ( obj && prop in obj )
    {
      delete obj[ prop ];
    }
  };
  
  /**
   * Stops listening for a given callback for a given set of events.
   *
   * @method off
   * @for anim8.eventize
   * @param {String} [events]
   * @param {Function} [callback]
   * @chainable
   */
  target.off = function(events, callback)
  {
    // Remove ALL listeners
    if ( !anim8.isString( events ) )
    {
      deleteProperty( this, '$on' );
      deleteProperty( this, '$once' );
    }
    else
    {
      events = events.split(' ');

      // Remove listeners for given events
      if ( !anim8.isFunction( callback ) )
      {
        for (var i = 0; i < events.length; i++)
        {
          deleteProperty( this.$on, events[i] );
          deleteProperty( this.$once, events[i] );
        }
      }
      // Remove specific listener
      else
      {
        for (var i = 0; i < events.length; i++)
        {
          offListeners( this.$on, events[i], callback );
          offListeners( this.$once, events[i], callback );
        }
      }
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
   * @param {Any} argument
   * @chainable
   */
  target.trigger = function(event, argument)
  {
    triggerListeners( this.$on, event, argument, false );
    triggerListeners( this.$once, event, argument, true );

    return this;
  };
};

