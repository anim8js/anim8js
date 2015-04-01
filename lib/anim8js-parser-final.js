
/**
 * Instantiates a new parser for the 'final' animation type.
 */
anim8.ParserFinal = function()
{
  
};

// ParserFinal extends anim8.Parser()
anim8.ParserFinal.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserFinal.prototype.parse = function( animation, options, events )
{
  // 1. Generate the events, only caring about the delays and durations
  
	var values = animation.final;
	
  var delays = animation.delays || {};
  var durations = animation.durations || {};
  var scales = animation.scales || {};
  var scaleBases = animation.scaleBases || {};
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
    var duration = anim8.duration( anim8.coalesce( durations[attr], options.duration ) );
    var scale    = anim8.coalesce( scales[attr], options.scale );
    var scaleBase= anim8.coalesce( scaleBases[attr], options.scaleBase );

    var path     = new anim8.PointPath( attr, calculator, value );
    var event    = new anim8.Event( attr, path, 0, anim8.easing.default, delay + duration, 0, 1, scale, scaleBase, false, this );
    
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
anim8.ParserFinal.prototype.merge = function( animation, newOptions, oldOptions, events )
{
  var durations = animation.durations || {};
  var delays    = animation.delays || {};
  var scales    = animation.scales || {};
  var scaleBases = animation.scaleBases || {};
  
  for (var i = 0; i < events.length; i++)
  {
    var e = events[i];
    var attr = e.attribute;
    var calc = e.path.calculator;
      
    if ( e.getParser() !== this )
    {
      continue;
    }

    var delay = anim8.coalesce( delays[attr], newOptions.delay, oldOptions.delay );
    var duration = anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration );

    e.delay = anim8.delay( delay ) + anim8.duration( duration );
    e.scale = anim8.coalesce( scales[attr], newOptions.scale, oldOptions.scale, e.scale );
    e.scaleBase = calc.parse( anim8.coalesce( scaleBases[attr], newOptions.scaleBase, oldOptions.scaleBase ), e.scaleBase );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.final = new anim8.ParserFinal();