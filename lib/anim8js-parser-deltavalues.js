anim8.parser.deltas = function( animation, options, events ) 
{
	var deltas = animation.deltas;
	var values = animation.values;
	
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
      if ( value[k] !== true )
      {
  			value[k] = calculators[attr].parse( value[k], defaults[attr] ); 
      }
		}
		
    var duration = anim8.coalesce( durations[attr], options.duration, anim8.defaults.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing, anim8.defaults.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep, anim8.defaults.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat, anim8.defaults.repeat );

    var path     = new anim8.DeltaPath( attr, calculators[attr], values[attr], deltas[attr] );
    var event    = new anim8.Event( attr, path, duration, anim8.easing( easing ), delay, sleep, repeat );
    
    events.push( event );
	}
	
	return true;
};