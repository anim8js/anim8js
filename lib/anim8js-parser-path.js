
/**
 * Instantiates a new parser for the 'path' animation type.
 *
 * @class ParserPath
 * @constructor
 * @extends Parser
 */
anim8.ParserPath = function()
{
  
};

// ParserPath extends anim8.Parser()
anim8.override( anim8.ParserPath.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  { 
    var factory    = anim8.factory( animation.factory );
    var path    = animation.path;

    for (var attr in path)
    {
      var attribute  = factory.attribute( attr );
      var pathDefinition = path[ attr ];

      if ( !( pathDefinition instanceof anim8.Path ) )
      {
        pathDefinition.name = attr;
        pathDefinition.calculator = attribute.calculator;
      }

      var parsedPath = anim8.path( pathDefinition );
      var event      = helper.parseEvent( attr, parsedPath, this, true );
      
      attrimatorMap.put( attr, event );
    }
  }
});

/**
 * A parser which generates attrimators which follow a given path.
 *
 * **Examples:**
 * 
 *     animator.play({
 *      path: {
 *       opacity: {
 *        type: 'quadratic',
 *        p0: 0,
 *        p1: 0.4,
 *        p2: 1.0  
 *       }
 *      }
 *     });
 * 
 *
 * @property {ParserPath} path
 * @for anim8.parser
 */
anim8.parser['path'] = new anim8.ParserPath();
