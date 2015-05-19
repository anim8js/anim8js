
/**
 * Instantiates a new parser for the 'deltas' & 'values' animation type.
 *
 * @class ParserDeltas
 * @constructor
 * @extends Parser
 */
anim8.ParserDeltas = function()
{
  
};

// ParserDeltas extends anim8.Parser()
anim8.override( anim8.ParserDeltas.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. If deltas wasn't specified, assume a uniform distribution of points
    // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
    // 3. Generate the attrimators
    
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
    
    for (var attr in values)
    {
      var value = values[ attr ];
      var attribute = factory.attribute( attr );
      
      for (var k = 0; k < value.length; k++)
      {
        value[k] = attribute.parse( value[k] );
      }

      var path      = new anim8.PathDelta( attr, attribute.calculator, values[ attr ], deltas[ attr ] );
      var event     = helper.parseEvent( attr, path, this, true );
      
      attrimatorMap.put( attr, event );
    }
  }
});

/**
 * Register the parser.
 */
anim8.parser['values'] = new anim8.ParserDeltas();
