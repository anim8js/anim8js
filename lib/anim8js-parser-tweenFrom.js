
/**
 * Instantiates a new parser for the 'tweenFrom' animation type.
 */
anim8.ParserTweenFrom = function()
{
  
};

// ParserTweenFrom extends anim8.Parser()
anim8.override( anim8.ParserTweenFrom.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var tweenFrom  = animation.tweenFrom;

    for (var attr in tweenFrom)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenFrom[ attr ] );
      var path       = new anim8.Tween( attr, attribute.calculator, value, anim8.computed.current );
      var event      = helper.parseEvent( attr, path, this, true );
      
      attrimatorMap.put( attr, event );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['tweenFrom'] = new anim8.ParserTweenFrom();
