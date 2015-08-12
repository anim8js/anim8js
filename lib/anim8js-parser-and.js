
/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class ParserAnd
 * @constructor
 * @extends Parser
 */
anim8.ParserAnd = function()
{
  
};

// ParserAnd extends anim8.Parser()
anim8.override( anim8.ParserAnd.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var and = animation.and;

    and.factory = anim8.coalesce( and.factory, animation.factory );

    attrimatorMap.putMap( anim8.attrimatorsFor( and, options ) );
  },
  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    var animation = input.and;
    var helper = new anim8.ParserHelper( animation, oldOptions, newOptions );

    for (var parserName in animation)
    {
      var parser = anim8.parser( parserName );
      
      if ( parser !== false && parser.merge )
      {
        parser.merge( animation, newOptions, oldOptions, attrimatorMap, helper );
      }
    }
  }
});

/**
 * A parser which generates attrimators which tween from the current value to 
 * the given values.
 *
 * **Examples:**
 * 
 *     animator.play({
 *      ... other parsers ...
 *      and: {
 *       ... more parsers ...
 *      }
 *     });
 * 
 *
 * @property {ParserAnd} and
 * @for anim8.parser
 */
anim8.parser['and'] = new anim8.ParserAnd();
