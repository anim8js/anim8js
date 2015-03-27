
/**
 * Instantiates a new parser for the 'keyframe' animation type.
 */
anim8.ParserKeyframe = function()
{
  
};

// ParserKeyframe extends anim8.Parser()
anim8.ParserKeyframe.prototype = new anim8.Parser();
  
/**
 * Parses the animation object (and optionally an option object) and pushes
 * all generated events to the given array.
 * 
 * @param {object} animation
 * @param {object} options
 * @param {Array} events
 */
anim8.ParserKeyframe.prototype.parse = function( animation, options, events )
{
  // 1. Normalize keys by converting aliases to the actual value
  // 2. Split up keys that have commas into multiple entries
  // 3. Validate keys and remove invalid ones - also calculate max key value
  // 4. Sort frames by the key
  // 5. Expand frames to generate delta arrays, value arrays, and easing arrays
  // 6. Generate the events
  
  var kframes = animation.keyframe;
  
  var durations = animation.durations || {};
  var easings = animation.easings || {};
  var delays = animation.delays || {};
  var sleeps = animation.sleeps || {};
  var repeats = animation.repeats || {};
  
  var teasing = anim8.easing( anim8.coalesce( options.teasing, anim8.defaults.teasing ) );
  
  var sort = false;
  
  var aliases = {
    from:     '0',
    start:    '0',
    initial:  '0',
    first:    '0',
    half:     '50',
    middle:   '50',
    to:       '100',
    end:      '100',
    last:     '100'
  };
  
  // split up comma delimited times
  for (var time in kframes)
  {
    if ( time in aliases )
    {
      kframes[ aliases[time] ] = kframes[ time ];
      
      delete kframes[ time ];
    }
    else if ( time.indexOf(',') !== -1 )
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
  var pathEasings = {};
  
  for (var i = 0; i < times.length; i++)
  {
    var frame = times[i];
    var easing = anim8.coalesce( frame.value.easing, options.easing );
    
    delete frame.value.easing;
    
    for (var attr in frame.value)
    {
      if ( !(attr in deltas) )
      {
        deltas[attr] = [];
        values[attr] = [];
        pathEasings[attr] = [];
        
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
			
      deltas[attr].push( frame.order / maxTime );
      values[attr].push( calculators[attr].parse( frame.value[attr], defaults[attr] ) );
      pathEasings[attr].push( anim8.easing( anim8.coalesce( easings[attr], easing ) ) );
    }
  }
	
  // create events & paths
  for (var attr in deltas)
  {
    var duration = anim8.coalesce( durations[attr], options.duration, anim8.defaults.duration );
    var delay    = anim8.coalesce( delays[attr], options.delay, anim8.defaults.delay );
    var sleep    = anim8.coalesce( sleeps[attr], options.sleep, anim8.defaults.sleep );
    var repeat   = anim8.coalesce( repeats[attr], options.repeat, anim8.defaults.repeat );
    
    var path     = new anim8.KeyframePath( attr, calculators[attr], values[attr], deltas[attr], pathEasings[attr] );
    var event    = new anim8.Event( attr, path, duration, teasing, delay, sleep, repeat, true, this );
    
    events.push( event );
  }
};

// Add the parser to the object of possible parsers
anim8.parser.keyframe = new anim8.ParserKeyframe();