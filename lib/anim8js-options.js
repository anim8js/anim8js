
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
anim8.options = function(options, cache)
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
        var repeat = anim8.repeat( part.substring(1), false );

        if ( repeat !== false )
        {
          parsed.repeat = repeat;
        }
      }
      // Sleeping
      else if ( first === 'z' )
      {
        var sleep = anim8.time( part.substring(1), false );

        if ( sleep !== false )
        {
          parsed.sleep = sleep;
        }
      }
      // Delay
      else if ( first === '~' )
      {
        var delay = anim8.time( part.substring(1), false );

        if ( delay !== false )
        {
          parsed.delay = delay;
        }
      }
      // Scaling
      else if ( first === '!' )
      {
        var scale = parseFloat( part.substring(1) );

        if ( !isNaN(scale) )
        {
          parsed.scale = scale;
        }
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
        var duration = anim8.time( part, false );

        if ( duration !== false )
        {
          parsed.duration = duration;
        }
        else
        {
          // If not a duration, might be an alternative repeat? (doesn't start with x)
          var repeat = anim8.repeat( part, false );

          if ( repeat !== false )
          {
            parsed.repeat = repeat;
          }
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