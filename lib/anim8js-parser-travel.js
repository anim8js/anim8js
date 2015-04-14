
/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParserTravel = function()
{
  
};

// ParserTravel extends anim8.Parser()
anim8.override( anim8.ParserTravel.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var travel     = animation.travel;

    /**
     * The computed function which returns a function which returns a value pointing
     * to a given target given the current position of the animator.
     * 
     * @param  {Number}
     * @param  {any}
     * @param  {Number}
     * @return {Function}
     */
    var pointing = function(amount, target, epsilon, subtractVelocity)
    {
      var pointingFunction = function(attrimator, animator)
      {
        var attribute = animator.getAttribute( attrimator.attribute );
        var calc = attribute.calculator;
        var targetValue = anim8.isComputed( target ) ? target( attrimator, animator ) : target;
        var temp = calc.create();

        return function()
        {
          var position   = attrimator.position;
          var current    = calc.copy( temp, anim8.resolve( targetValue ) );
          var difference = calc.sub( current, position );
          var distance   = calc.distance( difference, calc.ZERO );

          if ( distance < epsilon )
          {
            attrimator.stopIn( 0 );
          }
          else
          {
            difference = calc.scale( difference, amount / distance );
          }
          
          if ( subtractVelocity )
          {
            difference = calc.sub( difference, attrimator.resolveVelocity() );
          }

          return difference;
        };
      };

      pointingFunction.computed = true;

      return pointingFunction;
    };

    for (var attr in travel)
    {
      var traveling     = travel[ attr ];
      var attribute     = factory.attribute( attr );
      var from          = attribute.parse( anim8.coalesce( traveling.from, true ) );
      var to            = attribute.parse( anim8.coalesce( traveling.to, true ) );
      var velocity      = anim8.number( traveling.velocity, 0 );
      var acceleration  = anim8.number( traveling.acceleration, 0 );
      var terminal      = anim8.number( anim8.coalesce( traveling.terminal, traveling.velocity ), Number.POSITIVE_INFINITY );
      var epsilon       = anim8.number( traveling.epsilon, 0.001 );

      if ( acceleration !== 0 )
      {
        acceleration = pointing( acceleration, to, epsilon, true );
      }

      if ( velocity !== 0 )
      {
        velocity = pointing( velocity, to, epsilon, false );
      }

      var traveler = new anim8.Physics(
        attr,
        this,
        attribute.calculator,
        from,
        velocity,
        acceleration,
        terminal
      );
      
      attrimatorMap.put( attr, traveler );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['travel'] = new anim8.ParserTravel();
