
/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParseSpring = function()
{
  
};

// ParseSpring extends anim8.Parser()
anim8.override( anim8.ParseSpring.prototype = new anim8.Parser(),
{
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
