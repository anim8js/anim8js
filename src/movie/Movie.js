
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
  this.introduce = false;
  this.timelines = new FastMap();
}

Class.define( Movie,
{
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
    var timelines = this.timelines.values;
    var maxTime = this.currentTime;

    for (var i = 0; i < timelines.length; i++)
    {
      maxTime = Math.max( maxTime, timelines[ i ].attrimators.timeRemaining() );
    }

    return this.at( maxTime );
  },
  play: function(animation, options, all)
  {
    var attrimatorMap = $attrimatorsFor( animation, options );
    var timelines = this.timelines.values;

    for (var i = 0; i < timelines.length; i++)
    {
      timelines[ i ].addAttrimators( attrimatorMap, all, this.currentTime, this.introduce );
    }

    this.introduce = false;

    return this;
  }
});

eventize( Movie.prototype );
