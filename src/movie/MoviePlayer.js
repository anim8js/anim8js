
function MoviePlayer(movie)
{
  this.speed = 1.0;
  this.time = 0;
  this.currentTime = 0;
  this.playing = false;
  this.animating = {};
  this.movie = movie;
  this.node = movie.head;
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
    this.speed = -Math.abs( speed );

    return this;
  },
  forward: function()
  {
    this.speed = Math.abs( speed );

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
      var elapsed = currenTime - player.currentTime;

      player.time += elapsed * player.speed;
      player.currentTime = currentTime;

      var node = player.node;
      if (player.speed > 0) {
        while (player.time > node.end) {
          var actions = node.actions;
          for (var i = 0; i < actions.length; i++) {
            var action = actions[ i ];
            var animators = action.animators;
            var attrimators = action.attrimators;

            for (var k = 0; k < animators.length; k++) {

            }
          }
          node = node.next;
        }
      }

      // APPLY ATTRIMATORS

      if ( player.playing )
      {
        requestRun( run );
      }
    };
  }
});
