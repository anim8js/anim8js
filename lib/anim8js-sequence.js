anim8.Sequence = function(animators, delay, easing, animation, options)
{
  this.animators = animators;
  this.delay = delay;
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
  
  play: function()
  {    
    this.animators.each(function(animator, i)
    {
      var events = this.createEvents(i);
      
      for (var k = 0; k < events.length; k++)
      {
        animator.placeEvent( events[k] );
      }
            
    }, this);
    
    return this.add();
  },
  
  add: function()
  {
    this.animators.each(function(animator)
    {
      if ( !animator.active )
      {
        animator.active = true;
        anim8.animating.push( animator ); 
      }
    });
    
    this.animators.applyInitialState();
    
    if ( !anim8.running )
    {
      anim8.running = true;
  		anim8.trigger('starting');
  		anim8.requestRun( anim8.run );
    }
    
    return this;
  }
  
};