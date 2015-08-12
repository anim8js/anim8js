
/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class ParserQueue
 * @constructor
 * @extends Parser
 */
anim8.ParserQueue = function()
{
  
};

// ParserQueue extends anim8.Parser()
anim8.override( anim8.ParserQueue.prototype = new anim8.Parser(),
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var queue = animation.queue;

    queue.factory = anim8.coalesce( queue.factory, animation.factory );

    attrimatorMap.queueMap( anim8.attrimatorsFor( queue, options ) );
  },
  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    var animation = input.queue;
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
 *      queue: {
 *       ... more parsers to play after the others ...
 *      }
 *     });
 * 
 *
 * @property {ParserQueue} queue
 * @for anim8.parser
 */
anim8.parser['queue'] = new anim8.ParserQueue();
