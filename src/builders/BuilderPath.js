
/**
 * Instantiates a new parser for the 'path' animation type.
 *
 * @class BuilderPath
 * @constructor
 * @extends Builder
 */
function BuilderPath()
{

}

Class.extend( BuilderPath, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory = $factory( animation.factory, helper.forObject );
    var path    = animation.path;

    for (var attr in path)
    {
      var attribute  = factory.attribute( attr );
      var pathDefinition = path[ attr ];

      if ( !( pathDefinition instanceof Path ) )
      {
        pathDefinition.name = attr;
        pathDefinition.calculator = attribute.calculator;
      }

      var parsedPath = $path( pathDefinition );
      var event      = helper.parseEvent( attr, parsedPath, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});
