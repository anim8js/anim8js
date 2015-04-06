
/**
 * Animates a single attribute over any period of time.
 */
anim8.Attrimator = function()
{

};

anim8.Attrimator.prototype =
{

  /**
   * Resets this animator for the given attribute created by the given parser.
   * 
   * @param  {attribute} string
   * @param  {anim8.Parser} parser
   */
  reset: function(attribute, parser, next)
  {
    this.attribute = attribute;
    this.parser = parser;
    this.next = next;

    this.startTime = 0;
    this.pauseTime = 0;
    this.paused = false;
    this.cycle = 0;
  },

  /**
   * Prepares this attribute animator for animation on the given subject animator.
   * This is called once in anim8.Animator.preupdate before the first time this
   * animator is updated.
   * 
   * @param  {[type]}
   * @return {[type]}
   */
  start: function(now, animator)
  {
    this.startTime = now;
  },

  /**
   * Updates this attribute animator given a time to animate to and the frame to
   * provide with a new value. This method will return true if the attribute
   * this is animating has been updated and needs to be applied to the subject.
   * 
   * @param  {Number} now
   * @param  {Object} frame
   * @return {Boolean}
   */
  setTime: function(now, frame)
  {
    if ( this.paused )
    {
      return false;
    }

    var value = this.valueAt( now - this.startTime );
    var updated = value !== false;

    if ( updated )
    {
      frame[ this.attribute ] = value;
    }

    return updated;
  },

  /**
   * Returns the amount of time that has elapsed in milliseconds.
   * 
   * @return {Number}
   */
  getElapsed: function()
  {
    return 0;
  },

  /**
   * Returns the value at the given time.
   * 
   * @param  {Number} time
   * @return {any}
   */
  valueAt: function(time)
  {
    return false;
  },

  /**
   * The total amount of time this animator will take. This may be an infinite number.
   * 
   * @return {Number}
   */
  totalTime: function()
  {
    return Number.POSITIVE_INFINITY;
  },

  /**
   * The time remaining before this animator and any following will be finished.
   * 
   * @return {Number}
   */
  timeRemaining: function() 
  {    
    return this.totalTime() + ( this.next ? this.next.timeRemaining() : 0 );
  },

  /**
   * Clones this animator.
   * 
   * @return {anim8.AttributeAnimator}
   */
  clone: function()
  {
    throw 'AttributeAnimator.clone not implemented';
  },

  /**
   * Returns whether this animator has computed values which need to be resolved
   * by the subject animator calling prepare on this attribute animator.
   * 
   * @return {Boolean}
   */
  hasComputed: function()
  {
    return false;
  },

  /**
   * Determines whether this animator will run infinitely.
   * 
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return true;
  },

  /**
   * [pause description]
   * @return {[type]}
   */
  pause: function()
  {
    if ( !this.paused )
    {
      this.pauseTime = anim8.now();
      this.paused = true;
    }
  },

  /**
   * [resume description]
   * @return {[type]}
   */
  resume: function()
  {
    if ( this.paused )
    {
      this.startTime += anim8.now() - this.pauseTime;
      this.paused = false;
    }
  },

  /**
   * [isPaused description]
   * @return {Boolean}
   */
  isPaused: function()
  {
    return this.paused;
  },

  /**
   * Sets the final state of the animator to the frame if one exists.
   * 
   * @param  {Object}
   * @return {Boolean}
   */
  finish: function(frame)
  {
    return false;
  },

  /**
   * [isFinished description]
   * @return {Boolean}
   */
  isFinished: function()
  {
    return false;
  },

  /**
   * Returns the parser that created this animator (if any).
   * 
   * @return {anim8.Parser}
   */
  getParser: function()
  {
    return this.parser;
  },

  /**
   * 
   * @param  {Function}
   * @return {[type]}
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
    }
  }

};