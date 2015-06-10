
anim8.Movie = function()
{
  this.events = [];
  this.currentTime = 0;
  this.subjects = new anim8.Animators();
  this.index = 0;
};

anim8.Movie.prototype = 
{
  select: function(subjects)
  {

  },
  at: function(time)
  {
    var at = anim8.time( time, false );

    if ( at === false )
    {
      throw 'Invalid time in Movie.at: ' + time;
    }

    this.currentTime = at;
  },
  move: function(time)
  {
    var by = anim8.time( time, false );

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
    var tran = anim8.transition( transition );
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
    return anim8.attrimatorsFor( animation, options );
  }
};

anim8.eventize( anim8.Movie.prototype );

anim8.MovieEvent = function(time, type, parameters)
{
  this.time = time;
  this.type = type;
  this.parameters = parameters;
};

anim8.MoviePlayer = function(movie)
{
  this.movie = movie;
  this.startTime = 0;
  this.referenceTime = 0;
  this.direction = 1;
  this.currentIndex = 0;
};
