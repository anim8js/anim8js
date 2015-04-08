
/**
 * Instantiates a new Animator given a subject to animate.
 *
 * @param {any} e
 */
anim8.Animator = function(e) 
{
	this.reset( e );
};

anim8.fn = anim8.Animator.prototype = 
{
  /**
   * Resets the animator given a subject to animate.
   *
   * @param {any} e
   */
	reset: function(subject)
	{
	  this.subject = subject;
    this.attrimators = new anim8.AttrimatorMap();
    this.attrimatorsAdded = [];
	  this.frame = {};
    this.updated = {};
	  this.finished = false;
		this.factory = null;
    this.active = false;
    this.cycleCurrent = 0;
    this.cycleNext = 0;
    this.cycleEnded = 0;
    
    return this;
	},

  /**
   * Starts a new animation cycle. This is done before events & springs are placed
   * to group them together so we know when to apply their initial value.
   * 
   * @return {this}
   */
  newCycle: function(attrimators)
  {
    this.cycleNext++;

    if ( attrimators instanceof anim8.AttrimatorMap )
    {
      this.cycleNext = attrimators.applyCycle( this.cycleNext );
    }
    else if ( attrimators instanceof anim8.Attrimator )
    {
      attrimators.cycle = this.cycleNext;
    }

    return this;
  },

  /**
   * Applies the current cycle. This involves finding all events & springs with the same cycle
   * identifier and applying their initial state.
   * 
   * @return {this}
   */
  applyCurrentCycle: function()
  {
    var cycle = this.cycleCurrent;
    var attrimators = this.attrimators.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      if ( attrimator.cycle === cycle )
      {
        this.updated[ attr ] = (attrimator.startCycle( this.frame ) !== false) || this.updated[ attr ];
      }
    }

    return this;
  },

  /**
   * [endCurrentCycle description]
   * @return {[type]}
   */
  endCurrentCycle: function()
  {
    if ( this.cycleCurrent > this.cycleEnded )
    {
      this.cycleEnded = this.cycleCurrent;
      this.trigger( 'cycleEnd:' + this.cycleCurrent, this.cycleCurrent ); 
    }
  },

  /**
   * Returns the attribute descriptor
   * @param  {[type]}
   * @return {[type]}
   */
  getAttribute: function(attr)
  {
    return this.factory.attribute( attr );
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
  preupdate: function(now)
  {
    // If there are attribute placed on the animator since the last preupdate
    // that has computed values we need to replace the path on the event with
    // a copy containing the computed values. This is where current value & 
    // relative values are injected from the animator into the attribute.
    var aa = this.attrimatorsAdded;
    if ( aa.length )
    {
      for (var i = 0; i < aa.length; i++)
      {
        var attrimator = aa[ i ];

        this.setDefault( attrimator.attribute );

        attrimator.start( now, this );     
      }

      aa.length = 0;
    }

    this.trigger('preupdate');
    
    return this;
  },

  /**
   * Sets the default value for the given attribute in the frame of this Animator if there's no value there.
   * 
   * @param {[type]}
   */
  setDefault: function(attr)
  {
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = this.getAttribute( attr ).cloneDefault();
    }
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

    var attrimators = this.attrimators.values;
    var minCycle = this.cycleNext;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      this.updated[ attr ] = attrimator.setTime( now, this.frame );

      this.finished = this.finished && attrimator.isFinished();

      minCycle = Math.min( minCycle, attrimator.cycle );
    }

    if ( this.cycleCurrent < minCycle )
    {
      while ( this.cycleCurrent < minCycle )
      {
        this.endCurrentCycle();
        this.cycleCurrent++;
      }
      
      this.cycleCurrent = minCycle;
      this.applyCurrentCycle();
      this.trigger( 'cycleStart:' + this.cycleCurrent, this.cycleCurrent );
    }

    if ( !this.wasFinished && this.finished )
    {
      this.endCurrentCycle();
    }

    this.trigger('update');
    
    return this;
  },

  /**
   * Places the attribute animator in this animator replacing any existing animator
   * for the same attribute. The next time the animator is updated the attribute
   * animator will be started.
   * 
   * @param  {anim8.Attrimator}
   */
  placeAttrimator: function(attrimator)
  {
    var attr = attrimator.attribute;

    this.attrimators.put( attr, attrimator );
    this.attrimatorsAdded.push( attrimator );

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
        this.subject[ attr ] = this.frame[ attr ]; 
				this.updated[ attr ] = false;
      }
    }
	
		this.trigger('apply');
	
    this.trimAttrimators();
    
    return this;
  },
  
  /**
   * Removes any finished events and places queued events. If the animator previously wasn't finished
   * but now it is the 'finished' event will be triggered.
   */
  trimAttrimators: function()
  {
    var attrimators = this.attrimators.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( attrimator.isFinished() )
      {
        if ( attrimator.next )
        {
          this.placeAttrimator( attrimator.next );
        }
        else
        {
          this.attrimators.removeAt( i );
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
   * Activates this Animator by adding it to the main loop if it isn't there already.
   * 
   * @return {[type]}
   */
  activate: function()
  {
    anim8.add( this );

    return this;
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

    this.factory.destroy( this );
    
    this.trigger('destroyed');
  },
  
  /**
   * Creates event instances for the given animation and options. The animation can be an animation
   * object or an animation name. If a name is provided the options are merged in.
   *
   * @param {anim8.Animation|string|object} animation
   * @param [object] options
   */
  createAttrimators: function(animation, options, cache)
  {
    var options = anim8.options( options );    
    var animation = anim8.animation( animation, options, cache );
  
    if (animation === false)
    {
      return false;
    }
    
    var attrimators = animation.newAttrimators();
    
    if ( animation.isSaved() && !anim8.isEmpty( options ) )
    { 
      animation.merge( options, attrimators );
    }
    
    this.onAnimation( animation, options, attrimators );

    while ( animation.next !== null )
    {
      animation = animation.next;

      var queueAttrimators = animation.newAttrimators();

      this.onAnimation( animation, options, queueAttrimators );

      attrimators.queueMap( queueAttrimators );
    }

    return attrimators;
  },
  
  /**
   * A method invoked when an animation is about to be played in the Animator.
   * 
   * @param {anim8.Animation} animation
   * @param {object} options
   * @param {anim8.AttrimatorMap} attrimatorMap
   */
  onAnimation: function(animation, options, attrimatorMap)
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

    this.newCycle( spring );
    this.placeAttrimator( spring );
    
    this.activate();
    
    return spring;
  },
  
  /**
   * Adds an animation to this Animator optionally finishing events for attributes not specified in the
   * given attribute. Existing events will be replaced immediately.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all 
   * @param [boolean] cache
   */
	play: function(animation, options, all, cache)
	{
    var attrimatorMap = this.createAttrimators( animation, options, cache );
    
    if ( attrimatorMap === false )
    {
      return false;
    }
    
    this.newCycle( attrimatorMap );
    this.playAttrimators( attrimatorMap, all );

    return this.activate();
	},

  /**
   * Adds events to this Animator to be played (optionally finishing events for attributes not specified in the given 
   * attribute). Existing events will be replaced immediately. This method will not activate the Animator, that has
   * to be done manually.
   * 
   * @param  {anim8.AttributeMap} animatorMap
   * @param  [boolean] all
   * @return {this}
   */
  playAttrimators: function(attrimatorMap, all)
  {
    if ( all )
    {
      var attrimators = this.attrimators.values;

      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var attrimator = attrimators[ i ];

        if ( !attrimatorMap.has( attrimator.attribute ) )
        {
          attrimator.finish( this.frame );
        }
      }
    }

    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      this.placeAttrimator( attrimators[i] );
    }
    
    return this;
  },
  
  /**
   * Queues an animation on this Animator. The events generated for the given animation
   * will all start at the same time - at the end of the events currently on the Animator.
   *
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   */
	queue: function(animation, options, cache)
	{
    var attrimatorMap = this.createAttrimators( animation, options, cache );
    
    if ( attrimatorMap === false )
    {
      return false;
    }
        
    this.newCycle( attrimatorMap );
    this.queueAttrimators( attrimatorMap );

    return this.activate();
	},

  /**
   * Queues an array of events on this Animator. The given events will be delayed to start at the same time - at the
   * end of the events currently on the Animator. This method will not activate the Animator, that has to be done 
   * manually.
   * 
   * @param  {array} events
   * @return {this}
   */
  queueAttrimators: function(attrimatorMap)
  {
    this.attrimators.queueMap( attrimatorMap, this.placeAttrimator, this );
    
    return this;
  },
  
  /**
   * Transitions from the currently playing events into the beginning of a new animation. 
   * The transition is made by constructing a quadratic curve from the current value to a 
   * point further on the current path to the starting point of the new animation.
   *
   * @param {string|array|object} transition
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all
   * @param [Boolean] cache
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var attrimatorMap = this.createAttrimators( animation, options, cache );
    
    if ( attrimatorMap === false )
    {
      return false;
    }

    this.newCycle( attrimatorMap );
    this.transitionAttrimators( transition, attrimatorMap, all );

    return this.activate();
  },

  /**
   * Transitions from the currently playing events into the beginning of a new animation. 
   * The transition is made by constructing a quadratic curve from the current value to a 
   * point further on the current path to the starting point of the new animation. This method will not activate the 
   * Animator, that has to be done manually.
   *
   * @param {object} transition
   * @param {anim8.AttrimatorMap} events
   * @param [boolean] all
   */
  transitionAttrimators: function(transition, attrimatorMap, all)
  {
    // If intro & outro are 0, use Tween
    // If intro is 0, use Quadratic Path between current value, outro point, and first point on new path.
    // If outro is 0, use Quadratic Path between current value, first point on new path, and intro point.
    // If intro & outro are not 0, use Cubic Path between current value, outro point, first point on new path, and intro point.
    // If granularity is given > 1 then compile the path, compute intro & outro velocities, and compute deltas for new 
    //    compiled path based on interpolated velocity over the path (knowing it's length and transition time)
    
    var current = this.attrimators;
    var attrimators = attrimatorMap.values;

    // Only transition if we need to
    if ( current.hasOverlap( attrimatorMap ) )
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var a1 = attrimators[ i ];
        var attr = a1.attribute;

        if ( current.has( attr ) )
        {
          var attribute = this.getAttribute( attr );
          var a2 = current.get( attr );
        
          var p0 = attribute.calculator.clone( this.frame[attr] );
          var p1 = a2.getFuture( transition.outroDelta );
          var p2 = a1.getPoint( 0 );
        
          var transitionPath = new anim8.QuadraticPath( attr, attribute.calculator, p0, p1, p2 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transition.time, transition.easing, 0, 0, 1 ).newInstance();
        
          transitionEvent.next = a1;

          this.placeAttrimator( transitionEvent );
        }
        else
        {
          a1.delay += transition.time;
     
          this.placeAttrimator( a1 );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        this.placeAttrimator( attrimators[ i ] );
      }
    }
    
    return this;
  },
  
  /**
   * Transitions from the currently playing events into a new animation. The transition is made
   * by constructing a cubic curve from the current value to a point further on the current
   * path to the starting point of the new animation.
   *
   * @param {number} transitionTime 
   * @param {number} transitionFromDelta
   * @param {number} transitionIntoDelta
   * @param {string|function|array} transitionEasing
   * @param {string|object|anim8.Animation} animation
   * @param [object] options
   * @param [boolean] all
   * /
  transitionInto: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var events = this.createEvents( animation, options, cache );
    
    if ( events === false )
    {
      return false;
    }
    
    this.transitionIntoEvents( transition, events, all );

    return this.activate();
  },

  /**
   * Transitions from the currently playing events into a new animation. The transition is made
   * by constructing a cubic curve from the current value to a point further on the current
   * path to the starting point of the new animation. This method will not activate the Animator, that has to be done 
   * manually.
   *
   * @param {number} transitionTime 
   * @param {number} transitionFromDelta
   * @param {number} transitionIntoDelta
   * @param {string|function|array} transitionEasing
   * @param {array} events
   * @param [boolean] all
   * /
  transitionIntoEvents: function(transition, events, all)
  {
    // Check if we even need to transition
    var transitionRequired = false;
    
    for (var i = 0; i < events.length && !transitionRequired; i++)
    {      
      if ( events[i].attribute in this.events )
      {
        transitionRequired = true;
      }
    }
    
    // Only transition if we need to
    if ( transitionRequired )
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
        
          var p0 = calc.clone( this.frame[attr] );
          var p1 = e2.getFuture( transition.outroDelta );
          var p2 = e1.getPoint( 0 );
          var p3 = e1.getPoint( transition.introDelta );
          
          var transitionPath = new anim8.CubicPath( attr, calc, p0, p1, p2, p3 );
          var transitionEvent = new anim8.Event( attr, transitionPath, transition.time, transition.easing, 0, 0, 1 ).newInstance();
        
          transitionEvent.next = e1;
        
          this.placeEvent( transitionEvent );
        }
        else
        {
          e1.delay += transition.time;
     
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
      
    return this;
  },
  /**/

  /**
   * Tweens a single attribute to a target value.
   *
   * @param {string} attr
   * @param {any} target
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenTo: function(attr, target, options)
  {
    var options   = anim8.options( options );
    var attribute = this.getAttribute( attr );
    var end       = attribute.parse( target );
    var path      = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, end );
    var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
    
    this.newCycle( event );
    this.placeAttrimator( event );
    
    return this.activate();
  },

  /**
   * Tweens a multiple attribute to target values.
   *
   * @param {object} targets
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenManyTo: function(targets, options)
  {
    var options = anim8.options( options );

    this.newCycle();

    for ( var attr in targets )
    {
      var attribute = this.getAttribute( attr );
      var end       = attribute.parse( targets[ attr ] );
      var path      = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, end );
      var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
      
      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },
  
  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * @param {string} attr
   * @param {any} starts
   * @param {any} ends
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tween: function(attr, starts, ends, options)
  {
    var options   = anim8.options( options );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starts );
    var end       = attribute.parse( ends );
    var path      = new anim8.Tween( attr, attribute.calculator, start, end );
    var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
    
    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },
  
  /**
   * Tweens multiple attributes from starting values to ending values.
   *
   * @param {object} starts
   * @param {object} ends
   * @param [string|number] duration
   * @param [string|number] delay
   * @param [string|function] easing
   * @param [string|number] repeat
   * @param [string|number] sleep
   * @param [number] scale
   * @param [any] scaleBase
   */
  tweenMany: function(starts, ends, options)
  {
    var options = anim8.options( options );

    this.newCycle();

    for ( var attr in starts )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( starts[ attr ] );
      var end       = attribute.parse( ends[ attr ] );
      var path      = new anim8.Tween( attr, attribute.calculator, start, end );
      var event     = new anim8.Event( attr, path, options.duration, options.easing, options.delay, options.sleep, options.repeat, options.scale, options.scaleBase );
      
      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },
  
  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   * 
   * @param {string} attribute
   */
  ref: function(attr)
  {
    var animator = this;
    var attribute = this.getAttribute( attr );
    var request = {};
    
    return function()
    {
      if ( attr in animator.frame )
      {
        return animator.frame[ attr ];
      }
      
      request[ attr ] = true;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attr ] ) )
      {
        return current[ attr ];
      }
      
      return attribute.defaultValue;
    };
  },
  
  /**
   * Follows the attribute along the given path definition.
   * 
   * @param {string} attribute
   * @param {anim8.Path|object|string} path
   * @param [number|string] duration
   * @param [number|string] delay
   * @param [function|string] easing
   * @param [number|string] repeat
   * @param [number|string] sleep  
   * @param [number] scale
   */
  follow: function(attribute, path, options)
  {
    var options = anim8.options( options );
    var path = anim8.path( path );
    
    var event = new anim8.Event( 
      attribute, 
      path, 
      options.duration,
      options.easing,
      options.delay, 
      options.sleep,
      options.repeat,
      options.scale,
      options.scaleBase
    );
    
    this.newCycle( event );
    this.placeAttrimator( event );
    
    return this.activate();
  },
  
  /**
   * Helper method that calls a callback for each object in the given map that exists
   * in the attribute string/array.
   *
   * @param {string|array} attributes
   * @param {function} callback
   * @param {object} objects
   */
  attrimatorsFor: function(attributes, callback, objects)
  {
		if ( anim8.isString( attributes ) )
		{
			attributes = attributes.split( ' ' );
		}
   
    var attrimatorMap = this.attrimators; 
    var resulting = !anim8.isFunction( callback );
    var results = [];
    
		if ( anim8.isArray( attributes ) )
		{
      for (var i = 0; i < attributes.length; i++)
      {
        var attr = attributes[i];
        var attrimator = attrimatorMap.get( attr );
        
        if ( attrimator )
        {
          if ( resulting )
          {
            results.push( attrimator );
          }
          else
          {
            callback.call( this, attrimator, attr );
          }
        }
      }
		}
    else
    {
      var attrimators = attrimatorMap.values;

      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var attrimator = attrimators[ i ];

        if ( resulting )
        {
          results.push( attrimator );
        }
        else
        {
          callback.call( this, attrimator, attrimator.attribute );
        }
      }
    }
    
		return resulting ? results : this;
  },
	
  /**
   * Stops all events for the specified attributes. Attribute names can be given as an array
   * or a space separated string. If no attributes are given all attributes are assumed.
   *
   * @param {string|array} attributes
   */
	stop: function(attributes)
	{
		return this.attrimatorsFor( attributes, function(attrimator, attr) 
		{
      this.attrimators.remove( attr );
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
		return this.attrimatorsFor( attributes, function(attrimator) 
		{
			while (attrimator.next)
			{
				attrimator = attrimator.next;
			}
			
			attrimator.finish( this.frame );
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
		return this.attrimatorsFor( attributes, function(attrimator)
		{
			attrimator.finish( this.frame );
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
		return this.attrimatorsFor( attributes, function(attrimator)
		{
			attrimator.pause();
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
		return this.attrimatorsFor( attributes, function(attrimator)
		{
			attrimator.resume();
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
   * Unsets the attribute, array of attributes, or object of attribtues. Unsetting involves removing all events,
   * springs, and the current value in the frame.
   * 
   * @param  {string|array|object}
   * @return {this}
   */
  unset: function(attributes)
  {
    if ( anim8.isString( attributes ) )
    {
      this.attrimators.remove( attributes );
      delete this.frame[ attributes ];
    }
    else if ( anim8.isArray( attributes ) )
    {
      for (var i = 0; i < attributes.length; i++)
      {
        this.unset( attributes[ i ] );
      }
    }
    else if ( anim8.isObject( attributes ) )
    {
      for (var attr in attributes)
      {
        this.unset( attr );
      }
    }

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
   * Returns the amount of finite time remaining before the animator is done
   * animating. Attrimators that don't have a known end time aren't included.
   */
  timeRemaining: function()
  {
    return this.attrimators.timeRemaining();
  },
  
  /**
   * Returns true if there are any events on this Animator.
   */
  hasAttrimators: function()
  {
    return this.attrimators.size() > 0;
  },
  
  /**
   * Returns the subject of the Animator optionally passing it through a wrapper
   * function before it's returned.
   *
   * @param [function] wrapper
   */
  getSubject: function(wrapper)
  {
    var subject = this.subject;

    if ( anim8.isFunction( wrapper ) )
    {
      subject = wrapper( subject );
    }

    return subject;
  },

  /**
   * Invokes a function with the given context or the context of this Animator if none is given. This is particularly
   * useful for having a function be called on deferred statements.
   * 
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  invoke: function(func, context, args)
  {
    if ( anim8.isFunction( func ) )
    {
      func.apply( context || this, args || [] );
    }
  },
	
	/**
	 * Defers the method calls following this one to when the given event type (on or once) and event.
	 * To return this animator you need to call undefer() as many times as you called defer().
	 *
	 * @param {string} eventType
	 * @param {string} event
   * @param [function] callback
	 */
	defer: function(eventType, event, callback)
	{
		return new anim8.DeferAnimator( this, this, eventType, event, callback );
	},

  /**
   * [onStart description]
   * @param  {Function}
   * @param  {[type]}
   * @return {[type]}
   */
  onCycleStart: function(callback, context)
  {
    this.once( 'cycleStart:' + this.cycleNext, callback, context );
  },

  /**
   * [onEnd description]
   * @param  {Function}
   * @param  {[type]}
   * @return {[type]}
   */
  onCycleEnd: function(callback, context)
  {
    this.once( 'cycleEnd:' + this.cycleNext, callback, context );
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
anim8.DeferAnimator.prototype = new anim8.Defer( anim8.DeferAnimator, 
[
  'restore', 'placeAttrimator', 'preupdate', 'update', 'apply', 'trimAttrimators',
  'activate', 'deactivate', 'destroy', 'spring', 'play', 'playAttrimators', 'queue',
  'queueAttrimators', 'transition', 'transitionAttrimators', 'tween', 'tweenTo', 
  'tweenMany', 'tweenManyTo', 'follow', 'stop', 'end', 'finish', 'pause', 'resume',
  'set', 'unset', 'get', 'invoke'
]);
