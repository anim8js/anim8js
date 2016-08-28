
/**
 * A factory creates Animator instances for subjects.
 *
 * @class Factory
 * @constructor
 */
function Factory()
{
  this.priority = 0;
}

Class.define( Factory,
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

});
