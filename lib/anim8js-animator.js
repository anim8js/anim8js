
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
   * @param {any} subject
   * @return {this}
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
   * Starts a new animation cycle. This is done before events & springs are 
   * placed to group them together so we know when to apply their initial value.
   *
   * @param {anim8.Attrimator|anim8.AttrimatorMap} attrimators
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
   * Applies the current cycle. This involves finding all attrimators with the 
   * same cycle identifier and applying their initial state.
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
   * Ends the current cycle which calls any listening functions.
   * 
   * @return {this}
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
   * Returns the attribute descriptor given the name of the attribute.
   * 
   * @param  {String} attr
   * @return {Object}
   */
  getAttribute: function(attr)
  {
    return this.factory.attribute( attr );
  },
  
  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   *
   * @return {this}
   */
  restore: function()
  { 
    return this;
  },
  
  /**
   * A method thats invoked along with all other animators before updates are 
   * called. This is used to make any necessary preparations before the animator
   * is updated.
   *
   * @param {Number} now
   * @return {this}
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
        var attr = attrimator.attribute;

        if ( attr in this.subject )
        {
          this.frame[ attr ] = this.subject[ attr ];
        }
        else
        {
          this.setDefault( attr );          
        }

        attrimator.start( now, this );     
      }

      aa.length = 0;
    }

    this.trigger('preupdate');
    
    return this;
  },

  /**
   * Sets the default value for the given attribute in the frame of this 
   * Animator if there's no value there.
   * 
   * @param {String} attr
   */
  setDefault: function(attr)
  {
    if ( !(attr in this.frame) )
    {
      this.frame[ attr ] = this.getAttribute( attr ).cloneDefault();
    }
  },
  
  /**
   * Updates all attrimators in this animator with the given time.
   *
   * @param {Number} now
   * @return {this}
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
   * Places the attribute animator in this animator replacing any existing 
   * animator for the same attribute. The next time the animator is updated the 
   * attribute animator will be started. The previous (if any) attrimator is
   * returned.
   * 
   * @param {anim8.Attrimator}
   * @return [anim8.Attrimator] 
   */
  placeAttrimator: function(attrimator)
  {
    var attr = attrimator.attribute;
    var existing = this.attrimators.get( attr );

    this.attrimators.put( attr, attrimator );
    this.attrimatorsAdded.push( attrimator );

    this.finished = false;

    return existing;
  },
  
  /**
   * Applies all updated attributes to the subject. This method is invoked with 
   * all of the other animators at the end of the animation cycle.
   *
   * @return {this}
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
   * Removes any finished attrimators and places any queued attrimators. If the
   * animator previously wasn't finished but now is the 'finished' event will
   * be triggered.
   *
   * @return {this}
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

    return this;
  },
  
  /**
   * Returns the current value for the given attribute (or undefined if the 
   * attribute is not or has not animated).
   *
   * @param {String} attr
   * @return {any}
   */
  value: function(attr)
  {
    return this.frame[ attr ];
  },

  /**
   * Activates this Animator by adding it to the main loop if it isn't there 
   * already.
   * 
   * @return {this}
   */
  activate: function()
  {
    anim8.add( this );

    return this;
  },
  
  /**
   * A method that is invoked when an animator is finished and is being removed 
   * from the list of currently animating Animators.
   *
   * @return {this}
   */
	deactivate: function()
	{ 
    this.trigger('deactivate', this);

    return this;
	},
  
  /**
   * A method that can be invoked to destroy an animator - removing any 
   * relationship between the subject and animator. The next time an animator is
   * generated for the subject a new animator will be created.
   *
   * @return {this}
   */
  destroy: function()
  {
    this.finished = true;

    this.factory.destroy( this );
    
    this.trigger('destroyed');

    return this;
  },
  
  /**
   * Creates a map of attrimators based on the animation and options given. For
   * each anim8.Animation instance thats being converted into attrimators,
   * the onAnimation(animation, option, attrimatorMap) function is invoked.
   *
   * @param {anim8.Animation|String|Object} animation
   * @param [String|Object] options
   * @param {Boolean} cache
   * @see anim8.animation
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
   * @param {Object} options
   * @param {anim8.AttrimatorMap} attrimatorMap
   */
  onAnimation: function(animation, options, attrimatorMap)
  {
    
  },
  
  /**
   * Adds a spring to this animator replacing any existing attrimator for the 
   * same attribute. A spring object can be given, an instance of anim8.Spring, 
   * or a name of a saved Spring. The spring added to the animator is returned.
   * 
   * @param {anim8.Spring|String|Object} spring
   * @return {anim8.Spring}
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
   * Plays an animation. Attributes in the animation that are currently being
   * animated will be stopped and replaced with the new attrimators. If "all" is
   * true then any attrimators animating not specified in the given animation
   * will be stopped.
   *
   * @param {anim8.Animation|String|Object} animation
   * @param [String|Object] options
   * @param [Boolean] all 
   * @param [Boolean] cache
   * @see anim8.animation
   * @see anim8.options
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
   * Plays a map of attrimators. Attributes in the attrimator map that are 
   * currently being animated will be stopped and replaced with the new
   * attrimators. If "all" is true then any attrimators animating not specified
   * in the given attrimator map will be stopped. This method will not activate 
   * the Animator, that has to be done manually.
   * 
   * @param  {anim8.AttrimatorMap} animatorMap
   * @param  [Boolean] all
   * @return {this}
   */
  playAttrimators: function(attrimatorMap, all)
  {
    if ( all )
    {
      this.finishNotPresent( attrimatorMap, 0 );
    }

    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      this.placeAttrimator( attrimators[i] );
    }
    
    return this;
  },
  
  /**
   * Queues an animation. The attrimators generated from the given animation 
   * will be started at the same time - as soon as all finite attrimators for
   * the same attributes are finished. Any infinite attrimators will be 
   * automatically stopped when all queued attrimators are set to start.
   *
   * @param {anim8.Animation|String|Object} animation
   * @param [String|Object] options
   * @param [Boolean] cache
   * @see anim8.animation
   * @see anim8.options
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
   * Queues a map of attrimators. The map of attrimators will be started at the
   * same time - as soon as all finished attrimators for the same attribute are
   * finished. Any infinite attrimators will be automatically stopped when all
   * queued attrimators are set to start.
   * 
   * @param  {anim8.AttrimatorMap} attrimatorMap
   * @return {this}
   */
  queueAttrimators: function(attrimatorMap)
  {
    this.attrimators.queueMap( attrimatorMap, this.placeAttrimator, this );
    
    return this;
  },
  
  /**
   * Transitions from the currently playing attrimators into the beginning of a 
   * new animation. Several parameters can be specified in the transition object
   * which determine how the transition is made. If "all" is true then any 
   * attrimators animating not specified in the given animation will be stopped.
   *
   * time: the total time to take to transition into a new animation.
   * outro: time to look into the future for the current attrimator to curve to.
   * intro: time to look into the future for the next attrimator to curve into.
   * lookup: time to look into the future to calculate velocity which is used
   *   for negative intros and maintaing consistent exit & entrance velocity.
   * granularity: when greater than 2 it activates smooth transitions where the
   *    velocity of the new & old attrimators is maintained over the transition.
   * 
   * @param {String|Array|Object} transition
   * @param {String|Object|anim8.Animation} animation
   * @param [Object] options
   * @param [Boolean] all
   * @param [Boolean] cache
   * @see anim8.transition
   * @see anim8.animation
   * @see anim8.options
   * @see anim8.Animator.transitionAttrimators
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
   * Transitions from the currently playing attrimators into the beginning of a
   * new animation. Several parameters can be specified in the transition object
   * which determine how the transition is made. If "all" is true then any 
   * attrimators animating not specified in the given attrimator map will be 
   * stopped.
   *
   * time: the total time to take to transition into a new animation.
   * outro: time to look into the future for the current attrimator to curve to.
   * intro: time to look into the future for the next attrimator to curve into.
   * lookup: time to look into the future to calculate velocity which is used
   *   for negative intros and maintaing consistent exit & entrance velocity.
   * granularity: when greater than 2 it activates smooth transitions where the
   *    velocity of the new & old attrimators is maintained over the transition.
   *
   * @param {Object} transition
   * @param {anim8.AttrimatorMap} events
   * @param [Boolean] all
   * @return {this}
   */
  transitionAttrimators: function(transition, attrimatorMap, all)
  {
    // TRANSITIONING:
    // If the animator doesn't have an attrimator for the given attribute just add the attrimator adding the total delay
    // If the animator has an attrimator currently...
    //   If the current attrimator or new attrimator don't have values at the desired times...
    //      Stop the current attrimator after the total delay (adding the delay of the new attrimator as well)
    //      Queue the new attrimator
    //   Else
    //      Create a path using the methods detailed above
    // If all is true and there's an attrimator left on the animator that isn't being transitioned, stop it after the total delay.

    // CREATING A TRANSITION PATH:
    // If intro & outro are 0, use Tween
    // If intro is 0, use Quadratic Path between current value, outro point, and first point on new path.
    // If outro is 0, use Quadratic Path between current value, first point on new path, and intro point.
    // If intro & outro are not 0, use Cubic Path between current value, outro point, first point on new path, and intro point.
    // If granularity is given > 1 then compile the path, compute intro & outro velocities, and compute deltas for new 
    //    compiled path based on interpolated velocity over the path (knowing it's length and transition time)

    var current = this.attrimators;
    var attrimators = attrimatorMap.values;

    // If transition all attributes, 
    if ( all )
    {
      this.finishNotPresent( attrimatorMap, transition.time );
    }

    // Only transition if we need to
    if ( current.hasOverlap( attrimatorMap ) )
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var next = attrimators[ i ];
        var attr = next.attribute;
        var curr = current.get( attr );

        if ( curr && anim8.isDefined( this.frame[ attr ] ) )
        {
          var attribute = this.getAttribute( attr );
          var calc = attribute.calculator;

          var p2 = next.valueAt( 0, calc.create() );
          
          if ( p2 !== false )
          {
            var transitionTime = transition.time;
            var p0 = calc.clone( this.frame[ attr ] );            
            var p1 = transition.outro ? curr.valueAt( curr.getElapsed() + transition.outro, calc.create() ) : false;
            var p3 = transition.intro ? next.valueAt( transition.intro, calc.create() ) : false;
            var path = null;

            // If the intro is negative we can look into the past by looking a little bit into
            // the future and assume the past is going in the same direction (only the opposite). 
            if ( p3 !== false && transition.intro < 0 && transition.lookup > 0 )
            {
              var pastLookahead = next.valueAt( transition.lookup, calc.create() );
              var pastVelocity = calc.sub( pastLookahead, p2 );

              if ( pastVelocity !== false )
              {
                var pastNegativeVelocity = calc.scale( pastVelocity, transition.intro / transition.lookup );
                var past = calc.add( pastNegativeVelocity, p2 );
                
                p3 = p2;
                p2 = past;
              }
            }

            // Build a path with as many as the points as possible.
            if ( p1 === false && p3 === false )
            {
              path = new anim8.Tween( attr, calc, p0, p2 );
            }
            else if ( p1 === false )
            {
              path = new anim8.QuadraticPath( attr, calc, p0, p2, p3 );
            }
            else if ( p3 === false )
            {
              path = new anim8.QuadraticPath( attr, calc, p0, p1, p2 );
            }
            else
            {
              path = new anim8.CubicPath( attr, calc, p0, p1, p2, p3 );
            }
            
            // If granularity is specified we will try to make the transition 
            // smooth by maintaining exit (outro) velocity from the current attrimator
            // and interpolating it to the entrance (intro) velocity for the 
            // attrimator we're transitioning into.
            if ( transition.granularity > 2 && transition.lookup > 0 )
            { 
              var outTime  = p1 === false ? curr.getElapsed() : curr.getElapsed() + transition.outro;
              var outPoint = p1 === false ? p0 : p1;
              var outNext  = curr.valueAt( outTime + transition.lookup, calc.create() );

              var inTime   = p3 === false ? 0 : transition.intro;
              var inPoint  = p3 === false ? p2 : p3;
              var inNext   = next.valueAt( inTime + transition.lookup, calc.create() );

              // We can only proceed if we have reference points to calculate
              // exit & entrance velocity.
              if ( outNext !== false && inNext !== false )
              {
                var outVelocity  = calc.sub( calc.clone( outNext ), outPoint );
                var outPerMillis = calc.length( outVelocity ) / transition.lookup;

                var inVelocity   = calc.sub( calc.clone( inNext ), inPoint );
                var inPerMillis  = calc.length( inVelocity ) / transition.lookup;

                var compiled = new anim8.CompiledPath( attr, path, transition.granularity );
                var points = compiled.points;
                var lastPoint = points.length - 1;
                var totalDistance = 0;
                var distances = [];

                for (var k = 0; k < lastPoint; k++)
                {
                  distances[ k ] = totalDistance;
                  totalDistance += calc.distance( points[ k ], points[ k + 1 ] );
                }
                distances[ lastPoint ] = totalDistance;

                if ( !isNaN( totalDistance ) )
                {
                  var requiredTime = 2.0 * totalDistance / (outPerMillis + inPerMillis);
                  var acceleration = 0.5 * (inPerMillis - outPerMillis) / requiredTime;
                  var timeDelta = requiredTime / lastPoint;
                  var deltas = [];

                  for (var k = 0; k < lastPoint; k++)
                  { 
                    var time = k * timeDelta;
                    var position = outPerMillis * time + acceleration * time * time;

                    deltas[ k ] = position / totalDistance;
                  }
                  deltas[ lastPoint ] = 1.0;

                  path = new anim8.DeltaPath( attr, calc, points, deltas );
                  transitionTime = requiredTime;
                }
              }
            }

            var transitionEvent = new anim8.Event( attr, path, transitionTime, transition.easing, 0, 0, 1 );
          
            transitionEvent.next = next;
            transitionEvent.cycle = next.cycle;

            next.offset = transition.intro;

            this.placeAttrimator( transitionEvent );
          }
          else
          {
            curr.stopIn( transition.time + next.delay );
            curr.queue( next );
            next.delay = 0;
          }
        }
        else
        {
          next.delay += transition.time;
          
          this.placeAttrimator( next );
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
   * Finishes any attrimators on this animator that are not present in the given
   * map of attrimators. Optionally a delay in stopping them can be given.
   * 
   * @param {anim8.AttrimatorMap} attrimatorMap
   * @param {Number} delay
   * @return {this}
   */
  finishNotPresent: function(attrimatorMap, delay)
  {
    var attrimators = this.attrimators.values;
    var stopIn = delay || 0;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( !attrimatorMap.has( attrimator.attribute ) )
      {
        attrimator.stopIn( stopIn );
      }
    }

    return this;
  },

  /**
   * Tweens a single attribute to a target value.
   *
   * @param {String} attr
   * @param {any} target
   * @param {String|Array|Object} options
   * @return {this}
   * @see anim8.options
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
   * Tweens a multiple attributes to target values.
   *
   * @param {Object} targets
   * @param {String|Array|Object} options
   * @return {this}
   * @see anim8.options
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
   * @param {String} attr
   * @param {any} starts
   * @param {any} ends
   * @param {Object} options
   * @return {this}
   * @see anim8.options
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
   * @param {Object} starts
   * @param {Object} ends
   * @param {Object} options
   * @return {this}
   * @see anim8.options
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
   * Returns a function that returns the current value for the given attribute 
   * when invoked. The returned function can be given as values for paths & 
   * springs that are evaluated every frame.
   * 
   * @param {String} attr
   * @return {Function}
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
   * @param {String} attribute
   * @param {anim8.Path|Object|String} path
   * @param [Object] options
   * @return {this}
   * @see anim8.options
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
   * Helper method that iterates over given attributes. If callback is specified
   * it is invoked for each attrimator in this animator for the given 
   * attributes. If no callback is given an array of anim8.Attrimators is 
   * returned for each attrimator in this animator for the given attributes.
   *
   * @param {String|Array} attributes
   * @param {Function} callback
   * @return {this|Array}
   */
  attrimatorsFor: function(attributes, callback)
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
   * Stops all attributes for the specified attributes. Attribute names can be 
   * given as an array or a space separated string. If no attributes are given 
   * all attributes are assumed.
   *
   * @param {String|Array} attributes
   * @return {this}
   */
	stop: function(attributes)
	{
		return this.attrimatorsFor( attributes, function(attrimator, attr) 
		{
      this.attrimators.remove( attr );
		});
	},
  
  /**
   * Ends all attributes for the specified attributes. If attributes are queued 
   * the last value of the last attribute is applied to this Animator before 
   * being completely removed. Attribute names can be given as an array or a 
   * space separated string. If no attributes are given all attributes are 
   * assumed.
   *
   * @param {String|Array} attributes
   * @return {this}
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
   * Finishes all current attrimators for the specified attributes. Attribute 
   * names can be given as an array or a space separated string. If no 
   * attributes are given all attributes are assumed.
   *
   * @param {String|Array} attributes
   * @return {this}
   */
	finish: function(attributes)
	{
		return this.attrimatorsFor( attributes, function(attrimator)
		{
			attrimator.finish( this.frame );
		});
	},
  
  /**
   * Pauses all current attrimators for the specified attributes. Attribute 
   * names can be given as an array or a space separated string. If no 
   * attributes are given all attributes are assumed.
   *
   * @param {String|Array} attributes
   * @return {this}
   */
	pause: function(attributes)
	{
		return this.attrimatorsFor( attributes, function(attrimator)
		{
			attrimator.pause();
		});
	},
  
  /**
   * Resumes all current attrimators for the specified attributes. Attribute 
   * names can be given as an array or a space separated string. If no 
   * attributes are given all attributes are assumed.
   *
   * @param {String|Array} attributes
   * @return {this}
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
   * @param {Object} attributes
   * @return {this}
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
   * Unsets the attribute, array of attributes, or object of attributes. 
   * Unsetting involves removing all attrimators and the current value in the 
   * frame,
   * 
   * @param  {String|Array|Object}
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
   * Gets the current attribute values for all attributes specified. The 
   * argument must be an object where the key is the name of an attribute.
   *
   * @param {Object} attributes
   * @return {Object}
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
   * animating. Attrimators that don't have a known end time are not included.
   * If there are no attrimators with end times then zero is returned.
   *
   * @return {Number}
   */
  timeRemaining: function()
  {
    return this.attrimators.timeRemaining();
  },
  
  /**
   * Returns true if there are any attrimators on this Animator.
   *
   * @return {Boolean}
   */
  hasAttrimators: function()
  {
    return this.attrimators.size() > 0;
  },
  
  /**
   * Returns the subject of the Animator optionally passing it through a wrapper
   * function before it's returned.
   *
   * @param [Function] wrapper
   * @return {any}
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
   * Invokes a function with the given context or the context of this Animator 
   * if none is given. This is particularly useful for having a function be 
   * called on deferred statements.
   * 
   * @param  {Function} func
   * @param  [Object] context
   * @param  [Array] args
   * @return {this}
   */
  invoke: function(func, context, args)
  {
    if ( anim8.isFunction( func ) )
    {
      func.apply( context || this, args || [] );
    }

    return this;
  },
	
	/**
	 * Defers the method calls following this one to when the given event type 
   * (on or once) and event. To return this animator you need to call undefer() 
   * as many times as you called defer().
	 *
	 * @param {String} eventType
	 * @param {String} event
   * @param [Function] callback
   * @return {anim8.DeferAnimator}
	 */
	defer: function(eventType, event, callback)
	{
		return new anim8.DeferAnimator( this, this, eventType, event, callback );
	},

  /**
   * Invokes the given callback when the last animation that was 
   * played/queued/transitioned starts.
   * 
   * @param  {Function} callback
   * @param  {Object} context
   * @return {this}
   */
  onCycleStart: function(callback, context)
  {
    this.once( 'cycleStart:' + this.cycleNext, callback, context );

    return this;
  },

  /**
   * Invokes the given callback when the last animation that was
   * played/queued/transitioned ends.
   * 
   * @param  {Function} callback
   * @param  {Object} context
   * @return {this}
   */
  onCycleEnd: function(callback, context)
  {
    this.once( 'cycleEnd:' + this.cycleNext, callback, context );

    return this;
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
