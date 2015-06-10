
/**
 * Instantiates a new parser for the 'final' animation type.
 *
 * @class ParserFinal
 * @constructor
 * @extends Parser
 */
anim8.ParserFinal = function()
{
  
};

// ParserFinal extends anim8.Parser()
anim8.override( anim8.ParserFinal.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays and durations
    
    var factory = anim8.factory( animation.factory );
    var values = animation.final;
    
    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] );
      var delay      = anim8.delay( helper.parseDelay( attr ) );
      var duration   = anim8.duration( helper.parseDuration( attr ) );
      var event      = new anim8.Oncer( attr, value, delay + duration, false, this, null, animation );
      
      attrimatorMap.put( attr, event );
    }
  },
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.delay = helper.mergeDelay( attr, e.delay ) + 
              helper.mergeDuration( attr, e.duration );
  }
});

/**
 * Register the parser.
 */
anim8.parser['final'] = new anim8.ParserFinal();

