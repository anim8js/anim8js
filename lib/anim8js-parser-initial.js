anim8.parser.initial = function( animation, options, events ) 
{
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
    
    if ( value !== true )
    {
      value = calculator.parse( value, defaultValue ); 
    }
		
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    
    var path     = new anim8.PointPath( attr, calculator, value );
    var event    = new anim8.Event( attr, path, 0, anim8.easing.default, delay, 0, 1 );
    
    events.push( event );
	}
	
	return true;
};