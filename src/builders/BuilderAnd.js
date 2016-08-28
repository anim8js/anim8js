
/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class BuilderAnd
 * @constructor
 * @extends Builder
 */
function BuilderAnd()
{

}

Class.extend( BuilderAnd, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var and = animation.and;

    and.factory = coalesce( and.factory, animation.factory );

    attrimatorMap.putMap( $attrimatorsFor( and, options ) );
  },
  
  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    this.submerge( input.and, newOptions, oldOptions, attrimatorMap );
  }
});
