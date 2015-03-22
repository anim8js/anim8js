(function($, m8)
{
  var SYMBOL = {
    REPEAT: 'x',
    DELAY: '~',
    SLEEP: 'z'
  };
    
  $.fn.animators = function()
  {
    return m8( this.get() );
  };
  
  $.fn.play = function(animationText, all)
  {
    var anim = parseAnimation( animationText );
    
    if ( anim !== false )
    {
      this.animators().play( anim.animation, anim.options, all );
    }
    
    return this; 
  };
  
  $.fn.dataPlay = function(animationAttribute, all)
  {
    return this.play( this.data( animationAttribute ), all );
  };
  
  $.fn.queue = function(animationText)
  {
    var anim = parseAnimation( animationText );
    
    if ( anim !== false )
    {
      this.animators().queue( anim.animation, anim.options );
    }
    
    return this; 
  };
  
  $.fn.dataQueue = function(animationAttribute)
  {
    return this.queue( this.data( animationAttribute ) );
  };

  $.fn.transition = function(animationText, transitionText)
  {
    var anim = parseAnimation( animationText );
    var tran = parseTransition( transitionText );
    
    if ( anim !== false )
    {
      this.animators().transition( tran.time, tran.delta, tran.easing, anim.animation, anim.options );
    }
    
    return this; 
  };
  
  $.fn.dataTransition = function(animationAttribute, transitionAttribute)
  {
    return this.play( this.data( animationAttribute ), this.data( transitionAttribute ) );
  };
  
  $.fn.pause = function()
  {
    this.animators().pause();
    
    return this;
  };
  
  $.fn.resume = function()
  {
    this.animators().resume();
    
    return this;
  };
  
  $.fn.restore = function()
  {
    this.animators().restore();
    
    return this;
  };
  
  $.fn.stop = function()
  {
    this.animators().stop();
    
    return this;
  };
  
  $.fn.finish = function()
  {
    this.animators().finish();
    
    return this;
  };
  
  $.fn.eventsFor = function(attributes, callback)
  {
    this.animators().eventsFor( attributes, callback );
    
    return this;
  };
  
  $.fn.set = function(attributes)
  {
    this.animators().set( attributes );
    
    return this;
  };
  
  $.fn.isAnimating = function(attributes)
  {
    return this.animators().isAnimating();
  };
  
  $.fn.hasEvents = function(attributes)
  {
    return this.animators().hasEvents();
  };
  
  var parseAnimation = function(text)
  {
    var parts = text.split(' ');
    var options = {};
    var animation = null;
    
    for (var i = 0; i < parts.length; i++)
    {
      var p = parts[i];
            
      if ( p in m8.animation )
      {
        animation = p;
      }
      else if ( m8.isEasingName( p ) )
      {
        options.easing = p;
      }
      else if ( p.charAt(0) === SYMBOL.REPEAT )
      {
        var repeats = parseInt( p.substring(1) );
        
        if (!isNaN(repeats)) 
        {
          options.repeat = repeats;
        }
      }
      else if ( p.charAt(0) === SYMBOL.SLEEP )
      {
        var sleeps = m8.time( p.substring(1) );
        
        if ( sleeps !== false )
        {
          options.sleep = sleeps;
        }
      }
      else if ( p.charAt(0) === SYMBOL.DELAY )
      {
        var delays = m8.time( p.substring(1) );
        
        if ( delays !== false )
        {
          options.delay = delays;
        }
      }
      else
      {
        var duration = m8.time( p );
        
        if ( duration !== false )
        {
          options.duration = duration;
        }
      }
    }
    
    if ( animation === null )
    {
      return false;
    }
    
    return {
      animation: animation,
      options: options
    };
  };

  var parseTransition = function(text)
  {
    var transition = 
    {
      time: 500,
      delta: 0.2,
      easing: 'ease'
    };
    
    var parts = text.split(' ');
    
    for (var i = 0; i < parts.length; i++)
    {
      var p = parts[i];
      var num = parseFloat(p);
      
      if ( m8.isEasingName( p ) )
      {
        transition.easing = p;
      }
      else if ( !isNaN(num) && num >= 0.0 && num <= 1.0 )
      {
        transition.delta = num;
      }
      else
      {
        var times = m8.time( p );
        
        if ( times !== false )
        {
          transition.time = times;
        }
      }
    }
    
    return transition;
  };
  
})(jQuery, anim8);
