
function MovieTimeline(animator)
{
  this.animator = animator;
  this.attrimators = new AttrimatorMap();
  this.start = 0;
}

Class.define( MovieTimeline,
{

  playAttrimators: function(attrimatorMap, all, time, intro)
  {
    if ( this.attrimators.size() )
    {
      this.attrimators.playMapAt( attrimatorMap, all, time );
    }
    else
    {
      this.attrimators.putMap( attrimatorMap );
      this.attrimators.delay( time );

      if ( !intro )
      {
        this.start = time;
      }
    }
  },

  queueAttrimators: function(attrimatorMap, all, time)
  {
    if ( all )
    {
      this.attrimators.stopNotPresentAt( attrimatorMap, time );
    }

    this.attrimators.queueMap( attrimatorMap );
  },

  transitionAttrimators: function(attrimatorMap, all, time, transition)
  {
    if ( all )
    {
      this.attrimators.stopNotPresentAt( attrimatorMap, time + transition.time );
    }

    this.attrimators.transitionMap(
      transition,
      attrimatorMap,
      function getValue(attr) {
        var attrimator = this.attrimators.get( attr );
        var attribute = this.animator.getAttribute( attr );

        return attrimator ? attrimator.valueAtSearch( time, attribute.cloneDefault() ) : undefined;
      },
      function getAttribute(attr) {
        return this.animator.getAttribute( attr );
      },
      function placeAttrimator(attrimator) {
        this.attrimators.playAttrimatorAt( attrimator, time );
      },
      function getValueAt(attrimator, relativeTime, out) {
        return attrimator.valueAtSearch( time + relativeTime, out );
      },
      function stopAttrimator(attrimator, relativeTime) {
        attrimator.stopAt( time + relativeTime );
      },
      this
    );
  },

  preupdate: function(time)
  {
    var animator = this.animator;
    var attrimators = this.attrimators.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = animator.attrimators.get( attr );
      var attrimatorAt = attrimator.attrimatorAt( time );

      if ( existing !== attrimatorAt )
      {
        if ( attrimatorAt )
        {
          animator.placeAttrimator( attrimatorAt );
        }
        else
        {
          animator.attrimators.remove( attr );
        }
      }
    }

    this.animator.preupdate( time );
  },

  update: function(time)
  {
    var animator = this.animator;
    var attrimators = this.attrimators.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var attribute = animator.getAttribute( attr );
      var calculator = attribute.calculator;
      var currentValue = animator.frame[ attr ];

      if ( calculator.isValid( currentValue ) )
      {
        var valueAt = attrimator.valueAtSearch( time, currentValue );

        if ( valueAt !== false )
        {
          animator.frame[ attr ] = valueAt;
          animator.updated[ attr ] = true;
        }
      }
    }
  },

  apply: function()
  {
    this.animator.apply();
  }

});
