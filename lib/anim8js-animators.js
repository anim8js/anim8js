
/*****************************************************************
  ANIMATORS DEFINITION
******************************************************************/

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
   * @param {function} iterator
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
   * @param {array} animators
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
   * Invokes a callback for each element in the array and if true is returned that element is removed from the array.
   *
   * @param {function} filterer
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
   * Returns the subjects of the Animators optionally passing them through a wrapper
   * function before it's returned.
   *
   * @param [function] wrapper
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
   */
  first: function()
  {
    return this[0];
  },

  /**
   * Reverses the order of animators in the array.
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
   * @return {this}
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
   * Returns an array of the subjects optionally
   */

  /**
   * Plays a sequence of events separated by a delay given an animation to play on all Animators.
   */
  sequence: function(delay, easing)
  {
    return new anim8.Sequence( this, delay, easing );
  },

  /**
   * Adds the following methods to make an array of Animators appear like a single Animator.
   */
  restore              : anim8.delegate( 'restore', anim8.delegate.RETURN_THIS ),
  placeSpring          : anim8.delegate( 'placeSpring', anim8.delegate.RETURN_THIS ),
  placeEvent           : anim8.delegate( 'placeEvent', anim8.delegate.RETURN_THIS ),
  preupdate            : anim8.delegate( 'preupdate', anim8.delegate.RETURN_THIS ),
  update               : anim8.delegate( 'update', anim8.delegate.RETURN_THIS ),
  apply                : anim8.delegate( 'apply', anim8.delegate.RETURN_THIS ),
  trimEvents           : anim8.delegate( 'trimEvents', anim8.delegate.RETURN_THIS ),
  deactivate           : anim8.delegate( 'deactivate', anim8.delegate.RETURN_THIS ),
  destroy              : anim8.delegate( 'destroy', anim8.delegate.RETURN_THIS ),
  spring               : anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS ),
  unspring             : anim8.delegate( 'unspring', anim8.delegate.RETURN_THIS ),
  play                 : anim8.delegate( 'play', anim8.delegate.RETURN_THIS ),
  playEvents           : anim8.delegate( 'playEvents', anim8.delegate.RETURN_THIS ),
  queue                : anim8.delegate( 'queue', anim8.delegate.RETURN_THIS ),
  queueEvents          : anim8.delegate( 'queueEvents', anim8.delegate.RETURN_THIS ),
  transition           : anim8.delegate( 'transition', anim8.delegate.RETURN_THIS ),
  transitionEvents     : anim8.delegate( 'transitionEvents', anim8.delegate.RETURN_THIS ),
  transitionInto       : anim8.delegate( 'transitionInto', anim8.delegate.RETURN_THIS ),
  transitionIntoEvents : anim8.delegate( 'transitionIntoEvents', anim8.delegate.RETURN_THIS ),
  tween                : anim8.delegate( 'tween', anim8.delegate.RETURN_THIS ),
  tweenTo              : anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS ),
  tweenMany            : anim8.delegate( 'tweenMany', anim8.delegate.RETURN_THIS ),
  tweenManyTo          : anim8.delegate( 'tweenManyTo', anim8.delegate.RETURN_THIS ),
  applyInitialState    : anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS ),
  follow               : anim8.delegate( 'follow', anim8.delegate.RETURN_THIS ),
  eventsFor            : anim8.delegate( 'eventsFor', anim8.delegate.RETURN_RESULTS ),
  springsFor           : anim8.delegate( 'springsFor', anim8.delegate.RETURN_RESULTS ),
  stop                 : anim8.delegate( 'stop', anim8.delegate.RETURN_THIS ),
  end                  : anim8.delegate( 'end', anim8.delegate.RETURN_THIS ),
  finish               : anim8.delegate( 'finish', anim8.delegate.RETURN_THIS ),
  pause 			         : anim8.delegate( 'pause', anim8.delegate.RETURN_THIS ),
  resume 			         : anim8.delegate( 'resume', anim8.delegate.RETURN_THIS ),
  set                  : anim8.delegate( 'set', anim8.delegate.RETURN_THIS ),
  get                  : anim8.delegate( 'get', anim8.delegate.RETURN_FIRST ),
  isAnimating          : anim8.delegate( 'isAnimating', anim8.delegate.RETURN_TRUE ),
  hasEvents            : anim8.delegate( 'hasEvents', anim8.delegate.RETURN_TRUE ),
  hasSprings           : anim8.delegate( 'hasSprings', anim8.delegate.RETURN_TRUE ),
  on			             : anim8.delegate( 'on', anim8.delegate.RETURN_THIS ),
  once		             : anim8.delegate( 'once', anim8.delegate.RETURN_THIS ),
  off			             : anim8.delegate( 'off', anim8.delegate.RETURN_THIS ),
  trigger              : anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS )

});
