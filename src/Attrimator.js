
/**
 * Animates a single attribute over any period of time.
 *
 * @class Attrimator
 * @constructor
 */
function Attrimator()
{

}

Class.define( Attrimator,
{

  /**
   * Resets this attrimator for the given attribute created by the given builder.
   *
   * @method reset
   * @param {String} attribute
   * @param {Builder} builder
   * @param {Attrimator} [next]
   */
  reset: function(attribute, builder, next)
  {
    /**
     * The name of the attribute this attrimator is animating.
     *
     * @property {String} attribute
     */
    this.attribute = attribute;

    /**
     * The builder that created this attrimator (if any).
     *
     * @property {Builder} builder
     */
    this.builder = builder;

    /**
     * The next attrimator to be played once this one has finished.
     *
     * @property {Attrimator} next
     */
    this.next = next;

    /**
     * The time the attrimator was started by the animator.
     *
     * @property {Number} startTime
     */
    this.startTime = 0;

    /**
     * The time the attrimator was last paused.
     *
     * @property {Number} pauseTime
     */
    this.pauseTime = 0;

    /**
     * The amount of time that has elapsed since the attrimator started.
     *
     * @property {Number} elapsed
     */
    this.elapsed = 0;

    /**
     * The time this attrimator should stop itself after it started in milliseconds.
     *
     * @property {Number} stopTime
     */
    this.stopTime = Number.POSITIVE_INFINITY;

    /**
     * Whether or not the attrimator is paused.
     *
     * @property {Boolean} paused
     */
    this.paused = false;

    /**
     * The cycle this attrimator belongs to.
     *
     * @type {Number} cycle
     */
    this.cycle = 0;

    /**
     * The amount of time in milliseconds this attrimator is delayed since start.
     *
     * @property {Number} delay
     */
    this.delay = 0;

    /**
     * The initial elapsed time in milliseconds when the attrimator is started.
     *
     * @property {Number} offset
     */
    this.offset = 0;
  },

  /**
   * Prepares this attrimator for animation on the given subject animator. This
   * is called as early as possible to establish the start time of the
   * attrimator so when the user isn't on the page time can be kept accurately.
   *
   * @param {Number} now
   * @param {Animator} animator
   */
  prestart: function(now)
  {
    if ( this.startTime === 0 )
    {
      this.startTime = now - this.offset;
      this.elapsed = this.offset;
      this.finished = false;
      this.prestartNext();
    }
  },

  /**
   * Calls {{#crossLink "Attrimator/prestart:method"}}{{/crossLink}} on the next
   * attrimator if it can be called.
   *
   * @method prestartNext
   */
  prestartNext: function( overrideNext )
  {
    // If there is a next attrimator and this attrimator has been prestarted...
    if ( this.next && this.startTime !== 0 )
    {
      // If override next is specified, clear next's startTime
      if ( overrideNext )
      {
        this.next.startTime = 0;
      }

      // We can only prestart next if it has no startTime.
      if ( this.next.startTime === 0 )
      {
        var totalTime = this.totalTime();

        // If this attrimator has a finite total amount of time, it's end can be calculated.
        if ( !isNaN( totalTime ) )
        {
          this.next.prestart( this.startTime + totalTime );
        }
      }
    }
  },

  /**
   * Prepares this attrimator for animation on the given subject
   * animator. This is called once in anim8.Animator.preupdate before the first
   * time this attrimator is updated.
   *
   * @method start
   * @param {Number} now
   * @param {Animator} animator
   */
  start: function(now, animator)
  {
    this.prestart( now );
  },

  /**
   * Invoked once when a new animation cycle is started on an Animator. If this
   * attrimator updated the frame true must be returned.
   *
   * @method startCycle
   * @param {Object} frame
   * @return {Boolean}
   */
  startCycle: function(frame)
  {
    return false;
  },

  /**
   * Updates this attrimator given a time to animate to and the frame to
   * provide with a new value. This method will return true if the attribute
   * this is animating has been updated and needs to be applied to the subject.
   *
   * @method setTime
   * @param {Number} now
   * @param {Object} frame
   * @return {Boolean}
   */
  setTime: function(now, frame)
  {
    if ( this.paused )
    {
      return false;
    }

    var updated = false;
    var elapsed = now - this.startTime;
    var updated = false;

    if ( elapsed > this.stopTime )
    {
      updated = this.finish( frame );
    }
    else if ( elapsed >= this.delay )
    {
      updated = this.update( elapsed, frame );
    }

    this.elapsed = elapsed;

    return updated;
  },

  /**
   * Updates the attrimator given elapsed time in milliseconds, the frame to
   * apply a value to, and returns whether the frame was updated or not.
   *
   * @method update
   * @param {Number} elapsed
   * @param {Object} frame
   * @return {Boolean}
   */
  update: function(elapsed, frame)
  {
    throw 'Attrimator.update not implemented';
  },

  /**
   * Returns the amount of time that has elapsed in milliseconds.
   *
   * @method getElapsed
   * @return {Number}
   */
  getElapsed: function()
  {
    return this.elapsed;
  },

  /**
   * Stops this attrimator in the given number of milliseconds.
   *
   * @method stopIn
   * @param {Number} milliseconds
   * @chainable
   */
  stopIn: function(milliseconds)
  {
    this.stopTime = this.getElapsed() + milliseconds;

    return this;
  },

  /**
   * If this attrimator repeats its animation this method will stop repitition
   * after the next animation cycle.
   *
   * @chainable
   */
  nopeat: function()
  {
    return this;
  },

  /**
   * Returns the value at the given time or returns false if it can't be
   * calculated.
   *
   * @method valueAt
   * @param {Number} time
   * @param {Any} out
   * @return {Any|False}
   */
  valueAt: function(time, out)
  {
    return false;
  },

  /**
   * The total amount of time this attrimator will take in milliseconds. This
   * may be an infinite number.
   *
   * @method totalTime
   * @return {Number}
   */
  totalTime: function()
  {
    return this.stopTime;
  },

  /**
   * The time remaining before this attrimator and any following will be
   * finished.
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    return this.totalTime() - this.elapsed + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * Clones this attrimator.
   *
   * @method clone
   * @return {Attrimator}
   */
  clone: function()
  {
    throw 'AttributeAnimator.clone not implemented';
  },

  /**
   * Returns whether this attrimator has computed values which need to be
   * resolved by the subject animator calling prepare on this attrimator.
   *
   * @method hasComputed
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return false;
  },

  /**
   * Determines whether this attrimator will run infinitely.
   *
   * @method isInfinite
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return !isFinite( this.stopTime );
  },

  /**
   * Pauses this attrimator if it isn't already paused.
   *
   * @method pause
   * @chainable
   */
  pause: function()
  {
    if ( !this.paused )
    {
      this.pauseTime = now();
      this.paused = true;
    }

    return this;
  },

  /**
   * Resumes this attrimator if it's paused. This involves resetting the start
   * time of the attrimator.
   *
   * @method resume
   * @chainable
   */
  resume: function()
  {
    if ( this.paused )
    {
      var totalPausedTime = now() - this.pauseTime;
      var delay = this;

      while ( delay && delay.startTime !== 0 )
      {
        delay.startTime += totalPausedTime;
        delay = delay.next;
      }

      this.paused = false;
    }

    return this;
  },

  /**
   * Whether this attrimator is paused.
   *
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function()
  {
    return this.paused;
  },

  /**
   * Sets the final state of the attrimator to the frame if one exists and
   * returns true, otherwise false is returned and frame remains unchanged.
   *
   * @method finish
   * @param {Object} frame
   * @return {Boolean}
   */
  finish: function(frame)
  {
    return false;
  },

  /**
   * Whether this attrimator is finished.
   *
   * @method isFinished
   * @return {Boolean}
   */
  isFinished: function()
  {
    return false;
  },

  /**
   * Returns the builder that created this attrimator (if any).
   *
   * @method getBuilder
   * @return {Builder}
   */
  getBuilder: function()
  {
    return this.builder;
  },

  /**
   * Places the given attrimator on the end of the chain of attrimators starting
   * with this attrimator.
   *
   * @method queue
   * @param {Attrimator} next
   * @chainable
   */
  queue: function(next)
  {
    if ( this.next )
    {
      this.next.queue( next );
    }
    else
    {
      this.next = next;
      this.prestartNext();
    }

    return this;
  },

  /**
   * Parses a value with the calculator given a default value to fallback on.
   *
   * @method parseValue
   * @param {Animator} animator
   * @param {T|Function|True} value
   * @param {T} defaultValue
   * @return {T|Function}
   */
  parseValue: function(animator, value, defaultValue)
  {
    var parsed = this.calculator.parse( value, defaultValue );

    if ( isComputed( parsed ) )
    {
       parsed = parsed( this, animator );
    }

    return parsed;
  }

});
