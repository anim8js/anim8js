/* anim8js 1.0.5 - anim8js - Anim8 Everything by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define('anim8', [], function() { // jshint ignore:line
      return factory(root);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(global);  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    root.m8 = root.anim8 = factory(root);
    root.m8s = root.anim8s = root.anim8.anim8s;
  }
}(this, function(global)
{


var Class =
{
  superPrefix: '_',

  extend: function(construct, parentConstructor, properties)
  {
    function F() {}

    F.prototype = parentConstructor.prototype;

    construct.prototype = new F();

    if ( isObject( properties ) )
    {
      this.define( construct, properties );
    }
  },

  define: function(construct, properties)
  {
    var target = construct.prototype;

    for (var prop in properties)
    {
      if ( prop in target )
      {
        this.defineProperty( target, this.superPrefix + prop, target[ prop ] );
      }

      this.defineProperty( target, prop, properties[ prop ] );
    }
  },

  defineProperty: function(target, property, value)
  {
    if ( Object.defineProperty )
    {
      Object.defineProperty( target, property, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: value
      });
    }
    else
    {
      target[ property ] = value;
    }
  }
};



/**
 * The default values for anim8js properties.
 *
 * @property {Object} anim8.Defaults
 */
var Defaults =
{

  /**
   * The default animation duration in milliseconds.
   *
   * @property {Number} duration
   * @for anim8.Defaults
   * @default 1000
   */
  duration: 1000,

  /**
   * The default easing.
   *
   * @property {String|Function|Array} easing
   * @for anim8.Defaults
   * @default 'ease'
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   *
   * @property {String|Function|Array} teasing
   * @for anim8.Defaults
   * @default 'linear'
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   *
   * @property {Number} delay
   * @for anim8.Defaults
   * @default 0
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   *
   * @property {Number} sleep
   * @for anim8.Defaults
   * @default 0
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   *
   * @property {Number} repeat
   * @for anim8.Defaults
   * @default 1
   */
  repeat: 1,

  /**
   * The default scale for an animation.
   *
   * @property scale
   * @for anim8.Defaults
   * @default 1.0
   * @type {Number}
   */
  scale: 1.0,

  /**
   * The default animation offset in milliseconds.
   *
   * @property {Number} offset
   * @for anim8.Defaults
   * @default 0
   */
  offset: 0,

  /**
   * The default transition time in milliseconds.
   *
   * @property {Number} transitionTime
   * @for anim8.Defaults
   * @default 500
   */
  transitionTime: 500,

  /**
   * The default transition outroduction time in milliseconds.
   *
   * @property {Number} transitionOutro
   * @for anim8.Defaults
   * @default 100
   */
  transitionOutro: 100,

  /**
   * The default transition introduction time in milliseconds.
   *
   * @property {Number} transitionIntro
   * @for anim8.Defaults
   * @default 100
   */
  transitionIntro: 100,

  /**
   * The default transition easing when none is specified.
   *
   * @property {String|Function|Array} transitionEasing
   * @for anim8.Defaults
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
   * @for anim8.Defaults
   * @default 0
   */
  transitionGranularity: 0,

  /**
   * TODO
   *
   * @property {Number} transitionLookup
   * @for anim8.Defaults
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
   * @for anim8.Defaults
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
   * @for anim8.Defaults
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
   * @for anim8.Defaults
   * @default false
   */
  cacheTransitions: false,

  /**
   * The value to return when options could not be parsed from input.
   *
   * @property {Object} noOptions
   * @for anim8.Defaults
   * @default {}
   */
  noOptions: {},

  /**
   * The value to return when a transition could not be parsed from input.
   *
   * @property {Object} noTransition
   * @for anim8.Defaults
   * @default {}
   */
  noTransition: {},

  /**
   * The target number of milliseconds between frames. This only applies if the
   * browser doesn't support any of the requestAnimationFrame variations.
   *
   * @property {Number} frameRate
   * @for anim8.Defaults
   * @default 33
   */
  frameRate: 16,

  /**
   * The number of milliseconds to pause between looping to let the UI react
   * to user events.
   *
   * @property {Number} pauseTime
   * @for anim8.Defaults
   * @default 5
   */
  pauseTime: 5,

  /**
   * The granularity for uniform combo paths used to calculate path lengths.
   *
   * @property {Number} comboPathUniformGranularity
   * @for anim8.Defaults
   * @default 100
   */

  comboPathUniformGranularity: 100

};


var DelegateTypes =
{

  /**
   * this is returned at the end.
   *
   * @property THIS
   * @for DelegateTypes
   */
  THIS: 'this',

  /**
   * An array of results for each method call is returned.
   *
   * @property RESULTS
   * @for DelegateTypes
   */
  RESULTS: 'results',

  /**
   * The result of the first element.
   *
   * @property RETURN_FIRST
   * @for delegate
   */
  FIRST: 'first',

  /**
   * True if any of the methods return true, otherwise false.
   *
   * @property RETURN_TRUE
   * @for delegate
   */
  TRUE: 'true'

};



/**
 * @class Core
 */

/**
 * A function that does nothing.
 *
 * @property anim8.noop
 */
function noop() {}

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
function isDefined(x)
{
  return typeof x !== 'undefined';
}

/**
 * Returns true if the given variable is a function.
 *
 * @method anim8.isFunction
 * @param {Any} x
 * @return {Boolean}
 */
function isFunction(x)
{
  return !!(x && x.constructor && x.call && x.apply);
}

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
function isNumber(x)
{
  return typeof x === 'number';
}

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
function isBoolean(x)
{
  return typeof x === 'boolean';
}

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
function isString(x)
{
  return typeof x === 'string';
}

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
function isArray(x)
{
  return x instanceof Array;
}

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
function isObject(x)
{
  return typeof x === 'object' && x !== null;
}

/**
 * Returns the current time in milliseconds.
 *
 * @method anim8.now
 * @return {Number}
 */
var now = (function()
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
var trim = (function()
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
function isEmpty(x)
{
  if ( isArray( x ) || isString( x ) )
  {
    return x.length > 0;
  }
  else if ( x === null )
  {
    return true;
  }
  else if ( isObject( x ) )
  {
    for (var prop in x)
    {
      return false;
    }
  }
  else if ( isNumber( x ) )
  {
    return x !== 0.0;
  }

  return true;
}

/**
 * Parses the given input and returns an array.
 *
 * **Examples:**
 *
 *     anim8.toArray();            // []
 *     anim8.toArray('a b');       // ['a b']
 *     anim8.toArray('a b', ' ');  // ['a', 'b']
 *     anim8.toArray({a:0,b:0});   // ['a', 'b']
 *     anim8.toArray(['a', 'b']);  // ['a', 'b']
 *     anim8.toArray(3.2);         // [3.2]
 *     anim8.toArray(true);        // [true]
 *
 * @param  {Any} x
 * @param  {String} [split]
 * @return {Array}
 */
function toArray( x, split )
{
  if ( isString( x ) )
  {
    return split ? x.split( split ) : [ x ];
  }
  else if ( isArray ( x ) )
  {
    return x;
  }
  else if ( isObject( x ) )
  {
    var props = [];

    for ( var prop in x )
    {
      props.push( prop );
    }

    return props;
  }
  else if ( isDefined( x ) )
  {
    return [ x ];
  }

  return [];
}

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
function copy(x)
{
  if ( isArray(x) )
  {
    var copied = [];

    for (var i = 0; i < x.length; i++)
    {
      copied.push( copy( x[i] ) );
    }

    x = copied;
  }
  else if ( isObject(x) )
  {
    var copied = {};

    for (var p in x)
    {
      copied[p] = copy( x[p] );
    }

    x = copied;
  }

  return x;
}

/**
 * Extends the given object by merging the following objects into it, avoiding
 * overriding any existing properties.
 *
 * @method anim8.extend
 * @param  {Object} out
 * @return {Object}
 */
function extend(out)
{
  for (var i = 1; i < arguments.length; i++)
  {
    var o = arguments[ i ];

    if ( isObject( o ) )
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
}

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
function coalesce(a, b, c, d)
{
  if (isDefined(a)) {
    return a;
  }
  if (isDefined(b)) {
    return b;
  }
  if (isDefined(c)) {
    return c;
  }
  return d;
}

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
function constant(variable)
{
  return function()
  {
    return variable;
  };
}

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
function resolve(variable)
{
  return isFunction( variable ) ? variable() : variable;
}

/**
 * Returns a "unique" identifier.
 *
 * @method id
 * @return {Number}
 */
var id = (function()
{
  var _id = 0;
  return function() {
    return ++_id;
  };

})();


/**
 * Instantiates a new Animation given it's name, the input & options passed, and
 * the attrimators that were generated from the input & options. If the name is
 * false this is an anonymous animation. Input & Options are used by builders to
 * generate attrimators, options allow for an animations default properties to
 * be overriden.
 *
 * @param {String|Boolean} name
 * @param {Object} input
 * @param {Object} options
 * @param {AttrimatorMap} attrimators
 * @class Animation
 * @constructor
 */
function Animation(name, input, options, attrimators)
{
  /**
   * The name of the animation, or false if it's an anonymous animation.
   *
   * @property {String|False} name
   */
  this.name = name;

  /**
   * The object which created the animation.
   *
   * @property {Object} input
   */
  this.input = input;

  /**
   * The options given when the animation was created.
   *
   * @property {Object} [options]
   */
  this.options = options;

  /**
   * The name of the animation, or false if it's an anonymous animation.
   *
   * @property {AttrimatorMap} name
   */
  this.attrimators = attrimators;
}

Class.define( Animation,
{

  /**
   * Generates an map of event instances from the attrimators in this animation.
   *
   * @method newAttrimators
   * @return {AttrimatorMap}
   */
  newAttrimators: function()
  {
    return this.attrimators.clone();
  },

  /**
   * Merges options with the options in this animation and places them in the
   * events.
   *
   * @method merge
   * @param {Object} [options]
   * @param {AttrimatorMap} attrimatorMap
   * @return {AttrimatorMap}
   */
  merge: function(options, attrimatorMap)
  {
    var helper = new BuilderHelper( this.input, this.options, options );

    for (var builderName in this.input)
    {
      var builder = $builder( builderName );

      if ( builder !== false && builder.merge )
      {
        builder.merge( this.input, options, this.options, attrimatorMap, helper );
      }
    }

    return attrimatorMap;
  }

});


/**
 * Instantiates a new Animator given a subject to animate.
 *
 * @param {Any} e
 * @class Animator
 * @constructor
 * @extends anim8.eventize
 */
function Animator(e)
{
  this.reset( e );
}

/**
 * The event triggered after preupdate is called. Pre-update is used to run any
 * preparations on the subject before updates are made and attributes are
 * applied.
 *
 * @event preupdate
 */

/**
 * The event triggered after all attrimators are updated and any new values
 * have been applied to the current values (frame) on the animator.
 *
 * @event update
 */

/**
 * The event triggered after the current values (frame) on the animator are
 * applied to the subject.
 *
 * @event apply
 */

/**
 * The event triggered when the given animation cycle starts (and initial
 * values are applied) for all attrimators in the cycle.
 *
 * @event cycleStart:#
 * @param {Number} cycleID
 */

/**
 * The event triggered when the given animation cycle ends which occurs when the
 * last attrimator for an animation finishes or is interrupted by commands like
 * play, queue, transition, end, finish, & stop.
 *
 * @event cycleEnd:#
 * @param {Number} cycleID
 */

/**
 * The event triggered when all animations on the animator have finished.
 *
 * @event finished
 * @param {Animator} animator
 */

/**
 * The event triggered when an animator is deactivated which occurs when an
 * animator has finished animating and is being taken off the list of live
 * animators (anim8.animating).
 *
 * @event deactivate
 */

/**
 * The event triggered after the user calls destroy on an animator.
 *
 * @event destroyed
 */

Class.define( Animator,
{

  /**
   * Resets the animator given a subject to animate.
   *
   * @method reset
   * @param {Any} subject
   * @chainable
   * @protected
   */
  reset: function(subject)
  {
    /**
     * The subject which is being animated.
     *
     * @property {Any} subject
     */
    this.subject = subject;

    /**
     * The map of attrimators animating the subject.
     *
     * @property {AttrimatorMap} attrimators
     */
    this.attrimators = new AttrimatorMap();

    /**
     * The array of attrimators recently added to the animator that
     * are ready to be started.
     *
     * @property {Array} attrimatorsAdded
     * @protected
     */
    this.attrimatorsAdded = [];

    /**
     * The object which stores the attribute values being animated.
     *
     * @property {Object} frame
     */
    this.frame = {};

    /**
     * The object which stores the attributes last updated.
     *
     * @property {Object} updated
     */
    this.updated = {};

    /**
     * Whether or not this animator has completely finished animating it's subject.
     *
     * @property {Boolean} finished
     */
    this.finished = false;

    /**
     * The factory which created this Animator given a subject.
     *
     * @property {Factory} factory
     */
    this.factory = null;

    /**
     * Whether or not this animator is actively being updated.
     *
     * @property {Boolean} active
     */
    this.active = false;

    /**
     * The current cycle being animated. Multiple cycles can be animated at once, this is the first one.
     *
     * @property {Number} cycleCurrent
     * @protected
     */
    this.cycleCurrent = 0;

    /**
     * The ID of the next cycle of animations to be added to this Animator.
     *
     * @property {Number} cycleNext
     * @protected
     */
    this.cycleNext = 0;

    /**
     * The last cycle that was ended.
     *
     * @property {Number} cycleEnded
     * @protected
     */
    this.cycleEnded = 0;

    return this;
  },

  /**
   * Starts a new animation cycle. This is done before events & springs are
   * placed to group them together so we know when to apply their initial value.
   *
   * @method newCycle
   * @param {Attrimator|AttrimatorMap} attrimators
   * @chainable
   * @protected
   */
  newCycle: function(attrimators)
  {
    this.cycleNext++;

    if ( attrimators instanceof AttrimatorMap )
    {
      this.cycleNext = attrimators.applyCycle( this.cycleNext );
    }
    else if ( attrimators instanceof Attrimator )
    {
      attrimators.cycle = this.cycleNext;
    }

    return this;
  },

  /**
   * Applies the current cycle. This involves finding all attrimators with the
   * same cycle identifier and applying their initial state.
   *
   * @method applyCurrentCycle
   * @chainable
   * @protected
   */
  applyCurrentCycle: function()
  {
    var cycle = this.cycleCurrent;
    var attrimators = this.attrimators.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      if ( attrimator.cycle === cycle )
      {
        this.updated[ attr ] = (attrimator.startCycle( this.frame ) !== false) || this.updated[ attr ];
      }
    }

    return this;
  },

  /**
   * Ends the current cycle which calls any listening functions.
   *
   * @method endCurrentCycle
   * @chainable
   * @protected
   */
  endCurrentCycle: function()
  {
    if ( this.cycleCurrent > this.cycleEnded )
    {
      this.cycleEnded = this.cycleCurrent;
      this.trigger( 'cycleEnd:' + this.cycleCurrent, this.cycleCurrent );
    }
  },

  /**
   * Returns the attribute descriptor given the name of the attribute.
   *
   * @method getAttribute
   * @param  {String} attr
   * @return {Object}
   */
  getAttribute: function(attr)
  {
    return this.factory.attribute( attr );
  },

  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   *
   * @method restore
   * @chainable
   */
  restore: function()
  {
    return this;
  },

  /**
   * Applies the initial state of recently added attrimators immediately.
   *
   * @method applyInitialState
   * @chainable
   */
  applyInitialState: function()
  {
    var currentTime = now();

    this.preupdate( currentTime );
    this.update( currentTime );
    this.apply();

    return this;
  },

  /**
   * A method thats invoked along with all other animators before updates are
   * called. This is used to make any necessary preparations before the animator
   * is updated.
   *
   * @method preupdate
   * @param {Number} now
   * @chainable
   */
  preupdate: function(now)
  {
    // If there are attribute placed on the animator since the last preupdate
    // that has computed values we need to replace the path on the event with
    // a copy containing the computed values. This is where current value &
    // relative values are injected from the animator into the attribute.
    var aa = this.attrimatorsAdded;
    if ( aa.length )
    {
      for (var i = 0; i < aa.length; i++)
      {
        var attrimator = aa[ i ];
        var attr = attrimator.attribute;

        if ( attr in this.subject )
        {
          this.frame[ attr ] = this.subject[ attr ];
        }
        else
        {
          this.setDefault( attr );
        }

        attrimator.start( now, this );
      }

      aa.length = 0;
    }

    this.trigger('preupdate');

    return this;
  },

  /**
   * Sets the default value for the given attribute in the frame of this
   * Animator if there's no value there.
   *
   * @method setDefault
   * @param {String} attr
   * @protected
   */
  setDefault: function(attr)
  {
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = this.getAttribute( attr ).cloneDefault();
    }
  },

  /**
   * Updates all attrimators in this animator with the given time.
   *
   * @method update
   * @param {Number} now
   * @chainable
   */
  update: function(now)
  {
    this.wasFinished = this.finished;
    this.finished = true;

    var attrimators = this.attrimators.values;
    var minCycle = this.cycleNext;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      this.updated[ attr ] = attrimator.setTime( now, this.frame );

      this.finished = this.finished && attrimator.isFinished();

      minCycle = Math.min( minCycle, attrimator.cycle );
    }

    if ( this.cycleCurrent < minCycle )
    {
      while ( this.cycleCurrent < minCycle )
      {
        this.endCurrentCycle();
        this.cycleCurrent++;
      }

      this.cycleCurrent = minCycle;
      this.applyCurrentCycle();
      this.trigger( 'cycleStart:' + this.cycleCurrent, this.cycleCurrent );
    }

    if ( !this.wasFinished && this.finished )
    {
      this.endCurrentCycle();
    }

    this.trigger('update');

    return this;
  },

  /**
   * Places the attribute animator in this animator replacing any existing
   * animator for the same attribute. The next time the animator is updated the
   * attribute animator will be started. The previous (if any) attrimator is
   * returned.
   *
   * @method placeAttrimator
   * @param {Attrimator} attrimator
   * @return {Attrimator}
   */
  placeAttrimator: function(attrimator)
  {
    var attr = attrimator.attribute;
    var existing = this.attrimators.get( attr );

    this.attrimators.put( attr, attrimator );
    this.attrimatorsAdded.push( attrimator );

    this.finished = false;

    return existing;
  },

  /**
   * Applies all updated attributes to the subject. This method is invoked with
   * all of the other animators at the end of the animation cycle.
   *
   * @method apply
   * @chainable
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

    this.trimAttrimators();

    return this;
  },

  /**
   * Removes any finished attrimators and places any queued attrimators. If the
   * animator previously wasn't finished but now is the 'finished' event will
   * be triggered.
   *
   * @method trimAttrimators
   * @chainable
   * @protected
   */
  trimAttrimators: function()
  {
    var attrimators = this.attrimators.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( attrimator.isFinished() )
      {
        if ( attrimator.next )
        {
          this.placeAttrimator( attrimator.next );
        }
        else
        {
          this.attrimators.removeAt( i );
        }
      }
    }

    if ( !this.wasFinished && this.finished )
    {
      this.trigger( 'finished', this );
    }

    return this;
  },

  /**
   * Returns the current value for the given attribute (or undefined if the
   * attribute is not or has not animated).
   *
   * @method value
   * @param {String} attr
   * @return {Any}
   */
  value: function(attr)
  {
    return this.frame[ attr ];
  },

  /**
   * Activates this Animator by adding it to the main loop if it isn't there
   * already.
   *
   * @method activate
   * @chainable
   */
  activate: function()
  {
    activateAnimator( this );

    return this;
  },

  /**
   * A method that is invoked when an animator is finished and is being removed
   * from the list of currently animating Animators.
   *
   * @method deactivate
   * @chainable
   */
  deactivate: function()
  {
    this.trigger('deactivate', this);

    return this;
  },

  /**
   * A method that can be invoked to destroy an animator - removing any
   * relationship between the subject and animator. The next time an animator is
   * generated for the subject a new animator will be created.
   *
   * @method destroy
   * @chainable
   */
  destroy: function()
  {
    this.finished = true;

    this.factory.destroy( this );

    this.trigger('destroyed');

    return this;
  },

  /**
   * Adds a spring to this animator replacing any existing attrimator for the
   * same attribute. A spring object can be given, an instance of anim8.Spring,
   * or a name of a saved Spring. The spring added to the animator is returned.
   *
   * @method spring
   * @param {Spring|String|Object} spring
   * @return {Spring}
   */
  spring: function(spring)
  {
    var spring = $spring( spring );

    if ( spring === false )
    {
      return false;
    }

    this.newCycle( spring );
    this.placeAttrimator( spring );

    this.activate();

    return spring;
  },

  /**
   * Plays an animation. Attributes in the animation that are currently being
   * animated will be stopped and replaced with the new attrimators. If `all` is
   * true then any attrimators animating not specified in the given animation
   * will be stopped.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method play
   * @param {Animation|String|Object} animation
   * @param {String|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  play: function(animation, options, all, cache)
  {
    var attrimatorMap = $attrimatorsFor( animation, options, cache );

    this.newCycle( attrimatorMap );
    this.playAttrimators( attrimatorMap, all );

    return this.activate();
  },

  /**
   * Plays a map of attrimators. Attributes in the attrimator map that are
   * currently being animated will be stopped and replaced with the new
   * attrimators. If "all" is true then any attrimators animating not specified
   * in the given attrimator map will be stopped. This method will not activate
   * the Animator, that has to be done manually.
   *
   * @method playAttrimators
   * @param {AttrimatorMap} animatorMap
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  playAttrimators: function(attrimatorMap, all)
  {
    if ( all )
    {
      this.attrimators.finishNotPresent( attrimatorMap, 0 );
    }

    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      this.placeAttrimator( attrimators[i] );
    }

    return this;
  },

  /**
   * Unplays an animation. Attributes in the animation that are currently being
   * animated will be transitioned to their starting values. If `all` is true
   * then any attrimators animating not specified in the given animation will be
   * stopped.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method unplay
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} transition
   * @param {String|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  unplay: function(animation, transition, options, all, cache)
  {
    var transition = $transition( transition );
    var attrimatorMap = $attrimatorsFor( animation, options, cache );

    this.unplayAttrimators( attrimatorMap, transition, all );

    return this.activate();
  },

  /**
   * Unplays a map of attrimators. Attributes in the attrimator map that are
   * currently being animated will be transitioned to their starting values.
   * If "all" is true then any attrimators animating not specified
   * in the given attrimator map will be stopped. This method will not activate
   * the Animator, that has to be done manually.
   *
   * @method unplayAttrimators
   * @param {AttrimatorMap} attrimatorMap
   * @param {Object} transition
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  unplayAttrimators: function(attrimatorMap, transition, all)
  {
    var unplayAttrimators = new AttrimatorMap();
    var attrimators = attrimatorMap.values;
    var startings = {};

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      if ( attrimator.startCycle( startings ) )
      {
        unplayAttrimators.put( attr, new Oncer( attr, startings[ attr ], 0, true ) );
      }
    }

    this.newCycle( unplayAttrimators );
    this.transitionAttrimators( transition, unplayAttrimators, all );

    return this;
  },

  /**
   * Queues an animation. The attrimators generated from the given animation
   * will be started at the same time - as soon as all finite attrimators for
   * the same attributes are finished. Any infinite attrimators will be
   * automatically stopped when all queued attrimators are set to start.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method queue
   * @param {Animation|String|Object} animation
   * @param {String|Object} [options]
   * @param {Boolean} [cache]
   * @chainable
   */
  queue: function(animation, options, cache)
  {
    var attrimatorMap = $attrimatorsFor( animation, options, cache );

    this.newCycle( attrimatorMap );
    this.queueAttrimators( attrimatorMap );

    return this.activate();
  },

  /**
   * Queues a map of attrimators. The map of attrimators will be started at the
   * same time - as soon as all finished attrimators for the same attribute are
   * finished. Any infinite attrimators will be automatically stopped when all
   * queued attrimators are set to start.
   *
   * @method queueAttrimators
   * @param {AttrimatorMap} attrimatorMap
   * @chainable
   * @protected
   */
  queueAttrimators: function(attrimatorMap)
  {
    this.attrimators.queueMap( attrimatorMap, 0, this.placeAttrimator, this );

    return this;
  },

  /**
   * Transitions from the currently playing attrimators into the beginning of a
   * new animation. Several parameters can be specified in the transition object
   * which determine how the transition is made. If "all" is true then any
   * attrimators animating not specified in the given animation will be stopped.
   *
   * time: the total time to take to transition into a new animation.
   * outro: time to look into the future for the current attrimator to curve to.
   * intro: time to look into the future for the next attrimator to curve into.
   * lookup: time to look into the future to calculate velocity which is used
   *   for negative intros and maintaing consistent exit & entrance velocity.
   * granularity: when greater than 2 it activates smooth transitions where the
   *    velocity of the new & old attrimators is maintained over the transition.
   *
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method transition
   * @param {String|Array|Object} transition
   * @param {String|Object|Animation} animation
   * @param {Object} [options]
   * @param {Boolean} [all]
   * @param {Boolean} [cache]
   * @chainable
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = $transition( transition );
    var attrimatorMap = $attrimatorsFor( animation, options, cache );

    this.newCycle( attrimatorMap );
    this.transitionAttrimators( transition, attrimatorMap, all );

    return this.activate();
  },

  /**
   * Transitions from the currently playing attrimators into the beginning of a
   * new animation. Several parameters can be specified in the transition object
   * which determine how the transition is made. If "all" is true then any
   * attrimators animating not specified in the given attrimator map will be
   * stopped.
   *
   * time: the total time to take to transition into a new animation.
   * outro: time to look into the future for the current attrimator to curve to.
   * intro: time to look into the future for the next attrimator to curve into.
   * lookup: time to look into the future to calculate velocity which is used
   *   for negative intros and maintaing consistent exit & entrance velocity.
   * granularity: when greater than 2 it activates smooth transitions where the
   *    velocity of the new & old attrimators is maintained over the transition.
   *
   * @method transitionAttrimators
   * @param {Object} transition
   * @param {AttrimatorMap} attrimatorMap
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  transitionAttrimators: function(transition, attrimatorMap, all)
  {
    if ( all )
    {
      this.attrimators.finishNotPresent( attrimatorMap, transition.time );
    }

    this.attrimators.transitionMap(
      transition,
      attrimatorMap,
      this.transitionGetValue,
      this.getAttribute,
      this.placeAttrimator,
      this.transitionGetValueAt,
      this.transitionStopAttrimator,
      this
    );

    return this;
  },

  transitionGetValue: function(attr)
  {
    return this.frame[ attr ];
  },

  transitionGetValueAt: function(attrimator, relativeTime, out)
  {
    return attrimator.valueAt( attrimator.getElapsed() + relativeTime, out );
  },

  transitionStopAttrimator: function(attrimator, relativeTime)
  {
    attrimator.stopIn( relativeTime );
  },

  /**
   * Tweens a single attribute to a target value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenTo
   * @param {String} attr
   * @param {T} target
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenTo: function(attr, target, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var end       = attribute.parse( target );
    var path      = new Tween( attr, attribute.calculator, computed.current, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes to target values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyTo
   * @param {Object} targets
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenManyTo: function(targets, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in targets )
    {
      var attribute = this.getAttribute( attr );
      var end       = attribute.parse( targets[ attr ] );
      var path      = new Tween( attr, attribute.calculator, computed.current, end );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Tweens a single attribute from a starting value to the current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenFrom
   * @param {String} attr
   * @param {T} starting
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenFrom: function(attr, starting, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starting );
    var path      = new Tween( attr, attribute.calculator, start, computed.current );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes from starting values to the current values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyFrom
   * @param {Object} startings
   * @param {String|Array|Object} [options]
   * @chainable
   */
  tweenManyFrom: function(startings, options)
  {
    var options = $options( options );

    this.newCycle();

    for ( var attr in startings )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( startings[ attr ] );
      var path      = new Tween( attr, attribute.calculator, start, computed.current );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tween
   * @param {String} attr
   * @param {T} starts
   * @param {T} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tween: function(attr, starts, ends, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starts );
    var end       = attribute.parse( ends );
    var path      = new Tween( attr, attribute.calculator, start, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes from starting values to ending values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenMany
   * @param {Object} starts
   * @param {Object} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenMany: function(starts, ends, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in starts )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( starts[ attr ] );
      var end       = attribute.parse( ends[ attr ] );
      var path      = new Tween( attr, attribute.calculator, start, end );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Moves an attribute relative to its current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method move
   * @param {String} attr
   * @param {T} amount
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  move: function(attr, amount, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var relative  = attribute.parse( amount );
    var start     = computed.current;
    var end       = isComputed( relative ) ? relative : computed.relative( relative );
    var path      = new Tween( attr, attribute.calculator, start, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Moves multiple attribute relative to their current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method moveMany
   * @param {Object} amounts
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  moveMany: function(amounts, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in amounts )
    {
      var attribute = this.getAttribute( attr );
      var relative  = attribute.parse( amounts[ attr ] );
      var start     = computed.current;
      var end       = isComputed( relative ) ? relative : computed.relative( relative );
      var path      = new Tween( attr, attribute.calculator, start, end );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Returns a function that returns the current value for the given attribute
   * when invoked. The returned function can be given as values for paths &
   * springs that are evaluated every frame.
   *
   * @method ref
   * @param {String} attr
   * @return {Function}
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

      if ( isDefined( current[ attr ] ) )
      {
        return current[ attr ];
      }

      return attribute.defaultValue;
    };
  },

  /**
   * Follows the attribute along the given path definition.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method follow
   * @param {String} attr
   * @param {Path|Object|String} path
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  follow: function(attr, path, options, cache)
  {
    var options = $options( options, cache );
    var path    = $path( path );
    var event   = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Helper method that iterates over given attributes. If callback is specified
   * it is invoked for each attrimator in this animator for the given
   * attributes. If no callback is given an array of anim8.Attrimators is
   * returned for each attrimator in this animator for the given attributes.
   *
   * @method attrimatorsFor
   * @param {String|Array|Object} attributes
   * @param {Function} callback
   * @return {this|Array}
   */
  attrimatorsFor: function(attributes, callback)
  {
    var attrimatorMap = this.attrimators;
    var attributes = toArray( coalesce( attributes, attrimatorMap.keys ), ' ' );
    var resulting = !isFunction( callback );
    var results = [];

    for (var i = attributes.length - 1; i >= 0; i--)
    {
      var attr = attributes[ i ];
      var attrimator = attrimatorMap.get( attr );

      if ( attrimator )
      {
        if ( resulting )
        {
          results.push( attrimator );
        }
        else
        {
          callback.call( this, attrimator, attr );
        }
      }
    }

    return resulting ? results : this;
  },

  /**
   * Stops all attributes for the specified attributes. Attribute names can be
   * given as an array or a space separated string. If no attributes are given
   * all attributes are assumed.
   *
   * @method stop
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  stop: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator, attr)
    {
      this.attrimators.remove( attr );
    });
  },

  /**
   * Ends all attributes for the specified attributes. If attributes are queued
   * the last value of the last attribute is applied to this Animator before
   * being completely removed. Attribute names can be given as an array or a
   * space separated string. If no attributes are given all attributes are
   * assumed.
   *
   * @method end
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  end: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      while (attrimator.next)
      {
        attrimator = attrimator.next;
      }

      attrimator.finish( this.frame );
    });
  },

  /**
   * Finishes all current attrimators for the specified attributes. Attribute
   * names can be given as an array or a space separated string. If no
   * attributes are given all attributes are assumed.
   *
   * @method finish
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  finish: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.finish( this.frame );
    });
  },

  /**
   * Calls nopeat on all current attrimators for the specified attributes.
   * Attribute names can be given as an array or a space separated string. If
   * no attributes are given all attributes are assumed.
   *
   * **See:** {{#crossLink "Attrimator/nopeat:method"}}Attrimator.nopeat{{/crossLink}}
   *
   * @method nopeat
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  nopeat: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.nopeat();
    });
  },

  /**
   * Pauses all current attrimators for the specified attributes. Attribute
   * names can be given as an array or a space separated string. If no
   * attributes are given all attributes are assumed.
   *
   * @method pause
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  pause: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.pause();
    });
  },

  /**
   * Resumes all current attrimators for the specified attributes. Attribute
   * names can be given as an array or a space separated string. If no
   * attributes are given all attributes are assumed.
   *
   * @method resume
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  resume: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.resume();
    });
  },

  /**
   * Sets the given attributes to this Animator immediately.
   *
   * @method set
   * @param {Object} attributes
   * @chainable
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
   * Unsets the attribute, array of attributes, or object of attributes.
   * Unsetting involves removing all attrimators and the current value in the
   * frame,
   *
   * @method unset
   * @param {String|Array|Object} attributes
   * @chainable
   */
  unset: function(attributes)
  {
    var attributes = toArray( coalesce( attributes, this.frame ), ' ' );

    for (var i = attributes.length - 1; i >= 0; i--)
    {
      var attr = attributes[ i ];

      this.attrimators.remove( attr );

      delete this.frame[ attr ];
    }

    return this;
  },

  /**
   * Gets the current attribute values for all attributes specified. The
   * argument must be an object where the key is the name of an attribute.
   *
   * @method get
   * @param {Object} attributes
   * @return {Object}
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
   * Returns the amount of finite time remaining before the animator is done
   * animating. Attrimators that don't have a known end time are not included.
   * If there are no attrimators with end times then zero is returned.
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    return this.attrimators.timeRemaining();
  },

  /**
   * Returns true if there are any attrimators on this Animator.
   *
   * @method hasAttrimators
   * @return {Boolean}
   */
  hasAttrimators: function()
  {
    return this.attrimators.size() > 0;
  },

  /**
   * Returns the subject of the Animator optionally passing it through a wrapper
   * function before it's returned.
   *
   * @method getSubject
   * @param {Function} [wrapper]
   * @return {Any}
   */
  getSubject: function(wrapper)
  {
    var subject = this.subject;

    if ( isFunction( wrapper ) )
    {
      subject = wrapper( subject );
    }

    return subject;
  },

  /**
   * Invokes a function with the given context or the context of this Animator
   * if none is given. This is particularly useful for having a function be
   * called on deferred statements.
   *
   * @method invoke
   * @param {Function} func
   * @param {Object} [context]
   * @param {Array} [args]
   * @chainable
   */
  invoke: function(func, context, args)
  {
    if ( isFunction( func ) )
    {
      func.apply( context || this, args || [] );
    }

    return this;
  },

  /**
   * Defers the method calls following this one to when the given event type
   * (on or once) and event. To return this animator you need to call undefer()
   * as many times as you called defer().
   *
   * @method defer
   * @param {String} eventType
   * @param {String} event
   * @param {Function} [callback]
   * @return {DeferAnimator}
   */
  defer: function(eventType, event, callback)
  {
    return new DeferAnimator( this, this, eventType, event, callback );
  },

  /**
   * Invokes the given callback when the last animation that was
   * played/queued/transitioned starts.
   *
   * @method onCycleStart
   * @param {Function} callback
   * @param {Object} [context]
   * @chainable
   */
  onCycleStart: function(callback, context)
  {
    this.once( 'cycleStart:' + this.cycleNext, callback, context );

    return this;
  },

  /**
   * Invokes the given callback when the last animation that was
   * played/queued/transitioned ends.
   *
   * @method onCycleEnd
   * @param {Function} callback
   * @param {Object} [context]
   * @chainable
   */
  onCycleEnd: function(callback, context)
  {
    this.once( 'cycleEnd:' + this.cycleNext, callback, context );

    return this;
  }

});

/**
 * Adds the following event methods to Animators: on, once, off, trigger.
 */
eventize( Animator.prototype );


/**
 * Instantiates an Array of {{#crossLink "Animator"}}{{/crossLink}} instances.
 *
 * @param {Array} [input]
 * @class Animators
 * @constructor
 * @extends {Array}
 */
function Animators(input)
{
  this.$ = [];

  if ( isArray( input ) )
  {
    this.fill( input );
  }
}

/**
 * Animators is an instance of Array. All array methods are supported.
 */
Class.define( Animators,
{

  /**
   * Adds an animator to this set of animators.
   *
   * @param  {Animator} animator
   * @chainable
   */
  push: function(animator)
  {
    this.$.push( animator );

    return this;
  },

  /**
   * Returns the number of animators in this set.
   *
   * @return {Number}
   */
  length: function()
  {
    return this.$.length;
  },

  /**
   * Returns the animator at the given index.
   *
   * @param  {Number} index
   * @return {Animator}
   */
  at: function(index)
  {
    return this.$[ index ];
  },

  /**
   * Invokes a callback for each element in the array.
   *
   * @method each
   * @param {Function} iterator
   * @param {Object} context
   * @chainable
   */
  each: function(iterator, context)
  {
    var array = this.$;

    for (var i = 0; i < array.length; i++)
    {
      if ( iterator.call( context || array[i], array[i], i ) === false )
      {
        break;
      }
    }

    return this;
  },

  /**
   * Appends the array of animators given to the end of this array.
   *
   * @method fill
   * @param {Array} animators
   * @chainable
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
   * Invokes a callback for each element in the array and if a true value is
   * returned  that element is removed from the array.
   *
   * @method filter
   * @param {Function} filterer
   * @chainable
   */
  filter: function(filterer)
  {
    var array = this.$;
    var alive = 0;

    for (var i = 0; i < array.length; i++)
    {
      var remove = filterer( array[i] );

      if ( !remove )
      {
        array[alive++] = array[i];
      }
    }

    array.length = alive;

    return this;
  },

  /**
   * Returns the subjects of the Animators optionally passing them through a
   * wrapper function before it's returned.
   *
   * @method getSubjects
   * @param {Function} [wrapper]
   * @return {Any}
   */
  getSubjects: function(wrapper)
  {
    var array = this.$;
    var subjects = [];

    for (var i = 0; i < array.length; i++)
    {
      subjects.push( array[i].subject );
    }

    if ( isFunction( wrapper ) )
    {
      subjects = wrapper( subjects );
    }

    return subjects;
  },

  /**
   * Returns the first animator in the array.
   *
   * @method first
   * @return {Animator}
   */
  first: function()
  {
    return this.$[0];
  },

  /**
   * Reverses the order of animators in the array.
   *
   * @method reverse
   * @chainable
   */
  reverse: function()
  {
    var array = this.$;
    var last = array.length - 1;
    var mid = Math.floor( array.length / 2 );

    for (var i = 0; i < mid; i++)
    {
      var e0 = array[ i ];
      var e1 = array[ last - i ];

      array[ i ] = e1;
      array[ last - i ] = e0;
    }

    return this;
  },

  /**
   * Activates all Animators in the array if they aren't active already.
   *
   * @method activate
   * @chainable
   */
  activate: function()
  {
    var array = this.$;

    for (var i = 0; i < array.length; i++)
    {
      pushAnimator( array[i] );
    }

    activate();

    return this;
  },

  /**
   * Creates a sequence of events separated by a delay.
   *
   * @method sequence
   * @param {String|Number} delay
   * @param {String|Array|Function} easing
   * @return {Sequence}
   */
  sequence: function(delay, easing)
  {
    return new Sequence( this, delay, easing );
  },

  /**
   * Returns the maximum time remaining out of all Animators in the array.
   *
   * **See:** {{#crossLink "Animating/timeRemaining:method"}}{{/crossLink}}
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    var array = this.$;
    var maxRemaining = 0;

    for (var i = 0; i < array.length; i++)
    {
      maxRemaining = Math.max( maxRemaining, array[ i ].timeRemaining() );
    }

    return maxRemaining;
  },

  /**
   * Calls {{#crossLink "Animator/preupdate:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method preupdate
   * @chainable
   */
  preupdate: function(now, max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].preupdate( now );
    }

    return this;
  },

  /**
   * Calls {{#crossLink "Animator/update:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method update
   * @chainable
   */
  update: function(now, max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].update( now );
    }

    return this;
  },

  /**
   * Calls {{#crossLink "Animator/apply:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method apply
   * @chainable
   */
  apply: function(max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].apply();
    }

    return this;
  },

  /**
   * Handles an animator if it's finished, and returns false if the animator can
   * be removed from the set of animators.
   *
   * @method handleFinished
   * @param {Animator} animator
   * @return {Boolean}
   */
  handleFinished: function(animator)
  {
    if ( animator.finished )
    {
      animator.deactivate();
      animator.active = false;
    }

    return animator.finished;
  },

  /**
   * Calls {{#crossLink "Animator/restore:method"}}{{/crossLink}} on each
   * animator in the array and returns this.
   *
   * @method restore
   * @chainable
   */
  restore               : delegate( 'restore', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/placeAttrimator:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method placeAttrimator
   * @chainable
   */
  placeAttrimator       : delegate( 'placeAttrimator', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method applyInitialState
   * @chainable
   */
  applyInitialState     : delegate( 'applyInitialState', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/trimAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method trimAttrimators
   * @chainable
   */
  trimAttrimators       : delegate( 'trimAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/deactivate:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method deactivate
   * @chainable
   */
  deactivate            : delegate( 'deactivate', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/destroy:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method destroy
   * @chainable
   */
  destroy               : delegate( 'destroy', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/spring:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method spring
   * @chainable
   */
  spring                : delegate( 'spring', DelegateTypes.RESULTS ),

  /**
   * Calls {{#crossLink "Animator/play:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method play
   * @chainable
   */
  play                  : delegate( 'play', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/unplay:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method unplay
   * @chainable
   */
  unplay                : delegate( 'unplay', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/playAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method playAttrimators
   * @chainable
   * @protected
   */
  playAttrimators       : delegate( 'playAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/queue:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method queue
   * @chainable
   */
  queue                 : delegate( 'queue', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/queueAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method queueAttrimators
   * @chainable
   * @protected
   */
  queueAttrimators      : delegate( 'queueAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/transition:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method transition
   * @chainable
   */
  transition            : delegate( 'transition', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/transitionAttrimators:method"}}{{/crossLink}}
   * on each animator in the array and returns this.
   *
   * @method transitionAttrimators
   * @chainable
   * @protected
   */
  transitionAttrimators : delegate( 'transitionAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tween:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tween
   * @chainable
   */
  tween                 : delegate( 'tween', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenTo:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenTo
   * @chainable
   */
  tweenTo               : delegate( 'tweenTo', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenFrom:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenFrom
   * @chainable
   */
  tweenFrom             : delegate( 'tweenFrom', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenMany:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenMany
   * @chainable
   */
  tweenMany             : delegate( 'tweenMany', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyTo:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenManyTo
   * @chainable
   */
  tweenManyTo           : delegate( 'tweenManyTo', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyFrom:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenManyFrom
   * @chainable
   */
  tweenManyFrom         : delegate( 'tweenManyFrom', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/move:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method move
   * @chainable
   */
  move                  : delegate( 'move', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/moveMany:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method moveMany
   * @chainable
   */
  moveMany              : delegate( 'moveMany', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/follow:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method follow
   * @chainable
   */
  follow                : delegate( 'follow', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/attrimatorsFor:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method attrimatorsFor
   * @chainable
   */
  attrimatorsFor        : delegate( 'attrimatorsFor', DelegateTypes.RESULTS ),

  /**
   * Calls {{#crossLink "Animator/stop:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method stop
   * @chainable
   */
  stop                  : delegate( 'stop', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/end:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method end
   * @chainable
   */
  end                   : delegate( 'end', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/finish:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method finish
   * @chainable
   */
  finish                : delegate( 'finish', DelegateTypes.THIS ),

/**
   * Calls {{#crossLink "Animator/nopeat:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method nopeat
   * @chainable
   */
  nopeat                : delegate( 'nopeat', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/pause:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method pause
   * @chainable
   */
  pause                 : delegate( 'pause', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/resume:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method resume
   * @chainable
   */
  resume                : delegate( 'resume', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/set:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method set
   * @chainable
   */
  set                   : delegate( 'set', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/unset:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method unset
   * @chainable
   */
  unset                 : delegate( 'unset', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/get:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method get
   * @chainable
   */
  get                   : delegate( 'get', DelegateTypes.FIRST ),

  /**
   * Calls {{#crossLink "Animator/hasAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method hasAttrimators
   * @chainable
   */
  hasAttrimators        : delegate( 'hasAttrimators', DelegateTypes.TRUE ),

  /**
   * Calls {{#crossLink "Animator/invoke:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method invoke
   * @chainable
   */
  invoke                : delegate( 'invoke', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleStart:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method onCycleStart
   * @chainable
   */
  onCycleStart          : delegate( 'onCycleStart', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleEnd:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method onCycleEnd
   * @chainable
   */
  onCycleEnd            : delegate( 'onCycleEnd', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/on:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method on
   * @chainable
   */
  on                    : delegate( 'on', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/once:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method once
   * @chainable
   */
  once                  : delegate( 'once', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/off:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method off
   * @chainable
   */
  off                   : delegate( 'off', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/trigger:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method trigger
   * @chainable
   */
  trigger               : delegate( 'trigger', DelegateTypes.THIS )

});


/**
 * Animates a single attribute over any period of time.
 *
 * @class Attrimator
 * @constructor
 */
function Attrimator()
{

}

Class.define( Attrimator,
{

  /**
   * Resets this attrimator for the given attribute created by the given builder.
   *
   * @method reset
   * @param {String} attribute
   * @param {Builder} builder
   * @param {Attrimator} [next]
   */
  reset: function(attribute, builder, next)
  {
    /**
     * The name of the attribute this attrimator is animating.
     *
     * @property {String} attribute
     */
    this.attribute = attribute;

    /**
     * The builder that created this attrimator (if any).
     *
     * @property {Builder} builder
     */
    this.builder = builder;

    /**
     * The next attrimator to be played once this one has finished.
     *
     * @property {Attrimator} next
     */
    this.next = next;

    /**
     * The time the attrimator was started by the animator.
     *
     * @property {Number} startTime
     */
    this.startTime = 0;

    /**
     * The time the attrimator was last paused.
     *
     * @property {Number} pauseTime
     */
    this.pauseTime = 0;

    /**
     * The amount of time that has elapsed since the attrimator started.
     *
     * @property {Number} elapsed
     */
    this.elapsed = 0;

    /**
     * The time this attrimator should stop itself after it started in milliseconds.
     *
     * @property {Number} stopTime
     */
    this.stopTime = Number.POSITIVE_INFINITY;

    /**
     * Whether or not the attrimator is paused.
     *
     * @property {Boolean} paused
     */
    this.paused = false;

    /**
     * The cycle this attrimator belongs to.
     *
     * @type {Number} cycle
     */
    this.cycle = 0;

    /**
     * The amount of time in milliseconds this attrimator is delayed since start.
     *
     * @property {Number} delay
     */
    this.delay = 0;

    /**
     * The initial elapsed time in milliseconds when the attrimator is started.
     *
     * @property {Number} offset
     */
    this.offset = 0;
  },

  /**
   * Prepares this attrimator for animation on the given subject animator. This
   * is called as early as possible to establish the start time of the
   * attrimator so when the user isn't on the page time can be kept accurately.
   *
   * @param {Number} now
   * @param {Animator} animator
   */
  prestart: function(now)
  {
    if ( this.startTime === 0 )
    {
      this.startTime = now - this.offset;
      this.elapsed = this.offset;
      this.finished = false;
      this.prestartNext();
    }
  },

  /**
   * Calls {{#crossLink "Attrimator/prestart:method"}}{{/crossLink}} on the next
   * attrimator if it can be called.
   *
   * @method prestartNext
   */
  prestartNext: function( overrideNext )
  {
    // If there is a next attrimator and this attrimator has been prestarted...
    if ( this.next && this.startTime !== 0 )
    {
      // If override next is specified, clear next's startTime
      if ( overrideNext )
      {
        this.next.startTime = 0;
      }

      // We can only prestart next if it has no startTime.
      if ( this.next.startTime === 0 )
      {
        var totalTime = this.totalTime();

        // If this attrimator has a finite total amount of time, it's end can be calculated.
        if ( isFinite( totalTime ) )
        {
          this.next.prestart( this.startTime + totalTime );
        }
      }
    }
  },

  /**
   * Prepares this attrimator for animation on the given subject
   * animator. This is called once in anim8.Animator.preupdate before the first
   * time this attrimator is updated.
   *
   * @method start
   * @param {Number} now
   * @param {Animator} animator
   */
  start: function(now, animator)
  {
    this.prestart( now );
  },

  /**
   * Invoked once when a new animation cycle is started on an Animator. If this
   * attrimator updated the frame true must be returned.
   *
   * @method startCycle
   * @param {Object} frame
   * @return {Boolean}
   */
  startCycle: function(frame)
  {
    return false;
  },

  /**
   * Updates this attrimator given a time to animate to and the frame to
   * provide with a new value. This method will return true if the attribute
   * this is animating has been updated and needs to be applied to the subject.
   *
   * @method setTime
   * @param {Number} now
   * @param {Object} frame
   * @return {Boolean}
   */
  setTime: function(now, frame)
  {
    if ( this.paused )
    {
      return false;
    }

    var updated = false;
    var elapsed = now - this.startTime;

    if ( elapsed > this.stopTime )
    {
      updated = this.finish( frame );
    }
    else if ( elapsed >= this.delay )
    {
      updated = this.update( elapsed, frame );
    }

    this.elapsed = elapsed;

    return updated;
  },

  /**
   * Updates the attrimator given elapsed time in milliseconds, the frame to
   * apply a value to, and returns whether the frame was updated or not.
   *
   * @method update
   * @param {Number} elapsed
   * @param {Object} frame
   * @return {Boolean}
   */
  update: function(elapsed, frame)
  {
    throw 'Attrimator.update not implemented';
  },

  /**
   * Returns the amount of time that has elapsed in milliseconds.
   *
   * @method getElapsed
   * @return {Number}
   */
  getElapsed: function()
  {
    return this.elapsed;
  },

  /**
   * Stops this attrimator in the given number of milliseconds.
   *
   * @method stopIn
   * @param {Number} milliseconds
   * @chainable
   */
  stopIn: function(milliseconds)
  {
    this.stopTime = this.getElapsed() + milliseconds;

    return this;
  },

  /**
   * Stops this attrimator at the given time. If the given time is outside this
   * attrimator and has a next attrimator that stopAt will be called.
   *
   * @method stopAt
   * @param {Number} time
   * @chainable
   */
  stopAt: function(time)
  {
    var totalTime = this.totalTime();

    if ( time > totalTime )
    {
      if ( this.next )
      {
        this.next.stopAt( time - totalTime );
      }
    }
    else
    {
      this.stopTime = time;
    }

    return this;
  },

  /**
   * If this attrimator repeats its animation this method will stop repitition
   * after the next animation cycle.
   *
   * @chainable
   */
  nopeat: function()
  {
    return this;
  },

  /**
   * Returns the value at the given time or returns false if it can't be
   * calculated.
   *
   * @method valueAt
   * @param {Number} time
   * @param {Any} out
   * @return {Any|False}
   */
  valueAt: function(time, out)
  {
    return false;
  },

  /**
   * Returns the value at the given time or returns false if it can't be
   * calculated. If the time is outside this attrimator, the next attrimator
   * is checked.
   *
   * @method valueAt
   * @param {Number} time
   * @param {Any} out
   * @return {Any|False}
   */
  valueAtSearch: function(time, out)
  {
    var totalTime = this.totalTime();

    if ( time > totalTime )
    {
      return this.next ? this.next.valueAtSearch( time - totalTime, out ) : false;
    }

    return this.valueAt( time, out );
  },

  /**
   * Returns the attrimator at the given time.
   *
   * @method attrimatorAt
   * @param {Number} time
   * @return {Attrimator}
   */
  attrimatorAt: function(time)
  {
    var totalTime = this.totalTime();

    if ( time > totalTime )
    {
      return this.next ? this.next.attrimatorAt( time - totalTime ) : null;
    }

    return this;
  },

  /**
   * The total amount of time this attrimator will take in milliseconds. This
   * may be an infinite number.
   *
   * @method totalTime
   * @return {Number}
   */
  totalTime: function()
  {
    return this.stopTime;
  },

  /**
   * The time remaining before this attrimator and any following will be
   * finished.
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    return this.totalTime() - this.elapsed + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * Clones this attrimator.
   *
   * @method clone
   * @return {Attrimator}
   */
  clone: function()
  {
    throw 'AttributeAnimator.clone not implemented';
  },

  /**
   * Returns whether this attrimator has computed values which need to be
   * resolved by the subject animator calling prepare on this attrimator.
   *
   * @method hasComputed
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return false;
  },

  /**
   * Determines whether this attrimator will run infinitely.
   *
   * @method isInfinite
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return !isFinite( this.stopTime );
  },

  /**
   * Pauses this attrimator if it isn't already paused.
   *
   * @method pause
   * @chainable
   */
  pause: function()
  {
    if ( !this.paused )
    {
      this.pauseTime = now();
      this.paused = true;
    }

    return this;
  },

  /**
   * Resumes this attrimator if it's paused. This involves resetting the start
   * time of the attrimator.
   *
   * @method resume
   * @chainable
   */
  resume: function()
  {
    if ( this.paused )
    {
      var totalPausedTime = now() - this.pauseTime;
      var delay = this;

      while ( delay && delay.startTime !== 0 )
      {
        delay.startTime += totalPausedTime;
        delay = delay.next;
      }

      this.paused = false;
    }

    return this;
  },

  /**
   * Whether this attrimator is paused.
   *
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function()
  {
    return this.paused;
  },

  /**
   * Sets the final state of the attrimator to the frame if one exists and
   * returns true, otherwise false is returned and frame remains unchanged.
   *
   * @method finish
   * @param {Object} frame
   * @return {Boolean}
   */
  finish: function(frame)
  {
    return false;
  },

  /**
   * Whether this attrimator is finished.
   *
   * @method isFinished
   * @return {Boolean}
   */
  isFinished: function()
  {
    return false;
  },

  /**
   * Returns the builder that created this attrimator (if any).
   *
   * @method getBuilder
   * @return {Builder}
   */
  getBuilder: function()
  {
    return this.builder;
  },

  /**
   * Places the given attrimator on the end of the chain of attrimators starting
   * with this attrimator.
   *
   * @method queue
   * @param {Attrimator} next
   * @chainable
   */
  queue: function(next)
  {
    if ( this.next )
    {
      this.next.queue( next );
    }
    else
    {
      this.next = next;
      this.prestartNext();
    }

    return this;
  },

  /**
   * Places the given attrimator at the given time.
   */
  nextAt: function(next, time)
  {
    var totalTime = this.totalTime();

    if ( time < totalTime )
    {
      this.stopTime = time;
      this.next = next;
    }
    else if ( this.next )
    {
      this.next.nextAt( next, time - totalTime );
    }
    else
    {
      next.delay += time - totalTime;
      this.next = next;
    }

    return this;
  },

  /**
   * Parses a value with the calculator given a default value to fallback on.
   *
   * @method parseValue
   * @param {Animator} animator
   * @param {T|Function|True} value
   * @param {T} defaultValue
   * @return {T|Function}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( isComputed( parsed ) )
    {
       parsed = parsed( this, animator );
    }

    return parsed;
  }

});


/**
 * A map of attrimators by their attribute name.
 *
 * @class AttrimatorMap
 * @constructor
 * @extends FastMap
 */
function AttrimatorMap()
{
  this.reset();
}

Class.extend( AttrimatorMap, FastMap,
{

  /**
   * Sets the group identifier for attrimators in this map. If force is
   * specified it will overwrite any existing group identifier on attrimators.
   * If deep is true, then all next attrimators also could have their group
   * identifiers set.
   *
   * @method setGroup
   * @param {Number} groupId
   * @param {Boolean} [force=false]
   * @param {Boolean} [deep=false]
   */
  setGroup: function(groupId, force, deep)
  {
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[ i ];

      do
      {
        if ( !attrimator.groupId || force )
        {
          attrimator.groupId = groupId;
        }

        attrimator = attrimator.next;

      } while ( deep && attrimator );
    }
  },

  /**
   * Adds a delay to all attrimators in this map.
   *
   * @method delay
   * @param {Number} time
   * @return {AttrimatorMap}
   */
  delay: function(time)
  {
    var attrimators = this.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      attrimators[ i ].delay += time;
    }

    return this;
  },

  /**
   * Queues the attrimator on this map. If the attribute is already on this map
   * this is placed on the end of the Attrimator chain, otherwise the attrimator
   * is added to the map. If there is an attrimator already on the map it's
   * returned.
   *
   * @method queue
   * @param {Attrimator} attrimator
   * @return {Attrimator}
   */
  queue: function(attrimator)
  {
    var attr = attrimator.attribute;
    var current = this.get( attr );

    if ( current )
    {
      current.queue( attrimator );
    }
    else
    {
      this.put( attr, attrimator );
    }

    return current;
  },

  /**
   * Queues the given map to this map. The attrimators placed on this map are
   * queued and delayed in a way that they all start at the same time. If a
   * function is provided as the second argument it is invoked whenever an
   * attrimator in the given map is new & added to this map.
   *
   * @method queueMap
   * @param {AttrimatorMap} map
   * @param {Function} [onNewAttribute]
   * @param {Object} [context]
   * @chainable   188703090
   */
  queueMap: function(map, offset, onNewAttribute, context)
  {
    var maxRemaining = this.timeRemaining();
    var attrimators = map.values;
    var hasCallback = isFunction( onNewAttribute );
    var mapOffset = coalesce( offset, 0 );
    var timeOffset = maxRemaining + mapOffset;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = this.get( attr );

      if ( existing )
      {
        if ( existing.isInfinite() )
        {
          existing.stopIn( attrimator.delay + timeOffset );
        }
        else
        {
          attrimator.delay += (timeOffset - existing.timeRemaining());
        }

        existing.queue( attrimator );
      }
      else
      {
        attrimator.delay += timeOffset;

        this.put( attr, attrimator );

        if ( hasCallback )
        {
          onNewAttribute.call( context || this, attrimator );
        }
      }
    }

    return this;
  },

  /**
   * Removes the attrimator at the given index replacing it with the next
   * attrimator if one exists.
   *
   * @method unqueueAt
   * @param {Number} index
   * @chainable
   */
  unqueueAt: function(index)
  {
    var current = this.values[ index ];

    if ( current.next )
    {
      this.values[ index ] = current.next;
    }
    else
    {
      this.removeAt( index );
    }

    return this;
  },

  /**
   * Plays the given attrimators at the given time. This performs the necessary
   * stopping, queueing, and delaying of attrimators that may need to be done.
   *
   * @method playMapAt
   * @param {AttrimatorMap} attrimatorMap
   * @param {Boolean} all
   * @param {Number} time
   * @chainable
   */
  playMapAt: function(attrimatorMap, all, time)
  {
    if ( all )
    {
      this.stopNotPresentAt( attrimatorMap, time );
    }

    var attrimators = attrimatorMap.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      this.playAttrimatorAt( attrimators[ i ], time );
    }

    return this;
  },

  playAttrimatorAt: function(attrimator, time)
  {
    var attr = attrimator.attribute;
    var existing = this.get( attr );

    if ( existing )
    {
      existing.nextAt( attrimator, time );
    }
    else
    {
      attrimator.delay += time;

      this.put( attr, attrimator );
    }
  },

  transitionMap: function(transition, attrimatorMap, getValue, getAttribute, placeAttrimator, getValueAt, stopAttrimator, context)
  {
    // TRANSITIONING:
    // If the animator doesn't have an attrimator for the given attribute just add the attrimator adding the total delay
    // If the animator has an attrimator currently...
    //   If the current attrimator or new attrimator don't have values at the desired times...
    //      Stop the current attrimator after the total delay (adding the delay of the new attrimator as well)
    //      Queue the new attrimator
    //   Else
    //      Create a path using the methods detailed above
    // If all is true and there's an attrimator left on the animator that isn't being transitioned, stop it after the total delay.

    // CREATING A TRANSITION PATH:
    // If intro & outro are 0, use Tween
    // If intro is 0, use Quadratic Path between current value, outro point, and first point on new path.
    // If outro is 0, use Quadratic Path between current value, first point on new path, and intro point.
    // If intro & outro are not 0, use Cubic Path between current value, outro point, first point on new path, and intro point.
    // If granularity is given > 1 then compile the path, compute intro & outro velocities, and compute deltas for new
    //    compiled path based on interpolated velocity over the path (knowing it's length and transition time)

    var attrimators = attrimatorMap.values;

    if ( this.hasOverlap( attrimatorMap ) )
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var next = attrimators[ i ];
        var attr = next.attribute;
        var curr = this.get( attr );
        var currValue = getValue.call( context, attr );

        if ( curr && isDefined( currValue ) )
        {
          var attribute = getAttribute.call( context, attr );
          var calc = attribute.calculator;

          var p2 = next.valueAt( 0, calc.create() );

          if ( p2 !== false )
          {
            var transitionTime = transition.time;
            var p0 = calc.clone( currValue );
            var p1 = transition.outro ? getValueAt.call( context, curr, transition.outro, calc.create() ) : false;
            var p3 = transition.intro ? next.valueAt( transition.intro, calc.create() ) : false;
            var path = null;

            // If the intro is negative we can look into the past by looking a little bit into
            // the future and assume the past is going in the same direction (only the opposite).
            if ( p3 !== false && transition.intro < 0 && transition.lookup > 0 )
            {
              var pastLookahead = next.valueAt( transition.lookup, calc.create() );
              var pastVelocity = calc.sub( pastLookahead, p2 );

              if ( pastVelocity !== false )
              {
                var pastNegativeVelocity = calc.scale( pastVelocity, transition.intro / transition.lookup );
                var past = calc.add( pastNegativeVelocity, p2 );

                p3 = p2;
                p2 = past;
              }
            }

            // Build a path with as many of the points as possible.
            if ( p1 === false && p3 === false )
            {
              path = new Tween( attr, calc, p0, p2 );
            }
            else if ( p1 === false )
            {
              path = new PathQuadratic( attr, calc, p0, p2, p3 );
            }
            else if ( p3 === false )
            {
              path = new PathQuadratic( attr, calc, p0, p1, p2 );
            }
            else
            {
              path = new PathCubic( attr, calc, p0, p1, p2, p3 );
            }

            // If granularity is specified we will try to make the transition
            // smooth by maintaining exit (outro) velocity from the current attrimator
            // and interpolating it to the entrance (intro) velocity for the
            // attrimator we're transitioning into.
            if ( transition.granularity > 2 && transition.lookup > 0 )
            {
              var outTime  = p1 === false ? 0 : transition.outro;
              var outPoint = p1 === false ? p0 : p1;
              var outNext  = getValueAt.call( context, curr, outTime + transition.lookup, calc.create() );

              var inTime   = p3 === false ? 0 : transition.intro;
              var inPoint  = p3 === false ? p2 : p3;
              var inNext   = next.valueAt( inTime + transition.lookup, calc.create() );

              // We can only proceed if we have reference points to calculate
              // exit & entrance velocity.
              if ( outNext !== false && inNext !== false )
              {
                var outVelocity  = calc.sub( calc.clone( outNext ), outPoint );
                var outPerMillis = calc.length( outVelocity ) / transition.lookup;

                var inVelocity   = calc.sub( calc.clone( inNext ), inPoint );
                var inPerMillis  = calc.length( inVelocity ) / transition.lookup;

                var compiled = new PathCompiled( attr, path, transition.granularity );
                var points = compiled.points;
                var lastPoint = points.length - 1;
                var totalDistance = 0;
                var distances = [];

                for (var k = 0; k < lastPoint; k++)
                {
                  distances[ k ] = totalDistance;
                  totalDistance += calc.distance( points[ k ], points[ k + 1 ] );
                }
                distances[ lastPoint ] = totalDistance;

                if ( !isNaN( totalDistance ) )
                {
                  var requiredTime = 2.0 * totalDistance / (outPerMillis + inPerMillis);
                  var acceleration = 0.5 * (inPerMillis - outPerMillis) / requiredTime;
                  var timeDelta = requiredTime / lastPoint;
                  var deltas = [];

                  for (var k = 0; k < lastPoint; k++)
                  {
                    var time = k * timeDelta;
                    var position = outPerMillis * time + acceleration * time * time;

                    deltas[ k ] = position / totalDistance;
                  }
                  deltas[ lastPoint ] = 1.0;

                  path = new PathDelta( attr, calc, points, deltas );
                  transitionTime = requiredTime;
                }
              }
            }

            var transitionEvent = new Event( attr, path, transitionTime, transition.easing, 0, 0, 0, 1 );

            transitionEvent.next = next;
            transitionEvent.cycle = next.cycle;

            next.offset = transition.intro;

            placeAttrimator.call( context, transitionEvent );
          }
          else
          {
            stopAttrimator.call( context, curr, transition.time + next.delay );

            curr.queue( next );
            next.delay = 0;
          }
        }
        else
        {
          next.delay += transition.time;

          placeAttrimator.call( context, next );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        placeAttrimator.call( context, attrimators[ i ] );
      }
    }

    return this;
  },

  /**
   * Finishes any attrimators on this animator that are not present in the given
   * map of attrimators. Optionally a delay in stopping them can be given.
   *
   * @method finishNotPresent
   * @param {AttrimatorMap} attrimatorMap
   * @param {Number} [delay=0]
   * @chainable
   * @protected
   */
  finishNotPresent: function(attrimatorMap, delay)
  {
    var attrimators = this.values;
    var stopIn = delay || 0;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( !attrimatorMap.has( attrimator.attribute ) )
      {
        attrimator.stopIn( stopIn );
      }
    }

    return this;
  },

  /**
   * Finishes any attrimators on this animator that are not present in the given
   * map of attrimators. Optionally a delay in stopping them can be given.
   *
   * @method stopNotPresentAt
   * @param {AttrimatorMap} attrimatorMap
   * @param {Number} time
   * @chainable
   * @protected
   */
  stopNotPresentAt: function(attrimatorMap, time)
  {
    var attrimators = this.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( !attrimatorMap.has( attrimator.attribute ) )
      {
        attrimator.stopAt( time );
      }
    }

    return this;
  },

  /**
   * Clones this map returning a deep clone where all attrimators are cloned.
   *
   * @method clone
   * @return {AttrimatorMap}
   */
  clone: function()
  {
    var values = this.values;
    var keys = this.keys;
    var clone = new AttrimatorMap();

    for (var i = values.length - 1; i >= 0; i--)
    {
      clone.values[i] = values[i].clone();
      clone.keys[i] = keys[i];
      clone.indices[ keys[i] ] = i;
    }

    return clone;
  },

  /**
   * Returns the time remaining for all finite attrimators in this map. The time
   * remaining includes queued attrimators.
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function(returnInfinity)
  {
    var maxRemaining = 0;
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[i];

      if ( !attrimator.isInfinite() )
      {
        maxRemaining = Math.max( maxRemaining, attrimator.timeRemaining() );
      }
      else if ( returnInfinity )
      {
        return Number.Infinity;
      }
    }

    return maxRemaining;
  },

  /**
   * Sets the cycle of the attrimators in this map. If there are attrimators
   * queued the are given the next cycle number. The final cycle number is
   * returned.
   *
   * @method applyCycle
   * @param {Number} nextCycle
   * @return {Number}
   */
  applyCycle: function(nextCycle)
  {
    var currentDepth = this.values;
    var nextDepth = null;

    while ( currentDepth.length )
    {
      nextDepth = [];

      for (var i = currentDepth.length - 1; i >= 0; i--)
      {
        var attrimator = currentDepth[ i ];

        attrimator.cycle = nextCycle;

        if ( attrimator.next )
        {
          nextDepth.push( attrimator.next );
        }
      }

      if ( nextDepth.length )
      {
        nextCycle++;
      }

      currentDepth = nextDepth;
    }

    return nextCycle;
  },

  /**
   * Iterates through all attrimators in this map, at any depth.
   *
   * @method iterate
   * @param  {Function} callback
   * @param  {Object} [context]
   * @chainable
   */
  iterate: function(callback, context)
  {
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[i];
      var previous = null;
      var depth = 0;

      while ( attrimator )
      {
        callback.call( context || this, attrimator, depth++, previous );

        attrimator = (previous = attrimator).next;
      }
    }

    return this;
  }

});


/**
 * Instantiates a new Builder. Builders are responsible for taking animation
 * definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generating & placing {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}
 * onto an {{#crossLink "AttrimatorMap"}}{{/crossLink}}.
 *
 * Builders are added to the {{#crossLink "anim8.builder"}}{{/crossLink}} object
 * by a key and when that key exists in an animation definition, the animation
 * definition is passed to the {{#crossLink "Builder/parse:method"}}{{/crossLink}}
 * to generate {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 *
 * @class Builder
 * @constructor
 */
function Builder()
{

}

/**
 * Returns the next merge ID. Merge IDs are used when merging options into
 * attrimators to perform an optimal merge.
 *
 * @method nextMergeId
 * @static
 */
Builder.nextMergeId = (function()
{
  var id = 0;
  return function() {
    return id++;
  };
})();

Class.define( Builder,
{

  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimatorMap to the given array.
   *
   * @method parse
   * @param {Object} animation
   * @param {Object} options
   * @param {AttrimatorMap} attrimatorMap
   * @param {BuilderHelper} helper
   */
  parse: function( animation, options, attrimatorMap, helper )
  {
    throw 'Builder.parse not implemented';
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
   * @method merge
   * @param {Object} animation
   * @param {Object} newOptions
   * @param {Object} oldOptions
   * @param {AttrimatorMap} attrimatorMap
   * @param {BuilderHelper} helper
   */
  merge: function( animation, newOptions, oldOptions, attrimatorMap, helper )
  {
    var builder = this;
    var factory = $factory( animation.factory );

    attrimatorMap.iterate(function(e)
    {
      if ( e.getBuilder() === builder )
      {
        builder.mergeAttrimator( e, e.attribute, helper, factory );
      }
    });
  },

  /**
   * Merges new options contained in the helper into the given attrimator.
   *
   * @method mergeAttrimator
   * @param {Attrimator} e
   * @param {String} attr
   * @param {BuilderHelper} helper
   * @param {Factory} factory
   */
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.easing    = helper.mergeEasing( attr, e.easing );
    e.repeat    = helper.mergeRepeat( attr, e.repeat );
    e.delay     = helper.mergeDelay( attr, e.delay );
    e.sleep     = helper.mergeSleep( attr, e.sleep );
    e.duration  = helper.mergeDuration( attr, e.duration );
    e.offset    = helper.mergeOffset( attr, e.offset );
    e.scale     = helper.mergeScale( attr, e.scale );
    e.scaleBase = helper.mergeScaleBase( attr, e.scaleBase, factory );
  },

  /**
   * Calls merge on all builders specified in the given animation definition.
   *
   * @method submerge
   * @protected
   * @param {Object} animation
   * @param {Object} newOptions
   * @param {Object} oldOptions
   * @param {AttrimatorMap} attrimatorMap
   */
  submerge: function( animation, newOptions, oldOptions, attrimatorMap )
  {
    var helper = new BuilderHelper( animation, oldOptions, newOptions );

    for (var builderName in animation)
    {
      var builder = $builder( builderName );

      if ( builder !== false && builder.merge )
      {
        builder.merge( animation, newOptions, oldOptions, attrimatorMap, helper );
      }
    }
  }
});


/**
 * Instantiates a new instance of Builder Helper.
 *
 * @param {Object} input
 * @param {Object} oldOptions
 * @param {Object} newOptions
 * @class BuilderHelper
 * @constructor
 */
function BuilderHelper( input, oldOptions, newOptions )
{
  this.input = input;
  this.oldOptions = oldOptions || {};
  this.newOptions = newOptions || {};

  this.prepareSpecifics( 'easings' );
  this.prepareSpecifics( 'repeats' );
  this.prepareSpecifics( 'delays' );
  this.prepareSpecifics( 'sleeps' );
  this.prepareSpecifics( 'durations' );
  this.prepareSpecifics( 'offsets' );
  this.prepareSpecifics( 'scales' );
  this.prepareSpecifics( 'scaleBases' );
}

Class.define( BuilderHelper,
{

  /**
   * If an object with the given name doesn't exist on the input it's created.
   *
   * @method prepareSpecifics
   * @param {String} specifics
   */
  prepareSpecifics: function(specifics)
  {
    if ( !isObject( this.input[ specifics ] ) )
    {
      this.input[ specifics ] = {};
    }
  },

  /* PARSING */

  /**
   * Parses an easing from the input.
   *
   * @method parseEasing
   * @param  {String} attr
   * @return {String|Function|Array}
   */
  parseEasing: function(attr)
  {
    return this.parseFirst( attr, 'easing', 'easings' );
  },

  /**
   * Parses repeats from the input.
   *
   * @method parseRepeat
   * @param  {String} attr
   * @return {Number}
   */
  parseRepeat: function(attr)
  {
    return this.parseNumber( attr, $repeat, $repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
  },

  /**
   * Parses delay from the input.
   *
   * @method parseDelay
   * @param  {String} attr
   * @return {Number}
   */
  parseDelay: function(attr)
  {
    return this.parseNumber( attr, $delay, $time, 'delay', 'delayAdd', 'delayScale', 'delays' );
  },

  /**
   * Parses sleep from the input.
   *
   * @method parseSleep
   * @param  {String} attr
   * @return {Number}
   */
  parseSleep: function(attr)
  {
    return this.parseNumber( attr, $sleep, $time, 'sleep', 'sleepAdd', 'sleepScale', 'sleeps' );
  },

  /**
   * Parses duration from the input.
   *
   * @method parseDuration
   * @param  {String} attr
   * @return {Number}
   */
  parseDuration: function(attr)
  {
    return this.parseNumber( attr, $duration, $time, 'duration', 'durationAdd', 'durationScale', 'durations' );
  },

  /**
   * Parses offset from the input.
   *
   * @method parseOffset
   * @param  {String} attr
   * @return {Number}
   */
  parseOffset: function(attr)
  {
    return this.parseNumber( attr, $offset, $time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
  },

  /**
   * Parses scale from the input.
   *
   * @method parseScale
   * @param  {String} attr
   * @return {Number}
   */
  parseScale: function(attr)
  {
    return this.parseNumber( attr, $scale, $number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
  },

  /**
   * Parses scale base from the input.
   *
   * @method parseScaleBase
   * @param  {String} attr
   * @return {Any}
   */
  parseScaleBase: function(attr)
  {
    return this.parseFirst( attr, 'scaleBase', 'scaleBases' );
  },

  /**
   * Parses a value from the input given the attribute, option, and specific.
   *
   * @method parseFirst
   * @param {String} attr
   * @param {String} option
   * @param {String} specifics
   * @return {Any}
   */
  parseFirst: function(attr, option, specifics)
  {
    return coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
  },

  /**
   * Parses an event from the input given a path & builder for the event.
   *
   * @method parseEvent
   * @param {String} attr
   * @param {Path} path
   * @param {Builder} builder
   * @param {Boolean} hasInitialState
   * @return {Event}
   */
  parseEvent: function(attr, path, builder, hasInitialState, mergeId)
  {
    var duration   = this.parseDuration( attr );
    var easing     = this.parseEasing( attr );
    var delay      = this.parseDelay( attr );
    var sleep      = this.parseSleep( attr );
    var repeat     = this.parseRepeat( attr );
    var offset     = this.parseOffset( attr );
    var scale      = this.parseScale( attr );
    var scaleBase  = this.parseScaleBase( attr );
    var event      = new Event( attr, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, hasInitialState, builder, null, this.input );

    return event;
  },

  /**
   * Parses a number from the input given parse functions.
   *
   * @method parseNumber
   * @param {String} attr
   * @param {Function} parseFunction
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} optionAdd
   * @param {String} optionScale
   * @param {String} specifics
   * @return {Number}
   */
  parseNumber: function(attr, parseFunction, parseOptionFunction, option, optionAdd, optionScale, specifics)
  {
    var baseRaw = coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
    var base = parseFunction( baseRaw );
    var add = parseOptionFunction( this.oldOptions[ optionAdd ], 0 );
    var scale = coalesce( this.oldOptions[ optionScale ], 1 );

    return (add === 0 && scale === 1) ? baseRaw : (base + add) * scale;
  },

  /* MERGING */

  /**
   * Merges easing based on the input, new options, and the current easing.
   *
   * @method mergeEasing
   * @param {String} attr
   * @param {Function} current
   * @return {Function}
   */
  mergeEasing: function(attr, current)
  {
    return this.mergeFirst( attr, current, $easing, 'easing', 'easings' );
  },

  /**
   * Merges repeats based on the input, new options, and the current repeat.
   *
   * @method mergeRepeat
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeRepeat: function(attr, current)
  {
    return this.mergeNumber( attr, current, $repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
  },

  /**
   * Merges delay based on the input, new options, and the current delay.
   *
   * @method mergeDelay
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeDelay: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'delay', 'delayAdd', 'delayScale', 'delays' );
  },

  /**
   * Merges sleep based on the input, new options, and the current sleep.
   *
   * @method mergeSleep
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeSleep: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'sleep', 'sleepAdd', 'sleepScale', 'scales' );
  },

  /**
   * Merges duration based on the input, new options, and the current duration.
   *
   * @method mergeDuration
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeDuration: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'duration', 'durationAdd', 'durationScale', 'durations' );
  },

  /**
   * Merges offset based on the input, new options, and the current offset.
   *
   * @method mergeOffset
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeOffset: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
  },

  /**
   * Merges scale based on the input, new options, and the current scale.
   *
   * @method mergeScale
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeScale: function(attr, current)
  {
    return this.mergeNumber( attr, current, $number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
  },

  /**
   * Merges scale base based on the input, new options, and the current scale
   * base.
   *
   * @method mergeScaleBase
   * @param {String} attr
   * @param {T} current
   * @param {Factory} factory
   * @return {T}
   */
  mergeScaleBase: function(attr, current, factory)
  {
    var calc = factory.attribute( attr ).calculator;

    var parseFunction = function(value, defaultValue) {
      return calc.parse( value, defaultValue );
    };

    return this.mergeFirst( attr, current, parseFunction, 'scaleBase', 'scaleBases' );
  },

  /**
   * Returns the first available option from input, new options, old options,
   * and the current value.
   *
   * @method mergeFirst
   * @param {String} attr
   * @param {T} current
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} specifics
   * @return {T}
   */
  mergeFirst: function(attr, current, parseOptionFunction, option, specifics)
  {
    var specific = this.input[ specifics ][ attr ];
    var value = coalesce( specific, this.newOptions[ option ], this.oldOptions[ option ] );

    return parseOptionFunction( value, current );
  },

  /**
   * Merges a number by returning the first occurrence from input, new options,
   * old options, and the current value.
   *
   * @method mergeNumber
   * @param {String} attr
   * @param {Number} current
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} optionAdd
   * @param {String} optionScale
   * @param {String} specifics
   * @return {Number}
   */
  mergeNumber: function(attr, current, parseOptionFunction, option, optionAdd, optionScale, specifics)
  {
    var baseRaw = coalesce( this.input[ specifics ][ attr ], this.newOptions[ option ], this.oldOptions[ option ] );
    var base = parseOptionFunction( baseRaw, current );
    var add = parseOptionFunction( coalesce( this.newOptions[ optionAdd ], this.oldOptions[ optionAdd ] ), 0 );
    var scale = coalesce( this.newOptions[ optionScale ], this.oldOptions[ optionScale ], 1 );

    return (base + add) * scale;
  }

});




/**
 * Instantiates a new Calculator instance.
 *
 * @class Calculator
 * @constructor
 */
function Calculator()
{

}

Class.define( Calculator,
{

  /**
   * Creates the constants for this calculator.
   *
   * @method createConstants
   */
  createConstants: function()
  {
    this.ZERO = this.create();
    this.ONE = this.parse( 1.0, this.ZERO );
    this.INFINITY = this.parse( Number.POSITIVE_INFINITY, this.ZERO );
  },

  /**
   * Parses the given input for a value this calculator understands.
   *
   * @method parse
   * @param  {T} x
   * @param  {T} defaultValue
   * @return {T|Function|False}
   */
  parse: function(x, defaultValue)
  {
    throw 'Calculator.parse not implemented';
  },

  /**
   * Parses the given input for a value this calculator understands.
   *
   * @method parse
   * @param  {T} x
   * @param  {T} defaultValue
   * @return {T|Function|False}
   */
  parseArray: function(input, output, defaultValue)
  {
    if (input.length !== output.length)
    {
      output.length = input.length;
    }

    var parsedDefault = this.parse( defaultValue, this.ZERO );

    for (var i = 0; i < input.length; i++)
    {
      output[ i ] = this.parse( input[ i ], parsedDefault );
    }

    return output;
  },

  /**
   * Copies a value and places it in out and returns out.
   *
   * @method copy
   * @param {T} out
   * @param {T} copy
   * @return {T}
   */
  copy: function(out, copy)
  {
    throw 'Calculator.copy not implemented';
  },

  /**
   * Zeros out and returns it.
   *
   * @method zero
   * @param {T} out
   * @return {T}
   */
  zero: function(out)
  {
    throw 'Calculator.zero not implemented';
  },

  /**
   * Clones the value and returns the clone.
   *
   * @method clone
   * @param {T} clone
   * @return {T}
   */
  clone: function(clone)
  {
    return this.copy( this.create(), clone );
  },

  /**
   * Creates an empty value equivalent to zero.
   *
   * @method create
   * @return {T}
   */
  create: function()
  {
    throw 'Calculator.create not implemented';
  },

  /**
   * Scales out by the given scalar value and returns out.
   *
   * @method scale
   * @param {T} out
   * @param {Number} scale
   * @return {T}
   */
  scale: function(out, scale)
  {
    return this.adds( out, out, scale - 1 );
  },

  /**
   * Adds an amount to out and returns out.
   *
   * @method add
   * @param {T} out
   * @param {T} amount
   * @return {T}
   */
  add: function(out, amount)
  {
    return this.adds( out, amount, 1 );
  },

  /**
   * Adds an amount scaled by a scalar value to out and returns out.
   *
   * @method adds
   * @param {T} out
   * @param {T} amount
   * @param {Number} amountScale
   * @return {T}
   */
  adds: function(out, amount, amountScale)
  {
    throw 'Calculator.adds not implemented';
  },

  /**
   * Subtracts an amount from out and returns out.
   *
   * @method sub
   * @param {T} out
   * @param {T} amount
   * @return {T}
   */
  sub: function(out, amount)
  {
    return this.adds( out, amount, -1 );
  },

  /**
   * Multiplies out by some amount and returns out.
   *
   * @method mul
   * @param {T} out
   * @param {T} scale
   * @return {T}
   */
  mul: function(out, scale)
  {
    throw 'Calculator.mul not implemented';
  },

  /**
   * Interpolates out between start & end given a delta value and returns out.
   * A delta value typically lies between 0 and 1 inclusively.
   *
   * @method interpolate
   * @param {T} out
   * @param {T} start
   * @param {T} end
   * @param {Number} delta
   * @return {T}
   */
  interpolate: function(out, start, end, delta)
  {
    out = this.zero( out );
    out = this.adds( out, start, 1 - delta );
    out = this.adds( out, end, delta );

    return out;
  },

  /**
   * Returns a random value between the given min and max.
   *
   * @method random
   * @param {T} out
   * @param {T} min
   * @param {T} max
   * @return {T}
   */
  random: function(out, min, max)
  {
    return this.interpolate( out, min, max, Math.random() );
  },

  /**
   * Calculates the distance between the two values.
   *
   * @method distance
   * @param {T} a
   * @param {T} b
   * @return {Number}
   */
  distance: function(a, b)
  {
    return Math.sqrt( this.distanceSq( a, b ) );
  },

  /**
   * Calculates the squared distance between the two values.
   *
   * @method distanceSq
   * @param {T} a
   * @param {T} b
   * @return {Number}
   */
  distanceSq: function(a, b)
  {
    throw 'Calculator.distanceSq not implemented';
  },

  /**
   * Returns the distance the given value is from zero.
   *
   * @method length
   * @param {T} a
   * @return {Number}
   */
  length: function(a)
  {
    return this.distance( a, this.ZERO );
  },

  /**
   * Returns the squared distance the given value is from zero.
   *
   * @method lengthSq
   * @param {T} a
   * @return {Number}
   */
  lengthSq: function(a)
  {
    return this.distanceSq( a, this.ZERO );
  },

  /**
   * Determines whether the given value is valid for this calculator.
   *
   * @method isValid
   * @param {any} a
   * @return {Boolean}
   */
  isValid: function(a)
  {
    throw 'Calculator.isValid not implemented';
  },

  /**
   * Returns whether the given value is not a number or has a component which is
   * not a number.
   *
   * @method isNaN
   * @param {T} a
   * @return {Boolean}
   */
  isNaN: function(a)
  {
    throw 'Calculator.isNaN not implemented';
  },

  /**
   * Determines whether the given value is equivalent to zero given an
   * acceptable distance from zero (epsilon).
   *
   * @method isZero
   * @param {T} a
   * @param {Number} epsilon
   * @return {Boolean}
   */
  isZero: function(a, epsilon)
  {
    throw 'Calculator.isZero not implemented';
  },

  /**
   * Determines whether the given values are equivalent up to an acceptable
   * distance apart.
   *
   * @method isEqual
   * @param {T} a
   * @param {T} b
   * @param {Number} epsilon
   * @return {Boolean}
   */
  isEqual: function(a, b, epsilon)
  {
    throw 'Calculator.isEqual not implemented';
  },

  /**
   * Sets out to the minimum value between the two values and returns out.
   *
   * @method min
   * @param {T} out
   * @param {T} a
   * @param {T} b
   * @return {T}
   */
  min: function(out, a, b)
  {
    throw 'Calculator.min not implemented';
  },

  /**
   * Sets out to the maximum value between two values and returns out.
   *
   * @method max
   * @param {T} out
   * @param {T} a
   * @param {T} b
   * @return {T}
   */
  max: function(out, a, b)
  {
    throw 'Calculator.max not implemented';
  },

  /**
   * Performs the dot product between two values.
   *
   * @param {T} a
   * @param {T} b
   * @return {Number}
   */
  dot: function(a, b)
  {
    throw 'Calculator.dot not implemented';
  },

  /**
   * Clamps out between the given minimum and maximum values and returns out.
   *
   * @method clamp
   * @param {T} out
   * @param {T} min
   * @param {T} max
   * @return {T}
   */
  clamp: function(out, min, max)
  {
    var distSq = this.distanceSq( out, this.ZERO );

    if ( distSq < min * min )
    {
      return this.scale( out, min / Math.sqrt( distSq ) );
    }
    else if ( distSq > max * max )
    {
      return this.scale( out, max / Math.sqrt( distSq ) );
    }

    return out;
  },

  /**
   * Sets the length of the given value and returns the new value.
   *
   * @param {T} out
   * @param {Number} length
   * @return {T}
   */
  setLength: function(out, length)
  {
    var lengthSq = this.lengthSq( out );

    if ( lengthSq !== 0 )
    {
      return this.scale( out, length / Math.sqrt( lengthSq ) );
    }

    return out;
  },

  /**
   * Determines whether the given value appears to be a relative value. Relative
   * values are stored as strings starting with a plus or minus for positive or
   * negative respectively.
   *
   * @method isRelative
   * @param {Any} x
   * @return {Boolean}
   * @protected
   */
  isRelative: function(x)
  {
    return isString( x ) && ( x[0] === '-' || x[0] === '+' );
  },

  /**
   * Returns the relative amount of the given relative value. If the value is
   * not a valid relative value false is returned.
   *
   * @method getRelativeAmount
   * @param {String} x
   * @return {Number}
   * @protected
   */
  getRelativeAmount: function(x)
  {
    var z = parseFloat( x );

    return isNaN(z) ? false : z;
  }

});


/**
 * Instantiates a Defer instance. Defer instances keep track of method calls
 * to call at a later time - after an event occurs. The first argument needs
 * to be a function which returns an instance of anim8.Defer when it's invoked.
 * The second argument is an array of methods that can be deferred.
 *
 * @param {Function} factory
 * @param {Array} methods
 * @class Defer
 * @constructor
 */
function Defer(factory, methods)
{
  this.$factory = factory;

  for (var i = 0; i < methods.length; i++)
  {
    this[ methods[i] ] = this.$push( methods[i] );
  }
}

Class.define( Defer,
{
  /**
   * Resets the defer instance.
   *
   * @method $reset
   * @param {Object} eventable
   * @param {Any} previous
   * @param {String} eventType
   * @param {String} event
   * @param {Function} callback
   */
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

  /**
   * Determines whether this Defer instance is at the root.
   *
   * @method $isRoot
   * @return {Boolean}
   */
  $isRoot: function()
  {
    return this.$eventable === this.$previous;
  },

  /**
   * Registers this Defer instance with the eventable.
   *
   * @method $register
   */
  $register: function()
  {
    this.$eventable[ this.$eventType ]( this.$event, this.$run, this );
  },

  /**
   * Creates a defered function which passes the method and arguments for
   * any method call into an array of calls on this Defer instance.
   *
   * @method $push
   * @param {String} methodName
   * @return {Function}
   */
  $push: function(methodName)
  {
    return function()
    {
      this.$calls.push( [methodName, arguments] );

      return this;
    };
  },

  /**
   * Executes all defered method calls and starts any child Defer instances.
   *
   * @method $run
   */
  $run: function()
  {
    // Invoke the callback if one was given.
    if ( isFunction( this.$callback ) )
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

  /**
   * Returns the object before the defer statement.
   *
   * @method undefer
   * @return {Any}
   */
  undefer: function()
  {
    return this.$previous;
  },

  /**
   * Defers any following method calls to after the given event is triggered. A
   * callback can be specified which is a function invoked after the event is
   * triggered.
   *
   * @method defer
   * @param {String} eventType
   * @param {String} event
   * @param {Function} callback
   * @return {Defer}
   */
  defer: function(eventType, event, callback)
  {
    var next = new this.$factory( this.$eventable, this, eventType, event, callback );

    this.$next.push( next );

    return next;
  }

});


/**
 * Provides the ability to defer method calls until certain events are triggered.
 *
 * @class DeferAnimator
 * @constructor
 * @extends Defer
 */
function DeferAnimator(animator, previous, eventType, event)
{
  this.$reset( animator, previous, eventType, event );
}

/**
 * Creates the Defer prototype for the following Animator methods.
 */
DeferAnimator.prototype = new Defer( DeferAnimator,
[
  /**
   * Defers the {{#crossLink "Animator/restore:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'restore',

  /**
   * Defers the {{#crossLink "Animator/placeAttrimator:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method placeAttrimator
   */
  'placeAttrimator',

  /**
   * Defers the {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method applyInitialState
   */
  'applyInitialState',

  /**
   * Defers the {{#crossLink "Animator/preupdate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method preupdate
   */
  'preupdate',

  /**
   * Defers the {{#crossLink "Animator/update:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method update
   */
  'update',

  /**
   * Defers the {{#crossLink "Animator/apply:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method apply
   */
  'apply',

  /**
   * Defers the {{#crossLink "Animator/trimAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   * @protected
   */
  'trimAttrimators',

  /**
   * Defers the {{#crossLink "Animator/activate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'activate',

  /**
   * Defers the {{#crossLink "Animator/deactivate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'deactivate',

  /**
   * Defers the {{#crossLink "Animator/destroy:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'destroy',

  /**
   * Defers the {{#crossLink "Animator/spring:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'spring',

  /**
   * Defers the {{#crossLink "Animator/play:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'play',

  /**
   * Defers the {{#crossLink "Animator/playAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   * @protected
   */
  'playAttrimators',

  /**
   * Defers the {{#crossLink "Animator/queue:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method queue
   */
  'queue',

  /**
   * Defers the {{#crossLink "Animator/queueAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method queueAttrimators
   * @protected
   */
  'queueAttrimators',

  /**
   * Defers the {{#crossLink "Animator/transition:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method transition
   */
  'transition',

  /**
   * Defers the {{#crossLink "Animator/transitionAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method transitionAttrimators
   * @protected
   */
  'transitionAttrimators',

  /**
   * Defers the {{#crossLink "Animator/tween:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tween
   */
  'tween',

  /**
   * Defers the {{#crossLink "Animator/tweenTo:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenTo
   */
  'tweenTo',

  /**
   * Defers the {{#crossLink "Animator/tweenMany:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenMany
   */
  'tweenMany',

  /**
   * Defers the {{#crossLink "Animator/tweenManyTo:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenManyTo
   */
  'tweenManyTo',

  /**
   * Defers the {{#crossLink "Animator/tweenFrom:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenFrom
   */
  'tweenFrom',

  /**
   * Defers the {{#crossLink "Animator/tweenManyFrom:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenManyFrom
   */
  'tweenManyFrom',

  /**
   * Defers the {{#crossLink "Animator/move:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method move
   */
  'move',

  /**
   * Defers the {{#crossLink "Animator/moveMany:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method moveMany
   */
  'moveMany',

  /**
   * Defers the {{#crossLink "Animator/follow:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method follow
   */
  'follow',

  /**
   * Defers the {{#crossLink "Animator/stop:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method stop
   */
  'stop',

  /**
   * Defers the {{#crossLink "Animator/end:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method end
   */
  'end',

  /**
   * Defers the {{#crossLink "Animator/finish:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method finish
   */
  'finish',

  /**
   * Defers the {{#crossLink "Animator/nopeat:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method nopeat
   */
  'nopeat',

  /**
   * Defers the {{#crossLink "Animator/pause:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method pause
   */
  'pause',

  /**
   * Defers the {{#crossLink "Animator/resume:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method resume
   */
  'resume',

  /**
   * Defers the {{#crossLink "Animator/set:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method set
   */
  'set',

  /**
   * Defers the {{#crossLink "Animator/unset:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method unset
   */
  'unset',

  /**
   * Defers the {{#crossLink "Animator/get:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method get
   */
  'get',

  /**
   * Defers the {{#crossLink "Animator/invoke:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method invoke
   */
  'invoke',

  /**
   * Defers the {{#crossLink "Animator/onCycleStart:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method onCycleStart
   */
  'onCycleStart',

  /**
   * Defers the {{#crossLink "Animator/onCycleEnd:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method onCycleEnd
   */
  'onCycleEnd'
]);


var EasingTypes = {};

/**
 * A collection of easing type functions. An easing type functions takes an
 * easing function as an argument and modifies it's input and output values.
 *
 * **See:** {{#crossLink "Core/anim8.easing"}}{{/crossLink}}
 *
 * @class anim8.easingType
 */

/**
 * Plays the animation forward normally.
 *
 * @method in
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['in'] = function(easing)
{
  return function(x)
  {
    return easing( x );
  };
};

/**
 * Plays the animation forward by flipping the easings momentum.
 *
 * @method out
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['out'] = function(easing)
{
  return function(x)
  {
    return 1.0 - easing( 1.0 - x );
  };
};

/**
 * Plays the animation forward by flipping the easings momentum halfway.
 *
 * @method inout
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['inout'] = function(easing)
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
 * @method yoyo
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['yoyo'] = function(easing)
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
 * @method mirror
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['mirror'] = function(easing)
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
 * @method reverse
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['reverse'] = function(easing)
{
  return function(x)
  {
    return easing( 1.0 - x );
  };
};

/**
 * Plays the animation backwards by flipping the easing's momentum.
 *
 * @method flip
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['flip'] = function(easing)
{
  return function(x)
  {
    return 1.0 - easing( x );
  };
};


/**
 * A collection of easing functions. An easing functions takes a single number
 * as input that's between 0 and 1 inclusively and returns a number that
 * progresses from 0 to 1 but in-between values may return a number that's less
 * than 0 or greater than 1.
 *
 * **See:** {{#crossLink "Core/anim8.easing"}}{{/crossLink}}
 *
 * @class anim8.Easings
 */
var Easings = {};


/**
 * Returns true if the given string would result in returning an easing.
 *
 * **See:** {{#crossLink "Core/anim8.easing"}}{{/crossLink}}
 *
 * @method anim8.isEasingName
 * @for Core
 * @param {String} easing
 * @return {Boolean}
 */
function isEasingName(easing)
{
  if ( easing in Easings )
  {
    return true;
  }

  var pair = easing.split('-');
  var e = pair[0];
  var t = pair[1];

  if ( pair.length >= 2 && e in Easings && t in EasingTypes )
  {
    return true;
  }

  return false;
}

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method linear
 * @for anim8.easing
 */
Easings['linear'] = function(x)
{
  return x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method quad
 * @for anim8.easing
 */
Easings['quad'] = function(x)
{
  return x * x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoKDAuMyooMS14KSooMS14KSp4KSsoMy4wKigxLXgpKngqeCkrKHgqeCp4KSkqKDEteCkreCooMS0oMS14KSooMS14KSooMS14KSooMS14KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method quad
 * @for anim8.easing
 */
Easings['ease'] = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  var x2 = x * x;
  var eq1 = (0.3 * i2 * x) + (3.0 * i * x2) + (x2 * x);
  var eq2 = 1.0 - i2 * i2;

  return eq1 * i + eq2 * x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d)
 *
 * @method cubic
 * @for anim8.easing
 */
Easings['cubic'] = function(x)
{
  return x * x * x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCp4IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method quartic
 * @for anim8.easing
 */
Easings['quartic'] = function(x)
{
  var x2 = x * x;
  return x2 * x2;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJ4KngqeCp4KngiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method quintic
 * @for anim8.easing
 */
Easings['quintic'] = function(x)
{
  var x2 = x * x;
  return x2 * x2 * x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeCp4KngpKyh4KngpLXgiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method back
 * @for anim8.easing
 */
Easings['back'] = function(x)
{
  var x2 = x * x;
  var x3 = x2 * x;
  return x3 + x2 - x;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJzaW4oeCoxLjU3MDc5NjMyNjc5KSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d)
 *
 * @method sine
 * @for anim8.easing
 */
Easings['sine'] = function(x)
{
  return Math.sin( x * 1.57079632679 );
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLXgqKDcuMC8xMCkpKngqKDEwLjAvMy4wKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d)
 *
 * @method overshot
 * @for anim8.easing
 */
Easings['overshot'] = function(x)
{
  return (1.0 - x * (7.0 / 10)) * x * (10.0 / 3.0);
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeCp4KigoMi4wKngqeCp4KSt4KngtKDQuMCp4KSsyLjApKSotc2luKHgqMTAuOTk1NTc0Mjg3NikiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method elastic
 * @for anim8.easing
 */
Easings['elastic'] = function(x)
{
  var x2 = x * x;
  var x3 = x2 * x;
  var scale = x2 * ((2.0 * x3) + x2 - (4.0 * x) + 2.0);
  var wave = -Math.sin(x * 10.9955742876);
  return scale * wave;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJhYnMoeC1zaW4oeCozLjE0MTU5MjY1MzU5KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method revisit
 * @for anim8.easing
 */
Easings['revisit'] = function(x)
{
  return Math.abs( x - Math.sin(x * 3.14159265359) );
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWNvcyh4KngqeCozNi4wKSooMS4wLXgpKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d)
 *
 * @method lasso
 * @for anim8.easing
 */
Easings['lasso'] = function(x)
{
  return (1.0 - Math.cos(x * x * x * 36.0) * (1.0 - x));
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS4wLXgqeCkqY29zKHgqeCp4KjE0LjgwNDQwNjYwMTYpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method slowbounce
 * @for anim8.easing
 */
Easings['slowbounce'] = function(x)
{
  var x2 = x * x;
  return (1.0 - Math.abs((1.0 - x2) * Math.cos(x2 * x * 14.8044066016)));
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS4wLXgpKmNvcyh4KngqMTQuODA0NDA2NjAxNikpKSIsImNvbG9yIjoiIzAwMDAwMCJ9LHsidHlwZSI6MTAwMCwid2luZG93IjpbIi0wLjE5MjUwMDAwMDAwMDAwMDI1IiwiMS40MzI0OTk5OTk5OTk5OTk5IiwiMC4wMTc0OTk5OTk5OTk5OTk4NzciLCIxLjAxNzQ5OTk5OTk5OTk5OTgiXX1d)
 *
 * @method bounce
 * @for anim8.easing
 */
Easings['bounce'] = function(x)
{
  return (1.0 - Math.abs((1.0 - x) * Math.cos(x * x * 14.8044066016)));
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS14KSooMS14KSpjb3MoeCp4KjE0LjgwNDQwNjYwMTYpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method smallbounce
 * @for anim8.easing
 */
Easings['smallbounce'] = function(x)
{
  var inv = 1.0 - x;
  return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 14.8044066016)));
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMS4wLWFicygoMS14KSooMS14KSpjb3MoeCp4KjcpKSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method tinybounce
 * @for anim8.easing
 */
Easings['tinybounce'] = function(x)
{
  var inv = 1.0 - x;
  return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 7.0)));
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoY29zKHgqeCoxMi4wKSp4KigxLjAteCkreCkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method hesitant
 * @for anim8.easing
 */
Easings['hesitant'] = function(x)
{
  return (Math.cos(x * x * 12.0) * x * (1.0 - x) + x);
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiJzcXJ0KHgpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method sqrt
 * @for anim8.easing
 */
Easings['sqrt'] = function(x)
{
  return Math.sqrt( x );
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoKDEuMC0oMS14KSooMS14KSooMS14KSooMS14KSkreCkqMC41IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method sqrtf
 * @for anim8.easing
 */
Easings['sqrtf'] = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  return ((1.0 - i2 * i2) + x) * 0.5;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIobG9nKHgpKzIuMCkqMC41IiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method log10
 * @for anim8.easing
 */
Easings['log10'] = function(x)
{
  return (Math.log10(x + 0.01) + 2.0) * 0.5 / 1.0021606868913213;
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoeDwwLjc_KHgqLTAuMzU3KTooKCh4LTAuNykqKHgtMC43KSoyNy41LTAuNSkqMC41KSkiLCJjb2xvciI6IiMwMDAwMDAifSx7InR5cGUiOjEwMDAsIndpbmRvdyI6WyItMC4xOTI1MDAwMDAwMDAwMDAyNSIsIjEuNDMyNDk5OTk5OTk5OTk5OSIsIjAuMDE3NDk5OTk5OTk5OTk5ODc3IiwiMS4wMTc0OTk5OTk5OTk5OTk4Il19XQ--)
 *
 * @method slingshot
 * @for anim8.easing
 */
Easings['slingshot'] = function(x)
{
  if (x < 0.7) {
    return (x * -0.357);
  } else {
    var d = x - 0.7;
    return ((d * d * 27.5 - 0.5) * 0.5);
  }
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIxLXNxcnQoMS14KngpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method circular
 * @for anim8.easing
 */
Easings['circular'] = function(x)
{
  return 1.0 - Math.sqrt( 1 - x * x );
};

/**
 * [View Easing Function](http://fooplot.com/#W3sidHlwZSI6MCwiZXEiOiIoMy4wKigxLjAteCkqeCp4KSsoeCp4KngpIiwiY29sb3IiOiIjMDAwMDAwIn0seyJ0eXBlIjoxMDAwLCJ3aW5kb3ciOlsiLTAuMTkyNTAwMDAwMDAwMDAwMjUiLCIxLjQzMjQ5OTk5OTk5OTk5OTkiLCIwLjAxNzQ5OTk5OTk5OTk5OTg3NyIsIjEuMDE3NDk5OTk5OTk5OTk5OCJdfV0-)
 *
 * @method gentle
 * @for anim8.easing
 */
Easings['gentle'] = function(x)
{
  return (3.0 * (1.0 - x) * x * x) + (x * x * x);
};

/**
 * Generates a bezier easing function given the two middle control points. The
 * first point is {0,0} and the last point is {1, 1}.
 *
 * @method bezier
 * @for anim8.easing
 * @param {Number} mX1
 * @param {Number} mY1
 * @param {Number} mX2
 * @param {Number} mY2
 * @return {Function}
 */
Easings['bezier'] = function(mX1, mY1, mX2, mY2)
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
      if (currentSlope === 0.0) {
        return aGuessT;
      }
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
 * Possible states an event can be in.
 *
 * @type {Object}
 */
var EventState =
{
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  FINISHED: 8
};

/**
 * Instantiates a new Event which extends Attrimator.
 *
 * @param {String} attribute
 * @param {Path} path
 * @param {String|Number} duration
 * @param {String|Function|Array} easing
 * @param {String|Number} delay
 * @param {String|Number} sleep
 * @param {String|Number} offset
 * @param {String|Number} repeat
 * @param {Number} scale
 * @param {T|Number} scaleBase
 * @param {Boolean} hasInitialState
 * @param {Builder} builder
 * @param {Attrimator} next
 * @param {Object} input
 * @param {Number} mergeId
 * @class Event
 * @constructor
 * @extends Attrimator
 */
function Event(attribute, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, hasInitialState, builder, next, input, mergeId)
{
  this.reset( attribute, builder, next );

  /**
   * The path the attribute will be animated along.
   *
   * @property {Path} path
   */
  this.path             = path;

  /**
   * The easing used to modify the delta value passed to the path.
   *
   * **See:** {{#crossLink "Core/anim8.easing:method"}}{{/crossLink}}
   *
   * @property {Function} easing
   */
  this.easing           = $easing( easing );

  /**
   * The amount of time in milliseconds to animate an attribute over the path.
   *
   * **See:** {{#crossLink "Core/anim8.duration:method"}}{{/crossLink}}
   *
   * @property {Number} duration
   */
  this.duration         = $duration( duration );

  /**
   * If this event repeats more than once, this is a pause between animations.
   *
   * **See:** {{#crossLink "Core/anim8.sleep:method"}}{{/crossLink}}
   *
   * @property {Number} sleep
   */
  this.sleep            = $sleep( sleep );

  /**
   * The number of times to repeat the animation.
   *
   * **See:** {{#crossLink "Core/anim8.repeat:method"}}{{/crossLink}}
   *
   * @property {Number} repeat
   */
  this.repeat           = $repeat( repeat );

  /**
   * The amount to scale the value computed from the path.
   *
   * **See:** {{#crossLink "Core/anim8.scale:method"}}{{/crossLink}}
   *
   * @property {T} scale
   */
  this.scale            = $scale( scale );

  /**
   * The base value from which to scale from. This is essentially this data
   * types default value.
   *
   * @property {T} scaleBase
   */
  this.scaleBase        = path.calculator.parse( scaleBase, path.calculator.ZERO );

  /**
   * Whether or not this event has an initial value which can be applied at the
   * start of the animation (or when
   * {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} is invoked).
   *
   * @property {Boolean} hasInitialState
   */
  this.hasInitialState  = coalesce( hasInitialState, true );

  this.delay            = $delay( delay );
  this.offset           = $offset( offset );

  this.input            = input;
  this.mergeId          = mergeId;
}

Class.extend( Event, Attrimator,
{
  /**
   * Returns the computed value given a base value and a delta along the path.
   *
   * @method computeValue
   * @param {T} baseValue
   * @param {Number} delta
   * @return {T}
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
   * Applies the value to the frame and returns true, otherwise returns false.
   *
   * @method applyValue
   * @param {Object} frame
   * @param {T} baseValue
   * @param {Number} delta
   * @return {T}
   */
  applyValue: function(frame, baseValue, delta)
  {
    var value = baseValue;

    // TODO pull defaultValue from attribute
    if (!this.path.calculator.isValid( baseValue ))
    {
      value = this.path.calculator.create();
    }

    value = this.computeValue( value, delta );

    if ( value !== false )
    {
      frame[ this.attribute ] = value;
    }

    return value;
  },

  nopeat: function()
  {
    var newRepeat = clamp( Math.ceil( ( this.elapsed - this.delay ) / ( this.duration + this.sleep ) ), 0, this.repeat );

    if ( newRepeat !== this.repeat )
    {
      this.repeat = newRepeat;
      this.prestartNext( true );
    }

    return this;
  },
  finish: function(frame)
  {
    this.applyValue( frame, this.path.calculator.create(), 1.0 );
    this.state = EventState.FINISHED;
  },
  start: function(now, animator)
  {
    this.prestart( now );

    this.state = this.delay ? EventState.DELAYED : EventState.ANIMATING;

    if ( this.hasComputed() )
    {
      this.path = this.path.replaceComputed( this, animator );
    }
  },
  startCycle: function(frame)
  {
    if ( this.hasInitialState )
    {
      this.applyValue( frame, frame[ this.attribute ], 0 );

      return true;
    }

    return false;
  },
  update: function(elapsed, frame)
  {
    var updated = false;
    var delay = this.delay;
    var duration = this.duration;
    var sleep = this.sleep;
    var repeat = this.repeat;
    var oldState = this.state;
    var newState = this.state;
    var delta = 0;

    elapsed -= delay;

    var cycle = duration + sleep;
    var iteration = Math.floor( elapsed / cycle );

    if ( iteration >= repeat )
    {
      newState = EventState.FINISHED;
      delta = 1;
    }
    else
    {
      elapsed -= iteration * cycle;

      if ( elapsed > duration )
      {
        newState = EventState.SLEEPING;
        delta = 1;
      }
      else
      {
        newState = EventState.ANIMATING;
        delta = elapsed / duration;
      }
    }

    if ( newState === EventState.ANIMATING ||
       ( newState !== EventState.ANIMATING && oldState === EventState.ANIMATING ) )
    {
      this.applyValue( frame, frame[ this.attribute ], delta );
      updated = true;
    }

    this.state = newState;

    return updated;
  },
  valueAt: function(time, out)
  {
    if ( time < this.delay && !this.hasInitialState )
    {
      return false;
    }

    var delta = 0;

    if ( time >= this.delay )
    {
      var cycle = (this.duration + this.sleep);
      var elapsed = (time - this.delay);
      var iteration = Math.floor( elapsed / cycle );

      if ( iteration >= this.repeat )
      {
        delta = 1.0;
      }
      else
      {
        delta = Math.min( 1.0, (elapsed % cycle) / this.duration );
      }
    }

    return this.computeValue( out, delta );
  },
  totalTime: function()
  {
    var sleepTime = this.sleep ? ((this.repeat - 1) * this.sleep) : 0;
    var animateTime = (this.repeat * this.duration);

    return Math.min( this.stopTime, this.delay + animateTime + sleepTime );
  },
  clone: function()
  {
    return new Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.offset, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.builder, this.next ? this.next.clone() : null, this.input );
  },
  hasComputed: function()
  {
    return this.path.computed;
  },
  isInfinite: function()
  {
    return !isFinite( this.repeat ) && !isFinite( this.stopTime );
  },
  isFinished: function()
  {
    return (this.state === EventState.FINISHED);
  }

});

/**
 * Returns an Event given the attribute, the path, and a parsed options object.
 *
 * **See:** {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method fromOptions
 * @for Event
 * @param  {String} attr
 * @param  {Path} path
 * @param  {Object} options
 * @return {Event}
 */
Event.fromOptions = function(attr, path, options)
{
  return new Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.offset, options.repeat, options.scale, options.scaleBase );
};


/**
 * A factory creates Animator instances for subjects.
 *
 * @class Factory
 * @constructor
 */
function Factory()
{
  this.priority = 0;
}

Class.define( Factory,
{

  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   *
   * @method is
   * @param  {Any} subject
   * @return {Boolean}
   */
  is: function(subject)
  {
    throw 'Factory.is not implemented';
  },

  /**
   * Returns an animator given a subject.
   *
   * @method animatorFor
   * @param  {Any} subject
   * @return {Animator}
   */
  animatorFor: function(subject)
  {
    throw 'Factory.animatorFor not implemented';
  },

  /**
   * Explodes the given subject to an array of Animators and adds them to the given array.
   *
   * @method animatorsFor
   * @param {Any} subject
   * @param {Array} animators
   */
  animatorsFor: function(subject, animators)
  {
    animators.push( this.animatorFor( subject ) );
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   *
   * @method destroy
   * @param {Animator} animator
   */
  destroy: function(animator)
  {

  },

  /**
   * Returns the attribute descriptor for the given attribute. An attribute
   * descriptor is an object with at least the following properties:
   *
   * - `name` = the name of the attribute (same as `attr`)
   * - `calculatorName` = the name of the calculator for the attribute
   * - `calculator` = the calculator for the attribute
   * - `defaultValue` = the default value for the attribute
   * - `parse` = a method to pass a value and have the calculator parse it and
   *             return the defaultValue if it was invalid
   * - `cloneDefault` = a method which returns a clone of the default value
   *
   * @method attribute
   * @param {String} attr
   * @return {Object}
   */
  attribute: function(attr)
  {
    throw 'Factory.attribute not implemented';
  }

});


/**
 * A FastMap has the key-to-value benefits of a map and iteration benefits of an
 * array. This is especially beneficial when most of the time the contents of
 * the structure need to be iterated and order doesn't matter (since removal
 * performs a swap which breaks insertion order).
 *
 * @param {FastMap|Object} map
 * @class FastMap
 * @constructor
 */
function FastMap(map)
{
  this.reset();

  if ( map instanceof FastMap )
  {
    this.putMap( map );
  }
  else if ( isObject( map ) )
  {
    for (var prop in map)
    {
      this.put( prop, map[ prop ] );
    }
  }
}

Class.define( FastMap,
{

  /**
   * Resets the map by initializing the values, keys, and indexes.
   *
   * @method reset
   * @chainable
   */
  reset: function()
  {
    /**
     * An array of the values in this map.
     *
     * @property {Array} values
     */
    this.values = [];

    /**
     * An array of the keys in this map.
     *
     * @property {Array} keys
     */
    this.keys = [];

    /**
     * An object of key to index mappings.
     *
     * @property {Object} indices
     */
    this.indices = {};

    return this;
  },

  /**
   * Puts the value in the map by the given key.
   *
   * @method put
   * @param {String} key
   * @param {V} value
   * @chainable
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
   * Changes the given key to another.
   *
   * @method rekey
   * @param {String} fromKey
   * @param {String} toKey
   * @chainable
   */
  rekey: function(fromKey, toKey)
  {
    if ( fromKey in this.indices )
    {
      var index = this.indices[ fromKey ];
      this.keys[ index ] = toKey;
      this.indices[ toKey ] = index;
      delete this.indices[ fromKey ];
    }

    return this;
  },

  /**
   * Puts all keys & values on the given map into this map overwriting any existing values mapped by similar keys.
   *
   * @method putMap
   * @param {FastMap} map
   * @chainable
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
   * @method get
   * @param {String} key
   * @return {V}
   */
  get: function(key)
  {
    return this.values[ this.indices[ key ] ];
  },

  /**
   * Removes the value by a given key
   *
   * @method remove
   * @param {String} key
   * @chainable
   */
  remove: function(key)
  {
    var index = this.indices[ key ];

    if ( isNumber( index ) )
    {
      this.removeAt( index );
    }

    return this;
  },

  /**
   * Removes the value & key at the given index.
   *
   * @method removeAt
   * @param {Number} index
   * @chainable
   */
  removeAt: function(index)
  {
    var key = this.keys[ index ];
    var lastValue = this.values.pop();
    var lastKey = this.keys.pop();

    if ( index < this.values.length )
    {
      this.values[ index ] = lastValue;
      this.keys[ index ] = lastKey;
      this.indices[ lastKey ] = index;
    }

    delete this.indices[ key ];

    return this;
  },

  /**
   * Returns the index of the value in the array given a key.
   *
   * @method indexOf
   * @param {String} key
   * @return {Number}
   */
  indexOf: function(key)
  {
    return coalesce( this.indices[ key ], -1 );
  },

  /**
   * Returns whether this map has a value for the given key.
   *
   * @method has
   * @param {String} key
   * @return {Boolean}
   */
  has: function(key)
  {
    return key in this.indices;
  },

  /**
   * Returns whether the given input has overlap with keys in this map.
   *
   * @method hasOverlap
   * @param {FastMap|Object} map
   * @return {Boolean}
   */
  hasOverlap: function(map)
  {
    var keys = this.keys;
    var indices = map.indices;

    for (var i = 0; i < keys.length; i++)
    {
      if ( keys[i] in indices )
      {
        return true;
      }
    }

    return false;
  },

  /**
   * Returns the number of elements in the map.
   *
   * @method size
   * @return {Number}
   */
  size: function()
  {
    return this.values.length;
  },

  /**
   * Clears all keys & values from the map.
   *
   * @method clear
   * @chainable
   */
  clear: function()
  {
    this.values.length = 0;
    this.keys.length = 0;
    this.indices = {};

    return this;
  }

});


/**
 * Instantiates a new Oncer which extends Attrimator.
 *
 * @param {String} attribute
 * @param {T} value
 * @param {String|Number} delay
 * @param {Boolean} hasInitialState
 * @param {Builder} builder
 * @param {Attrimator} next
 * @class Oncer
 * @constructor
 * @extends Attrimator
 */
function Oncer( attribute, value, delay, hasInitialState, builder, next, input )
{
  this.reset( attribute, builder, next );

  /**
   * The value that's set to the animator once.
   *
   * @property {T} value
   */
  this.value = value;

  /**
   * Whether or not this event has an initial value which can be applied at the
   * start of the animation (or when
   * {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} is invoked).
   *
   * @property {Boolean} hasInitialState
   */
  this.hasInitialState  = coalesce( hasInitialState, true );

  this.delay            = $delay( delay );
  this.applied          = false;
  this.input            = input;
}

Class.extend( Oncer, Attrimator,
{
  /**
   * Computes the value of this Oncer.
   *
   * @method getValue
   * @return {T}
   */
  getValue: function()
  {
    return isFunction( this.value ) ? this.value() : this.value;
  },

  finish: function(frame)
  {
    var update = !this.applied;

    if ( update )
    {
      frame[ this.attribute ] = this.getValue();

      this.applied = true;
    }

    return update;
  },

  start: function(now, animator)
  {
    this.prestart( now );

    this.value = animator.getAttribute( this.attribute ).parse( this.value );

    if ( isComputed( this.value ) )
    {
      this.value = this.value( this, animator );
    }

    this.applied = false;
  },

  startCycle: function(frame)
  {
    return this.hasInitialState && this.finish( frame );
  },

  update: function(elapsed, frame)
  {
    return elapsed >= this.delay && this.finish( frame );
  },

  valueAt: function(time, out)
  {
    if ( time < this.delay )
    {
      return false;
    }

    return this.getValue();
  },

  totalTime: function()
  {
    return Math.min( this.stopTime, this.delay );
  },

  clone: function()
  {
    return new Oncer( this.attribute, this.value, this.delay, this.hasInitialState, this.builder, this.next ? this.next.clone() : null );
  },

  hasComputed: function()
  {
    return isComputed( this.value );
  },

  isInfinite: function()
  {
    return false;
  },

  isFinished: function()
  {
    return this.applied;
  }
  
});


/**
 * Path class computes a value given a delta value [0, 1].
 *
 * @class Path
 * @constructor
 */
function Path()
{
}

Class.define( Path,
{

  /**
   * Resets the path with the given name, calculator, and points.
   *
   * @method reset
   * @param {String|false} name
   * @param {anim8.Calculator} calculator
   * @param {Array} points
   */
  reset: function(calculator, points)
  {
    this.calculator = $calculator( calculator );
    this.points = points;
    this.computed = this.hasComputed();
    this.deterministic = this.isDeterministic();
  },

  /**
   * Computes a value at the given delta setting and returning out.
   *
   * @method compute
   * @param {T} out
   * @param {Number} delta
   * @return {T}
   */
  compute: function(out, delta)
  {
    throw 'Path.compute not implemented';
  },

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   *
   * @method hasComputed
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return this.examinePoints( isComputed, true, false );
  },

  /**
   * Determines if this path has at least one computed value.
   *
   * **See:** {{#crossLink "anim8.computed"}}{{/crossLink}}
   *
   * @method isDeterministic
   * @return {Boolean}
   */
  isDeterministic: function()
  {
    return this.examinePoints( isFunction, false, true );
  },

  /**
   * Examines the points in the path by passing each point to the examiner
   * function. If the examiner function returns true then `returnOnTrue` true
   * is returned immediately, otherwise `returnOnFalse` is returned.
   *
   * @method examinePoints
   * @param {Function} examiner
   * @param {Any} returnOnTrue
   * @param {Any} returnOnFalse
   * @return {Any}
   */
  examinePoints: function(examiner, returnOnTrue, returnOnFalse)
  {
    var ps = this.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( examiner( ps[ i ] ) )
      {
        return returnOnTrue;
      }
    }

    return returnOnFalse;
  },

  /**
   * Replaces any computed values in this path with the result from invoking
   * the function and returns a clone of this path.
   *
   * @method replaceComputed
   * @return {anim8.Path}
   */
  replaceComputed: function(event, animator)
  {
    var clone = this.copy();
    var ps = clone.points;

    for (var i = 0; i < ps.length; i++)
    {
      if ( isComputed( ps[i] ) )
      {
        ps[i] = ps[i]( event, animator );
      }
    }

    return clone;
  },

  /**
   * Resolves and returns the point at the given index.
   *
   * @method resolvePoint
   * @param {Number} i
   * @return {T}
   */
  resolvePoint: function(i)
  {
    return resolve( this.points[ i ] );
  },

  /**
   * Returns whether the path is linear. Linear paths go directly from point to
   * point where curved paths do not. Linear paths can have their length
   * calculated fairly easily however curves you must compute length with a
   * given granularity.
   *
   * @method isLinear
   * @return {Boolean}
   */
  isLinear: function()
  {
    return true;
  },

  /**
   * Computes the length of the Path with a given granularity. Granularity is
   * used for non-linear paths - it's the number of segments are calculated on
   * the path where the length of the segments are summed and returned as the
   * length.
   *
   * @method length
   * @param {Number} granularity
   * @return {Number}
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
      var delta = deltadelta;
      var prev = calc.clone( this.resolvePoint( 0 ) );
      var temp = calc.create();

      for (var i = 1; i <= granularity; i++)
      {
        var next = this.compute( temp, delta );

        distance += calc.distance( prev, next );
        delta += deltadelta;

        temp = prev;
        prev = next;
      }
    }

    return distance;
  }

});


/**
 * Animates a single attribute with a velocity and acceleration.
 *
 * @param {String} attribute
 * @param {Builder} builder
 * @param {Calculator} calculator
 * @param {T} position
 * @param {T} velocity
 * @param {T} acceleration
 * @param {Number} terminal
 * @param {Number} stopTime
 * @class Physics
 * @constructor
 * @extends Attrimator
 */
function Physics( attribute, builder, calculator, position, velocity, acceleration, terminal, stopTime )
{
  this.reset( attribute, builder, null );

  this.calculator   = calculator;
  this.position     = position;
  this.velocity     = velocity;
  this.acceleration = acceleration;
  this.terminal     = $number( terminal, Number.POSITIVE_INFINITY );
  this.stopTime     = $time( stopTime, Number.POSITIVE_INFINITY );
  this.finished     = false;
}

Class.extend( Physics, Attrimator,
{
  /**
   * Parses a value for the animator given a default value.
   *
   * @method parseValue
   * @param {anim8.Animator} animator.
   * @param {T} value
   * @param {T} defaultValue
   * @return {T}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( isComputed( parsed ) )
    {
       parsed = parsed( this, animator );
    }

    return parsed;
  },

  /**
   * Resolves the velocity to a value.
   *
   * @method resolveVelocity
   * @return {T}
   */
  resolveVelocity: function()
  {
    return resolve( this.velocity );
  },

  /**
   * Resolves the acceleration to a value.
   *
   * @method resolveAcceleration
   * @return {T}
   */
  resolveAcceleration: function()
  {
    return resolve( this.acceleration );
  },

  start: function(now, animator)
  {
    this.prestart( now );

    var attribute = animator.getAttribute( this.attribute );
    var calc = $calculator( coalesce( this.calculator, attribute.calculator ) );

    this.calculator     = calc;
    this.position       = this.parseValue( animator, this.position, attribute.defaultValue );
    this.initalPosition = calc.clone( this.position );
    this.velocity       = this.parseValue( animator, this.velocity, calc.ZERO );
    this.acceleration   = this.parseValue( animator, this.acceleration, calc.ZERO );
    this.temp           = calc.create();
  },

  hasComputed: function()
  {
    return isComputed( this.position ) ||
           isComputed( this.velocity ) ||
           isComputed( this.acceleration );
  },

  update: function(elapsed, frame)
  {
    var value = this.valueAt( elapsed, this.temp, true );

    if ( value !== false )
    {
      frame[ this.attribute ] = this.position = value;

      return true;
    }

    var calc = this.calculator;
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, Physics.MAX_DT );
    var vel = calc.copy( this.temp, this.resolveVelocity() );
    var acc = this.resolveAcceleration();
    var pos = this.position;

    vel = calc.adds( vel, acc, dt );

    if ( isFinite( this.terminal ) )
    {
      vel = calc.clamp( vel, 0, this.terminal );
    }

    pos = calc.adds( pos, vel, dt );

    this.position = pos;

    if ( !isFunction( this.velocity ) )
    {
      this.velocity = calc.copy( this.velocity, vel );
    }

    frame[ this.attribute ] = pos;

    return true;
  },

  valueAt: function(time, out, usePosition)
  {
    if ( isFunction( this.velocity ) || isFunction( this.acceleration ) || this.terminal !== Number.POSITIVE_INFINITY )
    {
      return false;
    }

    time -= this.delay;
    time *= 0.001;

    var calc = this.calculator;
    var value = usePosition ? calc.copy( this.position, this.initalPosition ) : calc.copy( out, this.initalPosition );
    value = calc.adds( value, this.velocity, time );
    value = calc.adds( value, this.acceleration, time * time );

    return value;
  },

  clone: function()
  {
    return new Physics( this.attribute, this.builder, this.calculator, this.position, this.velocity, this.acceleration, this.terminal, this.stopTime );
  },

  finish: function(frame)
  {
    this.finished = true;

    return true;
  },

  isFinished: function()
  {
    return this.finished;
  }

});

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
Physics.MAX_DT = 0.1;


/**
 * Creates a seqeuence for the given animators offseting animations be the given
 * delay and easing.
 *
 * @param {Animators} animators
 * @param {String|Number} delay
 * @param {String|Array|Function} easing
 * @class Sequence
 * @constructor
 */
function Sequence(animators, delay, easing)
{
  /**
   * The animators to play a sequence of animations against.
   *
   * @property {Animators} animators
   */
  this.animators = animators;

  /**
   * The delay in milliseconds between animations.
   *
   * @property {Number} delay
   */
  this.delay = $delay( delay );

  /**
   * The easing function to use to calculate the delay offset for an animation.
   *
   * @property {Function} easing
   */
  this.easing = $easing( easing );
}

Class.define( Sequence,
{
  /**
   * Returns the maximum delay for delaying generated attrimators.
   *
   * @method maxDelay
   * @return {Number}
   */
  maxDelay: function()
  {
    return this.delay * (this.animators.length() - 1);
  },

  /**
   * Creates an AttrimatorMap with the given options for the animator at the
   * given index.
   *
   * @method createAttrimators
   * @param {Animation} animation
   * @param {Object} options
   * @param {Number} i
   * @return {AttrimatorMap}
   */
  createAttrimators: function(template, i)
  {
    var attrimatorMap = template.clone();
    var attrimators = attrimatorMap.values;
    var delta = i / (this.animators.length() - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();

    for (var k = attrimators.length - 1; k >= 0; k--)
    {
      attrimators[ k ].delay += delayOffset;
    }

    return attrimatorMap;
  },

  /**
   * Reverses the sequence by reversing the underlying array of animators.
   *
   * @method reverse
   * @chainable
   */
  reverse: function()
  {
    this.animators.reverse();

    return this;
  },

  /**
   * Plays the animation across the animators in this sequence.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/play:method"}}Animator.play{{/crossLink}}
   *
   * @method play
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  play: function(animation, options, all, cache)
  {
    var template = $attrimatorsFor( animation, options, cache );
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( template, i );

      animator.newCycle( attrimators );
      animator.playAttrimators( attrimators, all );
    });

    return this.add();
  },

  /**
   * Queues the animation across the animators in this sequence.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/queue:method"}}Animator.queue{{/crossLink}}
   *
   * @method queue
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  queue: function(animation, options, cache)
  {
    var template = $attrimatorsFor( animation, options, cache );
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
      var attrimatorMap = sequence.createAttrimators( template, i );
      var attrimators = attrimatorMap.values;

      for (var k = attrimators.length - 1; k >= 0; k--)
      {
        attrimators[ k ].delay += delayOffset;
      }

      animator.newCycle( attrimatorMap );
      animator.queueAttrimators( attrimatorMap );
    });

    return this.add();
  },

  /**
   * Transitions into the animation across the animators in this sequence.
   *
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/transition:method"}}Animator.transition{{/crossLink}}
   *
   * @method transition
   * @param {String|Array|Object} transition
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = $transition( transition );
    var template = $attrimatorsFor( animation, options, cache );
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( template, i );

      animator.newCycle( attrimators );
      animator.transitionAttrimators( transition, attrimators, all );
    });

    return this.add();
  },

  /**
   * Activates all animators in this sequence and returns this.
   *
   * **See:** {{#crossLink "Animator/activate:method"}}Animator.activate{{/crossLink}}
   *
   * @method add
   * @chainable
   */
  add: function()
  {
    this.animators.activate();

    return this;
  }

});


/**
 * A spring has a resting point, a current position, and the velocity currently
 * enacting on the position based on the implementing classes logic.
 *
 * @class Spring
 * @constructor
 * @extends Attrimator
 */
function Spring()
{
}

Class.extend( Spring, Attrimator,
{

  /**
   * Resets the spring's properties.
   *
   * @method set
   * @param {String} attribute
   * @param {Calculator|String} calculator
   * @param {T|Function|true} rest
   * @param {T|Function|true} position
   * @param {T|Function|true} velocity
   * @param {T|Function|true} gravity
   * @param {Boolean} finishOnRest
   */
  set: function(attribute, calculator, rest, position, velocity, gravity, finishOnRest)
  {
    this.reset( attribute, null, null );

    this.calculator   = calculator;
    this.rest         = rest;
    this.position     = position;
    this.gravity      = gravity;
    this.velocity     = velocity;
    this.finishOnRest = finishOnRest;
  },

  /**
   * Resolves the rest to the expected format.
   *
   * @method resolveRest
   * @return {T}
   */
  resolveRest: function()
  {
    return resolve( this.rest );
  },

  /**
   * Method that's invoked on each spring update.
   *
   * @method updateVelocity
   * @param {Number} dt
   */
  updateVelocity: function(dt)
  {
    throw 'Spring.updateVelocity not implemented';
  },

  start: function(now, animator)
  {
    this.prestart( now );

    var attribute = animator.getAttribute( this.attribute );
    var calc = $calculator( coalesce( this.calculator, attribute.calculator ) );

    this.calculator = calc;
    this.rest       = this.parseValue( animator, this.rest, attribute.defaultValue );
    this.position   = this.parseValue( animator, this.position, attribute.defaultValue );
    this.gravity    = this.parseValue( animator, this.gravity, calc.ZERO );
    this.velocity   = this.parseValue( animator, this.velocity, calc.ZERO );
  },

  hasComputed: function()
  {
    return isComputed( this.rest ) ||
           isComputed( this.position ) ||
           isComputed( this.gravity ) ||
           isComputed( this.velocity );
  },

  update: function(elapsed, frame)
  {
    var calc = this.calculator;

    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (elapsed - this.elapsed) * 0.001, Spring.MAX_DT );

    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.clone( this.position );

    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );

    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, Spring.EPSILON );

    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    else if ( this.finishOnRest && calc.isZero( this.velocity ) )
    {
      this.finished = true;
    }

    return updated;
  },

  finish: function(frame)
  {
    this.finished = true;

    return true;
  },

  isFinished: function()
  {
    return this.finished;
  }
});

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
Spring.EPSILON = 0.0001;


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
function anim8(subject)
{
  if ( subject instanceof Animator )
  {
    return subject;
  }

  var factory = $factoryFor( subject, true );

  if ( factory === false )
  {
    return false;
  }

  return factory.animatorFor( subject );
}

/**
 * Add events to the animation cycle: begin, end, finished, starting
 */
eventize( anim8 );

/**
 * Converts an array of subjects into an array of Animators.
 *
 * @param {Array} subject
 * @return {Animators}
 * @method anim8s
 */
function anim8s(subjects)
{
  var factory = $factoryFor( subjects, true );
  var animators = [];

  if ( factory !== false )
  {
    factory.animatorsFor( subjects, animators );

    return new Animators( animators );
  }

  if ( !isArray( subjects ) )
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

  return new Animators( animators );
}

/**
 * Whether the animation cycle is currently running. This is true
 * when where are active animators and anim8.run is being called
 * and false otherwise.
 *
 * @property {Boolean} anim8.running
 * @readOnly
 */
var running = false;

/**
 * Live Mode keeps the animation cycles running even when there aren't
 * Animators. For highly interactive applications enabling this may
 * take up more resources but it will result in smoother animations. When
 * the animation cycle goes from stopped to running it takes a few frames
 * to smooth out when this is false.
 *
 * @property {Boolean} anim8.live
 */
var live = false;

/**
 * The anim8 instance for all active animators.
 *
 * @property {Animators} anim8.animating
 * @readOnly
 */
var animating = new Animators();


function isRunning()
{
  return running;
}

function isLive()
{
  return live;
}

function setLive(newLive)
{
  live = newLive;
}

/**
 * Adds an animator to the list of animating if it isn't there already. If the
 * animation loop isn't currently running it's started.
 *
 * @method anim8.add
 * @param {Animator} animator
 */
function activateAnimator(animator)
{
  pushAnimator( animator );

  activate();
}

function pushAnimator(animator)
{
  if ( !animator.active )
  {
    animator.active = true;
    animating.push( animator );
  }
}

function activate()
{
  if ( !running )
  {
    running = true;

    anim8.trigger('starting');

    requestRun( run );
  }
}

/**
 * The function to call if animations need to be done.
 *
 * @method anim8.requestRun
 * @param {Function} callback
 */
var requestRun = (function()
{
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var requestor = global.requestAnimationFrame;

  for (var x = 0; x < vendors.length && !requestor; ++x)
  {
    requestor = global[ vendors[x] + 'RequestAnimationFrame' ];
  }

  if (!requestor)
  {
    var lastTime = 0;

    return function(callback)
    {
      var currentTime = now();
      var timeToCall = Math.max( Defaults.pauseTime, Defaults.frameRate - (currentTime - lastTime) );
      var id = global.setTimeout( function() { callback( currentTime + timeToCall ); }, timeToCall );
      lastTime = currentTime + timeToCall;
      return id;
    };
  }

  return function(callback)
  {
    requestor( callback );
  };

})();

/**
 * Executes an animation loop cycle which consists of four operations:
 *
 * 1. Call preupdate on all Animators
 * 2. Call update on all Animators
 * 3. Call apply on all Animators
 * 4. Remove finished Animators
 *
 * When there are no more animating the loop cycle is stopped.
 *
 * @method anim8.run
 */
function run()
{
  anim8.trigger('begin');

  var currentTime = now();
  var active = animating.length();

  // notify animators that we're about to update
  animating.preupdate( currentTime, active );

  // update animating based on the current time
  animating.update( currentTime, active );

  // apply the attributes calculated
  animating.apply( active );

  // if the animator is done remove it
  animating.filter( animating.handleFinished );

  // The loop has ended!
  anim8.trigger('end');

  // if there are animators still remaining call me again!
  if ( animating.length() || live )
  {
    requestRun( run );
  }
  else
  {
    running = false;

    anim8.trigger('finished');
  }
}

/**
 * Pauses all animators.
 *
 * **See:** {{#crossLink "Animator/pause:method"}}{{/crossLink}}
 *
 * @method anim8.pause
 * @param {String|Array} attributes
 * @return {anim8}
 */
function pause(attributes)
{
  animating.pause( attributes );

  return anim8;
}

/**
 * Resumes all animators.
 *
 * **See:** {{#crossLink "Animator/resume:method"}}{{/crossLink}}
 *
 * @method anim8.resume
 * @param {String|Array} attributes
 * @return {anim8}
 */
function resume(attributes)
{
  animating.resume( attributes );

  return anim8;
}

/**
 * Stops all animators.
 *
 * **See:** {{#crossLink "Animator/stop:method"}}{{/crossLink}}
 *
 * @method anim8.stop
 * @param {String|Array} attributes
 * @return {anim8}
 */
function stop(attributes)
{
  animating.stop( attributes );

  return anim8;
}

/**
 * Ends all animators.
 *
 * **See:** {{#crossLink "Animator/end:method"}}{{/crossLink}}
 *
 * @method anim8.end
 * @param {String|Array} attributes
 * @return {anim8}
 */
function end(attributes)
{
  animating.end( attributes );

  return anim8;
}

/**
 * Finishes all animators.
 *
 * **See:** {{#crossLink "Animator/finish:method"}}{{/crossLink}}
 *
 * @method anim8.finish
 * @param {String|Array} attributes
 * @return {anim8}
 */
function finish(attributes)
{
  animating.finish( attributes );

  return anim8;
}

/**
 * Interrupts all animators from repeating currently running animations.
 *
 * **See:** {{#crossLink "Animator/nopeat:method"}}{{/crossLink}}
 *
 * @method anim8.nopeat
 * @param {String|Array} attributes
 * @return {anim8}
 */
function nopeat(attributes)
{
  animating.nopeat( attributes );

  return anim8;
}


/**
 * Instantiates a new color given red, green, blue, and white components.
 * If a component is missed it's default value is either 255 (white) or
 * 1.0 (opaque).
 *
 * @method anim8.color
 * @for Core
 * @param {Number} [r=255]
 * @param {Number} [g=255]
 * @param {Number} [b=255]
 * @param {Number} [a=1]
 * @return {Object}
 */
function Color(r, g, b, a)
{
  return {
    r: coalesce( r, 255 ),
    g: coalesce( g, 255 ),
    b: coalesce( b, 255 ),
    a: coalesce( a, 1.0 )
  };
}

/**
 * The array of parsing methods to execute sequentally until a color is returned.
 */
Color.parsers =
[
  { /* already parsed color */
    parse: function(input) {
      if (typeof input === 'object') {
        var color = {
          r: this.parseComponent(input.r, parseInt, 255),
          g: this.parseComponent(input.g, parseInt, 255),
          b: this.parseComponent(input.b, parseInt, 255),
          a: this.parseComponent(input.a, parseFloat, 1.0)
        };
        return color;
      }
      return false;
    },
    parseComponent: function(c, parseFunction, max) {
      var t = typeof c;
      var v = max;
      if (t === 'string') {
        var vparsed = parseFunction(t, 10);
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
    regex: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i,
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
    regex: /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.\d+|[01])\)$/i,
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
 * @method anim8.color.parse
 * @for Core
 * @param {String} input
 * @return {Object|False}
 */
Color.parse = function(input)
{
  var cp = Color.parsers;

  for (var i = 0; i < cp.length; i++)
  {
    var parsed = cp[ i ].parse( input );

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
 * @method anim8.color.format
 * @for Core
 * @param {Object} color
 * @return {String}
 */
Color.format = function(color)
{
  var ca = clamp( coalesce( color.a, 1.0 ), 0, 1 );
  var cr = Math.floor( clamp( coalesce( color.r, 255 ), 0, 255 ) );
  var cg = Math.floor( clamp( coalesce( color.g, 255 ), 0, 255 ) );
  var cb = Math.floor( clamp( coalesce( color.b, 255 ), 0, 255 ) );

  if (ca === 1.0)
  {
    var r = cr.toString( 16 );
    var g = cg.toString( 16 );
    var b = cb.toString( 16 );

    if (r.length === 1) {
      r = '0' + r;
    }
    if (g.length === 1) {
      g = '0' + g;
    }
    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }
  else
  {
    return 'rgba(' + cr + ',' + cg + ',' + cb + ',' + ca + ')';
  }
};



/**
 * A collection of computed functions. Computed functions are functions that
 * are invoked once at the start of an animation given the
 * {{#crossLink "Attrimator"}}{{/crossLink}} and
 * {{#crossLink "Animator"}}{{/crossLink}} and the result replaces the function.
 *
 * **See:** {{#crossLink "anim8.computed/current:method"}}{{/crossLink}},
 *          {{#crossLink "anim8.computed/relative:method"}}{{/crossLink}},
 *          {{#crossLink "anim8.computed/random:method"}}{{/crossLink}}
 *
 * @class anim8.computed
 */
function computed(funcOrName, func)
{
  if ( isString( funcOrName ) && isFunction( func ) )
  {
    func.computed = true;

    computed[ funcOrName ] = func;

    return func;
  }
  else if ( isFunction( funcOrName ) )
  {
    funcOrName.computed = true;

    return funcOrName;
  }

  throw funcOrName + ' and ' + func + ' are not valid parameters for creating a computed function.';
}

/**
 * Calculates and returns the current value for an
 * {{#crossLink "Animator"}}{{/crossLink}}. If the animator doesn't have a
 * current value the default value for the attribute is returned.
 *
 * @method current
 * @param {Attrimator} attrimator
 * @param {Animator} animator
 * @return {T}
 */
computed('current', function(attrimator, animator)
{
  var attr = attrimator.attribute;
  var attribute = animator.getAttribute( attr );

  if ( attr in animator.frame )
  {
    return attribute.calculator.clone( animator.frame[ attr ] );
  }
  else
  {
    return attribute.cloneDefault();
  }
});

/**
 * Calculates a value relative to the attribute value currently in the animator.
 * A mask can be used for mixed relative & absolute values in a single value
 * where 1 makes it relative and 0 makes it absolute.
 *
 * **Examples:**
 *
 *     anim8.computed.relative( 40 ); // returns function which adds 40 to current value
 *     anim8.computed.relative( 40, 0.5 ); // returns function which adds 40 to half of the current value
 *     anim8.computed.relative( {x: 20, y: 10}, {x: 1, y: 0} ); // returns function which adds 20 to the x of the current value and sets the y of the current value to 10
 *
 * @method relative
 * @param {T} relativeAmount
 * @param {T} mask
 * @return {Function}
 */
computed('relative', function(relativeAmount, mask)
{
  // If the relativeAmount is already a computed value, return it.
  if ( isComputed( relativeAmount ) )
  {
    return relativeAmount;
  }

  var relativeFunction = function(attrimator, animator)
  {
    var attr = attrimator.attribute;
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
});

/**
 * Returns a random value based on the given random selection.
 *
 * 1. If an array is given an item is randomly chosen from that array.
 * 2. If an instance of {{#crossLink "Path"}}{{/crossLink}} is given a point is randomly computed and returned.
 * 3. If an object with min & max values is given a random value between them is returned.
 *
 * **Examples:**
 *
 *     anim8.computed.random( [1, 2, 3] ); // returns function which returns a 1, 2, or 3
 *     anim8.computed.random( {min: 1, max: 5} ); // returns function which returns a value between 1 and 5
 *     anim8.computed.random( {min: {x: 0, y: 0}, max: {x: 100, y: 200}} ); // returns function which returns a point in the rectangle {0,0,100,200}
 *     anim8.computed.random( path ); // returns function which returns a value anywhere along the given path
 *
 * @method random
 * @param  {Array|Object|Path} randomSelection
 * @return {Function}
 */
computed('random', function(randomSelection)
{
  var randomFunction = null;

  if ( isArray( randomSelection ) )
  {
    randomFunction = function(attrimator, animator)
    {
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calc = attribute.calculator;
      var selected = randomSelection[ Math.floor( Math.random() * randomSelection.length ) ];

      return calc.parse( selected, calc.ZERO );
    };
  }
  else if ( randomSelection instanceof Path )
  {
    randomFunction = function(attrimator, animator)
    {
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calc = attribute.calculator;

      return randomSelection.compute( calc.create(), Math.random() );
    };
  }
  else if ( isObject( randomSelection ) && isDefined( randomSelection.min ) && isDefined( randomSelection.max ) )
  {
    randomFunction = function(attrimator, animator)
    {
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calc = attribute.calculator;
      var resolvedMin = resolve( randomSelection.min );
      var resolvedMax = resolve( randomSelection.max );
      var min = calc.parse( resolvedMin, calc.ZERO );
      var max = calc.parse( resolvedMax, calc.ZERO );

      return calc.random( calc.create(), min, max );
    };
  }
  else
  {
    throw 'Invalid random input: ' + randomSelection;
  }

  // Place the input on the function if the user wants to modify it live
  randomFunction.randomSelection = randomSelection;

  return computed( randomFunction );
});

/**
 * Determines whether the given value is a computed value. A computed value is
 * function with a variable 'computed' set to a true value.
 *
 * @param  {any} x
 * @return {Boolean}
 */
function isComputed(x)
{
  return isFunction( x ) && x.computed;
}


/**
 * Creates a function which calls a method on all elements in the array or on
 * the first element.
 *
 * @method delegate
 * @param {String} functionName
 * @param {String} returning
 */
function delegate(functionName, returning)
{
  switch (returning)
  {
  case DelegateTypes.THIS:
    return function()
    {
      var array = this.$ || this;

      for (var i = 0; i < array.length; i++)
      {
        array[i][functionName].apply( array[i], arguments );
      }

      return this;
    };

  case DelegateTypes.RESULTS:
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

  case DelegateTypes.FIRST:
    return function()
    {
      var array = this.$ || this;

      return array.length === 0 ? undefined : array[0][functionName].apply( array[0], arguments );
    };

  case DelegateTypes.TRUE:
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

  return noop;
}


/**
 * Creates a composite dyanmic attribute which is an object of existing
 * attributes which takes advantage of an object based calculator.
 *
 * **Example:**
 *
 *     anim8.object.attribute.topLeft = {
 *       dynamic: anim8.composite({x:'left', y:'top'}),
 *       calculator:'2d',
 *       defaultValue: {x: 0, y: 0},
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the values in 'topLeft' being placed in left and top.
 *
 * @method anim8.composite
 * @param  {Object} map
 * @for Core
 * @return {Function}
 */
function composite( map )
{
  return function( value, frame )
  {
    for ( var prop in map )
    {
      frame[ map[ prop ] ] = value[ prop ];
    }
  };
}

/**
 * Creates a partial dynamic attribute which is a value that's placed in a
 * sub-property of an attribute.
 *
 * **Example:**
 *
 *     anim8.object.attribute.x = {
 *       dynamic: anim8.partial( 'position', 'x' ),
 *       calculator: 'number',
 *       defaultValue: 0,
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the values in 'x' being placed in position.x
 *
 * @method anim8.partial
 * @param {String} attribute
 * @param {String} subattribute
 * @for Core
 * @return {Function}
 */
function partial( attribute, subattribute )
{
  return function( value, frame )
  {
    if ( !isObject( frame[ attribute ] ) )
    {
      frame[ attribute ] = {};
    }

    frame[ attribute ][ subattribute ] = value;
  };
}

/**
 * Creates a dynamic attribute which spreads its value over several attributes.
 *
 * **Example:**
 *
 *     anim8.dom.attribute.padding = {
 *       dynamic: anim8.spread( ['paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom' ] ),
 *       calculator: 'number',
 *       defaultValue: 0,
 *       defaultUnit: 'px'
 *     };
 *
 * Which results in the value in 'padding' being placed in paddingLeft, paddingTop,
 * paddingRight, and paddingBottom.
 *
 * @param  {Array} attributes
 * @return {Function}
 */
function spread( attributes )
{
  return function( value, frame )
  {
    for ( var i = 0; i < attributes.length; i++ )
    {
      frame[ attributes[ i ] ] = value;
    }
  };
}




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
 * @method eventize
 * @for Core
 * @param {Object} target The object to add `on`, `once`, `off`, and `trigger`
 *    functions to.
 */
function eventize(target)
{
  Class.defineProperty( target, 'on', on );
  Class.defineProperty( target, 'once', once );
  Class.defineProperty( target, 'off', off );
  Class.defineProperty( target, 'trigger', trigger );
}

  // Adds a listener to $this
function addListener($this, property, events, callback, context)
{
  var events = toArray( events, ' ' );

  if ( !isDefined( $this[ property ] ) )
  {
    Class.defineProperty( $this, property, {} );
  }

  for (var i = 0; i < events.length; i++)
  {
    if ( !isDefined( $this[ property ][ events[i] ] ) )
    {
      $this[ property ][ events[i] ] = [];
    }

    $this[ property ][ events[i] ].push( [ callback, context || $this ] );
  }
}

// Removes a listener from an array of listeners.
function removeListeners(listeners, event, callback)
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
}

// Deletes a property from the given object if it exists
function deleteProperty(obj, prop)
{
  if ( obj && prop in obj )
  {
    delete obj[ prop ];
  }
}

// Triggers listeneers for the given event
function triggerListeners(listeners, event, argument, clear)
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
}

/**
 * Listens for every occurrence of the given events and invokes the callback
 * each time any of them are triggered.
 *
 * @method on
 * @for eventize
 * @param {String|Array|Object} events
 * @param {Function} callback
 * @param {Object} [context]
 * @chainable
 */
function on(events, callback, context)
{
  addListener( this, '$on', events, callback, context );

  return this;
}

/**
 * Listens for the next occurrence for each of the given events and invokes
 * the callback when any of the events are triggered.
 *
 * @method once
 * @for eventize
 * @param {String|Array|Object} events
 * @param {Function} callback
 * @param {Object} [context]
 * @chainable
 */
function once(events, callback, context)
{
  addListener( this, '$once', events, callback, context );

  return this;
}

/**
 * Stops listening for a given callback for a given set of events.
 *
 * **Examples:**
 *
 *     target.off();           // remove all listeners
 *     target.off('a b');      // remove all listeners on events a & b
 *     target.off(['a', 'b']); // remove all listeners on events a & b
 *     target.off('a', x);     // remove listener x from event a
 *
 * @method off
 * @for eventize
 * @param {String|Array|Object} [events]
 * @param {Function} [callback]
 * @chainable
 */
function off(events, callback)
{
  // Remove ALL listeners
  if ( !isDefined( events ) )
  {
    delete this.$on;
    delete this.$once;
  }
  else
  {
    var events = toArray( events, ' ' );

    // Remove listeners for given events
    if ( !isFunction( callback ) )
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
        removeListeners( this.$on, events[i], callback );
        removeListeners( this.$once, events[i], callback );
      }
    }
  }

  return this;
}

/**
 * Triggers a single event optionally passing an argument to any listeners.
 *
 * @method trigger
 * @for eventize
 * @param {String} event
 * @param {Any} argument
 * @chainable
 */
function trigger(event, argument)
{
  triggerListeners( this.$on, event, argument, false );
  triggerListeners( this.$once, event, argument, true );

  return this;
}


function gcd(a,b)
{
  if (a < 0)
  {
    a = -a;
  }
  if (b < 0)
  {
    b = -b;
  }
  if (b > a)
  {
    var temp = a;
    a = b;
    b = temp;
  }

  while (true)
  {
    if (b === 0)
    {
      return a;
    }

    a %= b;

    if (a === 0)
    {
      return b;
    }

    b %= a;
  }
}

function choose(n, m)
{
  var num = 1, den = 1, g;

  if ( m > (n / 2) )
  {
    m = n - m;
  }

  while ( m >= 1 )
  {
    num *= n--;
    den *= m--;
    g = gcd( num, den );
    num /= g;
    den /= g;
  }

  return num;
}

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
function clamp(v, min, max)
{
  return (v < min) ? min : (v > max ? max : v);
}


var Animations = {};

/**
 * Options to modify the properties of the animations being saved.
 */
var SaveOptions =
{
  prefix: '',
  options: {},
  cache: false
};

/**
 * Saves an animation under the given name. It can be played, queued, and
 * transitioned into at a later time providing the name and optionally options
 * to override with.
 *
 * **See:** {{#crossLink "Core/anim8.animation:method"}}anim8.animation{{/crossLink}},
 *          {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method anim8.save
 * @for Core
 * @param {String} name
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 */
function save( name, animation, options )
{
  var animation = $animation( animation, coalesce( options, SaveOptions.options ), SaveOptions.cache );
  var qualifiedName = SaveOptions.prefix + name;
  var key = qualifiedName.toLowerCase();

  animation.name = qualifiedName;

  Animations[ key ] = animation;
}

/**
 * Starts a save group with a prefix or an object containing a prefix and/or
 * default options to pass to the animations. The animations passed can be
 * an object or a function to call which contains save calls.
 *
 * @method anim8.saveGroup
 * @param {String|Object} prefixOrOptions
 * @param {Function|Object} animations
 */
function saveGroup( prefixOrOptions, animations )
{
  var previousOptions = copy( SaveOptions );

  if ( isString( prefixOrOptions ) )
  {
    SaveOptions.prefix += prefixOrOptions;
  }
  else if ( isObject( prefixOrOptions ) )
  {
    if ( isString( prefixOrOptions.prefix ) )
    {
      SaveOptions.prefix += prefixOrOptions.prefix;
    }
    if ( isDefined( prefixOrOptions.cache ) )
    {
      SaveOptions.cache = prefixOrOptions.cache;
    }
    if ( isDefined( prefixOrOptions.options ) )
    {
      var parsedOptions = $options( prefixOrOptions.options, SaveOptions.cache );

      if ( parsedOptions !== Defaults.noOptions )
      {
        extend( SaveOptions.options, parsedOptions );
      }
    }
  }

  if ( isObject( animations ) )
  {
    for (var animationName in animations)
    {
      save( animationName, animations[ animationName ] );
    }
  }
  else if ( isFunction( animations ) )
  {
    animations();
  }

  SaveOptions = previousOptions;
}


function translate(animation, mappings, saveAs, options, cache)
{
  var parsed = $animation(animation, options, cache);
  var attrimators = parsed.newAttrimators();

  for (var fromAttribute in mappings)
  {
    var toAttribute = mappings[ fromAttribute ];

    attrimators.get( fromAttribute ).attribute = toAttribute;
    attrimators.rekey( fromAttribute, toAttribute );
  }

  var translated = new Animation( saveAs, parsed.input, parsed.options, attrimators );

  if ( isString( saveAs ) )
  {
    save( saveAs, translated );
  }

  return translated;
}


/*
 * A calculator for objects with an x and y component (number)
 *
 * @class Calculator2d
 * @constructor
 * @extends Calculator
 */
function Calculator2d()
{
  this.createConstants();
}

Class.extend( Calculator2d, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // When a number is given a uniform point is returned.
    if ( isNumber( x ) )
    {
      return {
        x: x,
        y: x
      };
    }
    // When an array is given, assume [x, y]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1] };
    }
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, defaultValue.x );
      var cy = coalesce( x.y, defaultValue.y );
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

          return computed.relative( parsed, mask );
        }

        return parsed;
      }
    }
    // Relative values & left/right/middle/center/top/bottom aliases.
    if ( isString( x ) )
    {
      // If only a relative value is given it will modify the X & Y components evenly.
      if ( this.isRelative( x ) )
      {
        var rx = this.getRelativeAmount( x );

        if ( rx !== false )
        {
          return computed.relative( { x: rx, y: rx } );
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
    if ( isDefined( defaultValue ) )
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
  interpolate: function(out, start, end, delta)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
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
  },
  min: function(out, a, b)
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  },
  max: function(out, a, b)
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  },
  dot: function(a, b)
  {
    return a.x * b.x + a.y * b.y;
  },
  random: function(out, min, max)
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    return out;
  }
});


/**
 * A calculator for objects with an x, y, and z component (number)
 *
 * @class Calculator3d
 * @constructor
 * @extends Calculator
 */
function Calculator3d()
{
  this.createConstants();
}

Class.extend( Calculator3d, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // When a number is given a uniform point is returned.
    if ( isNumber( x ) )
    {
      return {
        x: x,
        y: x,
        z: x
      };
    }
    // When an array is given, assume [x, y, z]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1], z: x[2] };
    }
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, defaultValue.x );
      var cy = coalesce( x.y, defaultValue.y );
      var cz = coalesce( x.z, defaultValue.z );
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

          return computed.relative( parsed, mask );
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
        return computed.relative( { x: rx, y: rx, z: rx } );
      }
    }

    // If no value was given but the default value was given, clone it.
    if ( isDefined( defaultValue ) )
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
  interpolate: function(out, start, end, delta)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    out.z = (end.z - start.z) * delta + start.z;
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
  },
  min: function(out, a, b)
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  },
  max: function(out, a, b)
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  },
  dot: function(a, b)
  {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  random: function(out, min, max)
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    out.z = (max.z - min.z) * Math.random() + min.z;
    return out;
  }
});



/**
 * A calculator for number primitives.
 *
 * @class CalculatorNumber
 * @constructor
 * @extends Calculator
 */
function CalculatorNumber()
{
  this.createConstants();
}

Class.extend( CalculatorNumber, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // A raw number
    if ( isNumber( x ) )
    {
      return x;
    }
    // A number in a string or a relative number.
    if ( isString( x ) )
    {
      var amount = this.getRelativeAmount( x );

      if ( amount !== false )
      {
        if ( this.isRelative( x ) )
        {
          return computed.relative( amount );
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
  interpolate: function(out, start, end, delta)
  {
    return (end - start) * delta + start;
  },
  distanceSq: function(a, b)
  {
    var ab = a - b;
    return ab * ab;
  },
  distance: function(a, b)
  {
    return Math.abs( a - b );
  },
  length: function(a)
  {
    return Math.abs( a );
  },
  lengthSq: function(a)
  {
    return a * a;
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
  },
  min: function(out, a, b)
  {
    return Math.min( a, b );
  },
  max: function(out, a, b)
  {
    return Math.max( a, b );
  },
  dot: function(a, b)
  {
    return a * b;
  }
});


/**
 * A calculator for objects with an x, y, z, and angle components.
 *
 * @class CalculatorQuaternion
 * @constructor
 * @extends Calculator
 */
function CalculatorQuaternion()
{
  this.createConstants();
}

Class.extend( CalculatorQuaternion, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // When only a number is given assume it's an angle around the Z-axis.
    if ( isNumber( x ) )
    {
      return {
        x: 0,
        y: 0,
        z: 1,
        angle: x
      };
    }
    // When an array is given, assume [x, y, z, angle]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1], z: x[2], angle: x[3] };
    }
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, defaultValue.x );
      var cy = coalesce( x.y, defaultValue.y );
      var cz = coalesce( x.z, defaultValue.z );
      var ca = coalesce( x.angle, defaultValue.angle );
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

          return computed.relative( parsed );
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
        return computed.relative( { x:0, y:0, z:1, angle: rx }, { x:0, y:0, z:0, angle:1 } );
      }
    }

    // If no value was given but the default value was given, clone it.
    if ( isDefined( defaultValue ) )
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
  interpolate: function(out, start, end, delta)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    out.z = (end.z - start.z) * delta + start.z;
    out.angle = (end.angle - start.angle) * delta + start.angle;
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
  },
  min: function(out, a, b)
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    out.angle = Math.min(a.angle, b.angle);
    return out;
  },
  max: function(out, a, b)
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    out.angle = Math.max(a.angle, b.angle);
    return out;
  },
  dot: function(a, b)
  {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.angle * b.angle;
  },
  random: function(out, min, max)
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    out.z = (max.z - min.z) * Math.random() + min.z;
    out.angle = (max.angle - min.angle) * Math.random() + min.angle;
    return out;
  }
});



/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 *
 * @class CalculatorRGB
 * @constructor
 * @extends Calculator
 */
function CalculatorRGB()
{
  this.createConstants();
}

Class.extend( CalculatorRGB, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // When a number is given a grayscale color is returned.
    if ( isNumber( x ) )
    {
      return {
        r: x,
        g: x,
        b: x
      };
    }
    // When an array is given, assume [r, g, b]
    if ( isArray( x ) )
    {
      x = { r: x[0], g: x[1], b: x[2] };
    }
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cr = coalesce( x.r, defaultValue.r );
      var cg = coalesce( x.g, defaultValue.g );
      var cb = coalesce( x.b, defaultValue.b );
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

          return computed.relative( parsed, mask );
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
        return computed.relative( { r: rx, g: rx, b: rx } );
      }
    }

    // Try to parse the color.
    var parsed = Color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }

    // If no value was given but the default value was given, clone it.
    if ( isDefined( defaultValue ) )
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
  interpolate: function(out, start, end, delta)
  {
    out.r = (end.r - start.r) * delta + start.r;
    out.g = (end.g - start.g) * delta + start.g;
    out.b = (end.b - start.b) * delta + start.b;
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
    return isObject( a ) && 'r' in a && 'g' in a && 'b' in a;
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
  },
  min: function(out, a, b)
  {
    out.r = Math.min(a.r, b.r);
    out.g = Math.min(a.g, b.g);
    out.b = Math.min(a.b, b.b);
    return out;
  },
  max: function(out, a, b)
  {
    out.r = Math.max(a.r, b.r);
    out.g = Math.max(a.g, b.g);
    out.b = Math.max(a.b, b.b);
    return out;
  },
  dot: function(a, b)
  {
    return a.r * b.r + a.g * b.g + a.b * b.b;
  },
  random: function(out, min, max)
  {
    out.r = (max.r - min.r) * Math.random() + min.r;
    out.g = (max.g - min.g) * Math.random() + min.g;
    out.b = (max.b - min.b) * Math.random() + min.b;
    return out;
  }
});


/**
 * A calculator for objects with r, g, & b components
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 *
 * @class CalculatorRGBA
 * @constructor
 * @extends Calculator
 */
function CalculatorRGBA()
{
  this.createConstants();
}

Class.extend( CalculatorRGBA, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // When a number is given an opaque grayscale color is returned.
    if ( isNumber( x ) )
    {
      return {
        r: x,
        g: x,
        b: x,
        a: 1.0
      };
    }
    // When an array is given, assume [r, g, b, a]
    if ( isArray( x ) )
    {
      x = { r: x[0], g: x[1], b: x[2], a: x[3] };
    }
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cr = coalesce( x.r, defaultValue.r );
      var cg = coalesce( x.g, defaultValue.g );
      var cb = coalesce( x.b, defaultValue.b );
      var ca = coalesce( x.a, defaultValue.a );
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

          return computed.relative( parsed, mask );
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
        return computed.relative( { r: rx, g: rx, b: rx, a: 0 } );
      }
    }

    // Try to parse the color.
    var parsed = Color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }

    // If no value was given but the default value was given, clone it.
    if ( isDefined( defaultValue ) )
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
  interpolate: function(out, start, end, delta)
  {
    out.r = (end.r - start.r) * delta + start.r;
    out.g = (end.g - start.g) * delta + start.g;
    out.b = (end.b - start.b) * delta + start.b;
    out.a = (end.a - start.a) * delta + start.a;
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
    return isObject( a ) && 'r' in a && 'g' in a && 'b' in a && 'a' in a;
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
  },
  min: function(out, a, b)
  {
    out.r = Math.min(a.r, b.r);
    out.g = Math.min(a.g, b.g);
    out.b = Math.min(a.b, b.b);
    out.a = Math.min(a.a, b.a);
    return out;
  },
  max: function(out, a, b)
  {
    out.r = Math.max(a.r, b.r);
    out.g = Math.max(a.g, b.g);
    out.b = Math.max(a.b, b.b);
    out.a = Math.max(a.a, b.a);
    return out;
  },
  dot: function(a, b)
  {
    return a.r * b.r + a.g * b.g + a.b * b.b + a.a * b.a;
  },
  random: function(out, min, max)
  {
    out.r = (max.r - min.r) * Math.random() + min.r;
    out.g = (max.g - min.g) * Math.random() + min.g;
    out.b = (max.b - min.b) * Math.random() + min.b;
    out.a = (max.a - min.a) * Math.random() + min.a;
    return out;
  }
});


/**
 * A calculator for strings.
 *
 * @class CalculatorString
 * @constructor
 * @extends Calculator
 */
function CalculatorString()
{
  this.createConstants();
}

Class.extend( CalculatorString, Calculator,
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }
    // A raw string
    if ( isString( x ) )
    {
      return x;
    }

    return defaultValue;
  },
  copy: function(out, copy)
  {
    return copy;
  },
  create: function()
  {
    return '';
  },
  zero: function(out)
  {
    return '';
  },
  adds: function(out, amount, amountScale)
  {
    return amount;
  },
  mul: function(out, scale)
  {
    return scale;
  },
  interpolate: function(out, start, end, delta)
  {
    return delta < 0.5 ? start : end;
  },
  distanceSq: function(a, b)
  {
    var d = Math.abs( a.length - b.length );
    return d * d;
  },
  distance: function(a, b)
  {
    return Math.abs( a.length - b.length );
  },
  length: function(a)
  {
    return a.length;
  },
  lengthSq: function(a)
  {
    return a.length * a.length;
  },
  isValid: function(a)
  {
    return typeof a === 'string';
  },
  isNaN: function(a)
  {
    return false;
  },
  isZero: function(a, epsilon)
  {
    return a.length <= epsilon;
  },
  isEqual: function(a, b, epsilon)
  {
    return a === b;
  },
  min: function(out, a, b)
  {
    return a < b ? a : b;
  },
  max: function(out, a, b)
  {
    return a > b ? a : b;
  },
  dot: function(a, b)
  {
    return a.length * b.length;
  }
});


/**
 * A factory for plain objects.
 *
 * @class FactoryObject
 * @constructor
 * @extends Factory
 */
function FactoryObject()
{
  this.priority = 0;
  this.attributes = {};
}

Class.extend( FactoryObject, Factory,
{
  is: function(subject)
  {
    return isObject( subject ) && !isArray( subject ); /* !isElement( subject ) && */
  },
  animatorFor: function(subject)
  {
    var animator = subject.$animator;

    if ( !animator )
    {
      animator = new Animator( subject );
      animator.factory = this;

      subject.$animator = animator;
    }

    return animator;
  },
  destroy: function(animator)
  {
    delete animator.subject.$animator;
  },
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = object.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = $calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );

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
 * The Object namespace.
 *
 * @type {Object}
 */
var object = {};

/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {Object|String} attr
 * @return {Object}
 */
object.attribute = function(attr)
{
  if ( isObject( attr ) && isDefined( attr.defaultValue ) )
  {
    return attr;
  }
  if ( isString( attr ) && attr in object.attribute )
  {
    return object.attribute[ attr ];
  }

  return object.attribute['default'];
};

/**
 * The default attribute.
 */
object.attribute['default']                 = {defaultValue: 0};


/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class BuilderAnd
 * @constructor
 * @extends Builder
 */
function BuilderAnd()
{

}

Class.extend( BuilderAnd, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var and = animation.and;

    and.factory = coalesce( and.factory, animation.factory );

    attrimatorMap.putMap( $attrimatorsFor( and, options ) );
  },
  
  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    this.submerge( input.and, newOptions, oldOptions, attrimatorMap );
  }
});


/**
 * Instantiates a new parser for the 'deltas' & 'values' animation type.
 *
 * @class BuilderDeltas
 * @constructor
 * @extends Builder
 */
function BuilderDeltas()
{

}

Class.extend( BuilderDeltas, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. If deltas wasn't specified, assume a uniform distribution of points
    // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
    // 3. Generate the attrimators

    var mergeId = Builder.nextMergeId();
    var factory = $factory( animation.factory );
    var deltas = animation.deltas;
    var values = animation.values;

    if ( !isDefined( deltas ) )
    {
      deltas = {};
    }
    else if ( isArray( deltas ) )
    {
      var deltaObject = {};

      for (var attr in values)
      {
        deltaObject[attr] = deltas;
      }

      deltas = deltaObject;
    }

    for (var attr in values)
    {
      var value = values[ attr ];
      var valueMax = value.length - 1;
      var delta = deltas[ attr ];
      var attribute = factory.attribute( attr );

      for (var k = 0; k <= valueMax; k++)
      {
        value[k] = attribute.parse( value[k] );
      }

      if ( !isArray( delta ) )
      {
        delta = [];

        for (var i = 0; i <= valueMax; i++)
        {
          delta[i] = i / valueMax;
        }
      }

      var path      = new PathDelta( attr, attribute.calculator, value, delta );
      var event     = helper.parseEvent( attr, path, this, true );

      event.mergeId = mergeId;

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new builder for the 'final' animation type.
 *
 * @class BuilderFinal
 * @constructor
 * @extends Builder
 */
function BuilderFinal()
{

}

Class.extend( BuilderFinal, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays and durations

    var factory = $factory( animation.factory );
    var values = animation.final;

    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var delay      = $delay( helper.parseDelay( attr ) );
      var duration   = $duration( helper.parseDuration( attr ) );
      var event      = new Oncer( attr, value, delay + duration, false, this, null, animation );

      attrimatorMap.put( attr, event );
    }
  },
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.delay = helper.mergeDelay( attr, e.delay ) +
              helper.mergeDuration( attr, e.duration );
  }
});


/**
 * Instantiates a new parser for the 'initial' animation type.
 *
 * @class BuilderInitial
 * @constructor
 * @extends Builder
 */
function BuilderInitial()
{

}

Class.extend( BuilderInitial, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays & scales

    var factory    = $factory( animation.factory );
    var values     = animation.initial;

    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var delay      = helper.parseDelay( attr );
      var oncer      = new Oncer( attr, value, delay, true, this, null, animation );

      attrimatorMap.put( attr, oncer );
    }
  },
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.delay = helper.mergeDelay( attr, e.delay );
  }
});


/**
 * Instantiates a new parser for the 'keyframe' animation type.
 *
 * @class BuilderKeyframe
 * @constructor
 * @extends Builder
 */
function BuilderKeyframe()
{

}

Class.extend( BuilderKeyframe, Builder,
{
  aliases: {
    from:     '0',
    start:    '0',
    initial:  '0',
    first:    '0',
    half:     '50',
    middle:   '50',
    to:       '100',
    end:      '100',
    last:     '100'
  },

  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Normalize keys by converting aliases to the actual value
    // 2. Split up keys that have commas into multiple entries
    // 3. Validate keys and remove invalid ones - also calculate max key value
    // 4. Sort frames by the key
    // 5. Expand frames to generate delta arrays, value arrays, and easing arrays
    // 6. Generate the attrimators

    var factory = $factory( animation.factory );
    var kframes = animation.keyframe;
    var easings = animation.easings || {};
    var teasing = $easing( coalesce( options.teasing, Defaults.teasing ) );

    var sort = false;

    // split up comma delimited times
    for (var time in kframes)
    {
      if ( time in this.aliases )
      {
        kframes[ this.aliases[time] ] = kframes[ time ];

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
      times.sort(function(a, b)
      {
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
      var easing = coalesce( frame.value.easing, options.easing );

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
        pathEasings[attr].push( $easing( coalesce( easings[ attr ], easing ) ) );
      }
    }

    // create events & paths
    for (var attr in deltas)
    {
      var duration  = helper.parseDuration( attr );
      var delay     = helper.parseDelay( attr );
      var sleep     = helper.parseSleep( attr );
      var offset    = helper.parseOffset( attr );
      var repeat    = helper.parseRepeat( attr );
      var scale     = helper.parseScale( attr );
      var scaleBase = helper.parseScaleBase( attr );
      var path      = new PathKeyframe( attr, attributes[attr].calculator, values[attr], deltas[attr], pathEasings[attr] );
      var event     = new Event( attr, path, duration, teasing, delay, sleep, offset, repeat, scale, scaleBase, true, this, null, animation );

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new parser for the 'move' animation type.
 *
 * @class BuilderMove
 * @constructor
 * @extends Builder
 */
function BuilderMove()
{

}

Class.extend( BuilderMove, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory );
    var move       = animation.move;

    for (var attr in move)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( move[ attr ] );
      var path       = new Tween( attr, attribute.calculator, computed.current, computed.relative( value ) );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new parser for the 'path' animation type.
 *
 * @class BuilderPath
 * @constructor
 * @extends Builder
 */
function BuilderPath()
{

}

Class.extend( BuilderPath, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory = $factory( animation.factory );
    var path    = animation.path;

    for (var attr in path)
    {
      var attribute  = factory.attribute( attr );
      var pathDefinition = path[ attr ];

      if ( !( pathDefinition instanceof Path ) )
      {
        pathDefinition.name = attr;
        pathDefinition.calculator = attribute.calculator;
      }

      var parsedPath = $path( pathDefinition );
      var event      = helper.parseEvent( attr, parsedPath, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new builder for the 'physics' animation type.
 *
 * @class BuilderPhysics
 * @constructor
 * @extends Builder
 */
function BuilderPhysics()
{

}

Class.extend( BuilderPhysics, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = $factory( animation.factory );
    var physics    = animation.physics;

    for (var attr in physics)
    {
      var physic    = physics[ attr ];

      var attrimator = new Physics(
        attr,
        this,
        physic.calculator,
        coalesce( physic.position, true ),
        physic.velocity,
        physic.acceleration,
        physic.terminal,
        physic.stopAt
      );

      attrimatorMap.put( attr, attrimator );
    }
  },

  merge: false
});


/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class BuilderQueue
 * @constructor
 * @extends Builder
 */
function BuilderQueue()
{

}

Class.extend( BuilderQueue, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var queue = animation.queue;

    queue.factory = coalesce( queue.factory, animation.factory );

    attrimatorMap.queueMap( $attrimatorsFor( queue, options ) );
  },

  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    this.submerge( input.queue, newOptions, oldOptions, attrimatorMap );
  }
});


/**
 * Instantiates a new parser for the 'springs' animation type.
 *
 * @class BuilderSpring
 * @constructor
 * @extends Builder
 */
function BuilderSpring()
{

}

Class.extend( BuilderSpring, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = $factory( animation.factory );
    var springs    = animation.springs;

    for (var attr in springs)
    {
      var spring     = springs[ attr ];

      if ( !isDefined( spring.attribute ) )
      {
        spring.attribute = attr;
      }

      var parsed = $spring( spring );

      if ( parsed !== false )
      {
        parsed.parser = this;

        attrimatorMap.put( attr, parsed );
      }
    }
  },

  merge: false
});


/**
 * Instantiates a new parser for the 'travel' animation type.
 *
 * @class BuilderTravel
 * @constructor
 * @extends Builder
 */
function BuilderTravel()
{

}

Class.extend( BuilderTravel, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory );
    var travel     = animation.travel;

    /**
     * The computed function which returns a function which returns a value pointing
     * to a given target given the current position of the animator.
     *
     * @param  {Number}
     * @param  {any}
     * @param  {Number}
     * @return {Function}
     */
    var pointing = function(amount, target, epsilon, subtractVelocity)
    {
      return computed(function pointingFunction(attrimator, animator)
      {
        var attribute = animator.getAttribute( attrimator.attribute );
        var calc = attribute.calculator;
        var targetValue = isComputed( target ) ? target( attrimator, animator ) : target;
        var temp = calc.create();

        return function()
        {
          var position   = attrimator.position;
          var current    = calc.copy( temp, resolve( targetValue ) );
          var difference = calc.sub( current, position );
          var distance   = calc.distance( difference, calc.ZERO );

          if ( distance < epsilon )
          {
            attrimator.stopIn( 0 );
          }
          else
          {
            difference = calc.scale( difference, amount / distance );
          }

          if ( subtractVelocity )
          {
            difference = calc.sub( difference, attrimator.resolveVelocity() );
          }

          return difference;
        };
      });
    };

    for (var attr in travel)
    {
      var traveling     = travel[ attr ];
      var attribute     = factory.attribute( attr );
      var fromParsed    = attribute.parse( coalesce( traveling.from, true ) );
      var toParsed      = attribute.parse( coalesce( traveling.to, true ) );
      var velocity      = $number( traveling.velocity, 0 );
      var acceleration  = $number( traveling.acceleration, 0 );
      var terminal      = $number( coalesce( traveling.terminal, traveling.velocity ), Number.POSITIVE_INFINITY );
      var epsilon       = $number( traveling.epsilon, 0.001 );

      if ( acceleration !== 0 )
      {
        acceleration = pointing( acceleration, toParsed, epsilon, true );
      }

      if ( velocity !== 0 )
      {
        velocity = pointing( velocity, toParsed, epsilon, false );
      }

      var traveler = new Physics(
        attr,
        this,
        attribute.calculator,
        fromParsed,
        velocity,
        acceleration,
        terminal
      );

      attrimatorMap.put( attr, traveler );
    }
  },

  merge: false
});


/**
 * Instantiates a new builder for the 'tweenFrom' animation type.
 *
 * @class BuilderTweenFrom
 * @constructor
 * @extends Builder
 */
function BuilderTweenFrom()
{

}

Class.extend( BuilderTweenFrom, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory );
    var tweenFrom  = animation.tweenFrom;

    for (var attr in tweenFrom)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenFrom[ attr ] );
      var path       = new Tween( attr, attribute.calculator, value, computed.current );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 *
 * @class BuilderTweenTo
 * @constructor
 * @extends Builder
 */
function BuilderTweenTo()
{

}

Class.extend( BuilderTweenTo, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory );
    var tweenTo    = animation.tweenTo;

    for (var attr in tweenTo)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenTo[ attr ] );
      var path       = new Tween( attr, attribute.calculator, computed.current, value );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});


/**
 * Instantiates a new PathDelta.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Array} deltas
 * @class PathDelta
 * @constructor
 * @extends Path
 */
function PathDelta(name, calculator, points, deltas)
{
  this.name = name;
  this.set( calculator, points, deltas );
}

Class.extend( PathDelta, Path,
{
  set: function(calculator, points, deltas)
  {
    this.reset( calculator, points );
    this.deltas = deltas;
  },

  compute: function(out, delta)
  {
    var ds = this.deltas;
    var end = ds.length - 2;
    var i = 0;
    while (ds[i + 1] < delta && i < end) {
      i++;
    }
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i );
    var p1 = this.resolvePoint( i + 1 );

    return this.calculator.interpolate( out, p0, p1, pd );
  },

  copy: function()
  {
    return new PathDelta( this.name, this.calculator, copy(this.points), copy(this.deltas) );
  }
});


/**
 * Instantiates a new PathParametric.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @param {Array} matrix
 * @param {Number} weight
 * @class PathParametric
 * @constructor
 * @extends Path
 */
function PathParametric(name, calculator, points, loop, matrix, weight, invert)
{
  this.name = name;
  this.set( calculator, points, loop, matrix, weight, invert );
}

Class.extend( PathParametric, Path,
{
  set: function(calculator, points, loop, matrix, weight, invert)
  {
    this.reset( calculator, points );
    this.loop = loop;
    this.matrix = matrix;
    this.weight = weight;
    this.invert = invert;
    this.temp = calculator.create();
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var temp = this.temp;
    var matrix = this.matrix;
    var n = this.points.length - 1;
    var a = delta * n;
    var i = clamp( Math.floor( a ), 0, n - 1 );
    var d = a - i;

    var p0 = this.resolvePoint( i - 1 );
    var p1 = this.resolvePoint( i );
    var p2 = this.resolvePoint( i + 1 );
    var p3 = this.resolvePoint( i + 2 );

    var d0, d1, d2, d3;
    if (this.invert) {
      d3 = 1;
      d2 = d;
      d1 = d * d2;
      d0 = d * d1;
    } else {
      d0 = 1;
      d1 = d;
      d2 = d * d1;
      d3 = d * d2;
    }

    out = calc.zero( out );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[0][0] );
    temp = calc.adds( temp, p1, matrix[0][1] );
    temp = calc.adds( temp, p2, matrix[0][2] );
    temp = calc.adds( temp, p3, matrix[0][3] );
    out = calc.adds( out, temp, d0 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[1][0] );
    temp = calc.adds( temp, p1, matrix[1][1] );
    temp = calc.adds( temp, p2, matrix[1][2] );
    temp = calc.adds( temp, p3, matrix[1][3] );
    out = calc.adds( out, temp, d1 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[2][0] );
    temp = calc.adds( temp, p1, matrix[2][1] );
    temp = calc.adds( temp, p2, matrix[2][2] );
    temp = calc.adds( temp, p3, matrix[2][3] );
    out = calc.adds( out, temp, d2 );

    temp = calc.zero( temp );
    temp = calc.adds( temp, p0, matrix[3][0] );
    temp = calc.adds( temp, p1, matrix[3][1] );
    temp = calc.adds( temp, p2, matrix[3][2] );
    temp = calc.adds( temp, p3, matrix[3][3] );
    out = calc.adds( out, temp, d3 );

    out = calc.scale( out, this.weight );

    return out;
  },

  resolvePoint: function(i)
  {
    var points = this.points;
    var n = points.length;
    var k = (this.loops ? (i + n) % n : clamp( i, 0, n - 1 ));

    return resolve( points[ k ] );
  },

  copy: function()
  {
    return new PathParametric( this.name, this.calculator, copy(this.points), this.loop, this.matrix, this.weight );
  },

  isLinear: function()
  {
    return false;
  }
});


/**
 * Instantiates a new PathBasisSpline.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathBasisSpline
 * @constructor
 * @extends PathParametric
 */
function PathBasisSpline(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathBasisSpline, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathBasisSpline.MATRIX, PathBasisSpline.WEIGHT, true );
  },

  copy: function()
  {
    return new PathBasisSpline( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                                 [-1, 3,-3, 1]   [p-1]
 * f(t) = [t^3, t^2, t, 1] * 1/6 * [ 3,-6, 3, 0] * [ p ]
 *                                 [-3, 0, 3, 0]   [p+1]
 *                                 [ 1, 4, 1, 0]   [p+2]
 */

PathBasisSpline.WEIGHT = 1.0 / 6.0;
PathBasisSpline.MATRIX = [
  [-1, 3,-3, 1],
  [ 3,-6, 3, 0],
  [-3, 0, 3, 0],
  [ 1, 4, 1, 0]
];


/**
 * Instantiates a new PathBezier.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathBezier
 * @constructor
 * @extends Path
 */
function PathBezier(name, calculator, points, weights)
{
  this.name = name;
  this.set( calculator, points, weights );
}

Class.extend( PathBezier, Path,
{
  set: function(calculator, points, weights)
  {
    this.reset( calculator, points );
    this.weights = weights || PathBezier.computeWeights( points.length );
    this.inverses = new Array( points.length );
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var inverses = this.inverses;
    var weights = this.weights;
    var n = this.points.length;
    var x = 1;

    inverses[n - 1] = 1;

    for (var i = n - 2; i >= 0; i--)
    {
      inverses[i] = inverses[i + 1] * (1 - delta);
    }

    out = calc.zero( out );

    for (var i = 0; i < n; i++)
    {
      out = calc.adds( out, this.resolvePoint( i ), weights[ i ] * inverses[ i ] * x );

      x *= delta;
    }

    return out;
  },

  copy: function()
  {
    return new PathBezier( this.name, this.calculator, copy(this.points), this.weights );
  },

  isLinear: function()
  {
    return false;
  }
});

PathBezier.computeWeights = function(n)
{
  var w = new Array( n-- );

  for (var i = 0; i <= n; i++)
  {
    w[ i ] = choose( n, i );
  }

  return w;
};


/**
 * Instantiates a new PathCatmullRom.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathCatmullRom
 * @constructor
 * @extends PathParametric
 */
function PathCatmullRom(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathCatmullRom, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathCatmullRom.MATRIX, PathCatmullRom.WEIGHT, false );
  },

  copy: function()
  {
    return new PathCatmullRom( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                                 [-1, 3,-3, 1]   [p-1]
 * f(t) = [1, t, t^2, t^3] * 1/2 * [ 3,-6, 3, 0] * [ p ]
 *                                 [-3, 0, 3, 0]   [p+1]
 *                                 [ 1, 4, 1, 0]   [p+2]
 */

PathCatmullRom.WEIGHT = 0.5;
PathCatmullRom.MATRIX = [
  [ 0, 2, 0, 0],
	[-1, 0, 1, 0],
	[ 2,-5, 4,-1],
	[-1, 3,-3, 1]
];


/**
 * Instantiates a new PathCombo.
 *
 * @param {String|false} name
 * @param {Path[]} paths
 * @param {Boolean} [uniform]
 * @param {Number} [granularity]
 * @class PathCombo
 * @constructor
 * @extends Path
 */
function PathCombo(name, paths, uniform, granularity)
{
  this.name = name;
  this.set( paths, uniform, granularity );
}

Class.extend( PathCombo, Path,
{
  set: function(paths, uniform, granularity)
  {
    var pathCount = paths.length;
    var calc = paths[0].calculator;
    var points = [];
    var deltas = [];
    var linear = true;
    var length = false;

    for (var i = 0; i < pathCount; i++)
    {
      points.push.apply( points, paths[ i ].points );

      deltas[ i ] = ( i + 1 ) / pathCount;

      if ( !paths[ i ].isLinear() )
      {
        linear = false;
      }
    }

    if ( uniform )
    {
      var lengthGranularity = coalesce( granularity, Defaults.comboPathUniformGranularity );
      var lengthTotal = 0;
      var lengths = [];

      for (var i = 0; i < pathCount; i++)
      {
        lengths[ i ] = paths[ i ].length( lengthGranularity );
        lengthTotal += lengths[ i ];
      }

      var lengthCurrent = 0;

      for (var i = 0; i < pathCount; i++)
      {
        lengthCurrent += lengths[ i ];
        deltas[ i ] = lengthCurrent / lengthTotal;
      }

      length = lengthTotal;
    }

    this.reset( calc, points );
    this.paths = paths;
    this.deltas = deltas;
    this.uniform = uniform;
    this.granularity = granularity;
    this.linear = linear;
    this.cachedLength = length;
  },

  isLinear: function()
  {
    return this.linear;
  },

  length: function(granularity)
  {
    return this.cachedLength !== false ? this.cachedLength : this._length( granularity );
  },

  compute: function(out, delta)
  {
    var paths = this.paths;
    var deltas = this.deltas;
    var previousDelta = 0;
    var i = 0;

    while ( i < paths.length - 1 && deltas[ i ] < delta )
    {
      previousDelta = deltas[ i ];
      i++;
    }

    var deltaDistance = delta - previousDelta;
    var deltaGap = deltas[ i ] - previousDelta;
    var pathDelta = deltaDistance / deltaGap;

    return paths[ i ].compute( out, pathDelta );
  },

  copy: function()
  {
    return new PathCombo( this.name, this.paths, this.uniform, this.granularity );
  }
});


/**
 * Instantiates a new PathCompiled.
 *
 * @param {String|false} name
 * @param {Path} path
 * @param {Number} pointCount
 * @class PathCompiled
 * @constructor
 * @extends Path
 */
function PathCompiled(name, path, pointCount)
{
  this.name = name;
  this.set( path, pointCount );
}

Class.extend( PathCompiled, Path,
{
  set: function(path, pointCount)
  {
    var calc = path.calculator;
    var compiled = PathCompiled.compile( calc, path, pointCount );

    this.reset( calc, compiled );
    this.path = path;
    this.pointCount = pointCount;
  },

  compute: function(out, delta)
  {
    var n = this.points.length;
    var a = Math.floor( delta * n );
    var index = clamp( a, 0, n - 1 );

    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  copy: function()
  {
    return new PathCompiled( this.name, this, this.points.length );
  }
});

PathCompiled.compile = function(calc, path, pointCount)
{
  if (path.points.length === pointCount)
  {
    return copy( path.points );
  }

  var points = [];

  for (var i = 0; i < pointCount; i++)
  {
    points.push( path.compute( calc.create(), i / (pointCount - 1) ) );
  }

  return points;
};


/**
 * Instantiates a new PathCubic.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @param {T} p3
 * @class PathCubic
 * @constructor
 * @extends Path
 */
function PathCubic(name, calculator, p0, p1, p2, p3)
{
  this.name = name;
  this.set( calculator, p0, p1, p2, p3 );
}

Class.extend( PathCubic, Path,
{
  set: function(calculator, p0, p1, p2, p3)
  {
    this.reset( calculator, [p0, p1, p2, p3] );
  },

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

  copy: function()
  {
    return new PathCubic( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
  },

  isLinear: function()
  {
    return false;
  }
});


/**
 * Instantiates a new PathHermite.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} start
 * @param {T} startTangent
 * @param {T} end
 * @param {T} endTangent
 * @class PathHermite
 * @constructor
 * @extends Path
 */
function PathHermite(name, calculator, start, startTangent, end, endTangent)
{
  this.name = name;
  this.set( calculator, start, startTangent, end, endTangent );
}

Class.extend( PathHermite, Path,
{
  set: function(calculator, start, startTangent, end, endTangent)
  {
    this.reset( calculator, [start, end] );
    this.startTangent = startTangent;
    this.endTangent = endTangent;
  },

  compute: function(out, d)
  {
    var calc = this.calculator;
    var d2 = d * d;
    var d3 = d2 * d;

    out = calc.zero( out );
    out = calc.adds( out, this.resolvePoint( 0 ), 2 * d3 - 3 * d2 + 1 );
    out = calc.adds( out, this.resolvePoint( 1 ), -2 * d3 + 3 * d2 );
    out = calc.adds( out, resolve( this.startTangent ), d3 - 2 * d2 + d );
    out = calc.adds( out, resolve( this.endTangent ), d3 - d2 );

    return out;
  },

  copy: function()
  {
    return new PathHermite( this.name, this.calculator, this.points[0], this.startTangent, this.points[1], this.endTangent );
  },

  isLinear: function()
  {
    return false;
  }
});


/**
 * Instantiates a new PathJump.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathJump
 * @constructor
 * @extends Path
 */
function PathJump(name, calculator, points)
{
  this.name = name;
  this.set( calculator, points );
}

Class.extend( PathJump, Path,
{
  set: function(calculator, points)
  {
    this.reset( calculator, points );
  },

  compute: function(out, delta)
  {
    var a = Math.floor( delta * this.points.length );
    var index = Math.min( a, this.points.length - 1 );

    return this.calculator.copy( out, this.resolvePoint( index ) );
  },

  copy: function()
  {
    return new PathJump( this.name, this.calculator, copy(this.points) );
  }
});


/**
 * Instantiates a new PathKeyframe.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Array} deltas
 * @param {Array} easings
 * @class PathKeyframe
 * @constructor
 * @extends Path
 */
function PathKeyframe(name, calculator, points, deltas, easings)
{
  this.name = name;
  this.set( calculator, points, deltas, easings );
}

Class.extend( PathKeyframe, Path,
{
  set: function(calculator, points, deltas, easings)
  {
    this.reset( calculator, points );
    this.deltas = deltas;
    this.easings = easings;
  },

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
    while (ds[i + 1] < delta && i < end) {
      i++;
    }
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.resolvePoint( i );
    var p1 = this.resolvePoint( i + 1 );
    var ea = this.easings[i];

    return this.calculator.interpolate( out, p0, p1, ea( pd ) );
  },
  copy: function()
  {
    return new PathKeyframe( this.name, this.calculator, copy(this.points), copy(this.deltas), copy(this.easings) );
  }
});


/**
 * Instantiates a new PathLinear.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathLinear
 * @constructor
 * @extends PathDelta
 */
function PathLinear(name, calculator, points)
{
  this.name = name;
  this.set( calculator, points );
}

Class.extend( PathLinear, PathDelta,
{
  set: function(calculator, points)
  {
    var deltas = PathLinear.getTimes( calculator, points );

    this._set( calculator, points, deltas );
  },

  copy: function()
  {
    return new PathLinear( this.name, this.calculator, copy(this.points) );
  }
});

PathLinear.getTimes = function(calc, points)
{
  var n = points.length - 1;
	var distances = [];

	distances[ 0 ] = 0;

	for (var i = 1; i <= n; i++)
	{
		distances[ i ] = distances[ i - 1 ] + calc.distance( points[ i - 1 ], points[ i ] );
	}

	var invlength = 1.0 / distances[ n ];

	for (var i = 1; i < n; i++)
	{
		distances[ i ] *= invlength;
	}

  distances[ n ] = 1;

	return distances;
};


/**
 * Instantiates a new PathQuadratic.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @class PathQuadratic
 * @constructor
 * @extends Path
 */
function PathQuadratic(name, calculator, p0, p1, p2)
{
  this.name = name;
  this.set( calculator, p0, p1, p2 );
}

Class.extend( PathQuadratic, Path,
{
  set: function(calculator, p0, p1, p2)
  {
    this.reset( calculator, [p0, p1, p2] );
  },

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

  copy: function()
  {
    return new PathQuadratic( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
  },

  isLinear: function()
  {
    return false;
  }
});


/**
 * Instantiates a new PathQuadraticCorner.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Number} midpoint
 * @param {Boolean} loop
 * @class PathQuadraticCorner
 * @constructor
 * @extends Path
 */
function PathQuadraticCorner(name, calculator, points, midpoint, loop)
{
  this.name = name;
  this.set( calculator, points, midpoint, loop );
}

Class.extend( PathQuadraticCorner, Path,
{
  set: function(calculator, points, midpoint, loop)
  {
    this.reset( calculator, points );
    this.midpoint = midpoint;
    this.loop = loop;
    this.temp0 = calculator.create();
    this.temp1 = calculator.create();
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var temp0 = this.temp0;
    var temp1 = this.temp1;
    var midpoint = this.midpoint;
    var negmidpoint = 1.0 - midpoint;
    var halfmidpoint = midpoint * 0.5;
    var n = this.points.length - (this.loops ? 0 : 1);
    var a = delta * n;
    var i = clamp( Math.floor( a ), 0, n - 1 );
    var d = a - i;

    var p0 = this.resolvePoint( i - 1 );
    var p1 = this.resolvePoint( i );
    var p2 = this.resolvePoint( i + 1 );
    var p3 = this.resolvePoint( i + 2 );

    if ( d < midpoint )
    {
      d = (d / midpoint);
      temp0 = calc.interpolate( temp0, p0, p1, d * halfmidpoint + negmidpoint + halfmidpoint );
      temp1 = calc.interpolate( temp1, p1, p2, d * halfmidpoint + halfmidpoint );
      p1 = temp0;
      p2 = temp1;
      d = d * 0.5 + 0.5;
    }
    else if ( d > negmidpoint )
    {
      d = (d - negmidpoint) / midpoint;
      temp0 = calc.interpolate( temp0, p1, p2, d * halfmidpoint + negmidpoint );
      temp1 = calc.interpolate( temp1, p2, p3, d * halfmidpoint );
      p1 = temp0;
      p2 = temp1;
      d = d * 0.5;
    }

    out = calc.interpolate( out, p1, p2, d );

    return out;
  },

  resolvePoint: function(i)
  {
    var points = this.points;
    var n = points.length;
    var k = (this.loops ? (i + n) % n : clamp( i, 0, n - 1 ));

    return resolve( points[ k ] );
  },

  copy: function()
  {
    return new PathQuadraticCorner( this.name, this.calculator, copy(this.points), this.midpoint, this.loop );
  },

  isLinear: function()
  {
    return false;
  }
});


/**
 * Instantiates a new PathSub.
 *
 * @param {String|false} name
 * @param {Path} path
 * @param {Number} start
 * @param {Number} end
 * @class PathSub
 * @constructor
 * @extends Path
 */
function PathSub(name, path, start, end)
{
  this.name = name;
  this.set( path, start, end );
}

Class.extend( PathSub, Path,
{
  set: function(path, start, end)
  {
    this.reset( path.calculator, path.points );
    this.path = path;
    this.start = start;
    this.end = end;
  },

  compute: function(out, delta)
  {
    return this.path.compute( out, (this.end - this.start) * delta + this.start );
  },

  copy: function()
  {
    return new PathSub( this.name, this.path, this.start, this.end );
  }
});


/**
 * Instantiates a new PathLinear.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathLinear
 * @constructor
 * @extends PathDelta
 */
function PathUniform(name, path, pointCount)
{
  this.name = name;
  this.set( path, pointCount );
}

Class.extend( PathUniform, PathDelta,
{
  set: function(path, pointCount)
  {
    var calc = path.calculator;
    var points = PathCompiled.compile( calc, path, pointCount );
    var deltas = PathLinear.getTimes( calc, points );

    this._set( calc, points, deltas );
    this.path = path;
    this.pointCount = pointCount;
  },

  copy: function()
  {
    return new PathUniform( this.name, this.path, this.pointCount );
  }
});


/**
 * Instantiates a new Tween.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} start
 * @param {T} end
 * @class Tween
 * @constructor
 * @extends Path
 */
function Tween(name, calculator, start, end)
{
  this.name = name;
  this.set( calculator, start, end );
}

Class.extend( Tween, Path,
{
  set: function(calculator, start, end)
  {
    this.reset( calculator, [ start, end ] );
  },

  compute: function(out, delta)
  {
    return this.calculator.interpolate( out, this.resolvePoint( 0 ), this.resolvePoint( 1 ), delta );
  },

  copy: function()
  {
    return new Tween( this.name, this.calculator, this.points[0], this.points[1] );
  }
});


/**
 * Instantiates a new SpringDistance.
 *
 * @param {String|false} attribute
 * @param {anim8.Calculator} calculator
 * @param {T} position
 * @param {T} rest
 * @param {Number} distance
 * @param {Number} damping
 * @param {Number} stiffness
 * @param {T} velocity
 * @param {T} gravity
 * @param {Boolean} finishOnRest
 * @class SpringDistance
 * @constructor
 * @extends Spring
 */
function SpringDistance(attribute, calculator, position, rest, distance, damping, stiffness, velocity, gravity, finishOnRest)
{
  this.set( attribute, calculator, rest, position, velocity, gravity, finishOnRest );

  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = null;
}

Class.extend( SpringDistance, Spring,
{

  start: function(now, animator)
  {
    this._start( now, animator );

    this.temp = this.calculator.create();
  },

  clone: function()
  {
    return new SpringDistance( this.attribute, this.calculator, this.position, this.rest, this.distance, this.damping, this.stiffness, this.velocity, this.gravity, this.finishOnRest );
  },

  updateVelocity: function(dt)
  {
    // d = DISTANCE( position, rest )
    // velocity += ((position - rest) / d * stiffness * |distance - d| - (damping * velocity)) * elapsed.seconds;
    // position += velocity * elapsed.seconds;

    var calc = this.calculator;
    var rest = this.resolveRest();

    var d = calc.distance( this.position, rest );

    this.temp = calc.copy( this.temp, this.position );
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
 * Instantiates a new SpringLinear.
 *
 * @param {String|false} attribute
 * @param {Calculator} calculator
 * @param {T} position
 * @param {T} rest
 * @param {T} damping
 * @param {T} stiffness
 * @param {T} velocity
 * @param {T} gravity
 * @param {Boolean} finishOnRest
 * @class SpringLinear
 * @constructor
 * @extends Spring
 */
function SpringLinear(attribute, calculator, position, rest, damping, stiffness, velocity, gravity, finishOnRest)
{
  this.set( attribute, calculator, rest, position, velocity, gravity, finishOnRest );

  this.damping      = damping;
  this.stiffness    = stiffness;
  this.temp0        = null;
  this.temp1        = null;
}

Class.extend( SpringLinear, Spring,
{

  start: function(now, animator)
  {
    this._start( now, animator );

    var attribute = animator.getAttribute( this.attribute );
    var calc = this.calculator;

    this.damping      = this.parseValue( animator, this.damping, attribute.defaultValue );
    this.stiffness    = this.parseValue( animator, this.stiffness, attribute.defaultValue );
    this.temp0        = calc.create();
    this.temp1        = calc.create();
  },

  clone: function()
  {
    return new SpringLinear( this.attribute, this.calculator, this.position, this.rest, this.damping, this.stiffness, this.velocity, this.gravity, this.finishOnRest );
  },

  hasComputed: function()
  {
    return isComputed( this.rest ) ||
           isComputed( this.position ) ||
           isComputed( this.gravity ) ||
           isComputed( this.velocity ) ||
           isComputed( this.damping ) ||
           isComputed( this.stiffness );
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


var nextTimeline = (function()
{
  var id = 0;

  return function() {
    return ++id;
  };

})();

function Movie(name)
{
  this.name = name;
  this.currentTime = 0;
  this.currentTimelines = [];
  this.sequenceDelay = 0;
  this.sequenceEasing = Easings.linear;
  this.introduce = false;
  this.timelines = new FastMap();
  this.autoEnd = false;
}

Class.define( Movie,
{

  setAutoEnd: function(autoEnd)
  {
    this.autoEnd = autoEnd;

    return this;
  },

  sequence: function(delay, easing)
  {
    this.sequenceDelay = $time( delay );
    this.sequenceEasing = $easing( easing, Easings.linear );

    return this;
  },

  intro: function(subjects)
  {
    this.currentTimelines = this.getTimelines( subjects );
    this.introduce = true;

    return this;
  },

  with: function(subjects)
  {
    this.currentTimelines = this.getTimelines( subjects );

    return this;
  },

  add: function(subjects)
  {
    var additional = this.getTimelines( subjects );

    this.currentTimelines.push.apply( this.currentTimelines, additional );

    return this;
  },

  getTimeline: function(animator)
  {
    var timelineId = animator.$timelineId;
    var timeline = this.timelines.get( timelineId );

    if ( !isDefined( timeline ) )
    {
      timelineId = nextTimeline();
      timeline = new MovieTimeline( animator );
      animator.$timelineId = timelineId;

      this.timelines.put( timelineId, timeline );
    }

    return timeline;
  },

  getTimelines: function(subjects)
  {
    var animators = [];

    if ( isArray( subjects ) )
    {
      for (var i = 0; i < subjects.length; i++)
      {
        var animator = anim8( subjects[ i ] );

        if ( animator !== false )
        {
          animators.push( this.getTimeline( animator ) );
        }
      }
    }
    else
    {
      var animator = anim8( subjects );

      if ( animator !== false )
      {
        animators.push( this.getTimeline( animator ) );
      }
    }

    return animators;
  },

  at: function(time)
  {
    var at = $time( time, false );

    if ( at === false )
    {
      throw 'Invalid time in Movie.at: ' + time;
    }

    this.currentTime = at;

    return this;
  },

  seek: function(time)
  {
    var by = $time( time, false );

    if ( by === false )
    {
      throw 'Invalid time in Movie.seek: ' + time;
    }

    return this.at( this.currentTime + by );
  },

  end: function()
  {
    return this.at( this.duration() );
  },

  play: function(animation, options, all)
  {
    var parsed = $animation( animation, options );
    var intro = this.introduce;

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.playAttrimators( parsed.newAttrimators(), all, time, intro );
    });
  },

  queue: function(animation, options, all)
  {
    var parsed = $animation( animation, options );

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.queueAttrimators( parsed.newAttrimators(), all, time );
    });
  },

  transition: function(transition, animation, options, all)
  {
    var transition = $transition( transition );
    var parsed = $animation( animation, options );

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.transitionAttrimators( parsed.newAttrimators(), all, time, transition );
    });
  },

  eachCurrentTimeline: function(onTimeline)
  {
    var timelines = this.currentTimelines;
    var n = timelines.length - 1;
    var time = this.currentTime;

    if ( this.sequenceDelay > 0 )
    {
      var timeGap = n * this.sequenceDelay;
      var easing = this.sequenceEasing;

      for (var i = 0; i <= n; i++)
      {
        onTimeline( timelines[ i ], time + easing( i / n ) * timeGap );
      }
    }
    else
    {
      for (var i = 0; i <= n; i++)
      {
        onTimeline( timelines[ i ], time );
      }
    }

    this.sequenceDelay = 0;
    this.introduce = false;

    if ( this.autoEnd )
    {
      this.end();
    }

    return this;
  },

  duration: function()
  {
    var timelines = this.timelines.values;
    var maxTime = 0;

    for (var i = 0; i < timelines.length; i++)
    {
      maxTime = Math.max( maxTime, timelines[ i ].attrimators.timeRemaining() );
    }

    return maxTime;
  }
});

eventize( Movie.prototype );


function MoviePlayer(movie)
{
  this.speed = 1.0;
  this.time = 0;
  this.currentTime = 0;
  this.playing = false;
  this.movie = movie;
  this.duration = movie.duration();
  this.run = this.runner( movie, this );
}

Class.define( MoviePlayer,
{
  reverse: function()
  {
    this.speed = -this.speed;

    return this;
  },
  backward: function()
  {
    this.speed = -Math.abs( this.speed );

    return this;
  },
  forward: function()
  {
    this.speed = Math.abs( this.speed );

    return this;
  },
  start: function(applyNow, avoidApplyTrigger)
  {
    this.time = 0;

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  end: function(applyNow, avoidApplyTrigger)
  {
    this.time = this.duration;

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  play: function()
  {
    if ( !this.playing )
    {
      this.currentTime = now();
      this.playing = true;

      requestRun( this.run );
    }

    return this;
  },
  pause: function()
  {
    this.playing = false;

    return this;
  },
  goto: function(time, applyNow, avoidApplyTrigger)
  {
    this.time = $time( time );

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  apply: function(applyTime, avoidApplyTrigger)
  {
    var time = coalesce( applyTime, this.time );
    var timelines = this.movie.timelines.values;
    var active = [];

    for (var i = 0; i < timelines.length; i++)
    {
      var timeline = timelines[ i ];

      if ( time >= timeline.start )
      {
        active.push( timeline );
      }
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].preupdate( time );
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].update( time );
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].apply();
    }

    if ( !avoidApplyTrigger )
    {
      this.trigger( 'apply', [this, time] );
    }

    return this;
  },
  evaluatePlaying: function()
  {
    if ( this.playing )
    {
      if ( this.time < 0 )
      {
        this.time = 0;
        this.playing = false;
        this.trigger( 'start', [this] );
      }
      else if ( this.time > this.duration )
      {
        this.time = this.duration;
        this.playing = false;
        this.trigger( 'end', [this] );
      }
    }

    return this;
  },
  runner: function(movie, player)
  {
    return function run()
    {
      var currentTime = now();
      var elapsed = currentTime - player.currentTime;

      player.time += elapsed * player.speed;
      player.currentTime = currentTime;
      player.apply();
      player.evaluatePlaying();

      if ( player.playing )
      {
        requestRun( player.run );
      }
    };
  }
});

eventize( MoviePlayer.prototype );


function MovieTimeline(animator)
{
  this.animator = animator;
  this.attrimators = new AttrimatorMap();
  this.start = 0;
}

Class.define( MovieTimeline,
{

  playAttrimators: function(attrimatorMap, all, time, intro)
  {
    if ( this.attrimators.size() )
    {
      this.attrimators.playMapAt( attrimatorMap, all, time );
    }
    else
    {
      this.attrimators.putMap( attrimatorMap );
      this.attrimators.delay( time );

      if ( !intro )
      {
        this.start = time;
      }
    }
  },

  queueAttrimators: function(attrimatorMap, all, time)
  {
    if ( all )
    {
      this.attrimators.stopNotPresentAt( attrimatorMap, time );
    }

    this.attrimators.queueMap( attrimatorMap );
  },

  transitionAttrimators: function(attrimatorMap, all, time, transition)
  {
    if ( all )
    {
      this.attrimators.stopNotPresentAt( attrimatorMap, time + transition.time );
    }

    this.attrimators.transitionMap(
      transition,
      attrimatorMap,
      function getValue(attr) {
        var attrimator = this.attrimators.get( attr );
        var attribute = this.animator.getAttribute( attr );

        return attrimator ? attrimator.valueAtSearch( time, attribute.cloneDefault() ) : undefined;
      },
      function getAttribute(attr) {
        return this.animator.getAttribute( attr );
      },
      function placeAttrimator(attrimator) {
        this.attrimators.playAttrimatorAt( attrimator, time );
      },
      function getValueAt(attrimator, relativeTime, out) {
        return attrimator.valueAtSearch( time + relativeTime, out );
      },
      function stopAttrimator(attrimator, relativeTime) {
        attrimator.stopAt( time + relativeTime );
      },
      this
    );
  },

  preupdate: function(time)
  {
    var animator = this.animator;
    var attrimators = this.attrimators.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = animator.attrimators.get( attr );
      var attrimatorAt = attrimator.attrimatorAt( time );

      if ( existing !== attrimatorAt )
      {
        if ( attrimatorAt )
        {
          animator.placeAttrimator( attrimatorAt );
        }
        else
        {
          animator.attrimators.remove( attr );
        }
      }
    }

    this.animator.preupdate( time );
  },

  update: function(time)
  {
    var animator = this.animator;
    var attrimators = this.attrimators.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calculator = attribute.calculator;
      var currentValue = animator.frame[ attr ];

      if ( calculator.isValid( currentValue ) )
      {
        var valueAt = attrimator.valueAtSearch( time, currentValue );

        if ( valueAt !== false )
        {
          animator.frame[ attr ] = valueAt;
          animator.updated[ attr ] = true;
        }
      }
    }
  },

  apply: function()
  {
    this.animator.apply();
  }

});


var Builders = {};

/**
 * Register the builder.
 */
Builders['values'] = new BuilderDeltas();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      ... other builders ...
 *      and: {
 *       ... more builders ...
 *      }
 *     });
 *
 *
 * @property {BuilderAnd} and
 * @for anim8.builder
 */
Builders['and'] = new BuilderAnd();

/**
 * Register the builder.
 */
Builders['final'] = new BuilderFinal();


/**
 * Register the builder.
 */
Builders['initial'] = new BuilderInitial();

/**
 * Registers the builder.
 */
Builders['keyframe'] = new BuilderKeyframe();

/**
 * Register the builder.
 */
Builders['move'] = new BuilderMove();

/**
 * A builder which generates attrimators which follow a given path.
 *
 * **Examples:**
 *
 *     animator.play({
 *      path: {
 *       opacity: {
 *        type: 'quadratic',
 *        p0: 0,
 *        p1: 0.4,
 *        p2: 1.0
 *       }
 *      }
 *     });
 *
 *
 * @property {BuilderPath} path
 * @for anim8.builder
 */
Builders['path'] = new BuilderPath();

/**
 * Register the builder.
 */
Builders['physics'] = new BuilderPhysics();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      ... other builders ...
 *      queue: {
 *       ... more builders to play after the others ...
 *      }
 *     });
 *
 *
 * @property {BuilderQueue} queue
 * @for anim8.builder
 */
Builders['queue'] = new BuilderQueue();

/**
 * Register the builder.
 */
Builders['springs'] = new BuilderSpring();

/**
 * Register the builder.
 */
Builders['travel'] = new BuilderTravel();

/**
 * Register the builder.
 */
Builders['tweenFrom'] = new BuilderTweenFrom();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      tweenTo: {
 *       opacity: 1.0,       // absolute value
 *       left: '+40'         // 40 more units from current value
 *      }
 *     });
 *
 *
 * @property {BuilderTweenTo} tweenTo
 * @for anim8.builder
 */
Builders['tweenTo'] = new BuilderTweenTo();


/**
 * A collection of calculators. A calculator is responsible for performing
 * mathematical operations for a specific animatable data type.
 *
 * @class anim8.calculator
 */
var Calculators = {};

/**
 * A calculator for numbers.
 *
 * @property {CalculatorNumber} number
 * @for anim8.Calculators
 */
Calculators['number'] = new CalculatorNumber();

/**
 * A calculator for 2d points; objects with x & y Number components.
 *
 * @property {Calculator2d} 2d
 * @for anim8.Calculators
 */
Calculators['2d'] = new Calculator2d();

/**
 * A calculator for 3d points; objects with x, y, & z Number components.
 *
 * @property {Calculator3d} 3d
 * @for anim8.Calculators
 */
Calculators['3d'] = new Calculator3d();

/**
 * A calculator for quaternions; objects with x, y, z, & angle Number components.
 *
 * @property {CalculatorQuaternion} quaternion
 * @for anim8.Calculators
 */
Calculators['quaternion'] = new CalculatorQuaternion();

/**
 * A calculator for opaque colors; objects with r, g, & b Number components.
 *
 * @property {CalculatorRGB} rgb
 * @for anim8.Calculators
 */
Calculators['rgb'] = new CalculatorRGB();

/**
 * A calculator for colors; objects with r, g, b, & a Number components.
 *
 * @property {CalculatorRGBA} rgba
 * @for anim8.Calculators
 */
Calculators['rgba'] = new CalculatorRGBA();

/**
 * A calculator for strings.
 *
 * @property {CalculatorString} string
 * @for anim8.Calculators
 */
Calculators['string'] = new CalculatorString();

/**
 * The default calculator.
 *
 * @property {CalculatorNumber} default
 * @for anim8.Calculators
 */
Calculators['default'] = Calculators['number'];


var Factories = {};

/**
 * Registers the object factory.
 */
Factories['object'] = new FactoryObject();

/**
 * Registers the default factory.
 */
Factories['default'] = Factories['object'];


var Paths = {};

/**
 * Parses an object for a combo path.
 *
 * @param {Object} path
 * @return {PathCombo}
 */
Paths['combo'] = function(path)
{
  var paths = path.paths;

  for (var i = 0; i < paths.length; i++)
  {
    paths[ i ] = $path( paths[ i ] );
  }

  return new PathCombo(
    path.name,
    paths,
    path.uniform,
    path.granularity
  );
};


/**
 * Parses an object for a compiled path.
 *
 * @param {Object} path
 * @return {PathCompiled}
 */
Paths['compiled'] = function(path)
{
  var parent = $path( path.path );

  return new PathCompiled(
    path.name,
    parent,
    path.n || path.pointCount
  );
};

/**
 * Parses an object for a cubic path.
 *
 * @param {Object} path
 * @return {PathCubic}
 */
Paths['cubic'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathCubic(
    path.name,
    calc,
    calc.parse( path.p0, defaultValue ),
    calc.parse( path.p1, defaultValue ),
    calc.parse( path.p2, defaultValue ),
    calc.parse( path.p3, defaultValue )
  );
};

/**
 * Parses an object for a delta path.
 *
 * @param {Object} path
 * @return {PathDelta}
 */
Paths['delta'] = function(path)
{
  var calc = $calculator( path.calculator );

  if (!path.deltas)
  {
    path.deltas = [];

    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  return new PathDelta(
    path.name,
    calc,
    calc.parseArry( path.points, path.points, path.defaultValue ),
    path.deltas
  );
};

/**
 * Parses an object for a jump path.
 *
 * @param {Object} path
 * @return {PathJump}
 */
Paths['jump'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathJump(
    path.name,
    calc,
    calc.parseArry( path.points, path.points, path.defaultValue )
  );
};

/**
 * Parses an object for a keyframe path.
 *
 * @param {Object} path
 * @return {PathKeyframe}
 */
Paths['keyframe'] = function(path)
{
  var calc = $calculator( path.calculator );

  if (!path.deltas)
  {
    path.deltas = [];

    for (var i = 0; i < path.points.length; i++)
    {
      path.deltas[ i ] = i / ( path.points.length - 1 );
    }
  }

  var defaultEasing = $easing( path.easings, null );

  if ( !isDefined( path.easings ) || !isArray( path.easings ) || defaultEasing !== null )
  {
    path.easings = [];

    for (var i = 0; i < path.points.length; i++)
    {
      path.easings[ i ] = defaultEasing;
    }
  }

  for (var i = 0; i < path.easings.length; i++)
  {
    path.easings[ i ] = $easing( path.easings[ i ] );
  }

  return new PathKeyframe(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.deltas,
    path.easings
  );
};


/**
 * Parses an object for a quadratic path.
 *
 * @param {Object} path
 * @return {PathQuadratic}
 */
Paths['quadratic'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathQuadratic(
    path.name,
    calc,
    calc.parse( path.p0, defaultValue ),
    calc.parse( path.p1, defaultValue ),
    calc.parse( path.p2, defaultValue )
  );
};

/**
 * Parses an object for a tween path.
 *
 * @param {Object} path
 * @return {Tween}
 */
Paths['tween'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new Tween(
    path.name,
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.end, defaultValue )
  );
};

/**
 * Parses an object for a sub path.
 *
 * @param {Object} path
 * @return {PathSub}
 */
Paths['sub'] = function(path)
{
  var parent = $path( path.path );

  return new PathSub(
    path.name,
    parent,
    coalesce( path.start, 0 ),
    coalesce( path.end, 1 )
  );
};

/**
 * Parses an object for a quadratic corner path.
 *
 * @param {Object} path
 * @return {PathQuadraticCorner}
 */
Paths['quadratic-corner'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathQuadraticCorner(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.midpoint,
    path.loop
  );
};

/**
 * Parses an object for a linear path.
 *
 * @param {Object} path
 * @return {PathLinear}
 */
Paths['linear'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathLinear(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue )
  );
};


/**
 * Parses an object for a uniform path.
 *
 * @param {Object} path
 * @return {PathUniform}
 */
Paths['uniform'] = function(path)
{
  var parent = $path( path.path );

  return new PathUniform(
    path.name,
    parent,
    path.n || path.pointCount
  );
};

/**
 * Parses an object for a hermite path.
 *
 * @param {Object} path
 * @return {PathHermite}
 */
Paths['hermite'] = function(path)
{
  var calc = $calculator( path.calculator );
  var defaultValue = calc.parse( path.defaultValue, calc.ZERO );

  return new PathHermite(
    path.name,
    calc,
    calc.parse( path.start, defaultValue ),
    calc.parse( path.startTangent, defaultValue ),
    calc.parse( path.end, defaultValue ),
    calc.parse( path.endTangent, defaultValue )
  );
};

/**
 * Parses an object for a bezier path.
 *
 * @param {Object} path
 * @return {PathBezier}
 */
Paths['bezier'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathBezier(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.weights
  );
};

/**
 * Parses an object for a parametric cubic curve path.
 *
 * @param {Object} path
 * @return {PathParametric}
 */
Paths['parametric'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathParametric(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.loop,
    path.matrix,
    path.weight
  );
};

/**
 * Parses an object for a parametric cubic curve path.
 *
 * @param {Object} path
 * @return {PathParametric}
 */
Paths['catmull-rom'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathCatmullRom(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.loop
  );
};

/**
 * Parses an object for a basis spline path.
 *
 * @param {Object} path
 * @return {PathBasisSpline}
 */
Paths['basis-spline'] = function(path)
{
  var calc = $calculator( path.calculator );

  return new PathBasisSpline(
    path.name,
    calc,
    calc.parseArray( path.points, path.points, path.defaultValue ),
    path.loop
  );
};


var Springs = {};

/**
 * Register the spring builder.
 *
 * @param {Object}
 * @return {SpringDistance}
 */
Springs['distance'] = function(spring)
{
  return new SpringDistance(
    spring.attribute,
    spring.calculator,
    coalesce( spring.position, true ),
    coalesce( spring.rest, true ),
    spring.distance,
    spring.damping,
    spring.stiffness,
    spring.velocity,
    spring.gravity,
    spring.finishOnRest
  );
};

/**
 * Register the spring builder.
 *
 * @param {Object}
 * @return {SpringLinear}
 */
Springs['linear'] = function(spring)
{
  return new SpringLinear(
    spring.attribute,
    spring.calculator,
    coalesce( spring.position, true ),
    coalesce( spring.rest, true ),
    spring.damping,
    spring.stiffness,
    spring.velocity,
    spring.gravity,
    spring.finishOnRest
  );
};


/**
 * Returns an instance of {{#crossLink "Animation"}}{{/crossLink}} based on the
 * given input & options. If the input is a string the animation with that name
 * is returned. If the input is a string with an animation name and an option
 * string the animation with the given name modified by any additional options
 * is returned. Commas can be used to queue animation & option pairs one after
 * another. Ampersands can be used to play animations at the same time. If the
 * input is an object an anonymous animation is created. If no animation could
 * be determined then false is returned.
 *
 * **Examples:**
 *
 *     animation('wiggle');
 *     animation('wiggle ~1s 4s z40ms x5 !1.2');
 *     animation('wiggle', {...options...});
 *     animation('wiggle, tada ~50ms, fadeOut 2s');
 *     animation('wiggle & tada !3, fadeOut');
 *     animation({...definition...});
 *
 * If the given input is a string you can cache it. An example would be
 * 'wiggle ~1s 2s x3' - if `cache` is true and you call this method again it won't
 * need to be parsed again.
 *
 * **See:** {{#crossLink "Core/options:method"}}{{/crossLink}}
 *
 * @method animation
 * @for Core
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 * @param {Boolean} [cache=false]
 * @return {Animation|False}
 * @throws {String} The animation string has an invalid animation name or the
 *    animation fails to create attrimators from the animation definition.
 */
function $animation(animation, options, cache)
{
  var options = $options( options, cache );
  var hasOptions = !isEmpty( options );

  if ( animation instanceof Animation )
  {
    if ( hasOptions )
    {
      var attrimators = animation.newAttrimators();

      animation.merge( options, attrimators );

      return new Animation( false, animation.input, options, attrimators);
    }

    return animation;
  }
  if ( isString( animation ) )
  {
    var key = animation.toLowerCase();

    if ( key in Animations && !hasOptions )
    {
      return Animations[ key ];
    }

    var attrimators = $attrimatorsFor( animation, options, cache );

    if ( key in Animations && !hasOptions )
    {
      return Animations[ key ];
    }

    return new Animation( false, {}, options, attrimators );
  }
  if ( isObject( animation ) )
  {
    var attrimators = $attrimatorsFor( animation, options, cache );

    return new Animation( false, animation, options, attrimators );
  }

  return false;
}



/**
 * Generates an AttrimatorMap for the given animation and options. If the
 * animation given is an instance of {{#crossLink "Animation"}}{{/crossLink}}
 * then a copy of that animations attrimators is returned, and if options are
 * specified then they are merged into the generated attrimators. If the
 * animation given is an object it's properties are iterated and for each builder
 * with a matching name attrimators are generated. If the animation given is a
 * string of a cached or saved animation then it's handled as if an instance of
 * {{#crossLink "Animation"}}{{/crossLink}} was given. If the animation given
 * is a string which isn't saved or cached it goes through the following parsing
 * logic.
 *
 * - Split up the string into sections with `,` which queues animations.
 * - Split up each of the sections with `&` which enables animations to play
 *   simultaneously.
 * - For each of those sections, take the first word as the name of the
 *   animation and any remaining text as the options for that animation.
 *
 * If no attrimators could be parsed, an empty attrimator map is returned. If
 * the animation given is a string that specifies animations that don't exist
 * an error is thrown.
 *
 * **Examples:**
 *
 *     anim8.attrimatorsFor('wiggle');
 *     anim8.attrimatorsFor('wiggle ~1s 4s z40ms x5 !1.2');
 *     anim8.attrimatorsFor('wiggle', {...options...});
 *     anim8.attrimatorsFor('wiggle, tada ~50ms, fadeOut 2s');
 *     anim8.attrimatorsFor('wiggle & tada !3, fadeOut');
 *     anim8.attrimatorsFor({...definition...});
 *
 * If the given input is a string you can cache it. An example would be
 * 'wiggle ~1s 2s x3' - if `cache` is true and you call this method again it won't
 * need to be parsed again.
 *
 * **See:** {{#crossLink "Core/options:method"}}{{/crossLink}}
 *
 * @method anim8.attrimatorsFor
 * @for Core
 * @param {Object|String} animation
 * @param {Object|String} [options]
 * @param {Boolean} [cache=false]
 * @return {AttrimatorMap}
 */
function $attrimatorsFor( animation, options, cache )
{
  var parsedOptions = $options( options, cache );
  var hasOptions = !isEmpty( parsedOptions );
  var attrimators = new AttrimatorMap();

  if ( animation instanceof Animation )
  {
    attrimators.putMap( animation.newAttrimators() );

    if ( hasOptions )
    {
      animation.merge( parsedOptions, attrimators );
    }
  }
  else if ( isObject( animation ) )
  {
    var helper = new BuilderHelper( animation, parsedOptions );

    for (var builderName in animation)
    {
      var builder = $builder( builderName );

      if ( builder !== false )
      {
        builder.parse( animation, parsedOptions, attrimators, helper );
      }
    }
  }
  else if ( isString( animation ) )
  {
    var key = animation.toLowerCase();
    var saved = Animations[ key ];
    var cacheIt = coalesce( cache, Defaults.cache );

    if ( saved )
    {
      attrimators.putMap( saved.newAttrimators() );

      if ( hasOptions )
      {
        saved.merge( parsedOptions, attrimators );
      }
    }
    else
    {
      var animationsQueued = animation.split( ',' );

      for (var k = 0; k < animationsQueued.length; k++)
      {
        var animationsMerged = animationsQueued[ k ].split( '&' );
        var base = new AttrimatorMap();

        for (var j = 0; j < animationsMerged.length; j++)
        {
          var animationString = trim( animationsMerged[ j ].toLowerCase() );
          var animationSplit = animationString.split( ' ' );
          var parsedAnimation = Animations[ animationSplit[ 0 ] ];

          if ( parsedAnimation )
          {
            var additionalOptions = $options( animationSplit.slice( 1 ), cache );
            var hasAdditionalOptions = !isEmpty( additionalOptions );
            var parsedAttrimators = parsedAnimation.newAttrimators();

            if ( hasOptions && hasAdditionalOptions )
            {
              parsedAnimation.merge( extend( {}, parsedOptions, additionalOptions ), parsedAttrimators );
            }
            else if ( hasAdditionalOptions )
            {
              parsedAnimation.merge( additionalOptions, parsedAttrimators );
            }
            else if ( hasOptions )
            {
              parsedAnimation.merge( parsedOptions, parsedAttrimators );
            }

            base.putMap( parsedAttrimators );
          }
          else
          {
            throw animationString + ' is not a valid animation in "' + animationsQueued[ k ] + '"';
          }
        }

        attrimators.queueMap( base );
      }

      if ( cacheIt && !hasOptions )
      {
        Animations[ key ] = new Animation( animation, {}, {}, attrimators );
      }
    }
  }

  return attrimators;
}


/**
 * A collection of {{#crossLink "Builder"}}builders{{/crossLink}} which takes
 * animation definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generates {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 *
 * @class anim8.builder
 */

/**
 * Returns a builder based on the input. If the input is an instance of Builder
 * it's returned immediately. If the input is a string the builder with that name
 * is returned. If no builder could be determined then false is returned.
 *
 * **See:** {{#crossLink "anim8.builder"}}{{/crossLink}}
 *
 * @method anim8.builder
 * @for Core
 * @param {Builder|String} builderInput
 * @return {Builder|false}
 */
function $builder(builderInput)
{
  if ( builderInput instanceof Builder )
  {
    return builderInput;
  }
  if ( isString( builderInput ) && builderInput in Builders )
  {
    return Builders[ builderInput ];
  }

  return false;
}


/**
* Returns a calculator based on the input. If the input is an instance of
* {{#crossLink "Calculator"}}{{/crossLink}} it is immediately returned. If the
* input is a string the calculator with that name is returned. If no calculator
* could be determined the default calculator is returned.
*
* @method anim8.calculator
* @for Core
* @param {Calculator|String} calculatorInput
* @return {Calculator}
*/
function $calculator(calculatorInput)
{
 if ( calculatorInput instanceof Calculator )
 {
   return calculatorInput;
 }
 if ( isString( calculatorInput ) && calculatorInput in Calculators )
 {
   return Calculators[ calculatorInput ];
 }

 return Calculators['default'];
}



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
function $delay(time)
{
  return $time( time, Defaults.delay );
}


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
function $duration(time)
{
  return $time( time, Defaults.duration );
}


/**
 * Returns an easing based on the given input. If the input is a function it's
 * assumed to be an easing function and is returned immediately. If the input is
 * a string the easing with that name is returned. If the input is a string in
 * the format 'easing-easingType' then an easing is returned that is a
 * combination of the easing with the given name and the easingType with the
 * given name. If the given input is an array with 4 elements it's assumed to be
 * a bezier path and one is created and returned. If no input is given the
 * default easing is returned. If an easing cannot be determined then an error
 * is thrown.
 *
 * **Examples:**
 *
 *     anim8.easing();               // anim8.defaults.easing
 *     anim8.easing( 'linear' );     // anim8.easing.linear
 *     anim8.easing( 'reverse' );    // anim8.easingType.reverse( anim8.defaults.easing )
 *     anim8.easing( 'ease-yoyo' );  // anim8.easingType.yoyo( anim8.easing.ease )
 *     anim8.easing( [0,0,1,1] );    // anim8.easing.bezier( 0, 0, 1, 1 )
 *     anim8.easing( 5, false );     // false
 *     anim8.easing( 'invalid', 1 ); // 1
 *     anim8.easing( [0,0,1], 1 );   // 1
 *
 * @method anim8.easing
 * @for Core
 * @param {Function|String|Array} easing
 * @param {E} [returnOnInvalid]
 * @return {Function|E}
 */
function $easing(easing, returnOnInvalid)
{
  if ( isFunction( easing ) )
  {
    return easing;
  }
  if ( isString( easing ) )
  {
    if ( easing in Easings )
    {
      return Easings[ easing ];
    }
    if ( easing in EasingTypes )
    {
      return EasingTypes[ easing ]( $easing( Defaults.easing ) );
    }

    if ( easing.indexOf('-') !== -1 )
    {
      var pair = easing.split('-');
      var e = pair[0];
      var t = pair[1];

      if ( pair.length >= 2 && e in Easings && t in EasingTypes )
      {
        return EasingTypes[ t ]( Easings[ e ] );
      }
    }
  }
  if ( isArray( easing ) && easing.length === 4 && isNumber( easing[0] ) && isNumber( easing[1] ) && isNumber( easing[2] ) && isNumber( easing[3] ) )
  {
    return Easings.bezier.apply( null, easing );
  }
  if ( !isDefined( easing ) )
  {
    return $easing( Defaults.easing );
  }

  if ( isDefined( returnOnInvalid ) )
  {
    return returnOnInvalid;
  }

  throw easing + ' is not a valid easing';
}


/**
 * Returns an easing type based on the input. If the input is a function that
 * function is immediately returned. If the input is a string the easing type
 * with that name is returned. If no easing type could be determined an error is
 * thrown.
 *
 * @param {Function|String} easingType
 * @param [Boolean] optional
 * @return {Function|false}
 */
function $easingType(easingType, optional)
{
  if ( isFunction( easingType ) )
  {
    return easingType;
  }
  if ( isString( easingType ) && easingType in EasingTypes )
  {
    return EasingTypes[ easingType ];
  }

  if ( optional )
  {
    return false;
  }

  throw easingType + ' is not a valid easing type';
}


/**
 * Returns a factory given the input and returns the default if none is found.
 *
 * @method factory
 * @for Core
 * @param {String|Factory} [factory]
 * @return {Factory}
 */
function $factory(factoryInput)
{
  if ( factoryInput instanceof Factory )
  {
    return factoryInput;
  }
  if ( isString( factoryInput ) && factoryInput in Factories )
  {
    return Factories[ factoryInput ];
  }

  return Factories['default'];
}


/**
 * Returns a factory for the given subject and optionally throws an error if no
 * factory exists.
 *
 * @method factoryFor
 * @for Core
 * @param {Any} subject
 * @param {Boolean} [optional]
 * @return {Factory}
 */
function $factoryFor(subject, optional)
{
  var highestPriorityFactory = false;

  for (var factoryName in Factories)
  {
    var factory = Factories[ factoryName ];

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
}


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
function $number(value, returnOnInvalid)
{
  var parsed = parseFloat( value );

  return isNaN( parsed ) ? returnOnInvalid : parsed;
}



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
function $offset(time)
{
  return $time( time, Defaults.offset );
}


var Options = {};

/**
 * Parses a value into an options object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 *     [duration] x[repeat] z[sleep] ~[delay] @[offset] ![scale] [[easing][-easingType]]
 *
 * This is also a registry of options, you can add your own options that
 * can be used later with syntax like:
 *
 *     anim8.options['myOptions'] = anim8.options('1.5s x2 !2');
 *
 * So you can use 'myOptions' as the options input.
 *
 * You can also specify relative values & scaling values. If you have the
 * following options:
 *
 *     +2s x*2 ~-1s
 *
 * It will result in adding 2 seconds to the duration, repeating it twice as
 * much, and subtracting one second from the delay.
 *
 * For more information on acceptable values in options:
 *
 * **See:** {{#crossLink "Core/anim8.duration:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.repeat:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.sleep:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.delay:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.scale:method"}}{{/crossLink}}, and
 *          {{#crossLink "Core/anim8.easing:method"}}{{/crossLink}}
 *
 * @method anim8.options
 * @for Core
 * @param {Object|String|Array} options
 * @param {Boolean} [cache]
 * @return {Object}
 */
function $options(options, cache)
{
  var originalInput = options;
  var cacheIt = coalesce( cache, Defaults.cacheOptions );

  if ( isString( options ) )
  {
    if ( options in Options )
    {
      return Options[ options ];
    }

    options = options.toLowerCase().split(/\s+/);
  }

  if ( isArray( options ) )
  {
    var parsed = {};

    for (var i = 0; i < options.length; i++)
    {
      var part = options[i];
      var first = part.charAt( 0 );

      // Repeats
      if ( first === 'x' )
      {
        parseOptionProperty( part.substring(1), parsed, $repeat, 'repeat', 'repeatAdd', 'repeatScale' );
      }
      // Sleeping
      else if ( first === 'z' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'sleep', 'sleepAdd', 'sleepScale' );
      }
      // Delay
      else if ( first === '~' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'delay', 'delayAdd', 'delayScale' );
      }
      // Scaling
      else if ( first === '!' )
      {
        parseOptionProperty( part.substring(1), parsed, $number, 'scale', 'scaleAdd', 'scaleScale' );
      }
      // Offset
      else if ( first === '@' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'offset', 'offsetAdd', 'offsetScale' );
      }
      else
      {
        // Easing?
        var easing = $easing( part, false );

        if ( easing !== false )
        {
          parsed.easing = easing;
        }

        // Duration?
        var duration = parseOptionProperty( part, parsed, $time, 'duration', 'durationAdd', 'durationScale' );

        if ( duration === false )
        {
          // If not a duration, might be an alternative repeat? (doesn't start with x)
          parseOptionProperty( part, parsed, $repeat, 'repeat', 'repeatAdd', 'repeatScale' );
        }
      }
    }

    if ( isString( originalInput ) && cacheIt )
    {
      Options[ originalInput ] = parsed;
    }

    return parsed;
  }

  if ( isObject( options ) )
  {
    return options;
  }

  return Defaults.noOptions;
}

function parseOptionProperty(input, out, parseFunction, property, propertyAdd, propertyScale)
{
  var first = input.charAt( 0 );

  if ( first === '*' )
  {
    parsed = $number( input.substring( 1 ), false );

    if ( parsed !== false )
    {
      out[ propertyScale ] = parsed;
    }
  }
  else
  {
    if ( first === '+' || first === '-' )
    {
      property = propertyAdd;
      input = input.substring( 1 );
    }

    var parsed = parseFunction( input, false );

    if ( parsed !== false )
    {
      out[ property ] = parsed;
    }
  }

  return parsed;
}


/**
 * Parses a path given the input and returns an instance of anim8.Path or throws
 * an error if the path could not be parsed. If the input is an object and has
 * a type property with a value that maps to a path type the path's parsing
 * function is invoked with the object.
 *
 * @method anim8.path
 * @for Core
 * @param  {anim8.Path|String|Object} pathInput
 * @return {anim8.Path}
 * @throws {String} If the input is not a valid path.
 */
function $path(pathInput)
{
  if ( pathInput instanceof Path )
  {
    return pathInput;
  }
  if ( isString( pathInput ) && pathInput in Paths )
  {
    return Paths[ pathInput ];
  }
  if ( isObject( pathInput ) && pathInput.type in Paths )
  {
    return Paths[ pathInput.type ]( pathInput );
  }

  throw pathInput + ' is not a valid path';
}



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
var $repeat = (function()
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
    if ( isNumber( repeat ) )
    {
      return repeat;
    }
    if ( isString( repeat ) )
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

    return coalesce( returnOnInvalid, Defaults.repeat );
  };

})();


/**
 * Parses scale from a string or number.
 *
 * **See:** {{#crossLink "Core/anim8.number:method"}}anim8.number{{/crossLink}}
 *
 * @method anim8.scale
 * @param {String|Number} scale
 * @return {Number}
 */
function $scale(scale)
{
  return $number( scale, Defaults.scale );
}



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
function $sleep(time)
{
  return $time( time, Defaults.sleep );
}

/**
 * Returns a spring if the provided argument is a spring, the name of a spring,
 * or an object with a spring type to be created. If none of these conditions
 * are true then an error is thrown.
 *
 * @method anim8.spring
 * @for Core
 * @param {Spring|String|Object} springInput
 * @return {Spring}
 */
function $spring(springInput)
{
  if ( springInput instanceof Spring )
  {
    return springInput;
  }
  if ( isString( springInput ) && springInput in Springs )
  {
    return Springs[ springInput ];
  }
  if ( isObject( springInput ) && springInput.type in Springs )
  {
    return Springs[ springInput.type ]( springInput );
  }

  throw springInput + ' is not a valid spring';
}


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
var $time = (function()
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
    if ( isNumber( time ) )
    {
      // raw numbers are considered milliseconds
      return Math.floor( time );
    }
    if ( isString( time ) )
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

    return coalesce( returnOnInvalid, 0 );
  };

})();


var Transitions = {};

/**
 * Parses a value into a transition object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 *     [time] [easing[-easingType]] >[outro] <[intro] /[granularity] ^[lookup]
 *
 * This is also a registry of transitions, you can add your own transitions that
 * can be used later with syntax like:
 *
 *     anim8.transition['myTransition'] = anim8.transition('50ms 0.05 linear');
 *
 * So you can use 'myTransition' as the transition input.
 *
 *     animator.transition('myTransition', 'myAnimation');
 *
 * @method anim8.transition
 * @for Core
 * @param {Object|String|Array} options
 * @param {Boolean} [cache]
 * @return {Object}
 */
function $transition(transition, cache)
{
  // 1. If it's a string, convert it into an array.
  // 2. If it's an array, parse it and convert it into an object.
  // 3. If it's an object, fill in any missing values with the defaults.

  var originalInput = transition;

  if ( isString( transition ) )
  {
    if ( transition in Transitions )
    {
      return Transitions[ transition ];
    }

    transition = transition.toLowerCase().split(/\s+/);
  }

  if ( isArray( transition ) )
  {
    var transitionArray = transition;

    transition = {};

    for (var i = 0; i < transitionArray.length; i++)
    {
      var part = transitionArray[i];
      var first = part.charAt( 0 );

      // Introduction Time (into next event)
      if ( first === '<' )
      {
        var intro = $time( part.substring(1), false );

        if ( !isNaN( intro ) )
        {
          transition.intro = intro;
        }
      }
      // Outroduction Time (out of current event)
      else if ( first === '>' )
      {
        var outro = $time( part.substring(1), false );

        if ( !isNaN( outro ) )
        {
          transition.outro = outro;
        }
      }
      // Granularity (for velocity conscious transitions)
      else if ( first === '/' )
      {
        var granularity = $number( part.substring(1), false );

        if ( granularity !== false )
        {
          transition.granularity = granularity;
        }
      }
      // Lookup (for velocity conscious transitions)
      else if ( first === '^' )
      {
        var lookup = $time( part.substring(1), false );

        if ( lookup !== false )
        {
          transition.lookup = lookup;
        }
      }
      else
      {
        // Easing
        var easing = $easing( part, false );

        if ( easing !== false )
        {
          transition.easing = easing;
        }

        // Time
        var time = $time( part, false );

        if ( time !== false )
        {
          transition.time = time;
        }
      }
    }
  }

  if ( isObject( transition ) )
  {
    transition.time        = $time( transition.time, Defaults.transitionTime );
    transition.outro       = $time( transition.outro, Defaults.transitionOutro );
    transition.intro       = $time( transition.intro, Defaults.transitionIntro );
    transition.easing      = $easing( coalesce( transition.easing, Defaults.transitionEasing ) );
    transition.granularity = $number( transition.granularity, Defaults.transitionGranularity );
    transition.lookup      = $time( transition.lookup, Defaults.transitionLookup );

    if ( isString( originalInput ) && coalesce( cache, Defaults.cacheTransitions ) )
    {
      Transitions[ originalInput ] = transition;
    }

    return transition;
  }

  return Defaults.noTransition;
}


  // Add events to the animation cycle: begin, end, finished, starting
  eventize( anim8 );

  // anim8.js
  anim8.anim8s = anim8s;
  anim8.fn = Animator.prototype;
  anim8s.fn = Animators.prototype;
  anim8.isRunning = isRunning;
  anim8.isLive = isLive;
  anim8.setLive = setLive;
  anim8.animating = animating;
  anim8.requestRun = requestRun;
  anim8.activateAnimator = activateAnimator;
  anim8.pushAnimator = pushAnimator;
  anim8.activate = activate;
  anim8.run = run;
  anim8.pause = pause;
  anim8.resume = resume;
  anim8.stop = stop;
  anim8.end = end;
  anim8.finish = finish;
  anim8.nopeat = nopeat;

  // Core
  anim8.noop = noop;
  anim8.isDefined = isDefined;
  anim8.isFunction = isFunction;
  anim8.isNumber = isNumber;
  anim8.isBoolean = isBoolean;
  anim8.isString = isString;
  anim8.isArray = isArray;
  anim8.isObject = isObject;
  anim8.isEmpty = isEmpty;
  anim8.now = now;
  anim8.trim = trim;
  anim8.toArray = toArray;
  anim8.copy = copy;
  anim8.extend = extend;
  anim8.coalesce = coalesce;
  anim8.constant = constant;
  anim8.resolve = resolve;
  anim8.id = id;
  anim8.Class = Class;
  anim8.Defaults = Defaults;

  // Math
  anim8.clamp = clamp;
  anim8.gcd = gcd;
  anim8.choose = choose;

  // Registries
  anim8.Animations = Animations;
  anim8.Calculators = Calculators;
  anim8.Factories = Factories;
  anim8.Builders = Builder;
  anim8.Paths = Paths;
  anim8.Springs = Springs;
  anim8.Easings = Easings;
  anim8.EasingTypes = EasingTypes;
  anim8.Options = Options;
  anim8.Transitions = Transitions;

  // Parsing
  anim8.animation = $animation;
  anim8.attrimatorsFor = $attrimatorsFor;
  anim8.calculator = $calculator;
  anim8.delay = $delay;
  anim8.duration = $duration;
  anim8.easing = $easing;
  anim8.easingType = $easingType;
  anim8.factory = $factory;
  anim8.factoryFor = $factoryFor;
  anim8.number = $number;
  anim8.offset = $offset;
  anim8.options = $options;
  anim8.builder = $builder;
  anim8.path = $path;
  anim8.repeat = $repeat;
  anim8.scale = $scale;
  anim8.sleep = $sleep;
  anim8.spring = $spring;
  anim8.time = $time;
  anim8.transition = $transition;

  // Modules
  // - color.js
  anim8.Color = Color;
  // - computed.js
  anim8.computed = computed;
  anim8.isComputed = isComputed;
  // - dynamic.js
  anim8.composite = composite;
  anim8.partial = partial;
  anim8.spread = spread;
  // - eventize.js
  anim8.eventize = eventize;
  // - save.js
  anim8.save = save;
  anim8.saveGroup = saveGroup;
  anim8.SaveOptions = SaveOptions;
  // - translate.js
  anim8.translate = translate;

  // Classes
  anim8.Aninmation = Animation;
  anim8.Animator = Animator;
  anim8.Animators = Animators;
  anim8.Attrimator = Attrimator;
  anim8.AttrimatorMap = AttrimatorMap;
  anim8.Calculator = Calculator;
  anim8.Defer = Defer;
  anim8.DeferAnimator = DeferAnimator;
  anim8.Event = Event;
  anim8.EventState = EventState;
  anim8.Factory = Factory;
  anim8.FastMap = FastMap;
  anim8.Oncer = Oncer;
  anim8.Builder = Builder;
  anim8.Path = Path;
  anim8.Physics = Physics;
  anim8.Sequence = Sequence;
  anim8.Spring = Spring;

  // Movie
  anim8.Movie = Movie;
  anim8.MoviePlayer = MoviePlayer;
  anim8.MovieTimeline = MovieTimeline;

  // Calculators
  anim8.Calculator2d = Calculator2d;
  anim8.Calculator3d = Calculator3d;
  anim8.CalculatorNumber = CalculatorNumber;
  anim8.CalculatorQuaternion = CalculatorQuaternion;
  anim8.CalculatorRGB = CalculatorRGB;
  anim8.CalculatorRGBA = CalculatorRGBA;
  anim8.CalculatorString = CalculatorString;

  // Factories
  anim8.object = object;
  anim8.FactoryObject = FactoryObject;

  // Builders
  anim8.BuilderAnd = BuilderAnd;
  anim8.BuilderDeltas = BuilderDeltas;
  anim8.BuilderFinal = BuilderFinal;
  anim8.BuilderInitial = BuilderInitial;
  anim8.BuilderKeyframe = BuilderKeyframe;
  anim8.BuilderMove = BuilderMove;
  anim8.BuilderPath = BuilderPath;
  anim8.BuilderPhysics = BuilderPhysics;
  anim8.BuilderQueue = BuilderQueue;
  anim8.BuilderSpring = BuilderSpring;
  anim8.BuilderTravel = BuilderTravel;
  anim8.BuilderTweenFrom = BuilderTweenFrom;
  anim8.BuilderTweenTo = BuilderTweenTo;

  // Paths
  anim8.PathBasisSpline = PathBasisSpline;
  anim8.PathBezier = PathBezier;
  anim8.PathCatmullRom = PathCatmullRom;
  anim8.PathCombo = PathCombo;
  anim8.PathCompiled = PathCompiled;
  anim8.PathCubic = PathCubic;
  anim8.PathDelta = PathDelta;
  anim8.PathHermite = PathHermite;
  anim8.PathJump = PathJump;
  anim8.PathKeyframe = PathKeyframe;
  anim8.PathLinear = PathLinear;
  anim8.PathParametric = PathParametric;
  anim8.PathQuadratic = PathQuadratic;
  anim8.PathQuadraticCorner = PathQuadraticCorner;
  anim8.PathSub = PathSub;
  anim8.PathUniform = PathUniform;
  anim8.PathTween = Tween;

  // Springs
  anim8.SpringDistance = SpringDistance;
  anim8.SpringLinear = SpringLinear;

  return anim8;

}));
