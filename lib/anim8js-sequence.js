
/**
 * Creates a seqeuence for the given animators offseting animations be the given
 * delay and easing.
 * 
 * @param {anim8.Animators} animators
 * @param {String|Number} delay
 * @param {String|Array|Function} easing
 */
anim8.Sequence = function(animators, delay, easing)
{
  this.animators = animators;
  this.delay = anim8.delay( delay );
  this.easing = anim8.easing( easing );
};

anim8.Sequence.prototype =
{
  /**
   * Returns the maximum delay for delaying generated attrimators.
   *
   * @return {Number}
   */
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  /**
   * Creates an AttrimatorMap with the given options for the animator at the 
   * given index.
   * 
   * @param {anim8.Animation} animation
   * @param {Object} options
   * @param {Number} i
   * @return {anim8.AttrimatorMap}
   */
  createAttrimators: function(animation, options, i)
  {
    var attrimatorMap = animation.newAttrimators();
    var attrimators = attrimatorMap.values;
    var delta = i / (this.animators.length - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();
    
    for (var k = attrimators.length - 1; k >= 0; k--)
    {
      attrimators[ k ].delay += delayOffset;
    }

    animation.merge( options, attrimatorMap );
    
    return attrimatorMap;
  },

  /**
   * Reverses the sequence by reversing the underlying array of animators.
   * 
   * @return {this}
   */
  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  /**
   * Plays the animation across the animators in this sequence.
   * 
   * @param {anim8.Animation|String|Object} animation
   * @param {String|Array|Object} options
   * @param {Boolean} all
   * @param {Boolean} cache
   * @return {this}
   * @see anim8.animation
   * @see anim8.options
   * @see anim8.Animator.play
   */
  play: function(animation, options, all, cache)
  {
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( anim, options, i );
      animator.newCycle( attrimators );
      animator.playAttrimators( attrimators, all );       
    });
    
    return this.add();
  },
  
  /**
   * Queues the animation across the animators in this sequence.
   * 
   * @param {anim8.Animation|String|Object} animation
   * @param {String|Array|Object} options
   * @param {Boolean} cache
   * @return {this}
   * @see anim8.animation
   * @see anim8.options
   * @see anim8.Animator.queue
   */
  queue: function(animation, options, cache)
  {
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;
    var maxRemaining = 0;
    var remaining = [];
    
    this.animators.each(function(animator, i)
    {
      remaining[i] = animator.timeRemaining();
      maxRemaining = Math.max( maxRemaining, remaining[i] );
    });

    this.animators.each(function(animator, i)
    {
      var delayOffset = maxRemaining - remaining[i];
      var attrimatorMap = sequence.createAttrimators( anim, options, i );
      var attrimators = attrimatorMap.values;

      for (var k = attrimators.length - 1; k >= 0; k--)
      {
        attrimators[ k ].delay += delayOffset;
      }
      
      animator.newCycle( attrimatorMap );
      animator.queueAttrimators( attrimatorMap );
    });
    
    return this.add();
  },

  /**
   * Transitions into the animation across the animators in this sequence.
   * 
   * @param {String|Array|Object} transition
   * @param {anim8.Animation|String|Object} animation
   * @param {String|Array|Object} options
   * @param {Boolean} all
   * @param {Boolean} cache
   * @return {this}
   * @see anim8.transition
   * @see anim8.animation
   * @see anim8.options
   * @see anim8.Animator.transition
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var options = anim8.options( options );
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( anim, options, i );
      animator.newCycle( attrimators );
      animator.transitionAttrimators( transition, attrimators, all );
    });
    
    return this.add();
  },
  
  /**
   * Activates all animators in this sequence and returns this.
   *
   * @return {this}
   */
  add: function()
  {
    this.animators.activate();
    
    return this;
  }
  
};