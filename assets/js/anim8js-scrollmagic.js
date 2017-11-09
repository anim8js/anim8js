/* anim8js-scrollmagic 1.0.3 - anim8 ScrollMagic by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['anim8', 'scrollmagic'], function(anim8, ScrollMagic) { // jshint ignore:line
      return factory(anim8, ScrollMagic, root);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('anim8'), require('scrollmagic'), global);  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    factory(root.anim8, root.ScrollMagic, root);
  }
}(this, function(anim8, ScrollMagic, window)
{

  var anim8s = anim8.anim8s;
  var Class = anim8.Class;
  var AttrimatorMap = anim8.AttrimatorMap;

  var $animation = anim8.animation;

  var Scene = ScrollMagic.Scene.prototype;


var Events = {
  BEFORE: 'BEFORE',
  DURING: 'DURING',
  AFTER: 'AFTER',
  ANY: '*',
  INITIAL: ''
};

Scene.setBackwards = function(backwards)
{
  this.backwards = backwards;

  return this;
};

Scene.getAfter = function()
{
  return this.backwards ? Events.BEFORE : Events.AFTER;
};

Scene.getBefore = function()
{
  return this.backwards ? Events.AFTER : Events.BEFORE;
};

Scene.isEventMatch = function(actual, expected)
{
  switch (expected)
  {
    case Events.ANY:
      return true;
    case Events.BEFORE:
      return actual === this.getBefore();
    case Events.AFTER:
      return actual === this.getAfter();
    default:
      return actual === expected;
  }
};

Scene.onProgress = function(callback)
{
  var invokeCallback = this.getInvokeCallback( callback );

  this.on( 'progress.anim8js', invokeCallback );

  anim8.requestRun( invokeCallback );

  return this;
};

Scene.onStart = function(callback)
{
  var invokeCallback = this.getInvokeCallback( callback );

  anim8.requestRun( invokeCallback );

  return this;
};

Scene.getInvokeCallback = function(callback)
{
  var instance = this;

  return function()
  {
    var state = instance.state();
    var progress = instance.progress();

    if (instance.backwards)
    {
      progress = 1.0 - progress;
    }

    callback.call( instance, state, progress );
  };
};


// .transition('*', 'DURING')     "enter"
// .transition('*', 'AFTER')     "enter"
// .transition(null, 'DURING')    "start on during"
// .transition('AFTER', 'DURING') "enter from after"
Scene.transition = function(expectedPrevious, expectedCurrent, getCalls, onStateChange)
{
  var builder = new CallEventBuilder(getCalls);
  var previous = Events.INITIAL;
  var listener = expectedPrevious === Events.INITIAL ? 'onStart' : 'onProgress';

  return this[ listener ](function(current, progress)
  {
    if (previous !== current)
    {
      if (onStateChange)
      {
        onStateChange.call( this, current, previous, progress, builder );
      }

      if (this.isEventMatch( previous, expectedPrevious ) &&
          this.isEventMatch( current, expectedCurrent ))
      {
        builder.execute( current, progress );
      }

      previous = current;
    }
  });
};

Scene.after = function(getCalls)
{
  return this.transition( Events.ANY, Events.AFTER, getCalls );
};

Scene.fromAfter = function(getCalls)
{
  return this.transition( Events.AFTER, Events.ANY, getCalls );
};

Scene.before = function(getCalls)
{
  return this.transition( Events.ANY, Events.BEFORE, getCalls );
};

Scene.fromBefore = function(getCalls)
{
  return this.transition( Events.BEFORE, Events.ANY, getCalls );
};

Scene.enter = function(getCalls)
{
  return this.transition( Events.ANY, Events.DURING, getCalls );
};

Scene.exit = function(getCalls)
{
  return this.transition( Events.DURING, Events.ANY, getCalls );
};

Scene.any = function(getCalls)
{
  return this.transition( Events.ANY, Events.ANY, getCalls );
};

Scene.start = function(getCalls)
{
  return this.transition( Events.INITIAL, Events.ANY, getCalls );
};

Scene.startBefore = function(getCalls)
{
  return this.transition( Events.INITIAL, Events.BEFORE, getCalls );
};

Scene.startAfter = function(getCalls)
{
  return this.transition( Events.INITIAL, Events.AFTER, getCalls );
};

Scene.startDuring = function(getCalls)
{
  return this.transition( Events.INITIAL, Events.DURING, getCalls );
};

// Special Enter / Exit Events
Scene.intro = function(getCalls)
{
  var onStateChange = function(current, previous, progress, builder)
  {
    if ((previous === Events.INITIAL && current === this.getBefore()) || current === Events.DURING)
    {
      builder.executeInitials( current, progress );
    }
  };

  return this.transition( Events.ANY, Events.DURING, getCalls, onStateChange );
};

Scene.outro = function(getCalls)
{
  var onStateChange = function(current, previous, progress, builder)
  {
    if (previous === Events.INITIAL && current === this.getAfter())
    {
      builder.executeFinals( current, progress );
    }
  };

  return this.transition( Events.DURING, Events.ANY, getCalls, onStateChange );
};

// Special During Event
Scene.during = function(getCalls)
{
  var builder = new CallDuringBuilder(getCalls);
  var callCount = 0;

  return this.onProgress(function(state, progress)
  {
    builder.execute( progress, callCount );
    callCount++;
  });
};

// Multiple Events
Scene.REGEX_SPLIT = /\s+/g;
Scene.REGEX_TRANSITION = /(|DURING|AFTER|\*)>(|DURING|AFTER|\*)/i;

Scene.listen = function(events, getCalls)
{
  if (events.split)
  {
    events = events.split( this.REGEX_SPLIT );
  }

  for (var i = 0; i < events.length; i++)
  {
    var eventMethod = events[ i ];

    if (eventMethod in this)
    {
      this[ eventMethod ]( getCalls );
    }
    else
    {
      var matches = this.REGEX_TRANSITION.exec( eventMethod.toUpperCase() );

      if (matches)
      {
        this.transition( matches[1], matches[2], getCalls );
      }
    }
  }

  return this;
};


Scene.animate = function(type, target, subject, method, a1, a2, a3, a4)
{
  var args = Array.prototype.slice.call( arguments );
  var type = args.shift();

  var getCalls = function() {
    var target = args.shift();
    var targetArgCount = anim8.coalesce( this.arguments[ target ], 1 );
    var targetArgs = args.splice( 0, targetArgCount );

    if (!this.callless[ target ]) {
      var method = args.shift();
      targetArgs.push(function() {
        this[ method ].apply( this, args );
      });
    }

    this[ target ].apply( this, targetArgs );
  };

  return this[ type ]( getCalls );
};


ScrollMagic.getAnimator = function(query)
{
  var elements = ScrollMagic._util.get.elements( query );

  if (elements.length === 0)
  {
    if (anim8.log)
    {
      anim8.log('could not create animator for ', query);
    }

    return null;
  }

  return anim8( elements[ 0 ] );
};

ScrollMagic.getAnimators = function(query)
{
  var elements = ScrollMagic._util.get.elements( query );

  if (elements.length === 0)
  {
    if (anim8.log)
    {
      anim8.log('could not create animators for ', query);
    }

    return null;
  }

  return anim8s( elements );
};


function CallBuilder()
{
}

Class.define( CallBuilder,
{
  callless: {},
  arguments: {
    callWith: 1
  },
  init: function(getCalls)
  {
    this.calls = [];
    this.initials = [];
    this.finals = [];

    getCalls.call( this, this );
  },
  execute: function()
  {
    this.executeList( this.calls, arguments );
  },
  executeInitials: function()
  {
    this.executeList( this.initials, arguments );
  },
  executeFinals: function()
  {
    this.executeList( this.finals, arguments );
  },
  executeList: function(list, args)
  {
    for (var i = 0; i < list.length; i++)
    {
      list[ i ].apply( this, args );
    }
  },
  call: function(callback)
  {
    this.calls.push( callback );

    return this;
  },
  initial: function(callback)
  {
    this.initials.push( callback );

    return this;
  },
  final: function(callback)
  {
    this.finals.push( callback );

    return this;
  },
  callWith: function(context, getCalls, getInitial, getFinal)
  {
    if (context)
    {
      this.call(function()
      {
        getCalls.apply( context, arguments );
      });

      if (getInitial)
      {
        this.initial(function()
        {
          getInitial.apply( context, arguments );
        });
      }

      if (getFinal)
      {
        this.final(function()
        {
          getFinal.apply( context, arguments );
        });
      }
    }

    return this;
  }
});


function CallEventBuilder(getCalls)
{
  this.init( getCalls );
}

Class.extend( CallEventBuilder, CallBuilder,
{
  animator: function(query, getCalls)
  {
    return this.callWith( ScrollMagic.getAnimator( query ), getCalls, createAnimatorInitial( getCalls ), createAnimatorFinal( getCalls ) );
  },
  animators: function(query, getCalls)
  {
    return this.callWith( ScrollMagic.getAnimators( query ), getCalls, createAnimatorInitial( getCalls ), createAnimatorFinal( getCalls ) );
  },
  player: function(player, getCalls)
  {
    return this.callWith( player, getCalls, createMovieInitial( getCalls ), createMovieFinal() );
  },
  movie: function(movie, getCalls)
  {
    return this.player( new anim8.MoviePlayer( movie ), getCalls );
  }
});


function createAnimatorInitial(getCalls)
{
  return function()
  {
    this.stop().restore();
    getCalls.apply( this, arguments );
    this.preupdate( 0 ).update( 0 ).apply().stop();
  };
}

function createAnimatorFinal(getCalls)
{
  return function()
  {
    this.stop().restore();
    getCalls.apply( this, arguments );
    this.preupdate( 0 ).update( 0 ).end().apply();
  };
}

function createMovieInitial(getCalls)
{
  return function()
  {
    getCalls.apply( this, arguments );

    this.pause().apply( this.time, true );
  };
}

function createMovieFinal()
{
  return function()
  {
    this.end( true, true );
  };
}


function CallDuringBuilder(getCalls)
{
  this.init( getCalls );
}

Class.extend( CallDuringBuilder, CallBuilder,
{
  callless: {
    player: true,
    movie: true
  },
  arguments: {
    callWith: 1,
    animator: 1,
    animators: 1,
    player: 3,
    movie: 3
  },
  addProgressAnimator: function(animator)
  {
    var attrimatorMap = animator.attrimators;
    var attrimators = attrimatorMap.values;
    var properties = attrimatorMap.keys;
    var duration = attrimatorMap.timeRemaining();

    animator.attrimators = new AttrimatorMap();

    this.call(function(progress, callCount)
    {
      var now = progress * duration;

      if (callCount === 0) {
        animator.preupdate( now );
      }

      for (var i = 0; i < attrimators.length; i++) {
        var attrimator = attrimators[ i ];
        var prop = properties[ i ];
        var value = attrimator.valueAtSearch( now, animator.frame[ prop ] );
        if (value === false) {
          var last = attrimator;
          var lastTime = now;
          while (last.next) {
            lastTime -= last.totalTime();
            last = last.next;
          }
          value = last.valueAt( lastTime, animator.frame[ prop ] );
        }
        if (value !== false) {
          animator.updated[ prop ] = true;
          animator.frame[ prop ] = value;
        }
      }

      animator.apply();
    });
  },
  animator: function(query, getCalls)
  {
    var animator = ScrollMagic.getAnimator(query);

    if (animator)
    {
      getCalls.call( animator );

      this.addProgressAnimator( animator );
    }

    return this;
  },
  animators: function(query, getCalls)
  {
    var animators = ScrollMagic.getAnimators(query);

    if (animators)
    {
      getCalls.call( animators );

      animators.each( this.addProgressAnimator, this );
    }

    return this;
  },
  player: function(player, overrideDuration, overrideOffset)
  {
    var offset = anim8.coalesce( overrideOffset, 0 );
    var duration = anim8.coalesce( overrideDuration, player.movie.duration() );

    return this.call(function(progress)
    {
      player.apply( progress * duration + offset, true );
    });
  },
  movie: function(movie, overrideDuration, overrideOffset)
  {
    return this.player( new anim8.MoviePlayer( movie ), overrideDuration, overrideOffset );
  }
});



  return anim8;

}));
