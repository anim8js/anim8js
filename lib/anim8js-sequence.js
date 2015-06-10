
/**
 * Creates a seqeuence for the given animators offseting animations be the given
 * delay and easing.
 * 
 * @param {Animators} animators
 * @param {String|Number} delay
 * @param {String|Array|Function} easing
 * @class Sequence
 * @constructor
 */
anim8.Sequence = function(animators, delay, easing)
{
  /**
   * The animators to play a sequence of animations against.
   * 
   * @property {Animators} animators
   */
  this.animators = animators;

  /**
   * The delay in milliseconds between animations.
   * 
   * @property {Number} delay
   */
  this.delay = anim8.delay( delay );

  /**
   * The easing function to use to calculate the delay offset for an animation.
   * 
   * @property {Function} easing
   */
  this.easing = anim8.easing( easing );
};

anim8.Sequence.prototype =
{
  /**
   * Returns the maximum delay for delaying generated attrimators.
   *
   * @method maxDelay
   * @return {Number}
   */
  maxDelay: function()
  {
    return this.delay * (this.animators.length() - 1);
  },
  
  /**
   * Creates an AttrimatorMap with the given options for the animator at the 
   * given index.
   *
   * @method createAttrimators
   * @param {Animation} animation
   * @param {Object} options
   * @param {Number} i
   * @return {AttrimatorMap}
   */
  createAttrimators: function(template, i)
  {
    var attrimatorMap = template.clone();
    var attrimators = attrimatorMap.values;
    var delta = i / (this.animators.length() - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();
    
    for (var k = attrimators.length - 1; k >= 0; k--)
    {
      attrimators[ k ].delay += delayOffset;
    }
    
    return attrimatorMap;
  },

  /**
   * Reverses the sequence by reversing the underlying array of animators.
   *
   * @method reverse
   * @chainable
   */
  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  /**
   * Plays the animation across the animators in this sequence.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/play:method"}}Animator.play{{/crossLink}}
   *
   * @method play 
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  play: function(animation, options, all, cache)
  {
    var template = anim8.attrimatorsFor( animation, options, cache );
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( template, i );
      
      animator.newCycle( attrimators );
      animator.playAttrimators( attrimators, all );       
    });
    
    return this.add();
  },
  
  /**
   * Queues the animation across the animators in this sequence.
   * 
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/queue:method"}}Animator.queue{{/crossLink}}
   *
   * @method queue
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  queue: function(animation, options, cache)
  {
    var template = anim8.attrimatorsFor( animation, options, cache );
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
      var attrimatorMap = sequence.createAttrimators( template, i );
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
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}},
   *          {{#crossLink "Core/anim8.options:method"}}{{/crossLink}},
   *          {{#crossLink "Animator/transition:method"}}Animator.transition{{/crossLink}}
   * 
   * @method transition
   * @param {String|Array|Object} transition
   * @param {Animation|String|Object} animation
   * @param {String|Array|Object} [options]
   * @param {Boolean} [all=false]
   * @param {Boolean} [cache=false]
   * @chainable
   */
  transition: function(transition, animation, options, all, cache)
  {
    var transition = anim8.transition( transition );
    var template = anim8.attrimatorsFor( animation, options, cache );
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      var attrimators = sequence.createAttrimators( template, i );

      animator.newCycle( attrimators );
      animator.transitionAttrimators( transition, attrimators, all );
    });
    
    return this.add();
  },
  
  /**
   * Activates all animators in this sequence and returns this.
   *
   * **See:** {{#crossLink "Animator/activate:method"}}Animator.activate{{/crossLink}}
   * 
   * @method add
   * @chainable
   */
  add: function()
  {
    this.animators.activate();
    
    return this;
  }
  
};