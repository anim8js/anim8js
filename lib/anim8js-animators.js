
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
anim8.Animators.prototype = new Array();

/**
 * Invokes a callback for each element in the array.
 * 
 * @param {function} iterator
 */
anim8.Animators.prototype.each = function(iterator, context) 
{
  for (var i = 0; i < this.length; i++) 
  {
    if ( iterator.call( context || this[i], this[i], i ) === false ) 
    {
      break;
    }
  }
	
	return this;
};

/**
 * Appends the array of animators given to the end of this array.
 *
 * @param {array} animators
 */
anim8.Animators.prototype.fill = function(animators)
{
  for (var i = 0; i < animators.length; i++)
  {
    this.push( animators[i] );
  }

  return this;
};

/**
 * Invokes a callback for each element in the array and if true is returned that element is removed from the array.
 *
 * @param {function} filterer
 */
anim8.Animators.prototype.filter = function(filterer)
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
};

/**
 * Returns the first animator in the array.
 */
anim8.Animators.prototype.first = function()
{
  return this[0];
};

/**
 * Plays a sequence of events separated by a delay given an animation to play on all Animators.
 */
anim8.Animators.prototype.sequence = function(delay, easing, animation, options)
{
  return new anim8.Sequence( this, delay, easing, animation, options );
};

/**
 * Adds the following methods to make an array of Animators appear like a single Animator.
 */
anim8.Animators.prototype.restore           = anim8.delegate( 'restore', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.placeSpring       = anim8.delegate( 'placeSpring', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.placeEvent        = anim8.delegate( 'placeEvent', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.preupdate         = anim8.delegate( 'preupdate', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.update            = anim8.delegate( 'update', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.apply             = anim8.delegate( 'apply', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.trimEvents        = anim8.delegate( 'trimEvents', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.deactivate        = anim8.delegate( 'deactivate', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.destroy           = anim8.delegate( 'destroy', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.spring            = anim8.delegate( 'spring', anim8.delegate.RETURN_RESULTS );
anim8.Animators.prototype.unspring          = anim8.delegate( 'unspring', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.play              = anim8.delegate( 'play', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.queue             = anim8.delegate( 'queue', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.transition        = anim8.delegate( 'transition', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.tweenTo           = anim8.delegate( 'tweenTo', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.applyInitialState = anim8.delegate( 'applyInitialState', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.follow            = anim8.delegate( 'follow', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.eventsFor         = anim8.delegate( 'eventsFor', anim8.delegate.RETURN_RESULTS );
anim8.Animators.prototype.springsFor        = anim8.delegate( 'springsFor', anim8.delegate.RETURN_RESULTS );
anim8.Animators.prototype.stop              = anim8.delegate( 'stop', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.end               = anim8.delegate( 'end', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.finish            = anim8.delegate( 'finish', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.pause 			      = anim8.delegate( 'pause', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.resume 			      = anim8.delegate( 'resume', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.set               = anim8.delegate( 'set', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.get               = anim8.delegate( 'get', anim8.delegate.RETURN_FIRST );
anim8.Animators.prototype.isAnimating       = anim8.delegate( 'isAnimating', anim8.delegate.RETURN_TRUE );
anim8.Animators.prototype.hasEvents         = anim8.delegate( 'hasEvents', anim8.delegate.RETURN_TRUE );
anim8.Animators.prototype.hasSprings        = anim8.delegate( 'hasSprings', anim8.delegate.RETURN_TRUE );
anim8.Animators.prototype.on			          = anim8.delegate( 'on', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.once		          = anim8.delegate( 'once', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.off			          = anim8.delegate( 'off', anim8.delegate.RETURN_THIS );
anim8.Animators.prototype.trigger           = anim8.delegate( 'trigger', anim8.delegate.RETURN_THIS );
