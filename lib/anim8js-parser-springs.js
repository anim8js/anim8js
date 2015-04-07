
/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParseSpring = function()
{
  
};

// ParseSpring extends anim8.Parser()
anim8.override( anim8.ParseSpring.prototype = new anim8.Parser(),
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
    var springs    = animation.springs;

  	for (var attr in springs)
  	{
      var spring     = springs[ attr ];

      if ( !anim8.isDefined( spring.attribute ) )
      {
        spring.attribute = attr;
      }

      var parsed = anim8.spring( spring );
      
      if ( parsed !== false )
      {
        parsed.parser = this;

        attrimatorMap.put( attr, parsed );  
      }
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['springs'] = new anim8.ParseSpring();
