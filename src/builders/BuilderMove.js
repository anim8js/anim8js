
/**
 * Instantiates a new parser for the 'move' animation type.
 *
 * @class BuilderMove
 * @constructor
 * @extends Builder
 */
function BuilderMove()
{

}

Class.extend( BuilderMove, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory, helper.forObject );
    var move       = animation.move;

    for (var attr in move)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( move[ attr ] );
      var path       = new Tween( attr, attribute.calculator, computed.current, computed.relative( value ) );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});
