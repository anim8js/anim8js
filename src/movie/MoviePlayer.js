
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
  runner: function(movie, player)
  {
    return function run()
    {
      var currentTime = now();
      var elapsed = currentTime - player.currentTime;
      var timelines = player.movie.timelines.values;
      var active = [];

      player.time += elapsed * player.speed;
      player.currentTime = currentTime;

      for (var i = 0; i < timelines.length; i++)
      {
        var timeline = timelines[ i ];

        if ( player.time >= timeline.start )
        {
          active.push( timeline );
        }
      }

      for (var i = 0; i < active.length; i++)
      {
        active[ i ].preupdate( player.time );
      }

      for (var i = 0; i < active.length; i++)
      {
        active[ i ].update( player.time );
      }

      for (var i = 0; i < active.length; i++)
      {
        active[ i ].apply();
      }

      if ( player.playing )
      {
        requestRun( player.run );
      }
    };
  }
});
