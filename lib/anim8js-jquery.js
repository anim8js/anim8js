/**
 * A factory for jQuery objects.
 */
anim8.jQueryFactory = function()
{
  this.priority = 10;
};

// It extends anim8.Factory
anim8.override( anim8.jQueryFactory.prototype = new anim8.Factory(),
{
  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   * 
   * @param  {any} subject
   * @return {boolean}
   */
  is: function(subject)
  {
    return typeof jQuery !== 'undefined' && subject instanceof jQuery;
  },

  /**
   * Returns an animator given a subject.
   * 
   * @param  {any} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    return anim8.factory.dom.animatorFor( subject[0] );
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
    subject.each(function() 
    {
      var animator = anim8.factory.dom.animatorFor( this );

      if (animator) 
      {
        animators.push( animator );
      }
    });
  }
  
});

/**
 * Registers the jQuery factory.
 */
anim8.factory['jquery'] = new anim8.jQueryFactory();
