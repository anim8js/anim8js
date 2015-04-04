

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