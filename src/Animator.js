
/**
 * Instantiates a new Animator given a subject to animate.
 *
 * @param {Any} e
 * @class Animator
 * @constructor
 * @extends anim8.eventize
 */
function Animator(e)
{
  this.reset( e );
}

/**
 * The event triggered after preupdate is called. Pre-update is used to run any
 * preparations on the subject before updates are made and attributes are
 * applied.
 *
 * @event preupdate
 */

/**
 * The event triggered after all attrimators are updated and any new values
 * have been applied to the current values (frame) on the animator.
 *
 * @event update
 */

/**
 * The event triggered after the current values (frame) on the animator are
 * applied to the subject.
 *
 * @event apply
 */

/**
 * The event triggered when the given animation cycle starts (and initial
 * values are applied) for all attrimators in the cycle.
 *
 * @event cycleStart:#
 * @param {Number} cycleID
 */

/**
 * The event triggered when the given animation cycle ends which occurs when the
 * last attrimator for an animation finishes or is interrupted by commands like
 * play, queue, transition, end, finish, & stop.
 *
 * @event cycleEnd:#
 * @param {Number} cycleID
 */

/**
 * The event triggered when all animations on the animator have finished.
 *
 * @event finished
 * @param {Animator} animator
 */

/**
 * The event triggered when an animator is deactivated which occurs when an
 * animator has finished animating and is being taken off the list of live
 * animators (anim8.animating).
 *
 * @event deactivate
 */

/**
 * The event triggered after the user calls destroy on an animator.
 *
 * @event destroyed
 */

Class.define( Animator,
{

  /**
   * Resets the animator given a subject to animate.
   *
   * @method reset
   * @param {Any} subject
   * @chainable
   * @protected
   */
  reset: function(subject)
  {
    /**
     * The subject which is being animated.
     *
     * @property {Any} subject
     */
    this.subject = subject;

    /**
     * The map of attrimators animating the subject.
     *
     * @property {AttrimatorMap} attrimators
     */
    this.attrimators = new AttrimatorMap();

    /**
     * The array of attrimators recently added to the animator that
     * are ready to be started.
     *
     * @property {Array} attrimatorsAdded
     * @protected
     */
    this.attrimatorsAdded = [];

    /**
     * The object which stores the attribute values being animated.
     *
     * @property {Object} frame
     */
    this.frame = {};

    /**
     * The object which stores the attributes last updated.
     *
     * @property {Object} updated
     */
    this.updated = {};

    /**
     * Whether or not this animator has completely finished animating it's subject.
     *
     * @property {Boolean} finished
     */
    this.finished = false;

    /**
     * The factory which created this Animator given a subject.
     *
     * @property {Factory} factory
     */
    this.factory = null;

    /**
     * Whether or not this animator is actively being updated.
     *
     * @property {Boolean} active
     */
    this.active = false;

    /**
     * The current cycle being animated. Multiple cycles can be animated at once, this is the first one.
     *
     * @property {Number} cycleCurrent
     * @protected
     */
    this.cycleCurrent = 0;

    /**
     * The ID of the next cycle of animations to be added to this Animator.
     *
     * @property {Number} cycleNext
     * @protected
     */
    this.cycleNext = 0;

    /**
     * The last cycle that was ended.
     *
     * @property {Number} cycleEnded
     * @protected
     */
    this.cycleEnded = 0;

    return this;
  },

  /**
   * Starts a new animation cycle. This is done before events & springs are
   * placed to group them together so we know when to apply their initial value.
   *
   * @method newCycle
   * @param {Attrimator|AttrimatorMap} attrimators
   * @chainable
   * @protected
   */
  newCycle: function(attrimators)
  {
    this.cycleNext++;

    if ( attrimators instanceof AttrimatorMap )
    {
      this.cycleNext = attrimators.applyCycle( this.cycleNext );
    }
    else if ( attrimators instanceof Attrimator )
    {
      attrimators.cycle = this.cycleNext;
    }

    return this;
  },

  /**
   * Applies the current cycle. This involves finding all attrimators with the
   * same cycle identifier and applying their initial state.
   *
   * @method applyCurrentCycle
   * @chainable
   * @protected
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
   * @method endCurrentCycle
   * @chainable
   * @protected
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
   * @method getAttribute
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
   * @method restore
   * @chainable
   */
  restore: function()
  {
    return this;
  },

  /**
   * Applies the initial state of recently added attrimators immediately.
   *
   * @method applyInitialState
   * @chainable
   */
  applyInitialState: function()
  {
    var currentTime = now();

    this.preupdate( currentTime );
    this.update( currentTime );
    this.apply();

    return this;
  },

  /**
   * A method thats invoked along with all other animators before updates are
   * called. This is used to make any necessary preparations before the animator
   * is updated.
   *
   * @method preupdate
   * @param {Number} now
   * @chainable
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
   * @method setDefault
   * @param {String} attr
   * @protected
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
   * @method update
   * @param {Number} now
   * @chainable
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
   * @method placeAttrimator
   * @param {Attrimator} attrimator
   * @return {Attrimator}
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
   * @method apply
   * @chainable
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
   * @method trimAttrimators
   * @chainable
   * @protected
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
   * @method value
   * @param {String} attr
   * @return {Any}
   */
  value: function(attr)
  {
    return this.frame[ attr ];
  },

  /**
   * Activates this Animator by adding it to the main loop if it isn't there
   * already.
   *
   * @method activate
   * @chainable
   */
  activate: function()
  {
    activateAnimator( this );

    return this;
  },

  /**
   * A method that is invoked when an animator is finished and is being removed
   * from the list of currently animating Animators.
   *
   * @method deactivate
   * @chainable
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
   * @method destroy
   * @chainable
   */
  destroy: function()
  {
    this.finished = true;

    this.factory.destroy( this );

    this.trigger('destroyed');

    return this;
  },

  /**
   * Adds a spring to this animator replacing any existing attrimator for the
   * same attribute. A spring object can be given, an instance of anim8.Spring,
   * or a name of a saved Spring. The spring added to the animator is returned.
   *
   * @method spring
   * @param {Spring|String|Object} spring
   * @return {Spring}
   */
  spring: function(spring)
  {
    var spring = $spring( spring );

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
   * animated will be stopped and replaced with the new attrimators. If `all` is
   * true then any attrimators animating not specified in the given animation
   * will be stopped.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method play
   * @param {Animation|String|Object} animation
   * @param {String|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  play: function(animation, options, all, cache)
  {
    var attrimatorMap = $attrimatorsFor( animation, options, cache, this );

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
   * @method playAttrimators
   * @param {AttrimatorMap} animatorMap
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  playAttrimators: function(attrimatorMap, all)
  {
    if ( all )
    {
      this.attrimators.finishNotPresent( attrimatorMap, 0 );
    }

    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      this.placeAttrimator( attrimators[i] );
    }

    return this;
  },

  /**
   * Unplays an animation. Attributes in the animation that are currently being
   * animated will be transitioned to their starting values. If `all` is true
   * then any attrimators animating not specified in the given animation will be
   * stopped.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method unplay
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} transition
   * @param {String|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  unplay: function(animation, transition, options, all, cache)
  {
    var transition = $transition( transition );
    var attrimatorMap = $attrimatorsFor( animation, options, cache, this );

    this.unplayAttrimators( attrimatorMap, transition, all );

    return this.activate();
  },

  /**
   * Unplays a map of attrimators. Attributes in the attrimator map that are
   * currently being animated will be transitioned to their starting values.
   * If "all" is true then any attrimators animating not specified
   * in the given attrimator map will be stopped. This method will not activate
   * the Animator, that has to be done manually.
   *
   * @method unplayAttrimators
   * @param {AttrimatorMap} attrimatorMap
   * @param {Object} transition
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  unplayAttrimators: function(attrimatorMap, transition, all)
  {
    var unplayAttrimators = new AttrimatorMap();
    var attrimators = attrimatorMap.values;
    var startings = {};

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;

      if ( attrimator.startCycle( startings ) )
      {
        unplayAttrimators.put( attr, new Oncer( attr, startings[ attr ], 0, true ) );
      }
    }

    this.newCycle( unplayAttrimators );
    this.transitionAttrimators( transition, unplayAttrimators, all );

    return this;
  },

  /**
   * Queues an animation. The attrimators generated from the given animation
   * will be started at the same time - as soon as all finite attrimators for
   * the same attributes are finished. Any infinite attrimators will be
   * automatically stopped when all queued attrimators are set to start.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method queue
   * @param {Animation|String|Object} animation
   * @param {String|Object} [options]
   * @param {Boolean} [cache]
   * @chainable
   */
  queue: function(animation, options, cache)
  {
    var attrimatorMap = $attrimatorsFor( animation, options, cache, this );

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
   * @method queueAttrimators
   * @param {AttrimatorMap} attrimatorMap
   * @chainable
   * @protected
   */
  queueAttrimators: function(attrimatorMap)
  {
    this.attrimators.queueMap( attrimatorMap, 0, this.placeAttrimator, this );

    return this;
  },

  /**
   * Inserts an animation. The attrimators generated from the given animation
   * will play now and any existing attrimators will be queued behind it. If
   * the given animation has an infinite attrimator for an existing attribute
   * it will be stopped in time for the current animation to finish playing. If
   * the given animation has an infinite attrimator for an attribute which is
   * not animating then the attrimator will continue to play infinitely.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method insert
   * @param {Animation|String|Object} animation
   * @param {String|Object} [options]
   * @param {Boolean} [cache]
   * @chainable
   */
  insert: function(animation, options, cache)
  {
    var attrimatorMap = $attrimatorsFor( animation, options, cache, this );

    this.newCycle( attrimatorMap );
    this.insertAttrimators( attrimatorMap );

    return this.activate();
  },

  /**
   * Inserts a map of attrimators. The attrimators generated from the given
   * animation will play now and any existing attrimators will be queued behind
   * it. If the given animation has an infinite attrimator for an existing
   * attribute it will be stopped in time for the current animation to finish
   * playing. If the given animation has an infinite attrimator for an attribute
   * which is not animating then the attrimator will continue to play
   * infinitely.
   *
   * @method insertAttrimators
   * @param {AttrimatorMap} attrimatorMap
   * @chainable
   * @protected
   */
  insertAttrimators: function(attrimatorMap)
  {
    this.attrimators.insertMap( attrimatorMap, this.placeAttrimator, this );

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
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method transition
   * @param {String|Array|Object} transition
   * @param {String|Object|Animation} animation
   * @param {Object} [options]
   * @param {Boolean} [all]
   * @param {Boolean} [cache]
   * @chainable
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = $transition( transition );
    var attrimatorMap = $attrimatorsFor( animation, options, cache, this );

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
   * @method transitionAttrimators
   * @param {Object} transition
   * @param {AttrimatorMap} attrimatorMap
   * @param {Boolean} [all]
   * @chainable
   * @protected
   */
  transitionAttrimators: function(transition, attrimatorMap, all)
  {
    if ( all )
    {
      this.attrimators.finishNotPresent( attrimatorMap, transition.time );
    }

    this.attrimators.transitionMap(
      transition,
      attrimatorMap,
      this.transitionGetValue,
      this.getAttribute,
      this.placeAttrimator,
      this.transitionGetValueAt,
      this.transitionStopAttrimator,
      this
    );

    return this;
  },

  transitionGetValue: function(attr)
  {
    return this.frame[ attr ];
  },

  transitionGetValueAt: function(attrimator, relativeTime, out)
  {
    return attrimator.valueAt( attrimator.getElapsed() + relativeTime, out );
  },

  transitionStopAttrimator: function(attrimator, relativeTime)
  {
    attrimator.stopIn( relativeTime );
  },

  /**
   * Tweens a single attribute to a target value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenTo
   * @param {String} attr
   * @param {T} target
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenTo: function(attr, target, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var end       = attribute.parse( target );
    var path      = new Tween( attr, attribute.calculator, computed.current, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes to target values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyTo
   * @param {Object} targets
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenManyTo: function(targets, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in targets )
    {
      var attribute = this.getAttribute( attr );
      var end       = attribute.parse( targets[ attr ] );
      var path      = new Tween( attr, attribute.calculator, computed.current, end );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Tweens a single attribute from a starting value to the current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenFrom
   * @param {String} attr
   * @param {T} starting
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenFrom: function(attr, starting, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starting );
    var path      = new Tween( attr, attribute.calculator, start, computed.current );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes from starting values to the current values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyFrom
   * @param {Object} startings
   * @param {String|Array|Object} [options]
   * @chainable
   */
  tweenManyFrom: function(startings, options)
  {
    var options = $options( options );

    this.newCycle();

    for ( var attr in startings )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( startings[ attr ] );
      var path      = new Tween( attr, attribute.calculator, start, computed.current );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tween
   * @param {String} attr
   * @param {T} starts
   * @param {T} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tween: function(attr, starts, ends, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var start     = attribute.parse( starts );
    var end       = attribute.parse( ends );
    var path      = new Tween( attr, attribute.calculator, start, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Tweens multiple attributes from starting values to ending values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenMany
   * @param {Object} starts
   * @param {Object} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  tweenMany: function(starts, ends, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in starts )
    {
      var attribute = this.getAttribute( attr );
      var start     = attribute.parse( starts[ attr ] );
      var end       = attribute.parse( ends[ attr ] );
      var path      = new Tween( attr, attribute.calculator, start, end );
      var event     = Event.fromOptions( attr, path, options );

      event.cycle = this.cycleNext;
      this.placeAttrimator( event );
    }

    return this.activate();
  },

  /**
   * Moves an attribute relative to its current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method move
   * @param {String} attr
   * @param {T} amount
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  move: function(attr, amount, options, cache)
  {
    var options   = $options( options, cache );
    var attribute = this.getAttribute( attr );
    var relative  = attribute.parse( amount );
    var start     = computed.current;
    var end       = isComputed( relative ) ? relative : computed.relative( relative );
    var path      = new Tween( attr, attribute.calculator, start, end );
    var event     = Event.fromOptions( attr, path, options );

    this.newCycle( event );
    this.placeAttrimator( event );

    return this.activate();
  },

  /**
   * Moves multiple attribute relative to their current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method moveMany
   * @param {Object} amounts
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  moveMany: function(amounts, options, cache)
  {
    var options = $options( options, cache );

    this.newCycle();

    for ( var attr in amounts )
    {
      var attribute = this.getAttribute( attr );
      var relative  = attribute.parse( amounts[ attr ] );
      var start     = computed.current;
      var end       = isComputed( relative ) ? relative : computed.relative( relative );
      var path      = new Tween( attr, attribute.calculator, start, end );
      var event     = Event.fromOptions( attr, path, options );

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
   * @method ref
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

      if ( isDefined( current[ attr ] ) )
      {
        return current[ attr ];
      }

      return attribute.defaultValue;
    };
  },

  /**
   * Follows the attribute along the given path definition.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method follow
   * @param {String} attr
   * @param {Path|Object|String} path
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  follow: function(attr, path, options, cache)
  {
    var options = $options( options, cache );
    var path    = $path( path );
    var event   = Event.fromOptions( attr, path, options );

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
   * @method attrimatorsFor
   * @param {String|Array|Object} attributes
   * @param {Function} callback
   * @return {this|Array}
   */
  attrimatorsFor: function(attributes, callback)
  {
    var attrimatorMap = this.attrimators;
    var attributes = toArray( coalesce( attributes, attrimatorMap.keys ), ' ' );
    var resulting = !isFunction( callback );
    var results = [];

    for (var i = attributes.length - 1; i >= 0; i--)
    {
      var attr = attributes[ i ];
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

    return resulting ? results : this;
  },

  /**
   * Stops all attributes for the specified attributes. Attribute names can be
   * given as an array or a space separated string. If no attributes are given
   * all attributes are assumed.
   *
   * @method stop
   * @param {String|Array|Object} [attributes]
   * @chainable
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
   * @method end
   * @param {String|Array|Object} [attributes]
   * @chainable
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
   * @method finish
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  finish: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.finish( this.frame );
    });
  },

  /**
   * Calls nopeat on all current attrimators for the specified attributes.
   * Attribute names can be given as an array or a space separated string. If
   * no attributes are given all attributes are assumed.
   *
   * **See:** {{#crossLink "Attrimator/nopeat:method"}}Attrimator.nopeat{{/crossLink}}
   *
   * @method nopeat
   * @param {String|Array|Object} [attributes]
   * @chainable
   */
  nopeat: function(attributes)
  {
    return this.attrimatorsFor( attributes, function(attrimator)
    {
      attrimator.nopeat();
    });
  },

  /**
   * Pauses all current attrimators for the specified attributes. Attribute
   * names can be given as an array or a space separated string. If no
   * attributes are given all attributes are assumed.
   *
   * @method pause
   * @param {String|Array|Object} [attributes]
   * @chainable
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
   * @method resume
   * @param {String|Array|Object} [attributes]
   * @chainable
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
   * @method set
   * @param {Object} attributes
   * @chainable
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
   * @method unset
   * @param {String|Array|Object} attributes
   * @chainable
   */
  unset: function(attributes)
  {
    var attributes = toArray( coalesce( attributes, this.frame ), ' ' );

    for (var i = attributes.length - 1; i >= 0; i--)
    {
      var attr = attributes[ i ];

      this.attrimators.remove( attr );

      delete this.frame[ attr ];
    }

    return this;
  },

  /**
   * Gets the current attribute values for all attributes specified. The
   * argument must be an object where the key is the name of an attribute.
   *
   * @method get
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
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    return this.attrimators.timeRemaining();
  },

  /**
   * Returns true if there are any attrimators on this Animator.
   *
   * @method hasAttrimators
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
   * @method getSubject
   * @param {Function} [wrapper]
   * @return {Any}
   */
  getSubject: function(wrapper)
  {
    var subject = this.subject;

    if ( isFunction( wrapper ) )
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
   * @method invoke
   * @param {Function} func
   * @param {Object} [context]
   * @param {Array} [args]
   * @chainable
   */
  invoke: function(func, context, args)
  {
    if ( isFunction( func ) )
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
   * @method defer
   * @param {String} eventType
   * @param {String} event
   * @param {Function} [callback]
   * @return {DeferAnimator}
   */
  defer: function(eventType, event, callback)
  {
    return new DeferAnimator( this, this, eventType, event, callback );
  },

  /**
   * Invokes the given callback when the last animation that was
   * played/queued/transitioned starts.
   *
   * @method onCycleStart
   * @param {Function} callback
   * @param {Object} [context]
   * @chainable
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
   * @method onCycleEnd
   * @param {Function} callback
   * @param {Object} [context]
   * @chainable
   */
  onCycleEnd: function(callback, context)
  {
    this.once( 'cycleEnd:' + this.cycleNext, callback, context );

    return this;
  }

});

/**
 * Adds the following event methods to Animators: on, once, off, trigger.
 */
eventize( Animator.prototype );
