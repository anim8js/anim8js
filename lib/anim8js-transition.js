
/**
 * Parses a value into a transition object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 * [time] [easing[-easingType]] >[outro] <[intro] /[granularity] ^[lookup]
 * 
 * This is also a registry of transitions, you can add your own transitions that
 * can be used later with syntax like:
 *
 * anim8.transition['myTransition'] = anim8.transition('50ms 0.05 linear');
 *
 * So you can use 'myTransition' as the transition input.
 * 
 * @param {object|string|array} options
 * @param {boolean} cache
 * @return {object}
 */
anim8.transition = function(transition, cache) 
{
  // 1. If it's a string, convert it into an array.
  // 2. If it's an array, parse it and convert it into an object.
  // 3. If it's an object, fill in any missing values with the defaults.

  var originalInput = transition;

  if ( anim8.isString( transition ) )
  {
    if ( transition in anim8.transition )
    {
      return anim8.transition[ transition ];
    }

    transition = transition.toLowerCase().split(' ');
  }

  if ( anim8.isArray( transition ) )
  {
    var transitionArray = transition;

    transition = {};

    for (var i = 0; i < transitionArray.length; i++)
    {
      var part = transitionArray[i];
      var first = part.charAt( 0 );

      // Introduction Time (into next event)
      if ( first === '<' )
      {
        var intro = anim8.time( part.substring(1), false );

        if ( !isNaN( intro ) )
        {
          transition.intro = intro;
        }
      }
      // Outroduction Time (out of current event)
      else if ( first === '>' )
      {
        var outro = anim8.time( part.substring(1), false );

        if ( !isNaN( outro ) )
        {
          transition.outro = outro;
        }
      }
      // Granularity (for velocity conscious transitions)
      else if ( first === '/' )
      {
        var granularity = anim8.number( part.substring(1), false );

        if ( granularity !== false )
        {
          transition.granularity = granularity;
        }
      }
      // Lookup (for velocity conscious transitions)
      else if ( first === '^' )
      {
        var lookup = anim8.time( part.substring(1), false );

        if ( lookup !== false )
        {
          transition.lookup = lookup;
        }
      }
      else
      {
        // Easing
        var easing = anim8.easing( part, false );

        if ( easing !== false )
        {
          transition.easing = easing;
        }

        // Time
        var time = anim8.time( part, false );

        if ( time !== false )
        {
          transition.time = time;
        }
      }
    }
  }

  if ( anim8.isObject( transition ) )
  {
    transition.time        = anim8.time( transition.time, anim8.defaults.transitionTime );
    transition.outro       = anim8.time( transition.outro, anim8.defaults.transitionOutro );
    transition.intro       = anim8.time( transition.intro, anim8.defaults.transitionIntro );
    transition.easing      = anim8.easing( anim8.coalesce( transition.easing, anim8.defaults.transitionEasing ) );
    transition.granularity = anim8.number( transition.granularity, anim8.defaults.transitionGranularity );
    transition.lookup      = anim8.time( transition.lookup, anim8.defaults.transitionLookup );
    
    if ( anim8.isString( originalInput ) && anim8.coalesce( cache, anim8.defaults.cacheTransitions ) )
    {
      anim8.transition[ originalInput ] = transition;
    }

    return transition;
  }

  return anim8.defaults.noTransition;
};
