
/**
 * Instantiates a new parser for the 'deltas' & 'values animation type.
 */
anim8.ParserDeltas = function()
{
  
};

// ParserDeltas extends anim8.Parser()
anim8.ParserDeltas.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserDeltas.prototype.parse = function( animation, options, events )
{
  // 1. If deltas wasn't specified, assume a uniform distribution of points
  // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
  // 3. Generate the events
  
	var deltas = animation.deltas;
	var values = animation.values;

  if ( !anim8.isDefined( deltas ) )
  {
    var valueCount = 0;
    
		for (var attr in values)
		{
      valueCount++; 
    }
    
    deltas = [];
    
    for (var i = 0; i < valueCount; i++)
    {
      deltas[i] = i / (valueCount - 1);
    }
  }
	if ( anim8.isArray( deltas ) )
	{
		var deltaObject = {};
		
		for (var attr in values)
		{
			deltaObject[attr] = deltas;	
		}
		
		deltas = deltaObject;
	}
	
  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};
  var calculators = {};
	var defaults = {};
  
	for (var attr in values)
	{
		var value = values[attr];
		var defaultValue = false;
		
    if ( attr in anim8.attribute )
    {
      calculators[attr] = anim8.calculator( anim8.attribute[attr].calculator );
			defaults[attr] = anim8.attribute[attr].defaultValue;
    }
    else
    {
      calculators[attr] = anim8.calculator.default;
			defaults[attr] = calculators[attr].create();
    }
		
		for (var k = 0; k < value.length; k++)
		{
			value[k] = calculators[attr].parse( value[k], defaults[attr] );
		}
		
    var duration = anim8.coalesce( durations[attr], options.duration, anim8.defaults.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing, anim8.defaults.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep, anim8.defaults.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat, anim8.defaults.repeat );

    var path     = new anim8.DeltaPath( attr, calculators[attr], values[attr], deltas[attr] );
    var event    = new anim8.Event( attr, path, duration, anim8.easing( easing ), delay, sleep, repeat, true, this );
    
    events.push( event );
	}
};

// Add the parser to the object of possible parsers
anim8.parser.values = new anim8.ParserDeltas();