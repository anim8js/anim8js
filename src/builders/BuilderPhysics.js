
/**
 * Instantiates a new builder for the 'physics' animation type.
 *
 * @class BuilderPhysics
 * @constructor
 * @extends Builder
 */
function BuilderPhysics()
{

}

Class.extend( BuilderPhysics, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = $factory( animation.factory );
    var physics    = animation.physics;

    for (var attr in physics)
    {
      var physic    = physics[ attr ];

      var attrimator = new Physics(
        attr,
        this,
        physic.calculator,
        coalesce( physic.position, true ),
        physic.velocity,
        physic.acceleration,
        physic.terminal,
        physic.stopAt
      );

      attrimatorMap.put( attr, attrimator );
    }
  },

  merge: false
});
