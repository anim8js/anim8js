
// TODO

function Movie()
{
  this.events = [];
  this.currentTime = 0;
  this.subjects = new Animators();
  this.index = 0;
}

Class.define( Movie,
{
  select: function(subjects)
  {

  },
  at: function(time)
  {
    var at = $time( time, false );

    if ( at === false )
    {
      throw 'Invalid time in Movie.at: ' + time;
    }

    this.currentTime = at;
  },
  move: function(time)
  {
    var by = $time( time, false );

    if ( by === false )
    {
      throw 'Invalid time in Movie.move: ' + time;
    }

    this.at( this.currentTime + by );
  },
  wait: function(time)
  {

  },
  after: function(callback, context)
  {

  },
  invoke: function(callback, context)
  {

  },
  play: function(animation, options, all)
  {
    var attr = this.getAttrimators( animation, options );
    var dura = attr.timeRemaining();

  },
  queue: function(animation, options)
  {

  },
  transition: function(transition, animation, options, all)
  {
    var tran = $transition( transition );
    var attr = this.getAttrimators( animation, options );

  },
  sequence: function(delay)
  {

  },
  _add: function(event)
  {

  },
  getAttrimators: function(animation, options)
  {
    return $attrimatorsFor( animation, options );
  }
});

eventize( Movie.prototype );

function MovieEvent(time, type, parameters)
{
  this.time = time;
  this.type = type;
  this.parameters = parameters;
}

function MoviePlayer(movie)
{
  this.movie = movie;
  this.startTime = 0;
  this.referenceTime = 0;
  this.direction = 1;
  this.currentIndex = 0;
}
