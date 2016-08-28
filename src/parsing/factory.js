
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
