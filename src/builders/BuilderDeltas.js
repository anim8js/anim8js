
/**
 * Instantiates a new parser for the 'deltas' & 'values' animation type.
 *
 * @class BuilderDeltas
 * @constructor
 * @extends Builder
 */
function BuilderDeltas()
{

}

Class.extend( BuilderDeltas, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. If deltas wasn't specified, assume a uniform distribution of points
    // 2. If deltas was an array, expand out into an object where the keys are attributes and the value is the delta array
    // 3. Generate the attrimators

    var mergeId = Builder.nextMergeId();
    var factory = $factory( animation.factory, helper.forObject );
    var deltas = animation.deltas;
    var values = animation.values;

    if ( !isDefined( deltas ) )
    {
      deltas = {};
    }
    else if ( isArray( deltas ) )
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
      var valueMax = value.length - 1;
      var delta = deltas[ attr ];
      var attribute = factory.attribute( attr );

      for (var k = 0; k <= valueMax; k++)
      {
        value[k] = attribute.parse( value[k] );
      }

      if ( !isArray( delta ) )
      {
        delta = [];

        for (var i = 0; i <= valueMax; i++)
        {
          delta[i] = i / valueMax;
        }
      }

      var path      = new PathDelta( attr, attribute.calculator, value, delta );
      var event     = helper.parseEvent( attr, path, this, true );

      event.mergeId = mergeId;

      attrimatorMap.put( attr, event );
    }
  }
});
