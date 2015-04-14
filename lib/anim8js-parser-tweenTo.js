
/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 */
anim8.ParserTweenTo = function()
{
  
};

// ParserTweenTo extends anim8.Parser()
anim8.override( anim8.ParserTweenTo.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var tweenTo    = animation.tweenTo;

    for (var attr in tweenTo)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenTo[ attr ] );
      var path       = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, value );
      var event      = helper.parseEvent( attr, path, this, true );
      
      attrimatorMap.put( attr, event );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['tweenTo'] = new anim8.ParserTweenTo();
