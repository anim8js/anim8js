/* anim8js-jquery 1.0.1 - anim8 your HTML elements with jQuery by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['anim8', 'jquery'], function(anim8, jQuery) { // jshint ignore:line
      return factory(anim8, jQuery, root);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('anim8'), require('jquery'), global);  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    factory(root.anim8, root.jQuery, root);
  }
}(this, function(anim8, jQuery, window)
{

  var anim8s = anim8.anim8s;
  var Factory = anim8.Factory;
  var Class = anim8.Class;
  var Factories = anim8.Factories;

  var $animation = anim8.animation;

/**
 * A factory for jQuery objects.
 */
function FactoryJQuery()
{
  this.priority = 10;
}

Class.extend( FactoryJQuery, Factory,
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
    return Factories.dom.animatorFor( subject[0] );
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   *
   * @param  {anim8.Animator} animator
   */
  destroy: function(animator)
  {
    return Factories.dom.destroy( animator );
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
      var animator = Factories.dom.animatorFor( this );

      if (animator)
      {
        animators.push( animator );
      }
    });
  },

  /**
   * Returns the attribute descriptor for the given attribute.
   *
   * @param  {String} attr
   * @return {Object}
   */
  attribute: function(attr)
  {
    return Factories.dom.attribute( attr );
  }

});


/**
 * Adds the m8, anim8, and animator functions to jQuery. An instance of anim8.Animator will be returned.
 *
 * @return {anim8.Animator}
 */
jQuery.fn.m8 = jQuery.fn.anim8 = jQuery.fn.animator = function()
{
  return anim8( this[0] );
};

/**
 * Adds the m8s, anim8s, animators functions to jQuery. An instance of anim8.Animators will be returned.
 *
 * @return {anim8.Animators}
 */
jQuery.fn.m8s = jQuery.fn.anim8s = jQuery.fn.animators = function()
{
  return anim8s( this.get() );
};


/**
 * Extend the clone function to remove the attribute which stores the animator ID so clones get new animators.
 *
 * @return {jQuery}
 */
var cloner = jQuery.fn.clone;

jQuery.fn.clone = function()
{
  var clone = cloner.apply( this, arguments );

  clone.removeAttr( Factories.dom.elementAttribute );

  return clone;
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
jQuery.fn.dataPlay = function( animationAttribute, all, cache )
{
  var options = {};

	return this.filter(function()
  {
		var animationText = jQuery(this).data( animationAttribute );

		if ( animationText )
		{
      var animation = $animation( animationText, options, cache );

      if ( animation !== false )
      {
        anim8( this ).play( animation, options, all );

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
jQuery.fn.dataQueue = function( animationAttribute, cache )
{
  var options = {};

	return this.filter(function()
  {
		var animationText = jQuery(this).data( animationAttribute );

		if ( animationText )
		{
      var animation = $animation( animationText, options, cache );

      if ( animation !== false )
      {
        anim8( this ).queue( animation );

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
jQuery.fn.dataTransition = function( animationAttribute, transition, all, cache )
{
  var options = {};

  return this.filter(function()
  {
    var animationText = jQuery(this).data( animationAttribute );

    if ( animationText )
    {
      var animation = $animation( animationText, options, cache );

      if ( animation !== false )
      {
        anim8( this ).transition( transition, animation, options, all );

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
jQuery.fn.sequence = function()
{
  this.each(function()
  {
    jQuery(this).html( jQuery(this).wrapCharacters('div', 'class="sequenced"') );
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
jQuery.fn.wrapCharacters = function(tagName, attributes)
{
  var tagBegin = '<' + tagName + (typeof attributes === 'string' ? ' ' + attributes : '') + '>';
  var tagEnd = '</' + tagName + '>';
  var html = '';

  jQuery(this).contents().each(function()
  {
    // Is this a text node?
    if (this.nodeType === 3)
    {
      // Break up node wrapping each character
      var text = this.data;

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
        html += outer.substring(0, start) + jQuery(this).wrapCharacters(tagName) + '</' + this.tagName.toLowerCase() + '>';
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



  // Register Factory
  anim8.Factories['jquery'] = new FactoryJQuery();

  // Classes
  anim8.FactoryJQuery = FactoryJQuery;

  return anim8;

}));
