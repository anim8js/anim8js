
/**
 * Instantiates an Array of {{#crossLink "Animator"}}{{/crossLink}} instances.
 *
 * @param {Array} [input]
 * @class Animators
 * @constructor
 * @extends {Array}
 */
function Animators(input)
{
  this.$ = [];

  if ( isArray( input ) )
  {
    this.fill( input );
  }
}

/**
 * Animators is an instance of Array. All array methods are supported.
 */
Class.define( Animators,
{

  /**
   * Adds an animator to this set of animators.
   *
   * @param  {Animator} animator
   * @chainable
   */
  push: function(animator)
  {
    this.$.push( animator );

    return this;
  },

  /**
   * Returns the number of animators in this set.
   *
   * @return {Number}
   */
  length: function()
  {
    return this.$.length;
  },

  /**
   * Returns the animator at the given index.
   *
   * @param  {Number} index
   * @return {Animator}
   */
  at: function(index)
  {
    return this.$[ index ];
  },

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
    var array = this.$;

    for (var i = 0; i < array.length; i++)
    {
      if ( iterator.call( context || array[i], array[i], i ) === false )
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
    var array = this.$;
    var alive = 0;

    for (var i = 0; i < array.length; i++)
    {
      var remove = filterer( array[i] );

      if ( !remove )
      {
        array[alive++] = array[i];
      }
    }

    array.length = alive;

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
    var array = this.$;
    var subjects = [];

    for (var i = 0; i < array.length; i++)
    {
      subjects.push( array[i].subject );
    }

    if ( isFunction( wrapper ) )
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
    return this.$[0];
  },

  /**
   * Reverses the order of animators in the array.
   *
   * @method reverse
   * @chainable
   */
  reverse: function()
  {
    var array = this.$;
    var last = array.length - 1;
    var mid = Math.floor( array.length / 2 );

    for (var i = 0; i < mid; i++)
    {
      var e0 = array[ i ];
      var e1 = array[ last - i ];

      array[ i ] = e1;
      array[ last - i ] = e0;
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
    var array = this.$;

    for (var i = 0; i < array.length; i++)
    {
      pushAnimator( array[i] );
    }

    activate();

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
    return new Sequence( this, delay, easing );
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
    var array = this.$;
    var maxRemaining = 0;

    for (var i = 0; i < array.length; i++)
    {
      maxRemaining = Math.max( maxRemaining, array[ i ].timeRemaining() );
    }

    return maxRemaining;
  },

  /**
   * Calls {{#crossLink "Animator/preupdate:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method preupdate
   * @chainable
   */
  preupdate: function(now, max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].preupdate( now );
    }

    return this;
  },

  /**
   * Calls {{#crossLink "Animator/update:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method update
   * @chainable
   */
  update: function(now, max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].update( now );
    }

    return this;
  },

  /**
   * Calls {{#crossLink "Animator/apply:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method apply
   * @chainable
   */
  apply: function(max)
  {
    var array = this.$;
    var length = max || array.length;

    for (var i = 0; i < length; i++)
    {
      array[ i ].apply();
    }

    return this;
  },

  /**
   * Handles an animator if it's finished, and returns false if the animator can
   * be removed from the set of animators.
   *
   * @method handleFinished
   * @param {Animator} animator
   * @return {Boolean}
   */
  handleFinished: function(animator)
  {
    if ( animator.finished )
    {
      animator.deactivate();
      animator.active = false;
    }

    return animator.finished;
  },

  /**
   * Calls {{#crossLink "Animator/restore:method"}}{{/crossLink}} on each
   * animator in the array and returns this.
   *
   * @method restore
   * @chainable
   */
  restore               : delegate( 'restore', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/placeAttrimator:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method placeAttrimator
   * @chainable
   */
  placeAttrimator       : delegate( 'placeAttrimator', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method applyInitialState
   * @chainable
   */
  applyInitialState     : delegate( 'applyInitialState', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/trimAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method trimAttrimators
   * @chainable
   */
  trimAttrimators       : delegate( 'trimAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/deactivate:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method deactivate
   * @chainable
   */
  deactivate            : delegate( 'deactivate', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/destroy:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method destroy
   * @chainable
   */
  destroy               : delegate( 'destroy', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/spring:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method spring
   * @chainable
   */
  spring                : delegate( 'spring', DelegateTypes.RESULTS ),

  /**
   * Calls {{#crossLink "Animator/play:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method play
   * @chainable
   */
  play                  : delegate( 'play', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/unplay:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method unplay
   * @chainable
   */
  unplay                : delegate( 'unplay', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/playAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method playAttrimators
   * @chainable
   * @protected
   */
  playAttrimators       : delegate( 'playAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/queue:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method queue
   * @chainable
   */
  queue                 : delegate( 'queue', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/queueAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method queueAttrimators
   * @chainable
   * @protected
   */
  queueAttrimators      : delegate( 'queueAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/transition:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method transition
   * @chainable
   */
  transition            : delegate( 'transition', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/transitionAttrimators:method"}}{{/crossLink}}
   * on each animator in the array and returns this.
   *
   * @method transitionAttrimators
   * @chainable
   * @protected
   */
  transitionAttrimators : delegate( 'transitionAttrimators', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tween:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tween
   * @chainable
   */
  tween                 : delegate( 'tween', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenTo:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenTo
   * @chainable
   */
  tweenTo               : delegate( 'tweenTo', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenFrom:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenFrom
   * @chainable
   */
  tweenFrom             : delegate( 'tweenFrom', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenMany:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenMany
   * @chainable
   */
  tweenMany             : delegate( 'tweenMany', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyTo:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenManyTo
   * @chainable
   */
  tweenManyTo           : delegate( 'tweenManyTo', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/tweenManyFrom:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method tweenManyFrom
   * @chainable
   */
  tweenManyFrom         : delegate( 'tweenManyFrom', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/move:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method move
   * @chainable
   */
  move                  : delegate( 'move', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/moveMany:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method moveMany
   * @chainable
   */
  moveMany              : delegate( 'moveMany', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/follow:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method follow
   * @chainable
   */
  follow                : delegate( 'follow', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/attrimatorsFor:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method attrimatorsFor
   * @chainable
   */
  attrimatorsFor        : delegate( 'attrimatorsFor', DelegateTypes.RESULTS ),

  /**
   * Calls {{#crossLink "Animator/stop:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method stop
   * @chainable
   */
  stop                  : delegate( 'stop', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/end:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method end
   * @chainable
   */
  end                   : delegate( 'end', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/finish:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method finish
   * @chainable
   */
  finish                : delegate( 'finish', DelegateTypes.THIS ),

/**
   * Calls {{#crossLink "Animator/nopeat:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method nopeat
   * @chainable
   */
  nopeat                : delegate( 'nopeat', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/pause:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method pause
   * @chainable
   */
  pause                 : delegate( 'pause', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/resume:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method resume
   * @chainable
   */
  resume                : delegate( 'resume', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/set:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method set
   * @chainable
   */
  set                   : delegate( 'set', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/unset:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method unset
   * @chainable
   */
  unset                 : delegate( 'unset', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/get:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method get
   * @chainable
   */
  get                   : delegate( 'get', DelegateTypes.FIRST ),

  /**
   * Calls {{#crossLink "Animator/hasAttrimators:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method hasAttrimators
   * @chainable
   */
  hasAttrimators        : delegate( 'hasAttrimators', DelegateTypes.TRUE ),

  /**
   * Calls {{#crossLink "Animator/invoke:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method invoke
   * @chainable
   */
  invoke                : delegate( 'invoke', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleStart:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method onCycleStart
   * @chainable
   */
  onCycleStart          : delegate( 'onCycleStart', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/onCycleEnd:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method onCycleEnd
   * @chainable
   */
  onCycleEnd            : delegate( 'onCycleEnd', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/on:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method on
   * @chainable
   */
  on                    : delegate( 'on', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/once:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method once
   * @chainable
   */
  once                  : delegate( 'once', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/off:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method off
   * @chainable
   */
  off                   : delegate( 'off', DelegateTypes.THIS ),

  /**
   * Calls {{#crossLink "Animator/trigger:method"}}{{/crossLink}} on
   * each animator in the array and returns this.
   *
   * @method trigger
   * @chainable
   */
  trigger               : delegate( 'trigger', DelegateTypes.THIS )

});
