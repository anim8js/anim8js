
/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParsePhysics = function()
{
  
};

// ParsePhysics extends anim8.Parser()
anim8.override( anim8.ParsePhysics.prototype = new anim8.Parser(),
{
    
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimators to the given array.
   * 
   * @param {object} animation
   * @param {object} options
   * @param {anim8.AttrimatorMap} attrimatorMap
   * @param {anim8.ParserHelper} helper
   */
  parse: function( animation, options, attrimatorMap, helper )
  {
    var factory    = anim8.factory( animation.factory );
    var physics    = animation.physics;

  	for (var attr in physics)
  	{
      var physic    = physics[ attr ];

      var attrimator = new anim8.Physics(
        attr, 
        this, 
        physic.calculator, 
        anim8.coalesce( physic.position, true ), 
        physic.velocity, 
        physic.acceleration, 
        physic.terminal,
        physic.stopAt
      );

      attrimatorMap.put( attr, attrimator );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['physics'] = new anim8.ParsePhysics();
