
function MoviePlayer(movie)
{
  this.speed = 1.0;
  this.time = 0;
  this.currentTime = 0;
  this.playing = false;
  this.movie = movie;
  this.duration = movie.duration();
  this.run = this.runner( movie, this );
}

Class.define( MoviePlayer,
{
  reverse: function()
  {
    this.speed = -this.speed;

    return this;
  },
  backward: function()
  {
    this.speed = -Math.abs( this.speed );

    return this;
  },
  forward: function()
  {
    this.speed = Math.abs( this.speed );

    return this;
  },
  start: function(applyNow, avoidApplyTrigger)
  {
    this.time = 0;

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  end: function(applyNow, avoidApplyTrigger)
  {
    this.time = this.duration;

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  play: function()
  {
    if ( !this.playing )
    {
      this.currentTime = now();
      this.playing = true;

      requestRun( this.run );
    }

    return this;
  },
  pause: function()
  {
    this.playing = false;

    return this;
  },
  goto: function(time, applyNow, avoidApplyTrigger)
  {
    this.time = $time( time );

    if ( applyNow )
    {
      this.apply( this.time, avoidApplyTrigger );
    }

    return this;
  },
  apply: function(applyTime, avoidApplyTrigger)
  {
    var time = coalesce( applyTime, this.time );
    var timelines = this.movie.timelines.values;
    var active = [];

    for (var i = 0; i < timelines.length; i++)
    {
      var timeline = timelines[ i ];

      if ( time >= timeline.start )
      {
        active.push( timeline );
      }
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].preupdate( time );
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].update( time );
    }

    for (var i = 0; i < active.length; i++)
    {
      active[ i ].apply();
    }

    if ( !avoidApplyTrigger )
    {
      this.trigger( 'apply', [this, time] );
    }

    return this;
  },
  evaluatePlaying: function()
  {
    if ( this.playing )
    {
      if ( this.time < 0 )
      {
        this.time = 0;
        this.playing = false;
        this.trigger( 'start', [this] );
      }
      else if ( this.time > this.duration )
      {
        this.time = this.duration;
        this.playing = false;
        this.trigger( 'end', [this] );
      }
    }

    return this;
  },
  runner: function(movie, player)
  {
    return function run()
    {
      var currentTime = now();
      var elapsed = currentTime - player.currentTime;

      player.time += elapsed * player.speed;
      player.currentTime = currentTime;
      player.apply();
      player.evaluatePlaying();

      if ( player.playing )
      {
        requestRun( player.run );
      }
    };
  }
});

eventize( MoviePlayer.prototype );
