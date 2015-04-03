

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
  var attribute = animator.attributes[ attr ];
  var calc = anim8.calculator( attribute.calculator );

  if ( attr in animator.frame )
  {
    return calc.clone( animator.frame[ attr ] );
  }
  else
  {
    return calc.clone( attribute.defaultValue );
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
anim8.computed.relative = function(relativeAmount)
{
  var relativeFunction = function(event, animator)
  { 
    var attr = event.attribute;
    var attribute = animator.attributes[ attr ];
    var calc = anim8.calculator( attribute.calculator );
    var current = null;

    if ( attr in animator.frame )
    {
      current = calc.clone( animator.frame[ attr ] );
    }
    else
    {
      current = calc.clone( attribute.defaultValue );
    }

    return calc.add( current, relativeAmount );
  };

  // Marks the function as computed which is a signal to paths & events.
  relativeFunction.computed = true;

  return relativeFunction;
};