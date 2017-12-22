
/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 *
 * @class BuilderTweenTo
 * @constructor
 * @extends Builder
 */
function BuilderTweenTo()
{

}

Class.extend( BuilderTweenTo, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory, helper.forObject );
    var tweenTo    = animation.tweenTo;

    for (var attr in tweenTo)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenTo[ attr ] );
      var path       = new Tween( attr, attribute.calculator, computed.current, value );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});
