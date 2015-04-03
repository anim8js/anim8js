
/**
 * [EventState description]
 * @type {[type]}
 */
anim8.EventState = 
{
  CREATED: 0,
  DELAYED: 1,
  ANIMATING: 2,
  SLEEPING: 4,
  PAUSED: 8,
  FINISHED: 16
};

/**
 * [Event description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {Boolean}
 * @param {[type]}
 * @param {Function}
 */
anim8.Event = function(attribute, path, duration, easing, delay, sleep, repeat, scale, scaleBase, hasInitialState, parser, next) 
{
  if ( attribute )
  {
    this.attribute        = attribute;
    this.path             = path;
    this.easing           = anim8.easing( easing );
    this.delay            = anim8.delay( delay );
    this.duration         = anim8.duration( duration );
    this.sleep            = anim8.sleep( sleep );
    this.repeat           = anim8.repeat( repeat );
    this.scale            = anim8.scale( scale );
    this.scaleBase        = path.calculator.parse( scaleBase, path.calculator.create() );
    this.hasInitialState  = anim8.coalesce( hasInitialState, true );
    this.parser           = parser;
    this.next             = next; 
  }
};

anim8.Event.prototype = 
{
  /**
   * [newInstance description]
   * @return {[type]}
   */
  newInstance: function()
  {
    return new anim8.EventInstance( this );
  },

  /**
   * [isInstance description]
   * @return {Boolean}
   */
  isInstance: function()
  {
    return false
  },

  /**
   * [getParser description]
   * @return {[type]}
   */
  getParser: function()
  {
    return this.parser;
  },

  /**
   * [totalTime description]
   * @return {[type]}
   */
	totalTime: function()
	{
		return this.delay + (this.repeat * this.duration) + ((this.repeat - 1) * this.sleep);
	},

  /**
   * [clone description]
   * @return {[type]}
   */
  clone: function()
  {
    return new anim8.Event( this.attribute, this.path, this.duration, this.easing, this.delay, this.sleep, this.repeat, this.scale, this.scaleBase, this.hasInitialState, this.parser, this.next ? this.next.clone() : null );
  },

  /**
   * [isInfinite description]
   * @return {Boolean}
   */
  isInfinite: function()
  {
    return (this.repeat === Number.POSITIVE_INFINITY);
  },

  /**
   * [timeRemaining description]
   * @return {[type]}
   */
  timeRemaining: function() 
  {    
    return this.totalTime();
  },

  /**
   * [timeRemainingInChain description]
   * @return {[type]}
   */
  timeRemainingInChain: function()
  {
    return this.timeRemaining() + (this.next ? this.next.timeRemainingInChain() : 0);
  },

  /**
   * [finiteTimeRemaining description]
   * @return {[type]}
   */
  finiteTimeRemaining: function()
  {
    return this.isInfinite() ? 0 : this.timeRemaining();
  },

  /**
   * [finiteTimeRemainingInChain description]
   * @return {[type]}
   */
  finiteTimeRemainingInChain: function()
  {
    return this.isInfinite() ? 0 : this.timeRemaining() + (this.next ? this.next.finiteTimeRemainingInChain() : 0);
  },

  /**
   * [hasTrue description]
   * @return {Boolean}
   */
  hasTrue: function()
  {
    return this.path.trues;
  },

  /**
   * [queue description]
   * @param  {[type]}
   * @return {[type]}
   */
  queue: function(e)
  {
    if ( this.next )
    {
      this.next.queue( e );
    }
    else
    {
      this.next = e;
    }
  }

};
