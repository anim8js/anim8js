
var Transitions = {};

/**
 * Parses a value into a transition object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 *     [time] [easing[-easingType]] >[outro] <[intro] /[granularity] ^[lookup]
 *
 * This is also a registry of transitions, you can add your own transitions that
 * can be used later with syntax like:
 *
 *     anim8.transition['myTransition'] = anim8.transition('50ms 0.05 linear');
 *
 * So you can use 'myTransition' as the transition input.
 *
 *     animator.transition('myTransition', 'myAnimation');
 *
 * @method anim8.transition
 * @for Core
 * @param {Object|String|Array} options
 * @param {Boolean} [cache]
 * @return {Object}
 */
function $transition(transition, cache)
{
  // 1. If it's a string, convert it into an array.
  // 2. If it's an array, parse it and convert it into an object.
  // 3. If it's an object, fill in any missing values with the defaults.

  var originalInput = transition;

  if ( isString( transition ) )
  {
    if ( transition in Transitions )
    {
      return Transitions[ transition ];
    }

    transition = transition.toLowerCase().split(' ');
  }

  if ( isArray( transition ) )
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
        var intro = $time( part.substring(1), false );

        if ( !isNaN( intro ) )
        {
          transition.intro = intro;
        }
      }
      // Outroduction Time (out of current event)
      else if ( first === '>' )
      {
        var outro = $time( part.substring(1), false );

        if ( !isNaN( outro ) )
        {
          transition.outro = outro;
        }
      }
      // Granularity (for velocity conscious transitions)
      else if ( first === '/' )
      {
        var granularity = $number( part.substring(1), false );

        if ( granularity !== false )
        {
          transition.granularity = granularity;
        }
      }
      // Lookup (for velocity conscious transitions)
      else if ( first === '^' )
      {
        var lookup = $time( part.substring(1), false );

        if ( lookup !== false )
        {
          transition.lookup = lookup;
        }
      }
      else
      {
        // Easing
        var easing = $easing( part, false );

        if ( easing !== false )
        {
          transition.easing = easing;
        }

        // Time
        var time = $time( part, false );

        if ( time !== false )
        {
          transition.time = time;
        }
      }
    }
  }

  if ( isObject( transition ) )
  {
    transition.time        = $time( transition.time, Defaults.transitionTime );
    transition.outro       = $time( transition.outro, Defaults.transitionOutro );
    transition.intro       = $time( transition.intro, Defaults.transitionIntro );
    transition.easing      = $easing( coalesce( transition.easing, Defaults.transitionEasing ) );
    transition.granularity = $number( transition.granularity, Defaults.transitionGranularity );
    transition.lookup      = $time( transition.lookup, Defaults.transitionLookup );

    if ( isString( originalInput ) && coalesce( cache, Defaults.cacheTransitions ) )
    {
      Transitions[ originalInput ] = transition;
    }

    return transition;
  }

  return Defaults.noTransition;
}
