/* anim8js-scrollmagic 1.0.0 - anim8 ScrollMagic by Philip Diffenderfer */
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
  AFTER: 'AFTER'
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

Scene.onProgress = function(callback)
{
  var instance = this;
  var invokeCallback = function()
  {
    var state = instance.state();
    var progress = instance.progress();

    if (instance.backwards)
    {
      progress = 1.0 - progress;
    }

    callback.call( instance, state, progress );
  };

  instance.on( 'progress.anim8js', invokeCallback );

  anim8.requestRun( invokeCallback );

  return this;
};


Scene.after = function(getCalls)
{
  var builder = new CallEventBuilder(getCalls);
  var last = null;

  return this.onProgress(function(state, progress)
  {
    if (state !== last) {
      if (state === this.getAfter()) {
        builder.execute( state, last );
      }
      last = state;
    }
  });
};

Scene.before = function(getCalls)
{
  var builder = new CallEventBuilder(getCalls);
  var last = null;

  return this.onProgress(function(state, progress)
  {
    if (state !== last) {
      if (state === this.getBefore()) {
        builder.execute( state, last );
      }
      last = state;
    }
  });
};

Scene.enter = function(getCalls)
{
  var builder = new CallEventBuilder(getCalls);
  var last = null;

  return this.onProgress(function(state, progress)
  {
    if (state !== last) {
      if (state === Events.DURING) {
        builder.execute( state, last );
      }
      last = state;
    }
  });
};

Scene.exit = function(getCalls)
{
  var builder = new CallEventBuilder(getCalls);
  var last = null;

  return this.onProgress(function(state, progress)
  {
    if (state !== last) {
      if (last && state !== Events.DURING) {
        builder.execute( state, last );
      }
      last = state;
    }
  });
};

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

    getCalls.call( this );
  },
  execute: function()
  {
    var calls = this.calls;

    for (var i = 0; i < calls.length; i++)
    {
      calls[ i ].apply( this, arguments );
    }
  },
  call: function(callback)
  {
    this.calls.push( callback );

    return this;
  },
  callWith: function(context, getCalls)
  {
    if (context)
    {
      this.call(function()
      {
        getCalls.apply( context, arguments );
      });
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
    return this.callWith( ScrollMagic.getAnimator( query ), getCalls );
  },
  animators: function(query, getCalls)
  {
    return this.callWith( ScrollMagic.getAnimators( query ), getCalls );
  },
  player: function(player, getCalls)
  {
    return this.callWith( player, getCalls );
  },
  movie: function(movie, getCalls)
  {
    return this.player( new anim8.MoviePlayer( movie ), getCalls );
  }
});


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
