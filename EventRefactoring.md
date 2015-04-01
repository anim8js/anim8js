# The following is code that could be used to refactor how events are stored across the library.


anim8.EventMap = function(events)
{
  this.map = {};
  this.length = 0;

  if ( events instanceof anim8.EventMap )
  {
    for (var attribute in events.map)
    {
      this.put( events.map[ attribute ] ); 
    }
  }
  else if ( anim8.isArray( events ) )
  {
    for (var i = 0; i < events.length; i++)
    {
      this.put( events[i] );
    }
  }
  else if ( anim8.isObject( events ) )
  {
    for (var attribute in events )
    {
      this.put( events[ attribute ] );
    }
  }
};

anim8.EventMap.prototype = 
{
  put: function(e)
  {
    if ( !(e.attribute in this.map) )
    {
      this.length++;
    }

    this.map[ e.attribute ] = e;
  },
  remove: function(attribute)
  {
    if ( attribute in this.map )
    {
      delete this.map[ attribute ];
      this.length--;
    }
  },
  queue: function(e)
  {
    if ( e.attribute in this.map )
    {
      this.map[ e.attribute ].queue( e );
    }
    else
    {
      this.map[ e.attribute ] = e;
      this.length++;
    }
  },
  unqueue: function(attribute)
  {
    if ( attribute in this.map )
    {
      var e = this.map[ attribute ];

      if ( !e.next )
      {
        delete this.map[ attribute ];
        this.length--;
      }
      else
      {
        this.map[ attribute ] = e.next;
      }

      return e;
    }
  },
  clone: function()
  {
    var events = [];

    for (var attribute in this.map)
    {
      var e = this.map[ attribute ];

      events.push( e.clone ? e.clone() : e );
    }

    return new anim8.EventMap( events );
  },
  finiteTimeRemaining: function()
  {
    var remaining = 0;

    for (var attribute in this.map)
    {
      var e = this.map[ attribute ];
      
      if ( !e.isInfinite() )
      {
        remaining = Math.max( remaining, e.finiteTimeRemainingInChain() );  
      }
    }

    return remaining;
  }
};