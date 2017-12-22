
/**
 * Instantiates a new parser for the 'point' animation type.
 *
 * @class BuilderPoint
 * @constructor
 * @extends Builder
 */
function BuilderPoint()
{

}

Class.extend( BuilderPoint, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = $factory( animation.factory, helper.forObject );
    var values     = animation.point;

    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var path       = new PathPoint( attr, attribute.calculator, value );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});
