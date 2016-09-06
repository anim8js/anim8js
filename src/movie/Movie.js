
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
  this.head = new MovieNode( 0, 0 );
  this.currentTime = 0;
  this.currentTimelines = [];
  this.currentNode = this.head;
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

    var node = this.currentNode;

    while (node.start > at)
    {
      node = node.prev;
    }
    while (node.start < a && node.next.start >= a)
    {
      node = node.next;
    }

    this.currentTime = at;
    this.currentNode = node.start === at ? node : MovieNode.insertAfter( node, at );

    return this;
  },
  seek: function(time)
  {
    var by = $time( time, false );

    if ( by === false )
    {
      throw 'Invalid time in Movie.move: ' + time;
    }

    return this.at( this.currentTime + by );
  },
  end: function()
  {
    return this.seekEndOf( this.head.prev );
  },
  next: function()
  {
    return this.seekEndOf( this.currentNode );
  },
  seekEndOf: function(node)
  {
    var head = this.head;
    var next = curr.next;
    var endTime = curr.end;

    while (next.start < endTime && next !== head)
    {
      node = next;
      next = node.next;
    }

    if (node.start !== endTime)
    {
      node = MovieNode.insertAfter( node );
    }

    this.currentTime = endTime;
    this.currentNode = node;

    return this;
  },
  call: function(callback, context)
  {
    this.currentNode.callbacks.push( callback );

    return this;
  },
  play: function(animation, options, all)
  {
    var attrimatorMap = $attrimatorsFor( animation, options );

    if ( this.introduce )
    {
      attrimatorMap.delay( this.currentTime );
      this.head.addAction( this.currentSubjects, attrimatorMap, all, );
      this.introduce = false;
    }
    else
    {
      this.currentNode.addAction( this.currentSubjects, attrimatorMap, all );
    }

    return this;
  },
  queue: function(animation, options, all)
  {
    var attrimatorMap = $attrimatorsFor( animation, options );
    var action = this.currentNode.findActionFor( this.currentSubjects );

    if ( action )
    {
      action.attrimators.queueMap( attrimatorMap );
    }

    return this;
  }
});

eventize( Movie.prototype );
