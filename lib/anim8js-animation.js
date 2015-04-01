
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
      var parsed = anim8.parseAnimationString( animationStrings[ k ] );

      if ( parsed.animation !== false )
      {
        if ( anim === false )
        {
          last = anim = parsed.animation.extend( parsed.options, true );
        }
        else
        {
          last = last.next = parsed.animation.extend( parsed.options, true );
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
 * Parses a string for an animation in the format of:
 *
 * animationName [duration] x[repeat] z[sleep] ~[delay] [easing]
 * 
 * @param {string} animation
 */
anim8.parseAnimationString = function(animation)
{
  var split = animation.toLowerCase().split(' ');
  var result = {
    animation: false,
    options: {}
  };

  for (var i = 0; i < split.length; i++)
  {
    var part = split[i];

    if ( part in anim8.animation && !result.animation )
    {
      result.animation = anim8.animation[ part ];
    }
    else
    {
      var first = part.charAt( 0 );

      if ( first === 'x' )
      {
        var repeat = anim8.repeat( part.substring(1), false );

        if ( repeat !== false )
        {
          result.options.repeat = repeat;
        }
      }
      if ( first === 'z' )
      {
        var sleep = anim8.time( part.substring(1), false );

        if ( sleep !== false )
        {
          result.options.sleep = sleep;
        }
      }
      if ( first === '~' )
      {
        var delay = anim8.time( part.substring(1), false );

        if ( delay !== false )
        {
          result.options.delay = delay;
        }
      }
      if ( first === '!' )
      {
        var scale = parseFloat( part.substring(1) );

        if ( !isNaN(scale) )
        {
          result.options.scale = scale;
        }
      }
      var easing = anim8.easing( part, false );

      if ( easing !== false )
      {
        result.options.easing = easing;
      }

      var duration = anim8.time( part, false );

      if ( duration !== false )
      {
        result.options.duration = duration;
      }
      else
      {
        var repeat = anim8.repeat( part, false );

        if ( repeat !== false )
        {
          result.options.repeat = repeat;
        }
      }
    }
  }

  return result;
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