
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
      this.attrimatorMap.playMapAt( attrimatorMap, all, time );
    }
    else if ( intro )
    {
      this.attrimatorMap.putMap( attrimatorMap );
      this.attrimatorMap.delay( time );
    }
    else
    {
      this.start = time;
      this.attrimatorMap.putMap( attrimatorMap );
      this.attrimatorMap.delay( time );
    }
  },

  preupdate: function(time)
  {
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

      if ( !calculator.isValid( animator.frame[ attr ] ) )
      {
        var gotten = {};
        gotten[ attr ] = '';

        animator.get( gotten );

        if ( !calculator.isValid( gotten[ attr ] ) )
        {
          animator.frame[ attr ] = attribute.cloneDefault();
        }
        else
        {
          animator.frame[ attr ] = gotten[ attr ];
        }
      }

      var valueAt = attrimator.valueAtSearch( time, animator.frame[ attr ] );

      if ( valueAt !== false )
      {
        animator.frame[ attr ] = valueAt;
        animator.updated[ attr ] = true;
      }
    }
  },

  apply: function()
  {
    this.animator.apply();
  }

});
