
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
    var factory = factory[ factoryName ];

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
