
/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 *
 * @class ParserTweenTo
 * @constructor
 * @extends Parser
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
 * A parser which generates attrimators which tween from the current value to 
 * the given values.
 *
 * **Examples:**
 * 
 *     animator.play({
 *      tweenTo: {
 *       opacity: 1.0,       // absolute value
 *       left: '+40'         // 40 more units from current value  
 *      }
 *     });
 * 
 *
 * @property {ParserTweenTo} tweenTo
 * @for anim8.parser
 */
anim8.parser['tweenTo'] = new anim8.ParserTweenTo();
