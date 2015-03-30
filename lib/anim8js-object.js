
/**
 * The factory for Plain-Old-Javascript-Objects.
 */
anim8.factories.object = 
{
  is: function(subject) 
	{
    return anim8.isObject( subject ) && !anim8.isElement( subject );
  },

  parseAnimator: function(from)
  {
    var animator = from.$animator;
    
    if ( !animator )
    {
      animator = new anim8.Animator( from );
      animator.factory = this;
      
      from.$animator = animator;
    }

    return animator;
  },
  
  parseAnimators: function(from, animators) 
	{
    animators.push( this.parseAnimator( from ) );
  }
};