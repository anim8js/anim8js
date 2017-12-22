
/**
 * Instantiates a new builder for the 'final' animation type.
 *
 * @class BuilderFinal
 * @constructor
 * @extends Builder
 */
function BuilderFinal()
{

}

Class.extend( BuilderFinal, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays and durations

    var factory = $factory( animation.factory, helper.forObject );
    var values = animation.final;

    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var delay      = $delay( helper.parseDelay( attr ) );
      var duration   = $duration( helper.parseDuration( attr ) );
      var event      = new Oncer( attr, value, delay + duration, false, this, null, animation );

      attrimatorMap.put( attr, event );
    }
  },
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.delay = helper.mergeDelay( attr, e.delay ) +
              helper.mergeDuration( attr, e.duration );
  }
});
