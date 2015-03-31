

/**
 * Returns a factory for the given subject or throws an error if no factory exists.
 *
 * @param {any} subject
 */
anim8.factory = function(subject, optional) 
{
  for (var factoryName in anim8.factory) 
  {
    var factory = anim8.factory[ factoryName ];
    
    if ( factory.is( subject ) )
    {     
      return factory;
    }
  }
  
  if ( optional )
  {
    return false;
  }
  
  throw 'No factory exists for subject ' + subject;
};

/**
 * A factory creates Animator instances for subjects.
 */
anim8.Factory = function()
{

};

anim8.Factory.prototype = 
{

  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return false;
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    return false;
  },

  /**
   * Explodes the given subject to an array of Animators and adds them to the given array.
   * 
   * @param  {any} subject
   * @param  {array} animators
   * @return {void}
   */
  animatorsFor: function(subject, animators)
  {
    animators.push( this.animatorFor( subject ) );
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   * 
   * @param  {anim8.Animator} animator
   * @return {void}
   */
  destroy: function(animator)
  {

  }

};
