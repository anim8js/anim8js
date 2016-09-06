
function MoviePlayer(movie)
{
  this.speed = 1.0;
  this.time = 0;
  this.currentTime = 0;
  this.playing = false;
  this.movie = movie;
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
  play: function()
  {
    if ( !this.playing )
    {
      this.currentTime = now();
      this.playing = true;

      requestRun( this.run );
    }
  },
  pause: function()
  {
    this.playing = false;

    return this;
  },
  goto: function(time, applyNow)
  {
    this.time = $time( time );

    if ( applyNow )
    {
      this.apply();
    }

    return this;
  },
  apply: function(applyTime)
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

      if ( player.playing )
      {
        requestRun( player.run );
      }
    };
  }
});
