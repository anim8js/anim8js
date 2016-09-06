
function MovieTimeline(animator)
{
  this.animator = animator;
  this.attrimators = new AttrimatorMap();
  this.start = 0;
}

Class.define( MovieTimeline,
{

  addAttrimators: function(attrimatorMap, all, time, intro)
  {
    if ( this.attrimators.size() )
    {
      this.attrimators.playMapAt( attrimatorMap, all, time );
    }
    else if ( intro )
    {
      this.attrimators.putMap( attrimatorMap );
      this.attrimators.delay( time );
    }
    else
    {
      this.start = time;
      this.attrimators.putMap( attrimatorMap );
      this.attrimators.delay( time );
    }
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
