

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
