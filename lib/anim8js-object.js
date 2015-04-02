
/**
 * A factory for plain objects.
 */
anim8.ObjectFactory = function()
{
  this.priority = 0;
};

// It extends anim8.Factory
anim8.ObjectFactory.prototype = new anim8.Factory();

/**
 * Determines whether the given subject is valid for this factory to create Animators for.
 * 
 * @param  {any} subject
 * @return {boolean}
 */
anim8.ObjectFactory.prototype.is = function(subject)
{
  return anim8.isObject( subject ) && !anim8.isElement( subject ) && !anim8.isArray( subject );
};

/**
 * Returns an animator given a subject.
 * 
 * @param  {any} subject
 * @return {anim8.Animator}
 */
anim8.ObjectFactory.prototype.animatorFor = function(subject)
{
  var animator = subject.$animator;
    
  if ( !animator )
  {
    animator = new anim8.Animator( subject );
    animator.factory = this;
    
    subject.$animator = animator;
  }
  
  return animator;
};

/**
 * Destroys the animator by unlinking the animator from the subject.
 * 
 * @param  {anim8.Animator} animator
 * @return {void}
 */
anim8.ObjectFactory.prototype.destroy = function(animator)
{
  delete animator.subject.$animator;
};

/**
 * Registers the object factory.
 */
anim8.factory.object = new anim8.ObjectFactory();
