
/**
 * Instantiates a new parser for the 'tweenFrom' animation type.
 */
anim8.ParserTweenFrom = function()
{
  
};

// ParserTweenFrom extends anim8.Parser()
anim8.override( anim8.ParserTweenFrom.prototype = new anim8.Parser(),
{
    
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimators to the given array.
   * 
   * @param {object} animation
   * @param {object} options
   * @param {anim8.AttrimatorMap} attrimatorMap
   * @param {anim8.ParserHelper} helper
   */
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var tweenFrom  = animation.tweenFrom;

  	for (var attr in tweenFrom)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( tweenFrom[attr] );
      var duration   = helper.parseDuration( attr );
      var easing     = helper.parseEasing( attr );
      var delay      = helper.parseDelay( attr );
      var sleep      = helper.parseSleep( attr );
      var repeat     = helper.parseRepeat( attr );
      var scale      = helper.parseScale( attr );
      var scaleBase  = helper.parseScaleBase( attr );
      var path       = new anim8.Tween( attr, attribute.calculator, value, anim8.computed.current );
      var event      = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      attrimatorMap.put( attr, event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['tweenFrom'] = new anim8.ParserTweenFrom();
