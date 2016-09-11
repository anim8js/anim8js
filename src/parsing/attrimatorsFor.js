

/**
 * Generates an AttrimatorMap for the given animation and options. If the
 * animation given is an instance of {{#crossLink "Animation"}}{{/crossLink}}
 * then a copy of that animations attrimators is returned, and if options are
 * specified then they are merged into the generated attrimators. If the
 * animation given is an object it's properties are iterated and for each builder
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
 * **See:** {{#crossLink "Core/options:method"}}{{/crossLink}}
 *
 * @method anim8.attrimatorsFor
 * @for Core
 * @param {Object|String} animation
 * @param {Object|String} [options]
 * @param {Boolean} [cache=false]
 * @return {AttrimatorMap}
 */
function $attrimatorsFor( animation, options, cache )
{
  var parsedOptions = $options( options, cache );
  var hasOptions = !isEmpty( parsedOptions );
  var attrimators = new AttrimatorMap();

  if ( animation instanceof Animation )
  {
    attrimators.putMap( animation.newAttrimators() );

    if ( hasOptions )
    {
      animation.merge( parsedOptions, attrimators );
    }
  }
  else if ( isObject( animation ) )
  {
    var helper = new BuilderHelper( animation, parsedOptions );

    for (var builderName in animation)
    {
      var builder = $builder( builderName );

      if ( builder !== false )
      {
        builder.parse( animation, parsedOptions, attrimators, helper );
      }
    }
  }
  else if ( isString( animation ) )
  {
    var key = animation.toLowerCase();
    var saved = Animations[ key ];
    var cacheIt = coalesce( cache, Defaults.cache );

    if ( saved )
    {
      attrimators.putMap( saved.newAttrimators() );

      if ( hasOptions )
      {
        saved.merge( parsedOptions, attrimators );
      }
    }
    else
    {
      var animationsQueued = animation.split( /\s*,\s*/ );

      for (var k = 0; k < animationsQueued.length; k++)
      {
        var animationsMerged = animationsQueued[ k ].split( /\s*&\s*/ );
        var base = new AttrimatorMap();

        for (var j = 0; j < animationsMerged.length; j++)
        {
          var animationString = trim( animationsMerged[ j ].toLowerCase() );
          var animationSplit = animationString.split( /\s+/ );
          var parsedAnimation = Animations[ animationSplit[ 0 ] ];

          if ( parsedAnimation )
          {
            var additionalOptions = $options( animationSplit.slice( 1 ), cache );
            var hasAdditionalOptions = !isEmpty( additionalOptions );
            var parsedAttrimators = parsedAnimation.newAttrimators();

            if ( hasOptions && hasAdditionalOptions )
            {
              parsedAnimation.merge( extend( {}, parsedOptions, additionalOptions ), parsedAttrimators );
            }
            else if ( hasAdditionalOptions )
            {
              parsedAnimation.merge( additionalOptions, parsedAttrimators );
            }
            else if ( hasOptions )
            {
              parsedAnimation.merge( parsedOptions, parsedAttrimators );
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
        Animations[ key ] = new Animation( animation, {}, {}, attrimators );
      }
    }
  }

  return attrimators;
}
