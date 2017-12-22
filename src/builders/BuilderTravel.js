
/**
 * Instantiates a new parser for the 'travel' animation type.
 *
 * @class BuilderTravel
 * @constructor
 * @extends Builder
 */
function BuilderTravel()
{

}

Class.extend( BuilderTravel, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory, helper.forObject );
    var travel     = animation.travel;

    for (var attr in travel)
    {
      var traveling     = travel[ attr ];
      var attribute     = factory.attribute( attr );
      var fromParsed    = attribute.parse( coalesce( traveling.from, true ) );
      var toParsed      = attribute.parse( coalesce( traveling.to, true ) );
      var velocity      = $number( traveling.velocity, 0 );
      var acceleration  = $number( traveling.acceleration, 0 );
      var terminal      = $number( coalesce( traveling.terminal, traveling.velocity ), Number.POSITIVE_INFINITY );
      var epsilon       = $number( traveling.epsilon, 0.001 );

      if ( acceleration !== 0 )
      {
        acceleration = computed.pointing( acceleration, toParsed, epsilon, true );
      }

      if ( velocity !== 0 )
      {
        velocity = computed.pointing( velocity, toParsed, epsilon, false );
      }

      var traveler = new Physics(
        attr,
        this,
        attribute.calculator,
        fromParsed,
        velocity,
        acceleration,
        terminal
      );

      attrimatorMap.put( attr, traveler );
    }
  },

  merge: false
});

/**
 * The computed function which returns a function which returns a value pointing
 * to a given target given the current position of the animator.
 *
 * @param  {Number}
 * @param  {any}
 * @param  {Number}
 * @return {Function}
 */
computed('pointing', function(amount, target, epsilon, subtractVelocity)
{
  function pointingFunction(attrimator, animator)
  {
    var attribute = animator.getAttribute( attrimator.attribute );
    var calc = attribute.calculator;
    var targetValue = isComputed( target ) ? target( attrimator, animator ) : target;
    var temp = calc.create();

    return function()
    {
      var position   = attrimator.position;
      var current    = calc.copy( temp, resolve( targetValue ) );
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
  }

  return computed( pointingFunction );
});
