
/**
 * [Sequence description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
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
   * [maxDelay description]
   * @return {[type]}
   */
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  /**
   * [createEvents description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
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
   * [reverse description]
   * @return {[type]}
   */
  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  /**
   * [play description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
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
   * [queue description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
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
   * [transition description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
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
   * [add description]
   */
  add: function()
  {
    this.animators.activate();
    
    return this;
  }
  
};