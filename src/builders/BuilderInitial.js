
/**
 * Instantiates a new parser for the 'initial' animation type.
 *
 * @class BuilderInitial
 * @constructor
 * @extends Builder
 */
function BuilderInitial()
{

}

Class.extend( BuilderInitial, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays & scales

    var factory    = $factory( animation.factory );
    var values     = animation.initial;

    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var delay      = helper.parseDelay( attr );
      var oncer      = new Oncer( attr, value, delay, true, this, null, animation );

      attrimatorMap.put( attr, oncer );
    }
  },
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.delay = helper.mergeDelay( attr, e.delay );
  }
});
