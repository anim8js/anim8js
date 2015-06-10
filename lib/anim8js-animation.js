
/**
 * Returns an instance of {{#crossLink "Animation"}}{{/crossLink}} based on the 
 * given input & options. If the input is a string the animation with that name 
 * is returned. If the input is a string with an animation name and an option 
 * string the animation with the given name modified by any additional options 
 * is returned. Commas can be used to queue animation & option pairs one after 
 * another. Ampersands can be used to play animations at the same time. If the 
 * input is an object an anonymous animation is created. If no animation could 
 * be determined then false is returned.
 *
 * **Examples:**
 * 
 *     anim8.animation('wiggle');
 *     anim8.animation('wiggle ~1s 4s z40ms x5 !1.2');
 *     anim8.animation('wiggle', {...options...});
 *     anim8.animation('wiggle, tada ~50ms, fadeOut 2s');
 *     anim8.animation('wiggle & tada !3, fadeOut');
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
  var options = anim8.options( options, cache );
  var hasOptions = !anim8.isEmpty( options );

  if ( animation instanceof anim8.Animation )
  {
    if ( hasOptions )
    {
      var attrimators = animation.newAttrimators();

      animation.merge( options, attrimators );

      return new anim8.Animation( false, animation.input, options, attrimators);
    }

    return animation;
  }
  if ( anim8.isString( animation ) )
  {
    var key = animation.toLowerCase();

    if ( key in anim8.animation && !hasOptions )
    {
      return anim8.animation[ key ];
    }

    var attrimators = anim8.attrimatorsFor( animation, options, cache );

    if ( key in anim8.animation && !hasOptions )
    {
      return anim8.animation[ key ];
    }

    return new anim8.Animation( false, {}, options, attrimators );
  }
  if ( anim8.isObject( animation ) )
  {
    var attrimators = anim8.attrimatorsFor( animation, options, cache );

    return new anim8.Animation( false, animation, options, attrimators );
  }
  
  return false;
};

/**
 * Generates an AttrimatorMap for the given animation and options. If the 
 * animation given is an instance of {{#crossLink "Animation"}}{{/crossLink}}
 * then a copy of that animations attrimators is returned, and if options are
 * specified then they are merged into the generated attrimators. If the 
 * animation given is an object it's properties are iterated and for each parser
 * with a matching name attrimators are generated. If the animation given is a
 * string of a cached or saved animation then it's handled as if an instance of
 * {{#crossLink "Animation"}}{{/crossLink}} was given. If the animation given
 * is a string which isn't saved or cached it goes through the following parsing
 * logic.
 *
 * - Split up the string into sections with `,` which queues animations.
 * - Split up each of the sections with `&` which enables animations to play
 *   simultaneously.
 * - For each of those sections, take the first word as the name of the 
 *   animation and any remaining text as the options for that animation.
 *
 * If no attrimators could be parsed, an empty attrimator map is returned. If
 * the animation given is a string that specifies animations that don't exist
 * an error is thrown.
 * 
 * **Examples:**
 * 
 *     anim8.attrimatorsFor('wiggle');
 *     anim8.attrimatorsFor('wiggle ~1s 4s z40ms x5 !1.2');
 *     anim8.attrimatorsFor('wiggle', {...options...});
 *     anim8.attrimatorsFor('wiggle, tada ~50ms, fadeOut 2s');
 *     anim8.attrimatorsFor('wiggle & tada !3, fadeOut');
 *     anim8.attrimatorsFor({...definition...});
 * 
 * If the given input is a string you can cache it. An example would be
 * 'wiggle ~1s 2s x3' - if `cache` is true and you call this method again it won't
 * need to be parsed again.
 *
 * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
 * 
 * @method anim8.attrimatorsFor
 * @for Core
 * @param {Object|String} animation
 * @param {Object|String} [options]
 * @param {Boolean} [cache=false]
 * @return {AttrimatorMap}
 */
anim8.attrimatorsFor = function( animation, options, cache )
{
  var options = anim8.options( options, cache );
  var hasOptions = !anim8.isEmpty( options );
  var attrimators = new anim8.AttrimatorMap();

  if ( animation instanceof anim8.Animation )
  {
    attrimators.putMap( animation.newAttrimators() );

    if ( hasOptions )
    {
      animation.merge( options, attrimators );
    }
  }
  else if ( anim8.isObject( animation ) )
  {
    var helper = new anim8.ParserHelper( animation, options );

    for (var parserName in animation)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false )
      {
        parser.parse( animation, options, attrimators, helper );
      }
    }
  }
  else if ( anim8.isString( animation ) )
  {
    var key = animation.toLowerCase();
    var saved = anim8.animation[ key ];
    var cacheIt = anim8.coalesce( cache, anim8.defaults.cache );

    if ( saved )
    {
      attrimators.putMap( saved.newAttrimators() );

      if ( hasOptions )
      {
        saved.merge( options, attrimators );
      }
    }
    else
    {
      var animationsQueued = animation.split( ',' );

      for (var k = 0; k < animationsQueued.length; k++)
      {
        var animationsMerged = animationsQueued[ k ].split( '&' );
        var base = new anim8.AttrimatorMap();

        for (var j = 0; j < animationsMerged.length; j++)
        {
          var animationString = anim8.trim( animationsMerged[ j ].toLowerCase() );
          var animationSplit = animationString.split( ' ' );
          var parsedAnimation = anim8.animation[ animationSplit[ 0 ] ];
          
          if ( parsedAnimation )
          {
            var parsedOptions = anim8.options( animationSplit.slice( 1 ), cache );
            var hasParsedOptions = !anim8.isEmpty( parsedOptions );
            var parsedAttrimators = parsedAnimation.newAttrimators();

            if ( hasOptions && hasParsedOptions )
            {
              parsedAnimation.merge( anim8.extend( {}, options, parsedOptions ), parsedAttrimators );
            }
            else if ( hasParsedOptions )
            {
              parsedAnimation.merge( parsedOptions, parsedAttrimators );
            }
            else if ( hasOptions )
            {
              parsedAnimation.merge( options, parsedAttrimators );
            }

            base.putMap( parsedAttrimators );
          }
          else
          {
            throw animationString + ' is not a valid animation in "' + animationsQueued[ k ] + '"';
          }
        }

        attrimators.queueMap( base );
      }

      if ( cacheIt && !hasOptions )
      {
        anim8.animation[ key ] = new anim8.Animation( animation, {}, {}, attrimators );
      }
    }
  }

  return attrimators;
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
anim8.save = function( name, animation, options )
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
};

anim8.Animation.prototype = 
{
  
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
      
      if ( parser !== false && parser.merge )
      {
        parser.merge( this.input, options, this.options, attrimatorMap, helper );
      }
    }

    return attrimatorMap;
  }

};