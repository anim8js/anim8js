

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

function isRelative(x)
{
  return isString( x ) && /^[+-]\d*\.?\d+$/.test( x );
}

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
 * Returns a computed function which builds a value for the given calculator
 * given an array of data points.
 *
 * **Examples:**
 *
 *     anim8.computed.combined( [1, 2, 3] ); // returns function which returns a 1, 2, or 3
 *
 * @method combined
 * @param  {Array} numbers
 * @return {Function}
 */
computed('combined', function(numbers)
{
  var numberCalculator = $calculator('number');

  var combinerFunction = function(attrimator, animator)
  {
    var attribute = animator.getAttribute( attrimator.attribute );
    var combined = [];

    for (var i = 0; i < numbers.length; i++)
    {
      combined.push( resolveComputed( attrimator, animator, numbers[ i ], numberCalculator ) );
    }

    return attribute.parse( combined );
  };

  // Place the input on the function if the user wants to modify it live
  combinerFunction.numbers = numbers;

  return computed( combinerFunction );
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

function resolveComputed(attrimator, animator, value, parser)
{
  if ( parser instanceof Calculator )
  {
    value = parser.parse( value );
  }
  else if ( isFunction( parser ) )
  {
    value = parser( attrimator, animator, value );
  }

  if ( isComputed( value ) )
  {
    return value( attrimator, animator );
  }

  return resolve( value );
}
