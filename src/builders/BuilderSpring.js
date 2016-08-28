
/**
 * Instantiates a new parser for the 'springs' animation type.
 *
 * @class BuilderSpring
 * @constructor
 * @extends Builder
 */
function BuilderSpring()
{

}

Class.extend( BuilderSpring, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = $factory( animation.factory );
    var springs    = animation.springs;

    for (var attr in springs)
    {
      var spring     = springs[ attr ];

      if ( !isDefined( spring.attribute ) )
      {
        spring.attribute = attr;
      }

      var parsed = $spring( spring );

      if ( parsed !== false )
      {
        parsed.parser = this;

        attrimatorMap.put( attr, parsed );
      }
    }
  },

  merge: false
});
