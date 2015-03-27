
/**
 * Instantiates a new Animator given a subject to animate.
 *
 * @param {any} e
 */
anim8.Animator = function(e) 
{
	this.reset( e );
};

anim8.Animator.prototype = 
{
  /**
   * Resets the animator given a subject to animate.
   *
   * @param {any} e
   */
	reset: function(e)
	{
	  this.e = e;
	  this.events = {};
    this.springs = {};
	  this.attributes = {};
	  this.frame = {};
    this.updated = {};
	  this.finished = false;
		this.factory = null;
    this.active = false;
    
    return this;
	},
  
  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   */
  restore: function()
  {
    
    return this;
  },
  
  /**
   * A method thats invoked along with all other animators before updates are called.
   * This is used to make any necessary preparations before the animator is updated.
   */
  preupdate: function()
  {
		this.trigger('preupdate');
    
    return this;
  },
  
  /**
   * Updates the animator with the current time. All events and springs in this
   * animator are updated.
   *
   * @param {number} now
   */
  update: function(now) 
	{  
    this.wasFinished = this.finished;
    
    this.finished = true;
		
    for (var attr in this.events)
    {
      var e = this.events[ attr ];
      
      this.updated[ attr ] = e.update( now, this.frame );
      
      this.finished = this.finished && e.isFinished();
    }
    
    for (var attr in this.springs)
    {
      var s = this.springs[ attr ];
      
      this.updated[ attr ] = s.update( now, this.frame );
      
      this.finished = false;
    }
	
		this.trigger('update');
    
    return this;
  },
  
  /**
   * Places the spring in this animator replacing any spring that exists for the same
   * attribute. The next time the animator is updated the spring will be started.
   *
   * @param {anim8.Spring} s
   */
  placeSpring: function(s)
  {
    var attr = s.attribute;
    
    this.springs[ attr ] = s;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
		
		this.finished = false;
  },
  
  /**
   * Places the event in this animator replacing any event that exists for the same
   * attribute. The next time the animator is updated the event will be started.
   *
   * @param {anim8.EventInstance} e
   */
  placeEvent: function(e)
  {
    var attr = e.attribute;
    
    this.events[ attr ] = e;
    
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = anim8.attribute( attr ).defaultValue;
    }
		
		this.finished = false;
  },
  
  /**
   * Applies all updated attributes to the subject. This method is invoked with all of the other
   * animators at the end of the animation cycle.
   */
  apply: function()
	{
    for (var attr in this.frame)
    {
      if ( this.updated[ attr ] )
      {
        this.e[ attr ] = this.frame[ attr ]; 
				this.updated[ attr ] = false;
      }
    }
	
		this.trigger('apply');
	
    this.trimEvents();
    
    return this;
  },
  
  /**
   * Removes any finished events and places queued events. If the animator previously wasn't finished
   * but now it is the 'finished' event will be triggered.
   */
  trimEvents: function()
  {
    for (var attr in this.events)
    {
      var e = this.events[attr];
      
      if ( e.isFinished() )
      {
        if ( e.next )
        {                    
          this.placeEvent( e.next );
          this.finished = false;
        }
        else
        {
          delete this.events[attr];
        }
      }
    }
    
    if ( !this.wasFinished && this.finished )
    {
      this.trigger( 'finished', this );
    }
  },
  
  /**
   * Returns the current value for the given attribute (or undefined if the attribute is not or 
   * has not animated).
   *
   * @param {string} attr
   */
  value: function(attr)
  {
    return this.frame[ attr ];
  },
  
  /**
   * A method that is invoked when an animator is finished and is being removed from the list
   * of currently animating Animators.
   */
	deactivate: function()
	{ 
    this.trigger('deactivate', this);
	},
  
  /**
   * A method that can be invoked to destroy an animator - removing any relationship between
   * the subject and animator. The next time an animator is generated for the subject a new
   * one will be created.
   */
  destroy: function()
  {
    this.finished = true;
    
    this.trigger('destroyed');
  },
  
  /**
   * Creates event instances for the given animation and options. The animation can be an animation
   * object or an animation name. If a name is provided the options are merged in.
   *
   * @param {anim8.Animation|string|object} animation
   * @param [object] options
   */
  createEvents: function(animation, options)
  {
    options = options || {};
    
    var animation = anim8.animation( animation, options );
  
    if (animation === false)
    {
      return false;
    }
    
    var events = animation.newEvents();
    
    if ( animation.isSaved() )
    {      
      for (var parserName in animation.input)
      {
        var parser = anim8.parser( parserName );
        
        if ( parser !== false )
        {
          parser.merge( animation.input, options, animation.options, events );
        }
      }
    }
    
    this.onAnimation( animation, options, events );
    
    return events;
  },
  
  /**
   * A method invoked when an animation is about to be played in the Animator.
   * 
   * @param {anim8.Animation} animation
   * @param {object} options
   * @param {array:anim8.EventInstance} events
   */
  onAnimation: function(animation, options, events)
  {
    
  },
  
  /**
   * Adds a spring to this animator replacing any existing spring for the same attribute.
   * A spring object can be given, an instance of anim8.Spring, or a name of a saved Spring.
   * 
   * @param {anim8.Spring|string|object} spring
   */
  spring: function(spring)
  {
    var spring = anim8.spring( spring );
    
    if ( spring === false )
    {
      return false;
    }

    this.placeSpring( spring );
    
    anim8.add( this );
    
    return spring;
  },
  
  /**
   * Removes springs for the specified attributes. If no attributes are specified then all springs
   * are removed. Attributes can be specified as an array of attribute names or a string with attribute
   * names separated by a space.
   *
   * @param {string|Array} attributes
   */
  unspring: function(attributes)
  {
    return this.springsFor( attributes, function(s)
    {
      delete this.springs[ s.attribute ];
    });
  },
  
  /**
   * Adds an animation to this Animator optionally finishing events for attributes not specified in the
   * given attribute. Events will be replaced immediately.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all 
   */
	play: function(animation, options, all)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    var attrs = {};
    
    for (var i = 0; i < events.length; i++)
    { 
      this.placeEvent( events[i] );
      
      attrs[ events[i].attribute ] = true;
    }
    
    if ( all )
    {
      for (var attr in this.events)
      {
        if ( !(attr in attrs) )
        {
          this.events[ attr ].finish( this.frame );
        }
      }
    }
    
    anim8.add( this );
    
		return this;
	},
  
  /**
   * Queues an animation on this Animator. The events generated for the given animation
   * will all start at the same time - at the end of the events currently on the Animator.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   */
	queue: function(animation, options)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
        
    var maxRemaining = 0.0;
    
    for (var attr in this.events)
    {
      var e = this.events[ attr ];
      
      if ( !e.isInfinite() )
      {
        maxRemaining = Math.max( maxRemaining, this.events[attr].timeRemainingInChain() );  
      }
    }
        
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      
      if ( attr in this.events  && !this.events[ attr ].isInfinite() )
      {    
        e.delay += (maxRemaining - this.events[attr].timeRemainingInChain());
        
        this.events[attr].queue( e );
      }
      else
      {
        e.delay += maxRemaining;
        
        this.placeEvent( e );
      }
    }
    
    anim8.add( this );
    
		return this;
	},
  
  /**
   * Transitions from the currently playing events into a new animation. The transition is made
   * by constructing a quadratic curve from the current value to a point further on the current
   * path to the starting point of the new animation.
   *
   * @param {number} transitionTime 
   * @param {number} transitionDelta
   * @param {string|function|array} transitionEasing
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all
   */
	transition: function(transitionTime, transitionDelta, transitionEasing, animation, options, all)
	{
    var events = this.createEvents( animation, options );
    
    if ( events === false )
    {
      return false;
    }
    
    // Check if we even need to transition
    var transition = false;
    
    for (var i = 0; i < events.length && !transition; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transition = true;
      }
    }
    
    // Only transition if we need to
    if ( transition )
    {
      for (var i = 0; i < events.length; i++)
      {
        var e1 = events[i];
        var attr = e1.attribute;
      
        if ( attr in this.events )
        {
          var path = e1.path;
          var calc = path.calculator;
          var e2 = this.events[attr];
        
          var p0 = calc.copy( calc.create(), this.frame[attr] );
          var p1 = e2.getFuture( transitionDelta );
          var p2 = e1.getPoint( 0 );
        
          var transitionPath = new anim8.QuadraticPath( attr, calc, p0, p1, p2 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transitionTime, transitionEasing, 0, 0, 1, true ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transitionTime;
     
          this.placeEvent( e1 );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = 0; i < events.length; i++)
      { 
        this.placeEvent( events[i] );
      }
    }
    
    anim8.add( this );
    
		return this;
	},
	
	/**
	 * Tweens a single attribute or a map of attributes to target values.
	 *
	 * .tweenTo( attributeName, targetValue, duration, delay, easing, repeat, sleep )
	 * .tweenTo( attributeMap, duration, delay, easing, repeat sleep )
	 *
	 * @param {object|string}
	 * @param [any]
	 * @param 
	 */
	tweenTo: function(input, a, b, c, d, e, f)
	{
		if ( anim8.isString( input ) )
		{
			var attr = anim8.attribute( input );
			var calc = anim8.calculator( attr.calculator );
			var target = calc.parse( a, attr.defaultValue );
			var duration = anim8.coalesce( b, anim8.defaults.duration );
			var delay = anim8.coalesce( c, anim8.defaults.delay );
			var easing = anim8.easing( d );
			var repeat = anim8.coalesce( e, anim8.defaults.repeat );
			var sleep = anim8.coalesce( f, anim8.defaults.sleep );
			
			var path = new anim8.Tween( input, calc, this.frame[ input ], target );
			var event = new anim8.Event( input, path, duration, easing, delay, sleep, repeat );
			
			this.placeEvent( event.newInstance() );
		}
		else if ( anim8.isObject( input ) )
		{
			for ( var attribute in input )
			{
				var attr = anim8.attribute( input );
				var calc = anim8.calculator( attr.calculator );
				var target = calc.parse( input[ attribute ], attr.defaultValue );
				var duration = anim8.coalesce( a, anim8.defaults.duration );
				var delay = anim8.coalesce( b, anim8.defaults.delay );
				var easing = anim8.easing( c );
				var repeat = anim8.coalesce( d, anim8.defaults.repeat );
				var sleep = anim8.coalesce( e, anim8.defaults.sleep );
				
				var path = new anim8.Tween( input, calc, this.frame[ input ], target );
				var event = new anim8.Event( input, path, duration, easing, delay, sleep, repeat );
				
				this.placeEvent( event.newInstance() );
			}
		}
		
		anim8.add( this );
		
		return this;
	},
	
	/**
	 * Applies the initial state of all unstarted current events for the specified attributes immediately. 
	 * Attribute names can be given as an array or a space separated string. If no attributes are given all 
	 * attributes are assumed.
	 *
   * @param {string|array} attributes
	 */
	applyInitialState: function(attributes)
	{
		var eventCount = this.eventsFor( attributes, function(event, attr)
		{
			if ( !event.hasStarted() && event.hasInitialState() )
			{
				event.applyValue( this.frame, this.frame[ attr ], 0.0 );
				
				this.updated[ attr ] = true;
			}
			
		});
		
		this.apply();
		
		return eventCount;
	},
  
  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   * 
   * @param {string} attribute
   */
  ref: function(attribute)
  {
    var animator = this;
    var request = {};
    
    return function()
    {
      if ( attribute in animator.frame )
      {
        return animator.frame[ attribute ];
      }
      
      request[ attribute ] = true;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attribute ] ) )
      {
        return current[ attribute ];
      }
      
      return anim8.attribute( attribute ).defaultValue;
    };
  },
  
  /**
   * Follows the attribute along the given path definition.
   * 
   * @param {string} attribute
   * @param {anim8.Path|object|string} path
   * @param [number] duration
   * @param [number] delay
   * @param [function|string] easing
   * @param [number] repeat
   * @param [number] sleep  
   */
  follow: function(attribute, path, duration, delay, easing, repeat, sleep)
  {
    var path = anim8.path( path );
    
    // attribute, path, duration, easing, delay, sleep, repeat) 
    var event = new anim8.Event( 
      attribute, 
      path, 
      anim8.coalesce( duration, anim8.defaults.duration ),
      anim8.easing( easing ),
      anim8.coalesce( delay, anim8.defaults.delay ),
      anim8.coalesce( sleep, anim8.defaults.sleep ),
      anim8.coalesce( repeat, anim8.defaults.repeat ),
      true
    );
    
    this.placeEvent( event.newInstance() );
    
    anim8.add( this );
    
    return this;
  },
  
  /**
   * Helper method that calls a callback for each object in the given map that exists
   * in the attribute string/array.
   *
   * @param {string|array} attributes
   * @param {function} callback
   * @param {object} objects
   */
  objectsFor: function(attributes, callback, objects)
  {
		if ( anim8.isString( attributes ) )
		{
			attributes = attributes.split( ' ' );
		}
    
    var resulting = !anim8.isFunction( callback );
    var objectCount = 0;
    var results = [];
    
		if ( anim8.isArray( attributes ) )
		{
      for (var i = 0; i < attributes.length; i++)
      {
        var attr = attributes[i];
        
        if ( attr in objects )
        {
          if ( resulting )
          {
            results.push( objects[attr] );
          }
          else
          {
            callback.call( this, objects[attr], attr ); 
            
            objectCount++;
          }
        }
      }
		}
    else
    {
      for (var attr in objects)
      {
        if ( resulting )
        {
          results.push( objects[attr] );
        }
        else
        {
          callback.call( this, objects[attr], attr ); 
          
          objectCount++;
        }
      }
    }
    
		return resulting ? results : objectCount;
  },
  
  /**
   * Invokes the callback for each event for the given attributes.
   * 
   * @param {string|array} attributes
   * @param {function} callback
   */
	eventsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.events );
	},
  
  /**
   * Invokes the callback for each spring for the given attributes.
   *
   * @param {string|array} attributes
   * @param {function} callback
   */
	springsFor: function(attributes, callback)
	{
		return this.objectsFor( attributes, callback, this.springs );
	},
	
  /**
   * Stops all events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	stop: function(attributes)
	{
		return this.eventsFor( attributes, function(event, attr) 
		{
			delete this.events[ attr ];
		});
	},
  
  /**
   * Ends all events for the specified attributes. If events are queued the last value of the last event
   * is applied to this Animator before being completely removed. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	end: function(attributes)
	{
		return this.eventsFor( attributes, function(event) 
		{
			while (event.next)
			{
				event = event.next;
			}
			
			event.finish( this.frame );
		});
	},
  
  /**
   * Finishes all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	finish: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.finish( this.frame );
		});
	},
  
  /**
   * Pauses all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	pause: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.pause();
		});
	},
  
  /**
   * Resumes all current events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	resume: function(attributes)
	{
		return this.eventsFor( attributes, function(event)
		{
			event.resume();
		});
	},
  
  /**
   * Sets the given attributes to this Animator immediately.
   *
   * @param {object} attributes
   */
  set: function(attributes)
  {
    for (var attr in attributes)
    {
      this.frame[ attr ] = attributes[ attr ];
			this.updated[ attr ] = true;
    }
    
    this.apply();
    
    return this;
  },
  
  /**
   * Gets the current attribute values for all attributes specified. The argument must be an object
   * where the key is the name of an attribute.
   *
   * @param {object} attributes
   */
  get: function(attributes)
  {
    var out = {};
    
    for (var attr in attributes)
    {
      out[ attr ] = this.frame[ attr ];
    }
    
    return out;
  },
  
  /**
   * Returns true if there are any events on this Animator.
   */
  hasEvents: function()
  {
    for (var attr in this.events)
    {
      return true;
    }
    
    return false;
  },
  
  /**
   * Returns true if there are any springs on this Animator.
   */
  hasSprings: function()
  {
    for (var attr in this.springs)
    {
      return true;
    }
    
    return false;
  },
  
  /**
   * Returns true if there are any springs on this Animator or animating events.
   */
  isAnimating: function()
  {
    if ( this.hasSprings() )
    {
      return true;
    }
    
    for (var attr in this.events)
    {
      if ( this.events[attr].isAnimating() )
      {
        return true;
      }
    }
    
    return false;
  },
	
	/**
	 * Defers the method calls following this one to when the given event type (on or once) and event.
	 * To return this animator you need to call undefer() as many times as you called defer().
	 *
	 * @param {string} eventType
	 * @param {string} event
	 */
	defer: function(eventType, event, callback)
	{
		return new anim8.DeferAnimator( this, this, eventType, event, callback );
	}
  
};

/**
 * Adds the following event methods to Animators: on, once, off, trigger.
 */
anim8.eventize( anim8.Animator.prototype );

/**
 * Provides the ability to defer method calls until certain events are triggered.
 */
anim8.DeferAnimator = function(animator, previous, eventType, event)
{
	this.$reset( animator, previous, eventType, event );
};

/**
 * Creates the Defer prototype for the following Animator methods.
 */
anim8.DeferAnimator.prototype = new anim8.Defer( anim8.DeferAnimator, [
  'play', 'queue', 'transition', 'restore', 'set', 'resume', 'pause', 
  'finish', 'end', 'stop', 'follow', 'applyInitialState', 'tweenTo', 
  'spring', 'unspring', 'apply', 'placeSpring', 'placeEvent'
]);
