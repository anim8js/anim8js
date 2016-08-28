
var Options = {};

/**
 * Parses a value into an options object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 *     [duration] x[repeat] z[sleep] ~[delay] @[offset] ![scale] [[easing][-easingType]]
 *
 * This is also a registry of options, you can add your own options that
 * can be used later with syntax like:
 *
 *     anim8.options['myOptions'] = anim8.options('1.5s x2 !2');
 *
 * So you can use 'myOptions' as the options input.
 *
 * You can also specify relative values & scaling values. If you have the
 * following options:
 *
 *     +2s x*2 ~-1s
 *
 * It will result in adding 2 seconds to the duration, repeating it twice as
 * much, and subtracting one second from the delay.
 *
 * For more information on acceptable values in options:
 *
 * **See:** {{#crossLink "Core/anim8.duration:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.repeat:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.sleep:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.delay:method"}}{{/crossLink}},
 *          {{#crossLink "Core/anim8.scale:method"}}{{/crossLink}}, and
 *          {{#crossLink "Core/anim8.easing:method"}}{{/crossLink}}
 *
 * @method anim8.options
 * @for Core
 * @param {Object|String|Array} options
 * @param {Boolean} [cache]
 * @return {Object}
 */
function $options(options, cache)
{
  var originalInput = options;
  var cacheIt = coalesce( cache, Defaults.cacheOptions );

  if ( isString( options ) )
  {
    if ( options in Options )
    {
      return Options[ options ];
    }

    options = options.toLowerCase().split(' ');
  }

  if ( isArray( options ) )
  {
    var parsed = {};

    for (var i = 0; i < options.length; i++)
    {
      var part = options[i];
      var first = part.charAt( 0 );

      // Repeats
      if ( first === 'x' )
      {
        parseOptionProperty( part.substring(1), parsed, $repeat, 'repeat', 'repeatAdd', 'repeatScale' );
      }
      // Sleeping
      else if ( first === 'z' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'sleep', 'sleepAdd', 'sleepScale' );
      }
      // Delay
      else if ( first === '~' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'delay', 'delayAdd', 'delayScale' );
      }
      // Scaling
      else if ( first === '!' )
      {
        parseOptionProperty( part.substring(1), parsed, $number, 'scale', 'scaleAdd', 'scaleScale' );
      }
      // Offset
      else if ( first === '@' )
      {
        parseOptionProperty( part.substring(1), parsed, $time, 'offset', 'offsetAdd', 'offsetScale' );
      }
      else
      {
        // Easing?
        var easing = $easing( part, false );

        if ( easing !== false )
        {
          parsed.easing = easing;
        }

        // Duration?
        var duration = parseOptionProperty( part, parsed, $time, 'duration', 'durationAdd', 'durationScale' );

        if ( duration === false )
        {
          // If not a duration, might be an alternative repeat? (doesn't start with x)
          parseOptionProperty( part, parsed, $repeat, 'repeat', 'repeatAdd', 'repeatScale' );
        }
      }
    }

    if ( isString( originalInput ) && cacheIt )
    {
      Options[ originalInput ] = parsed;
    }

    return parsed;
  }

  if ( isObject( options ) )
  {
    return options;
  }

  return Defaults.noOptions;
}

function parseOptionProperty(input, out, parseFunction, property, propertyAdd, propertyScale)
{
  var first = input.charAt( 0 );

  if ( first === '*' )
  {
    parsed = $number( input.substring( 1 ), false );

    if ( parsed !== false )
    {
      out[ propertyScale ] = parsed;
    }
  }
  else
  {
    if ( first === '+' || first === '-' )
    {
      property = propertyAdd;
      input = input.substring( 1 );
    }

    var parsed = parseFunction( input, false );

    if ( parsed !== false )
    {
      out[ property ] = parsed;
    }
  }

  return parsed;
}
