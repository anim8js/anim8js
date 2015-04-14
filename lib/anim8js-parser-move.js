
/**
 * Instantiates a new parser for the 'move' animation type.
 */
anim8.ParserMove = function()
{
  
};

// ParserMove extends anim8.Parser()
anim8.override( anim8.ParserMove.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Starting values are all true which signals to Animator to replace those points with the animator's current values.

    var factory    = anim8.factory( animation.factory );
    var move       = animation.move;

  	for (var attr in move)
  	{
      var attribute  = factory.attribute( attr );
      var value      = attribute.parse( move[ attr ] );
      var path       = new anim8.Tween( attr, attribute.calculator, anim8.computed.current, anim8.computed.relative( value ) );
      var event      = helper.parseEvent( attr, path, this, true );
      
      attrimatorMap.put( attr, event );
  	}
  }
});

/**
 * Register the parser.
 */
anim8.parser['move'] = new anim8.ParserMove();
