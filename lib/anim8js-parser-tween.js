
/**
 * Instantiates a new parser for the 'tweenTo' animation type.
 */
anim8.ParserTween = function()
{
  
};

// ParserTween extends anim8.Parser()
anim8.ParserTween.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserTween.prototype.parse = function( animation, options, events )
{
  // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

  var tweenTo = animation.tweenTo;

  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};

	for (var attr in tweenTo)
	{
    var calculator = null;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue= calculator.create();
    }
		
    var value    = calculator.parse( tweenTo[attr], defaultValue );
    var duration = anim8.coalesce( durations[attr], options.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat );
    
    var path     = new anim8.Tween( attr, calculator, true, value );
    var event    = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, true, this );
    
    events.push( event );
	}
};

// Add the parser to the object of possible parsers
anim8.parser.tweenTo = new anim8.ParserTween();