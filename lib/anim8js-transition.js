
/**
 * Parses a value into a transition object. If the given input is a string it's
 * expected to be in a similar format to:
 *
 * [time] [outroDelta] +[introDelta] [easing[-easingType]] ^[granularity]
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

      // Introduction Delta (into next event)
      if ( first === '+' )
      {
        var introDelta = parseFloat( part.substring(1) );

        if ( !isNaN( introDelta ) )
        {
          transition.introDelta = introDelta;
        }
      }
      // Granularity (for smooth transitions)
      else if ( first === '^' )
      {
        var granularity = parseInt( part.substring(1) );

        if ( !isNaN( granularity ) && granularity > 0 )
        {
          transition.granularity = granularity;
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

        // Outroduction Delta
        if ( anim8.isDefined( transition.time ) )
        {
          var outroDelta = parseFloat( part );

          if ( !isNaN( outroDelta ) && outroDelta >= 0 && outroDelta <= 1 )
          {
            transition.outroDelta = outroDelta;
          }
        }
        else
        {
          // Time
          var time = anim8.time( part, false );

          if ( time !== false )
          {
            transition.time = time;
          }
        }

      }
    }
  }

  if ( anim8.isObject( transition ) )
  {
    if ( !anim8.isNumber( transition.time ) )
    {
      transition.time = anim8.time( transition.time, anim8.defaults.transitionTime );
    }
    if ( !anim8.isNumber( transition.outroDelta ) )
    {
      transition.outroDelta = anim8.defaults.transitionOutroDelta;
    }
    if ( !anim8.isNumber( transition.introDelta ) )
    {
      transition.introDelta = anim8.defaults.transitionIntroDelta;
    }
    if ( !anim8.isDefined( transition.easing ) )
    {
      transition.easing = anim8.easing( anim8.defaults.transitionEasing );
    }
    if ( !anim8.isNumber( transition.granularity ) )
    {
      transition.granularity = anim8.defaults.transitionGranularity;
    }

    if ( anim8.isString( originalInput ) && anim8.coalesce( cache, anim8.defaults.cacheTransitions ) )
    {
      anim8.transition[ originalInput ] = transition;
    }

    return transition;
  }

  return anim8.defaults.noTransition;
};
