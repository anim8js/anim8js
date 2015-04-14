

/**
 * The namespace for computed functions. Computed functions are functions that
 * are invoked once at the start of an animation given the attrimator and 
 * animator and the result replaces the function.
 */
anim8.computed = {};

/**
 * Calculates the current value for an animator.
 * 
 * @param {anim8.Attrimator} attrimator
 * @param {anim8.Animator} animator
 * @return {T}
 */
anim8.computed.current = function(attrimator, animator)
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
};

// Marks the function as computed which is a signal to paths & events.
anim8.computed.current.computed = true;

/**
 * Calculates a value relative to the attribute value currently in the animator.
 * A mask can be used for mixed relative & absolute values in a single value
 * where 1 makes it relative and 0 makes it absolute.
 * 
 * @param {T} relativeAmount
 * @param {T} mask
 * @return {Function}
 */
anim8.computed.relative = function(relativeAmount, mask)
{
  // If the relativeAmount is already a computed value, return it.
  if ( anim8.isComputed( relativeAmount ) )
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
};

/**
 * Returns a random value based on the given random selection.
 * 
 * 1. If an array is given an item is randomly chosen from that array.
 * 2. If an instance of anim8.Path is given a point is randomly computed and returned.
 * 3. If an object with min & max values is given a random value between them is returned.
 * 
 * @param  {Array|Object|anim8.Path} randomSelection
 * @return {Function}
 */
anim8.computed.random = function(randomSelection)
{
  var randomFunction = null;

  if ( anim8.isArray( randomSelection ) )
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
  else if ( randomSelection instanceof anim8.Path )
  {
    randomFunction = function(attrimator, animator)
    {
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calc = attribute.calculator;

      return randomSelection.compute( calc.create(), Math.random() );
    };
  }
  else if ( anim8.isObject( randomSelection ) && anim8.isDefined( randomSelection.min ) && anim8.isDefined( randomSelection.max ) )
  {
    randomFunction = function(attrimator, animator)
    {
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calc = attribute.calculator;
      var resolvedMin = anim8.resolve( randomSelection.min );
      var resolvedMax = anim8.resolve( randomSelection.max );
      var min = calc.parse( resolvedMin, calc.ZERO );
      var max = calc.parse( resolvedMax, calc.ZERO );

      return calc.random( calc.create(), min, max );
    };
  }
  else
  {
    throw 'Invalid random input: ' + randomSelection;
  }

  // Marks the function as computed which is a signal to paths & events.
  randomFunction.computed = true;

  // Place the input on the function if the user wants to modify it live
  randomFunction.randomSelection = randomSelection;

  return randomFunction;
};

/**
 * Determines whether the given value is a computed value. A computed value is
 * function with a variable 'computed' set to a true value.
 * 
 * @param  {any} x
 * @return {Boolean}
 */
anim8.isComputed = function(x)
{
  return anim8.isFunction( x ) && x.computed;
};
