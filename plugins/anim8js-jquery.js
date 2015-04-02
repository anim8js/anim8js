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
   * Extend the clone function to remove the attribute which stores the animator ID so clones get new animators.
   * 
   * @return {jQuery}
   */
  var cloner = $.fn.clone;
  
  $.fn.clone = function()
  {
    this.removeAttr( anim8.factory.dom.attribute );

    return cloner.apply( this, arguments );
  };

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

  /**
   * Wraps every character with a span and the class sequenced and returns a jquery
   * element containing all wrapped characters.
   * 
   * @return {jQuery}
   */
  $.fn.sequence = function()
  {
    this.each(function()
    {
      $(this).html( $(this).wrapCharacters('div', 'class="sequenced"') );
    });

    return this.find('.sequenced');
  };

  /**
   * Wraps every character in ever element in the jQuery object with a tag.
   * If an element already only has one character it remains untouched.
   * 
   * @param  {string} tagName
   * @param  {string} attributes
   * @return {string} attributes
   */
  $.fn.wrapCharacters = function(tagName, attributes)
  {
    var tagBegin = '<' + tagName + (typeof attributes === 'string' ? ' ' + attributes : '') + '>';
    var tagEnd = '</' + tagName + '>';
    var html = '';

    $(this).contents().each(function()
    {
      // Is this a text node?
      if (this.nodeType === 3)
      {
        // Break up node wrapping each character
        var text = this.wholeText;

        if (text.length > 1)
        {
          // Collapse whitespaces
          var previousSpace = false;
          for (var i = 0; i < text.length; i++)
          {
            var space = text[i] <= ' ';
            if (!space || !previousSpace)
            {
              html += tagBegin + text[i] + tagEnd;
            }
            previousSpace = space;
          }
        }
        else
        {
          html += text;
        }
      }
      else
      {
        // Not a text node!
        var outer = this.outerHTML;
        // If there are children, we need to recursively break them down
        if (this.firstChild)
        {
          // Grab the element tag and attributes manually.
          var start = 0;
          var quotes = false;
          while (start < outer.length)
          {
            var c = outer[start++];
            if (c === '"' || c === "'")
            {
              quotes = !quotes;
            }
            else if (c === '\\')
            {
              start++;
            }
            else if (c === '>' && !quotes)
            {
              break;
            }
          }
          html += outer.substring(0, start) + $(this).wrapCharacters(tagName) + '</' + this.tagName.toLowerCase() + '>';
        }
        // No child nodes, just append outer HTML.
        else
        {
          html += outer;
        }
      }
    });

    return html;
  };
  
})(jQuery, anim8, anim8s);
