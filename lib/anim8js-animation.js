
/**
 * Returns an animation based on the input. If the input is an instance of anim8.Animation that instance
 * is immediately returned. If the input is a string the animation with that name is returned. If the
 * input is an object an anonymous animation is created using the second options argument. If no animation
 * could be determined then false is returned.
 * 
 * @param {anim8.Animation|string|object} animation
 * @param [object] options
 * @param [boolean] cache
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

    var animationStrings = animation.split(',');
    var anim = false;
    var last = false;

    for (var k = 0; k < animationStrings.length; k++)
    {
      var split = animationStrings[ k ].toLowerCase().split(' ');
      var parsedAnimation = anim8.animation[ split[ 0 ] ];
      var parsedOptions = anim8.options( split.slice( 1 ) );

      if ( parsedAnimation )
      {
        if ( anim === false )
        {
          last = anim = parsedAnimation.extend( parsedOptions, true );
        }
        else
        {
          last = last.next = parsedAnimation.extend( parsedOptions, true );
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
		var events = [];
		var options = options || {};
		
		for (var parserName in animation)
		{
			var parser = anim8.parser( parserName );
			
			if ( parser !== false )
			{
				parser.parse( animation, options, events );
			}
		}
		
		if (events.length)
		{
			return new anim8.Animation( false, animation, options, events );
		}
	}
	
	return false;
};

/**
 * Saves an animation under the given name. It can be played, queued, and transitioned into
 * at a later time providing the name and optionally options to override with.
 *
 * @param {string} name
 * @param {object} animation
 * @param [object] options
 */
anim8.save = function(name, animation, options)
{
  var animation = anim8.animation( animation, options );
  var key = name.toLowerCase();

  animation.name = name;
  
  anim8.animation[ key ] = animation;
};

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

/**
 * Instantiates a new Animation given it's name, the input & options passed, and the events that
 * were generated from the input & options. If the name is false this is an anonymous animation.
 * Input & Options are used by parsers to generate events, options allow for an animations
 * default event properties to be overriden.
 *
 * @param {string} name
 * @param {object} input
 * @param [object] options
 * @param {array:anim8.Event} events
 */
anim8.Animation = function(name, input, options, events)
{
	this.name = name;
	this.input = input;
	this.options = options;
	this.events = events;
  this.next = null;
};

anim8.Animation.prototype = 
{
  
  /**
   * Returns true if this animation was a saved animation, otherwise it's an anonymous one
   * and false is returned.
   */
  isSaved: function()
  {
    return (this.name !== false);
  },
  
  /**
   * Generates an array of event instances from the events in this animation.
   */
  newEvents: function()
  {
    var instances = [];
    
    for (var i = 0; i < this.events.length; i++)
    {
      instances.push( this.events[i].newInstance() );
    }
    
    return instances;
  },

  /**
   * Generates an array of event clones from the events in this animation.
   * 
   * @return {array}
   */
  cloneEvents: function()
  {
    var events = [];

    for (var i = 0; i < this.events.length; i++)
    {
      events.push( this.events[i].clone() );
    }

    return events;
  },

  /**
   * Merges options with the options in this animation and places them in the
   * events.
   * 
   * @param  {object} options
   * @param  {array} events
   * @return {[type]}
   */
  merge: function(options, events)
  {
    for (var parserName in this.input)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false )
      {
        parser.merge( this.input, options, this.options, events );
      }
    }

    return events;
  },

  /**
   * Extends this animation and returns an animation modified with the given options. 
   *
   * @param {object} options
   */
  extend: function(options, force)
  {
    if ( anim8.isEmpty( options ) && !force )
    {
      return this;
    }

    var events = this.cloneEvents();

    this.merge( options, events );

    anim8.extend( options, this.options );

    return new anim8.Animation( false, this.input, options, events );
  }

};