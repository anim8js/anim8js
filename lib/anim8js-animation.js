
/**
 * Returns an instance of anim8.Animation based on the given input & options. If 
 * the input is an instance of anim8.Animation that instance is immediately 
 * returned. If the input is a string the animation with that name is returned. 
 * If the input is a string with an animation name and an option string the
 * animation with the given name modified by any additional options is returned.
 * Commas can be used to queue animation & option pairs one after another. If 
 * the input is an object an anonymous animation is created. If no animation
 * could be determined then false is returned.
 *
 * **Examples:**
 * 
 *     anim8.animation('wiggle');
 *     anim8.animation('wiggle ~1s 4s z40ms x5 !1.2');
 *     anim8.animation('wiggle', {...options...});
 *     anim8.animation('wiggle, tada ~50ms, fadeOut 2s');
 *     anim8.animation({...definition...});
 * 
 * If the given input is a string you can cache it. An example would be
 * 'wiggle ~1s 2s x3' - if `cache` is true and you call this method again it won't
 * need to be parsed again.
 *
 * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
 * 
 * @method anim8.animation
 * @for Core
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 * @param {Boolean} [cache=false]
 * @return {Animation|False}
 * @throws {String} The animation string has an invalid animation name or the
 *    animation fails to create attrimators from the animation definition.
 */
anim8.animation = function(animation, options, cache)
{
  if ( animation instanceof anim8.Animation )
  {
    return animation;
  }
  if ( anim8.isString( animation ) )
  {
    var key = animation.toLowerCase();

    if ( key in anim8.animation )
    {
      return anim8.animation[ key ];
    }

    var animationsQueued = animation.split(',');
    var anim = false;
    var last = false;

    for (var k = 0; k < animationsQueued.length; k++)
    {
      var animationsMerged = animationsQueued[ k ].split( '&' );
      var base = false;

      for (var j = 0; j < animationsMerged.length; j++)
      {
        var animationString = anim8.trim( animationsMerged[ j ].toLowerCase() );
        var animationSplit = animationString.split( ' ' );
        var parsedAnimation = anim8.animation[ animationSplit[ 0 ] ];
        var parsedOptions = anim8.options( animationSplit.slice( 1 ) );

        if ( parsedAnimation )
        {
          var extendedAnimation = parsedAnimation.extend( parsedOptions, true );

          if ( base === false )
          {
            base = extendedAnimation;

            if ( anim === false )
            {
              last = anim = base;
            }
            else
            {
              last = last.next = base;
            }
          }
          else
          {
            base.attrimators.putMap( extendedAnimation.attrimators );
          }
        }
        else
        {
          throw parsedAnimation + ' is not a valid animation in "' + animationsQueued[ k ] + '"';
        }
      }
    }

    if ( anim8.coalesce( cache, anim8.defaults.cache ) && anim8.isEmpty( options ) )
    {
      anim.name = animation;

      anim8.animation[ key ] = anim;
    }

    return anim;
  }
  if ( anim8.isObject( animation ) )
  {
    var attrimatorMap = new anim8.AttrimatorMap();
    var options = anim8.options( options );
    var helper = new anim8.ParserHelper( animation, options );
    
    for (var parserName in animation)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false )
      {
        parser.parse( animation, options, attrimatorMap, helper );
      }
    }
    
    if (attrimatorMap.size())
    {
      return new anim8.Animation( false, animation, options, attrimatorMap );
    }
    else
    {
      throw 'Failed to create any attrimators in anim8.animation';
    }
  }
  
  return false;
};

/**
 * Saves an animation under the given name. It can be played, queued, and 
 * transitioned into at a later time providing the name and optionally options 
 * to override with.
 *
 * **See:** {{#crossLink "Core/anim8.animation:method"}}anim8.animation{{/crossLink}},
 *          {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method anim8.save
 * @for Core
 * @param {String} name
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 */
anim8.save = function(name, animation, options)
{
  var animation = anim8.animation( animation, options );
  var key = name.toLowerCase();

  animation.name = name;
  
  anim8.animation[ key ] = animation;
};

/**
 * Instantiates a new Animation given it's name, the input & options passed, and 
 * the attrimators that were generated from the input & options. If the name is 
 * false this is an anonymous animation. Input & Options are used by parsers to 
 * generate attrimators, options allow for an animations default properties to 
 * be overriden.
 *
 * @param {String|Boolean} name
 * @param {Object} input
 * @param {Object} options
 * @param {AttrimatorMap} attrimators
 * @class Animation
 * @constructor
 */
anim8.Animation = function(name, input, options, attrimators)
{
  /**
   * The name of the animation, or false if it's an anonymous animation. 
   *
   * @property {String|False} name
   */
  this.name = name;

  /**
   * The object which created the animation.
   *
   * @property {Object} input
   */
  this.input = input;

  /**
   * The options given when the animation was created.
   *
   * @property {Object} [options]
   */
  this.options = options;

  /**
   * The name of the animation, or false if it's an anonymous animation. 
   *
   * @property {AttrimatorMap} name
   */
  this.attrimators = attrimators;

  /**
   * The animation to play after this animation is finished playing.
   *
   * @property {Animation} [next]
   */
  this.next = null;
};

anim8.Animation.prototype = 
{
  
  /**
   * Returns true if this animation was a saved animation, otherwise it's an 
   * anonymous one and false is returned. Anonymous animations are typically
   * generated once and won't be used again.
   *
   * @method isSaved
   * @return {Boolean} 
   */
  isSaved: function()
  {
    return (this.name !== false);
  },
  
  /**
   * Generates an map of event instances from the attrimators in this animation.
   *
   * @method newAttrimators
   * @return {AttrimatorMap}
   */
  newAttrimators: function()
  {
    return this.attrimators.clone();
  },

  /**
   * Merges options with the options in this animation and places them in the
   * events.
   * 
   * @method merge
   * @param {Object} [options]
   * @param {AttrimatorMap} attrimatorMap
   * @return {AttrimatorMap}
   */
  merge: function(options, attrimatorMap)
  {
    var helper = new anim8.ParserHelper( this.input, this.options, options );

    for (var parserName in this.input)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false )
      {
        parser.merge( this.input, options, this.options, attrimatorMap, helper );
      }
    }

    return attrimatorMap;
  },

  /**
   * Extends this animation and returns an anonymous animation modified with the 
   * given options. If an empty set of options is given this animation instance
   * may be returned. This can be overriden if the second argument is true.
   *
   * @method extend
   * @param {Object} [options]
   * @param {Boolean} [force]
   * @return {Animation}
   */
  extend: function(options, force)
  {
    if ( anim8.isEmpty( options ) && !force )
    {
      return this;
    }

    var attrimatorMap = this.newAttrimators();

    this.merge( options, attrimatorMap );

    anim8.extend( options, this.options );

    return new anim8.Animation( false, this.input, options, attrimatorMap );
  }

};