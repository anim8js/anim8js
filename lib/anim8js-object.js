
/**
 * The factory for Plain-Old-Javascript-Objects.
 */
anim8.factories.object = 
{
  is: function(subject) 
	{
    return anim8.isObject( subject ) && !anim8.isElement( subject );
  },
  
  parseAnimators: function(from, animators) 
	{
    var animator = from.$animator;
    
    if ( !animator )
    {
      animator = new anim8.Animator( from );
      animator.factory = this;
      
      from.$animator = animator;
    }
    
    animators.push( animator );
  }
};