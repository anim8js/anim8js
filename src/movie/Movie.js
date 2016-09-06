
var nextTimeline = (function()
{
  var id = 0;

  return function() {
    return ++id;
  };

})();

function Movie(name)
{
  this.name = name;
  this.currentTime = 0;
  this.currentTimelines = [];
  this.sequenceDelay = 0;
  this.sequenceEasing = Easings.linear;
  this.introduce = false;
  this.timelines = new FastMap();
  this.autoEnd = false;
}

Class.define( Movie,
{

  setAutoEnd: function(autoEnd)
  {
    this.autoEnd = autoEnd;

    return this;
  },

  sequence: function(delay, easing)
  {
    this.sequenceDelay = $time( delay );
    this.sequenceEasing = $easing( easing, Easings.linear );

    return this;
  },

  intro: function(subjects)
  {
    this.currentTimelines = this.getTimelines( subjects );
    this.introduce = true;

    return this;
  },

  with: function(subjects)
  {
    this.currentTimelines = this.getTimelines( subjects );

    return this;
  },

  add: function(subjects)
  {
    var additional = this.getTimelines( subjects );

    this.currentTimelines.push.apply( this.currentTimelines, additional );

    return this;
  },

  getTimeline: function(animator)
  {
    var timelineId = animator.$timelineId;
    var timeline = this.timelines.get( timelineId );

    if ( !isDefined( timeline ) )
    {
      timelineId = nextTimeline();
      timeline = new MovieTimeline( animator );
      animator.$timelineId = timelineId;

      this.timelines.put( timelineId, timeline );
    }

    return timeline;
  },

  getTimelines: function(subjects)
  {
    var animators = [];

    if ( isArray( subjects ) )
    {
      for (var i = 0; i < subjects.length; i++)
      {
        var animator = anim8( subjects[ i ] );

        if ( animator !== false )
        {
          animators.push( this.getTimeline( animator ) );
        }
      }
    }
    else
    {
      var animator = anim8( subjects );

      if ( animator !== false )
      {
        animators.push( this.getTimeline( animator ) );
      }
    }

    return animators;
  },

  at: function(time)
  {
    var at = $time( time, false );

    if ( at === false )
    {
      throw 'Invalid time in Movie.at: ' + time;
    }

    this.currentTime = at;

    return this;
  },

  seek: function(time)
  {
    var by = $time( time, false );

    if ( by === false )
    {
      throw 'Invalid time in Movie.seek: ' + time;
    }

    return this.at( this.currentTime + by );
  },

  end: function()
  {
    return this.at( this.duration() );
  },

  play: function(animation, options, all)
  {
    var parsed = $animation( animation, options );
    var intro = this.introduce;

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.playAttrimators( parsed.newAttrimators(), all, time, intro );
    });
  },

  queue: function(animation, options, all)
  {
    var parsed = $animation( animation, options );

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.queueAttrimators( parsed.newAttrimators(), all, time );
    });
  },

  transition: function(transition, animation, options, all)
  {
    var transition = $transition( transition );
    var parsed = $animation( animation, options );

    return this.eachCurrentTimeline(function(timeline, time)
    {
      timeline.transitionAttrimators( parsed.newAttrimators(), all, time, transition );
    });
  },

  eachCurrentTimeline: function(onTimeline)
  {
    var timelines = this.currentTimelines;
    var n = timelines.length - 1;
    var time = this.currentTime;

    if ( this.sequenceDelay > 0 )
    {
      var timeGap = n * this.sequenceDelay;
      var easing = this.sequenceEasing;

      for (var i = 0; i <= n; i++)
      {
        onTimeline( timelines[ i ], time + easing( i / n ) * timeGap );
      }
    }
    else
    {
      for (var i = 0; i <= n; i++)
      {
        onTimeline( timelines[ i ], time );
      }
    }

    this.sequenceDelay = 0;
    this.introduce = false;

    if ( this.autoEnd )
    {
      this.end();
    }

    return this;
  },

  duration: function()
  {
    var timelines = this.timelines.values;
    var maxTime = 0;

    for (var i = 0; i < timelines.length; i++)
    {
      maxTime = Math.max( maxTime, timelines[ i ].attrimators.timeRemaining() );
    }

    return maxTime;
  }
});

eventize( Movie.prototype );
