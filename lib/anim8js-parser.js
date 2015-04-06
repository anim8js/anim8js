
/**
 * Returns a parser based on the input. If the input is a function that function is immediately returned.
 * If the input is a string the parser with that name is returned. If no parser could be determined then
 * false is returned.
 * 
 * @param {function|string} parser
 */
anim8.parser = function(parser)
{
  if ( parser instanceof anim8.Parser )
  {
    return parser;
  }
	if ( anim8.isString( parser ) && parser in anim8.parser )
	{
		return anim8.parser[ parser ];
	}
	
	return false;
};

/**
 * Instantiates a new Parser.
 */
anim8.Parser = function()
{
  
};

anim8.Parser.prototype = 
{
  
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimatorMap to the given array.
   * 
   * @param {object} animation
   * @param {object} options
   * @param {anim8.AttrimatorMap} attrimatorMap
   */
  parse: function( animation, options, attrimatorMap )
  {
    throw 'Parser.parse not implemented';
  },
  
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
   * @param {anim8.AttrimatorMap} attrimatorMap
   */
  merge: function( animation, newOptions, oldOptions, attrimatorMap )
  {
    var durations = animation.durations || {};
    var easings   = animation.easings || {};
    var delays    = animation.delays || {};
    var sleeps    = animation.sleeps || {};
    var repeats   = animation.repeats || {};
    var scales    = animation.scales || {};
    var scaleBases= animation.scaleBases || {};
    
    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var e = attrimators[ i ];
      
      if ( e.getParser() !== this )
      {
        continue;
      }
      
      var attr = e.attribute;
      var calc = e.path.calculator;

      e.easing    = anim8.easing( anim8.coalesce( easings[attr],   newOptions.easing,   oldOptions.easing   ), e.easing );
      e.repeat    = anim8.repeat( anim8.coalesce( repeats[attr],   newOptions.repeat,   oldOptions.repeat   ), e.repeat );
      e.delay     = anim8.time(   anim8.coalesce( delays[attr],    newOptions.delay,    oldOptions.delay    ), e.delay );
      e.sleep     = anim8.time(   anim8.coalesce( sleeps[attr],    newOptions.sleep,    oldOptions.sleep    ), e.sleep );
      e.duration  = anim8.time(   anim8.coalesce( durations[attr], newOptions.duration, oldOptions.duration ), e.duration );
      e.scale     =               anim8.coalesce( scales[attr],    newOptions.scale,    oldOptions.scale     , e.scale );
      e.scaleBase = calc.parse(   anim8.coalesce( scaleBases[attr],newOptions.scaleBase,oldOptions.scaleBase), e.scaleBase );
    }
  }
};