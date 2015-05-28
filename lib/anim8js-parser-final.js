
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
      var scale      = helper.parseScale( attr );
      var scaleBase  = helper.parseScaleBase( attr );
      var path       = new anim8.PathPoint( attr, attribute.calculator, value );
      var event      = new anim8.Event( attr, path, 0, anim8.easing(), delay + duration, 0, 0, 1, scale, scaleBase, false, this );
      
      attrimatorMap.put( attr, event );
    }
  },
  merge: function( animation, newOptions, oldOptions, attrimatorMap, helper )
  {
    var factory = anim8.factory( animation.factory );
    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var e = attrimators[i];
      var attr = e.attribute;
        
      if ( e.getParser() !== this )
      {
        continue;
      }

      e.delay     = helper.mergeDelay( attr, e.delay ) + helper.mergeDuration( attr, e.duration );
      e.scale     = helper.mergeScale( attr, e.scale );
      e.scaleBase = helper.mergeScaleBase( attr, e.scaleBase, factory ); 
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['final'] = new anim8.ParserFinal();

