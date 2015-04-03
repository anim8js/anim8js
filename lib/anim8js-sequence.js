anim8.Sequence = function(animators, delay, easing)
{
  this.animators = animators;
  this.delay = anim8.delay( delay );
  this.easing = anim8.easing( easing );
};

anim8.Sequence.prototype =
{
  maxDelay: function()
  {
    return this.delay * (this.animators.length - 1);
  },
  
  createEvents: function(animation, i)
  {
    var events = animation.newEvents();
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
  
  play: function(animation, options, all, cache)
  {
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.playEvents( sequence.createEvents( anim, i ), all );       
    });
    
    return this.add();
  },
  
  queue: function(animation, options, cache)
  {
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
      remaining[i] = animator.finiteTimeRemaining();
      maxRemaining = Math.max( maxRemaining, remaining[i] );
    });

    this.animators.each(function(animator, i)
    {
      var delayOffset = maxRemaining - remaining[i];
      var events = sequence.createEvents( anim, i );
      
      for (var i = 0; i < events.length; i++)
      {
        events[ i ].delay += delayOffset;
      }
      
      animator.queueEvents( events );
    });
    
    return this.add();
  },

  transition: function(transitionTime, transitionDelta, transitionEasing, animation, options, all, cache)
  {
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transitionEvents( transitionTime, transitionDelta, transitionEasing, sequence.createEvents( anim, i ), all );
    });
    
    return this.add();
  },

  transitionInto: function(transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, animation, options, all, cache)
  {
    var anim = anim8.animation( animation, options, cache );

    if ( anim === false )
    {
      return this;
    }

    var sequence = this;

    this.animators.each(function(animator, i)
    {
      animator.transitionIntoEvents( transitionTime, transitionFromDelta, transitionIntoDelta, transitionEasing, sequence.createEvents( anim, i ), all );
    });
    
    return this.add();
  },
  
  add: function()
  {
    this.animators.activate();
    this.animators.applyInitialState();
    
    return this;
  }
  
};