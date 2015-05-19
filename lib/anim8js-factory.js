

/**
 * Returns a factory for the given subject and optionally throws an error if no
 * factory exists.
 *
 * @method anim8.factoryFor
 * @for Core
 * @param {Any} subject
 * @param {Boolean} [optional]
 * @return {Factory}
 */
anim8.factoryFor = function(subject, optional) 
{
  var highestPriorityFactory = false;

  for (var factoryName in anim8.factory) 
  {
    var factory = anim8.factory[ factoryName ];
    
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
};

/**
 * Returns a factory given the input and returns the default if none is found.
 *
 * @method anim8.factory
 * @for Core
 * @param {String|Factory} [factory]
 * @return {Factory}
 */
anim8.factory = function(factory)
{
  if ( factory instanceof anim8.Factory )
  {
    return factory;
  }
  if ( anim8.isString( factory ) && factory in anim8.factory )
  {
    return anim8.factory[ factory ];
  }

  return anim8.factory.default;
};

/**
 * A factory creates Animator instances for subjects.
 *
 * @class Factory
 * @constructor
 */
anim8.Factory = function()
{
  this.priority = 0;
};

anim8.Factory.prototype = 
{

  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   *
   * @method is
   * @param  {Any} subject
   * @return {Boolean}
   */
  is: function(subject)
  {
    throw 'Factory.is not implemented';
  },

  /**
   * Returns an animator given a subject.
   *
   * @method animatorFor
   * @param  {Any} subject
   * @return {Animator}
   */
  animatorFor: function(subject)
  {
    throw 'Factory.animatorFor not implemented';
  },

  /**
   * Explodes the given subject to an array of Animators and adds them to the given array.
   *
   * @method animatorsFor
   * @param {Any} subject
   * @param {Array} animators
   */
  animatorsFor: function(subject, animators)
  {
    animators.push( this.animatorFor( subject ) );
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   *
   * @method destroy
   * @param {Animator} animator
   */
  destroy: function(animator)
  {

  },

  /**
   * Returns the attribute descriptor for the given attribute. An attribute
   * descriptor is an object with at least the following properties:
   *
   * - `name` = the name of the attribute (same as `attr`)
   * - `calculatorName` = the name of the calculator for the attribute
   * - `calculator` = the calculator for the attribute
   * - `defaultValue` = the default value for the attribute
   * - `parse` = a method to pass a value and have the calculator parse it and
   *             return the defaultValue if it was invalid
   * - `cloneDefault` = a method which returns a clone of the default value
   *
   * @method attribute
   * @param {String} attr
   * @return {Object}
   */
  attribute: function(attr)
  {
    throw 'Factory.attribute not implemented';
  }

};
