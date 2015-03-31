
/**
 * Returns an animation based on the input. If the input is an instance of anim8.Animation that instance
 * is immediately returned. If the input is a string the animation with that name is returned. If the
 * input is an object an anonymous animation is created using the second options argument. If no animation
 * could be determined then false is returned.
 * 
 * @param {anim8.Animation|string|object} animation
 * @param [object] options
 */
anim8.animation = function(animation, options)
{
  if ( animation instanceof anim8.Animation )
  {
    return animation;
  }
	if ( anim8.isString( animation ) )
	{
    if ( animation in anim8.animation )
    {
      return anim8.animation[ animation ];      
    }

    var animations = animation.split(',');
    var queue = [];

    for (var k = 0; k < animations.length; k++)
    {
      var parsed = anim8.parseAnimationString( animations[ k ] );

      if ( parsed !== false )
      {
        queue.push( anim8.animation( parsed.animation, parsed.options ) );
      }
    }
	}
	if ( anim8.isObject( animation ) )
	{
		var events = [];
		
		options = options || {};
		
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
  
  animation.name = name;
  
  anim8.animation[name] = animation;
};

/**
 * Parses a string for an animation in the format of:
 *
 * animationName [duration] x[repeat] z[sleep] ~[delay] [easing]
 * 
 * @param {string} animation
 */
anim8.parseAnimationString = function(animation)
{
  var split = animation.split(' ');
  var animation = false;
  var options = {};

  for (var i = 0; i < split.length; i++)
  {
    var part = split[i].toLowerCase();

    if ( part in anim8.animation && !animation )
    {
      animation = anim8.animation[ part ];
    }
    else
    {
      if ( part[0] === 'x' )
      {
        var repeat = anim8.repeat( part.substring(1), false );

        if ( repeat !== false )
        {
          options.repeat = repeat;
        }
      }
      if ( part[0] === 'z' )
      {
        var sleep = anim8.sleep( part.substring(1), false );

        if ( sleep !== false )
        {
          options.sleep = sleep;
        }
      }
      if ( part[0] === '~' )
      {
        var delay = anim8.delay( part.substring(1), false );

        if ( delay !== false )
        {
          options.delay = delay;
        }
      }
      var easing = anim8.easing( part, false );

      if ( easing !== false )
      {
        options.easing = easing;
      }

      var duration = anim8.duration( part, false );

      if ( duration !== false )
      {
        options.duration = duration;
      }
      else
      {
        var repeat = anim8.repeat( part, false );

        if ( repeat !== false )
        {
          options.repeat = repeat;
        }
      }
    }
  }

  if ( animation === false )
  {
    return false;
  }

  return {
    animation: animation,
    options: options
  };
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
  extend: function(options)
  {
    if ( anim8.isEmpty( options ) )
    {
      return this;
    }

    var events = this.cloneEvents();

    this.merge( options, events );

    return new anim8.Animation( this.name, this.input, options, events );
  }
  
};