
/**
 * Instantiates an Array of {{#crossLink "Animator"}}{{/crossLink}} instances.
 * 
 * @param {Array} [input]
 * @class Animators
 * @constructor
 * @extends {Array}
 */
anim8.Animators = function(input)
{
  if ( anim8.isArray( input ) )
  {
    this.fill( input );
  }
};

/**
 * Animators is an instance of Array. All array methods are supported.
 */
anim8.override( anim8s.fn = anim8.Animators.prototype = new Array(),
{

  /**
   * Invokes a callback for each element in the array.
   *
   * @method each
   * @param {Function} iterator
   * @param {Object} context
   * @chainable
   */
  each: function(iterator, context) 
  {
    for (var i = 0; i < this.length; i++) 
    {
      if ( iterator.call( context || this[i], this[i], i ) === false ) 
      {
        break;
      }
    }
    
    return this;
  },

  /**
   * Appends the array of animators given to the end of this array.
   *
   * @method fill
   * @param {Array} animators
   * @chainable
   */
  fill: function(animators)
  {
    for (var i = 0; i < animators.length; i++)
    {
      this.push( animators[i] );
    }

    return this;
  },

  /**
   * Invokes a callback for each element in the array and if a true value is
   * returned  that element is removed from the array.
   *
   * @method filter
   * @param {Function} filterer
   * @chainable
   */
  filter: function(filterer)
  {  
    var alive = 0;
    
    for (var i = 0; i < this.length; i++)
    {
      var remove = filterer( this[i] );
      
      if ( !remove )
      {
        this[alive++] = this[i];
      }
    }
    
    this.length = alive;
    
    return this;
  },

  /**
   * Returns the subjects of the Animators optionally passing them through a 
   * wrapper function before it's returned.
   *
   * @method getSubjects
   * @param {Function} [wrapper]
   * @return {Any}
   */
  getSubjects: function(wrapper)
  {
    var subjects = [];

    for (var i = 0; i < this.length; i++)
    {
      subjects.push( this[i].subject );
    }

    if ( anim8.isFunction( wrapper ) )
    {
      subjects = wrapper( subjects );
    }
    
    return subjects;
  },

  /**
   * Returns the first animator in the array.
   *
   * @method first
   * @return {Animator}
   */
  first: function()
  {
    return this[0];
  },

  /**
   * Reverses the order of animators in the array.
   *
   * @method reverse
   * @chainable
   */
  reverse: function()
  {
    var last = this.length - 1;
    var mid = Math.floor( this.length / 2 );

    for (var i = 0; i < mid; i++)
    {
      var e0 = this[ i ];
      var e1 = this[ last - i ];

      this[ i ] = e1;
      this[ last - i ] = e0;
    }

    return this;
  },

  /**
   * Activates all Animators in the array if they aren't active already.
   *
   * @method activate
   * @chainable
   */
  activate: function()
  {
    for (var i = 0; i < this.length; i++)
    {
      var animator = this[i];

      if ( !animator.active )
      {
        animator.active = true;
        anim8.animating.push( animator ); 
      }
    }
    
    if ( !anim8.running )
    {
      anim8.running = true;
      anim8.trigger('starting');
      anim8.requestRun( anim8.run );
    }
    
    return this;
  },

  /**
   * Creates a sequence of events separated by a delay.
   *
   * @method sequence
   * @param {String|Number} delay
   * @param {String|Array|Function} easing
   * @return {Sequence}
   */
  sequence: function(delay, easing)
  {
    return new anim8.Sequence( this, delay, easing );
  },

  /**
   * Returns the maximum time remaining out of all Animators in the array.
   *
   * **See:** {{#crossLink "Animating/timeRemaining:method"}}{{/crossLink}}
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function()
  {
    var maxRemaining = 0;

    for (var i = 0; i < this.length; i++)
    {
      maxRemaining = Math.max( maxRemaining, this[ i ].timeRemaining() );
    }

    return maxRemaining;
  },

  /**
   * Calls {{#crossLink "Animator/restore:method"}}{{/crossLink}} on each 
   * animator in the array and returns this.
   * 
   * @method restore
   * @chainable
   */
  restore               : anim8.delegate( 'restore', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/placeAttrimator:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method placeAttrimator
   * @chainable
   */
  placeAttrimator       : anim8.delegate( 'placeAttrimator', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method applyInitialState
   * @chainable
   */
  applyInitialState     : anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/preupdate:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method preupdate
   * @chainable
   */
  preupdate             : anim8.delegate( 'preupdate', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/update:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method update
   * @chainable
   */
  update                : anim8.delegate( 'update', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/apply:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method apply
   * @chainable
   */
  apply                 : anim8.delegate( 'apply', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/trimAttrimators:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method trimAttrimators
   * @chainable
   */
  trimAttrimators       : anim8.delegate( 'trimAttrimators', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/activate:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method activate
   * @chainable
   */
  activate              : anim8.delegate( 'activate', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/deactivate:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method deactivate
   * @chainable
   */
  deactivate            : anim8.delegate( 'deactivate', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/destroy:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method destroy
   * @chainable
   */
  destroy               : anim8.delegate( 'destroy', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/spring:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method spring
   * @chainable
   */
  spring                : anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS ),

  /**
   * Calls {{#crossLink "Animator/play:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method play
   * @chainable
   */
  play                  : anim8.delegate( 'play', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/playAttrimators:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method playAttrimators
   * @chainable
   * @protected
   */
  playAttrimators       : anim8.delegate( 'playAttrimators', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/queue:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method queue
   * @chainable
   */
  queue                 : anim8.delegate( 'queue', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/queueAttrimators:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method queueAttrimators
   * @chainable
   * @protected
   */
  queueAttrimators      : anim8.delegate( 'queueAttrimators', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/transition:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method transition
   * @chainable
   */
  transition            : anim8.delegate( 'transition', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/transitionAttrimators:method"}}{{/crossLink}} 
   * on each animator in the array and returns this.
   * 
   * @method transitionAttrimators
   * @chainable
   * @protected
   */
  transitionAttrimators : anim8.delegate( 'transitionAttrimators', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tween:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tween
   * @chainable
   */
  tween                 : anim8.delegate( 'tween', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenTo:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tweenTo
   * @chainable
   */
  tweenTo               : anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenFrom:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tweenFrom
   * @chainable
   */
  tweenFrom             : anim8.delegate( 'tweenFrom', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenMany:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tweenMany
   * @chainable
   */
  tweenMany             : anim8.delegate( 'tweenMany', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyTo:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tweenManyTo
   * @chainable
   */
  tweenManyTo           : anim8.delegate( 'tweenManyTo', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyFrom:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method tweenManyFrom
   * @chainable
   */
  tweenManyFrom         : anim8.delegate( 'tweenManyFrom', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/move:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method move
   * @chainable
   */
  move                  : anim8.delegate( 'move', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/moveMany:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method moveMany
   * @chainable
   */
  moveMany              : anim8.delegate( 'moveMany', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/follow:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method follow
   * @chainable
   */
  follow                : anim8.delegate( 'follow', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/attrimatorsFor:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method attrimatorsFor
   * @chainable
   */
  attrimatorsFor        : anim8.delegate( 'attrimatorsFor', anim8.delegate.RETURN_RESULTS ),

  /**
   * Calls {{#crossLink "Animator/stop:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method stop
   * @chainable
   */
  stop                  : anim8.delegate( 'stop', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/end:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method end
   * @chainable
   */
  end                   : anim8.delegate( 'end', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/finish:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method finish
   * @chainable
   */
  finish                : anim8.delegate( 'finish', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/pause:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method pause
   * @chainable
   */
  pause                 : anim8.delegate( 'pause', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/resume:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method resume
   * @chainable
   */
  resume                : anim8.delegate( 'resume', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/set:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method set
   * @chainable
   */
  set                   : anim8.delegate( 'set', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/unset:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method unset
   * @chainable
   */
  unset                 : anim8.delegate( 'unset', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/get:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method get
   * @chainable
   */
  get                   : anim8.delegate( 'get', anim8.delegate.RETURN_FIRST ),

  /**
   * Calls {{#crossLink "Animator/hasAttrimators:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method hasAttrimators
   * @chainable
   */
  hasAttrimators        : anim8.delegate( 'hasAttrimators', anim8.delegate.RETURN_TRUE ),

  /**
   * Calls {{#crossLink "Animator/invoke:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method invoke
   * @chainable
   */
  invoke                : anim8.delegate( 'invoke', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleStart:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method onCycleStart
   * @chainable
   */
  onCycleStart          : anim8.delegate( 'onCycleStart', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleEnd:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method onCycleEnd
   * @chainable
   */
  onCycleEnd            : anim8.delegate( 'onCycleEnd', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/on:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method on
   * @chainable
   */
  on                    : anim8.delegate( 'on', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/once:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method once
   * @chainable
   */
  once                  : anim8.delegate( 'once', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/off:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method off
   * @chainable
   */
  off                   : anim8.delegate( 'off', anim8.delegate.RETURN_THIS ),

  /**
   * Calls {{#crossLink "Animator/trigger:method"}}{{/crossLink}} on 
   * each animator in the array and returns this.
   * 
   * @method trigger
   * @chainable
   */
  trigger               : anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS )

});
