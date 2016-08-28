
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
