
/**
 * Returns a factory given the input and returns the default if none is found.
 *
 * @method factory
 * @for Core
 * @param {String|Factory} [factory]
 * @return {Factory}
 */
function $factory(factoryInput, forObject)
{
  if ( factoryInput instanceof Factory )
  {
    return factoryInput;
  }
  if ( isString( factoryInput ) && factoryInput in Factories )
  {
    return Factories[ factoryInput ];
  }
  if ( forObject )
  {
    if ( forObject instanceof Factory )
    {
      return forObject;
    }

    if ( forObject instanceof Sequence )
    {
      forObject = forObject.animators;
    }

    if ( forObject instanceof Animators )
    {
      forObject = forObject.$[0];
    }

    if ( forObject instanceof Animator && forObject.factory )
    {
      return forObject.factory;
    }
  }

  return Factories['default'];
}
