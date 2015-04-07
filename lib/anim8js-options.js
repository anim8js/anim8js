
/**
 * Parses a value into an options object. If the given input is a string it's 
 * expected to be in a similar format to:
 *
 * [duration] x[repeat] z[sleep] ~[delay] ![scale] [easing[-easingType]]
 *
 * This is also a registry of options, you can add your own options that
 * can be used later with syntax like:
 *
 * anim8.option['myOptions'] = anim8.option('1.5s x2 !2');
 *
 * So you can use 'myOptions' as the options input.
 * 
 * @param {object|string|array} options
 * @param {boolean} cache
 * @return {object}
 */
anim8.options = (function()
{
  function parseProperty(input, out, parseFunction, property, propertyAdd, propertyScale)
  {
    var first = input.charAt( 0 );

    if ( first === '*' )
    {
      parsed = anim8.number( input.substring( 1 ), false );

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

      var parsed = parseFunction( input, false )

      if ( parsed !== false )
      {
        out[ property ] = parsed;
      }  
    }

    return parsed;
  }

  return function(options, cache)
  {
    var originalInput = options;

    if ( anim8.isString( options ) )
    {
      if ( options in anim8.options )
      {
        return anim8.options[ options ];
      }

      options = options.toLowerCase().split(' ');
    }

    if ( anim8.isArray( options ) )
    {
      var parsed = {};

      for (var i = 0; i < options.length; i++)
      {
        var part = options[i];
        var first = part.charAt( 0 );

        // Repeats
        if ( first === 'x' )
        {
          parseProperty( part.substring(1), parsed, anim8.repeat, 'repeat', 'repeatAdd', 'repeatScale' );
        }
        // Sleeping
        else if ( first === 'z' )
        {
          parseProperty( part.substring(1), parsed, anim8.time, 'sleep', 'sleepAdd', 'sleepScale' );
        }
        // Delay
        else if ( first === '~' )
        {
          parseProperty( part.substring(1), parsed, anim8.time, 'delay', 'delayAdd', 'delayScale' );
        }
        // Scaling
        else if ( first === '!' )
        {
          parseProperty( part.substring(1), parsed, anim8.number, 'scale', 'scaleAdd', 'scaleScale' );
        }
        else
        {
          // Easing?
          var easing = anim8.easing( part, false );

          if ( easing !== false )
          {
            parsed.easing = easing;
          }

          // Duration?
          var duration = parseProperty( part, parsed, anim8.time, 'duration', 'durationAdd', 'durationScale' );

          if ( duration === false )
          {
            // If not a duration, might be an alternative repeat? (doesn't start with x)
            parseProperty( part, parsed, anim8.repeat, 'repeat', 'repeatAdd', 'repeatScale' );
          }
        }
      }

      if ( anim8.isString( originalInput ) && anim8.coalesce( cache, anim8.defaults.cacheOptions ) )
      {
        anim8.options[ originalInput ] = parsed;
      }

      return parsed; 
    }

    if ( anim8.isObject( options ) )
    {
      return options;
    }

    return anim8.defaults.noOptions;
  };

})();