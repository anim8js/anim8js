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
