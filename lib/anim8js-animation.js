
anim8.Animation = function(name, input, options, events)
{
	this.name = name;
	this.input = input;
	this.options = options;
	this.events = events;
};

anim8.Animation.prototype = 
{
  isSaved: function()
  {
    return (this.name !== false);
  },
  mergeOptions: function(options, events)
  { 
    // TODO move to parsers
    
    var durations = this.input.durations || {};
    var easings   = this.input.easings || {};
    var delays    = this.input.delays || {};
    var sleeps    = this.input.sleeps || {};
    var repeats   = this.input.repeats || {};
    
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
      
      e.easing   = anim8.easing( anim8.coalesce( easings[attr], options.easing, this.options.easing, e.easing ) );
      e.duration = anim8.coalesce( durations[attr], options.duration, this.options.duration, e.duration );
      e.delay    = anim8.coalesce( delays[attr], options.delay, this.options.delay, e.delay );
      e.sleep    = anim8.coalesce( sleeps[attr], options.sleep, this.options.sleep, e.sleep );
      e.repeat   = anim8.coalesce( repeats[attr], options.repeat, this.options.repeat, e.repeat );
    }
  },
  newEvents: function()
  {
    var e = [];
    
    for (var i = 0; i < this.events.length; i++)
    {
      e.push( this.events[i].newInstance() );
    }
    
    return e;
  }
};

anim8.save = function(name, animation, options)
{
  var animation = anim8.animation( animation, options );
  
  animation.name = name;
  
	anim8.animation[name] = animation;
};