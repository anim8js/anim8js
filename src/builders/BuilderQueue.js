
/**
 * Instantiates a new parser for the 'and' animation type.
 *
 * @class BuilderQueue
 * @constructor
 * @extends Builder
 */
function BuilderQueue()
{

}

Class.extend( BuilderQueue, Builder,
{
  parse: function( animation, options, attrimatorMap, helper )
  {
    var queue = animation.queue;

    queue.factory = coalesce( queue.factory, animation.factory );

    attrimatorMap.queueMap( $attrimatorsFor( queue, options, false, helper.forObject ) );
  },

  merge: function( input, newOptions, oldOptions, attrimatorMap, helper )
  {
    this.submerge( input.queue, newOptions, oldOptions, attrimatorMap );
  }
});
