anim8.Sequence = function(animators, delay, easing, animation, options)
{
  this.animators = animators;
  this.delay = anim8.delay( delay );
  this.easing = anim8.easing( easing );
  this.animation = anim8.animation( animation, options );
  this.options = options;
};

anim8.Sequence.prototype =
{
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  createEvents: function(i)
  {
    var events = this.animation.newEvents();
    var delta = i / (this.animators.length - 1);
    var delayOffset = this.easing( delta ) * this.maxDelay();
    
    for (var k = 0; k < events.length; k++)
    {
      events[k].delay += delayOffset;
    }
    
    return events;
  },

  reverse: function()
  {
    this.animators.reverse();

    return this;
  },
  
  play: function(all)
  {    
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.playEvents( sequence.createEvents( i ), all );       
    });
    
    return this.add();
  },
  
  queue: function()
  {
    var sequence = this;
    var maxRemaining = 0;
    var remaining = [];
    
    this.animators.each(function(animator, i)
    {
      remaining[i] = animator.finiteTimeRemaining();
      maxRemaining = Math.max( maxRemaining, remaining[i] );
    });

    this.animators.each(function(animator, i)
    {
      var delayOffset = maxRemaining - remaining[i];
      var events = sequence.createEvents( i );
      
      for (var i = 0; i < events.length; i++)
      {
        events[ i ].delay += delayOffset;
      }
      
      animator.queueEvents( events );
    });
    
    return this.add();
  },

  /*
  transition: function(transitionTime, transitionDelta, transitionEasing, animation, options)
  {
    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transition( sequence.createEvents( i ), all );
    });
    
    return this.add();
  },
  */
  
  add: function()
  {
    this.animators.activate();
    this.animators.applyInitialState();
    
    return this;
  }
  
};