
/**
 * Instantiates a new builder for the 'tweenFrom' animation type.
 *
 * @class BuilderTweenFrom
 * @constructor
 * @extends Builder
 */
function BuilderTweenFrom()
{

}

Class.extend( BuilderTweenFrom, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = $factory( animation.factory, helper.forObject );
    var tweenFrom  = animation.tweenFrom;

    for (var attr in tweenFrom)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenFrom[ attr ] );
      var path       = new Tween( attr, attribute.calculator, value, computed.current );
      var event      = helper.parseEvent( attr, path, this, true );

      attrimatorMap.put( attr, event );
    }
  }
});
