
/**
 * Instantiates a new parser for the 'initial' animation type.
 *
 * @class ParserInitial
 * @constructor
 * @extends Parser
 */
anim8.ParserInitial = function()
{
  
};

// ParserInitial extends anim8.Parser()
anim8.override( anim8.ParserInitial.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Generate the attrimators, only caring about the delays & scales
    
    var factory    = anim8.factory( animation.factory );
    var values     = animation.initial;
    
    for (var attr in values)
    {
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( values[ attr ] ); 
      var delay      = helper.parseDelay( attr );
      var oncer      = new anim8.Oncer( attr, value, delay, true, this );
      
      attrimatorMap.put( attr, oncer );
    }
  },
  merge: function( animation, newOptions, oldOptions, attrimatorMap, helper )
  {
    var factory    = anim8.factory( animation.factory );
    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var e = attrimators[i];
      var attr = e.attribute;
        
      if ( e.getParser() !== this )
      {
        continue;
      }
      
      e.delay     = helper.mergeDelay( attr, e.delay );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['initial'] = new anim8.ParserInitial();
