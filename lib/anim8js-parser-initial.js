
/**
 * Instantiates a new parser for the 'initial' animation type.
 */
anim8.ParserInitial = function()
{
  
};

// ParserInitial extends anim8.Parser()
anim8.ParserInitial.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserInitial.prototype.parse = function( animation, options, events )
{
  // 1. Generate the events, only caring about the delays
  
	var values = animation.initial;
	
  var delays = animation.delays || {};
  var calculators = {};
	var defaults = {};
  
	for (var attr in values)
	{
		var value = values[attr];
    var calculator = false;
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculator = anim8.calculator( anim8.attribute[attr].calculator );
			defaultValue = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculator = anim8.calculator.default;
			defaultValue = calculator.create();
    }
    
    value = calculator.parse( value, defaultValue ); 
		
    var delay    = anim8.delay( anim8.coalesce( delays[attr], options.delay ) );
    
    var path     = new anim8.PointPath( attr, calculator, value );
    var event    = new anim8.Event( attr, path, 0, anim8.easing.default, delay, 0, 1, true, this );
    
    events.push( event );
	}
};

/**
 * Merges the options with the given event instances. This is when an existing 
 * animation is provided but the user wants to override the animation's options.
 *
 * Because event properties can be specified in several places there's a priority
 * to which one takes precedence. The properties specified in the animation object
 * itself are highest priority, followed by the new options, then by the old
 * options, and finally by the existing property on the event instance.
 *
 * @param {object} animation
 * @param {object} newOptions
 * @param {object} oldOptions
 * @param {Array} events
 */
anim8.ParserInitial.prototype.merge = function( animation, newOptions, oldOptions, events )
{
  var durations = animation.durations || {};
  var delays    = animation.delays || {};
  
  for (var i = 0; i < events.length; i++)
  {
    var e = events[i];
    var attr = e.attribute;
      
    if ( e.getParser() !== this )
    {
      continue;
    }
    
    e.delay = anim8.time( anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay ), e.delay );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.initial = new anim8.ParserInitial();