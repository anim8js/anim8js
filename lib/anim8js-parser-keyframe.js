anim8.parser.keyframe = function( animation, options, events ) 
{
  var kframes = animation.keyframe;
  
  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};
  
  var sort = false;
  
  // split up comma delimited times
  for (var time in kframes)
  {
    if (time.indexOf(',') !== -1)
    {
      var times = time.split(',');
      
      for (var i = 0; i < times.length; i++)
      {
        kframes[times[i]] = kframes[time];
      }
      
      delete kframes[time];
      
      sort = true;
    }
  }
  
  var times = [];
  
  // validate times
  var lastTime = 0.0;
  var maxTime = 0.0;
  
  for (var time in kframes)
  {
    var t = parseFloat(time);
    
    if (isNaN(t))
    {
      delete kframes[time];
    }
    else
    {
      if (t < lastTime)
      {
        sort = true;
      }
      
      times.push({
        order: t,
        key: time,
        value: kframes[time]
      });
      
      lastTime = t;
      
      maxTime = Math.max( maxTime, t );
    }
  }
  
  // sort if necessary
  if (sort)
  {
    times.sort(function(a, b) {
      return a.order - b.order;
    });
    
    kframes = {};
    
    for (var i = 0; i < times.length; i++)
    {
      kframes[times[i].key] = times[i].value;
    }
  }
  
  // split up into deltas and values
  var deltas = {};
  var values = {};
  var calculators = {};
	var defaults = {};
  
  for (var i = 0; i < times.length; i++)
  {
    var frame = times[i];
    
    for (var attr in frame.value)
    { 
			var value = frame.value[attr];
			var defaultValue = false;
			
      if (!(attr in deltas))
      {
        deltas[attr] = [];
        values[attr] = [];
        
        if (attr in anim8.attribute)
        {
          calculators[attr] = anim8.calculator( anim8.attribute[attr].calculator );
					defaults[attr] = anim8.attribute[attr].defaultValue;
        }
        else
        {
          calculators[attr] = anim8.calculator.default;
					defaults[attr] = calculators[attr].create();
        }
      }
			
			value = calculators[attr].parse( value, defaults[attr] );
      
      deltas[attr].push( frame.order / maxTime );
      values[attr].push( value );
    }
  }
	
	// TODO console.log( 'deltas', deltas, 'values', values, 'calculators', calculators );
	
  // create events & paths
  for (var attr in deltas)
  {
    var duration = anim8.coalesce( durations[attr], options.duration, anim8.defaults.duration );
    var easing   = anim8.coalesce( easings[attr], options.easing, anim8.defaults.easing );
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep, anim8.defaults.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat, anim8.defaults.repeat );

    var path     = new anim8.Path( attr, values[attr], deltas[attr], calculators[attr] );
    var event    = new anim8.Event( attr, path, duration, anim8.easing( easing ), delay, sleep, repeat );
    
    events.push( event );
  }
};