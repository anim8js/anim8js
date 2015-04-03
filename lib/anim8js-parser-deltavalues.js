
/**
 * Instantiates a new parser for the 'deltas' & 'values' animation type.
 */
anim8.ParserDeltas = function()
{
  
};

// ParserDeltas extends anim8.Parser()
anim8.override( anim8.ParserDeltas.prototype = new anim8.Parser(),
{
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated events to the given array.
   * 
   * @param {object} animation
   * @param {object} options
   * @param {Array} events
   */
  parse: function( animation, options, events )
  {
    // 1. If deltas wasn't specified, assume a uniform distribution of points
    // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
    // 3. Generate the events
    
    var factory = anim8.factory( animation.factory );
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
    var scales = animation.scales || {};
    var scaleBases = animation.scaleBases || {};
    
  	for (var attr in values)
  	{
  		var value = values[ attr ];
      var attribute = factory.attribute( attr );
      var calculator = anim8.calculator( attribute );
  		var defaultValue = attributes.defaultValue;
  		
  		for (var k = 0; k < value.length; k++)
  		{
  			value[k] = calculator.parse( value[k], defaultValue );
  		}
  		
      var duration = anim8.coalesce( durations[attr], options.duration );
      var easing   = anim8.coalesce( easings[attr], options.easing );
      var delay    = anim8.coalesce( delays[attr], options.delay );
      var sleep    = anim8.coalesce( sleeps[attr], options.sleep );
      var repeat   = anim8.coalesce( repeats[attr], options.repeat );
      var scale    = anim8.coalesce( scales[attr], options.scale );
      var scaleBase= anim8.coalesce( scaleBases[attr], options.scaleBase );

      var path     = new anim8.DeltaPath( attr, calculator, values[attr], deltas[attr] );
      var event    = new anim8.Event( attr, path, duration, easing, delay, sleep, repeat, scale, scaleBase, true, this );
      
      events.push( event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser.values = new anim8.ParserDeltas();
