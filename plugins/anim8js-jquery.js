/**
 * Adds useful anim8js functions to jQuery.
 * 
 * @param  {jQuery}
 * @param  {anim8}
 * @param  {anim8s}
 * @return {function}
 */
(function($, m8, m8s)
{

  /**
   * Adds the m8, anim8, and animator functions to jQuery. An instance of anim8.Animator will be returned.
   * 
   * @return {anim8.Animator}
   */
  $.fn.m8 = $.fn.anim8 = $.fn.animator = function()
  {
    return m8( this[0] );
  };

  /**
   * Adds the m8s, anim8s, animators functions to jQuery. An instance of anim8.Animators will be returned.
   * 
   * @return {anim8.Animators}
   */
  $.fn.m8s = $.fn.anim8s = $.fn.animators = function()
  {
    return m8s( this.get() );
  };
  
  /**
   * Plays the animation specified in the given data attribute.
   *
   * The returned jQuery object is reduced to the elements that had a valid animation attribute.
   * 
   * @param  {string} animationAttribute
   * @param  [boolean] all
   * @param  [boolean] cache
   * @return {this}
   * @see anim8.Animator.play
   */
  $.fn.dataPlay = function( animationAttribute, all, cache )
  {
    var options = {};

		return this.filter(function()
	  {
			var animationText = $(this).data( animationAttribute );
		
			if ( animationText )
			{
        var animation = anim8.animation( animationText, options, cache );

        if ( animation !== false )
        {
          m8( this ).play( animation ); 

          return true;
        }
			}
			
			return false;
  	});
  };
  
  /**
   * Queues the animation specified in the given data attribute.
   *
   * The returned jQuery object is reduced to the elements that had a valid animation attribute.
   * 
   * @param  {string} animationAttribute
   * @param  [boolean] cache
   * @return {this}
   * @see anim8.Animator.queue
   */
  $.fn.dataQueue = function( animationAttribute, cache )
  {	
    var options = {};

  	return this.filter(function()
    {
  		var animationText = $(this).data( animationAttribute );
		
  		if ( animationText )
  		{
        var animation = anim8.animation( animationText, options, cache );

        if ( animation !== false )
        {
          m8( this ).queue( animation );

          return true;
        }
  		}
			
			return false;
    });
  };

  /**
   * Transitions into the animation specified in the given data attribute.
   *
   * The returned jQuery object is reduced to the elements that had a valid animation attribute.
   * 
   * @param  {string} animationAttribute
   * @param  {number} transitionTime
   * @param  {number} transitionDelta
   * @param  {string|function} transitionEasing
   * @param  {boolean} cache
   * @return {this}
   */
  $.fn.dataTransition = function( animationAttribute, transitionTime, transitionDelta, transitionEasing, cache )
  { 
    var options = {};

    return this.filter(function()
    {
      var animationText = $(this).data( animationAttribute );
    
      if ( animationText )
      {
        var animation = anim8.animation( animationText, options, cache );
 
        if ( animation !== false )
        {
          m8( this ).transition( transitionTime, transitionDelta, transitionEasing, animation );
          
          return true;
        }
      }
      
      return false;
    });
  };

  /**
   * Transitions into the animation specified in the given data attribute.
   *
   * The returned jQuery object is reduced to the elements that had a valid animation attribute.
   * 
   * @param  {string} animationAttribute
   * @param  {number} transitionTime
   * @param  {number} transitionFromDelta
   * @param  {number} transitionIntoDelta
   * @param  {string|function} transitionEasing
   * @param  {boolean} cache
   * @return {this}
   */
  $.fn.dataTransitionInto = function( animationAttribute, transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, cache )
  { 
    var options = {};

    return this.filter(function()
    {
      var animationText = $(this).data( animationAttribute );
    
      if ( animationText )
      {
        var animation = anim8.animation( animationText, options, cache );
 
        if ( animation !== false )
        {
          m8( this ).transitionInto( transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, animation );
          
          return true;
        }
      }
      
      return false;
    });
  };
  
})(jQuery, anim8, anim8s);
