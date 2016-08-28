
/**
 * Instantiates a new Builder. Builders are responsible for taking animation
 * definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generating & placing {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}
 * onto an {{#crossLink "AttrimatorMap"}}{{/crossLink}}.
 *
 * Builders are added to the {{#crossLink "anim8.builder"}}{{/crossLink}} object
 * by a key and when that key exists in an animation definition, the animation
 * definition is passed to the {{#crossLink "Builder/parse:method"}}{{/crossLink}}
 * to generate {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 *
 * @class Builder
 * @constructor
 */
function Builder()
{

}

/**
 * Returns the next merge ID. Merge IDs are used when merging options into
 * attrimators to perform an optimal merge.
 *
 * @method nextMergeId
 * @static
 */
Builder.nextMergeId = (function()
{
  var id = 0;
  return function() {
    return id++;
  };
})();

Class.define( Builder,
{

  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimatorMap to the given array.
   *
   * @method parse
   * @param {Object} animation
   * @param {Object} options
   * @param {AttrimatorMap} attrimatorMap
   * @param {BuilderHelper} helper
   */
  parse: function( animation, options, attrimatorMap, helper )
  {
    throw 'Builder.parse not implemented';
  },

  /**
   * Merges the options with the given event instances. This is when an existing
   * animation is provided but the user wants to override the animation's options.
   *
   * Because event properties can be specified in several places there's a priority
   * to which one takes precedence. The properties specified in the animation object
   * itself are highest priority, followed by the new options, then by the old
   * options, and finally by the existing property on the event instance.
   *
   * @method merge
   * @param {Object} animation
   * @param {Object} newOptions
   * @param {Object} oldOptions
   * @param {AttrimatorMap} attrimatorMap
   * @param {BuilderHelper} helper
   */
  merge: function( animation, newOptions, oldOptions, attrimatorMap, helper )
  {
    var builder = this;
    var factory = $factory( animation.factory );

    attrimatorMap.iterate(function(e)
    {
      if ( e.getBuilder() === builder )
      {
        builder.mergeAttrimator( e, e.attribute, helper, factory );
      }
    });
  },

  /**
   * Merges new options contained in the helper into the given attrimator.
   *
   * @method mergeAttrimator
   * @param {Attrimator} e
   * @param {String} attr
   * @param {BuilderHelper} helper
   * @param {Factory} factory
   */
  mergeAttrimator: function( e, attr, helper, factory )
  {
    e.easing    = helper.mergeEasing( attr, e.easing );
    e.repeat    = helper.mergeRepeat( attr, e.repeat );
    e.delay     = helper.mergeDelay( attr, e.delay );
    e.sleep     = helper.mergeSleep( attr, e.sleep );
    e.duration  = helper.mergeDuration( attr, e.duration );
    e.offset    = helper.mergeOffset( attr, e.offset );
    e.scale     = helper.mergeScale( attr, e.scale );
    e.scaleBase = helper.mergeScaleBase( attr, e.scaleBase, factory );
  },

  /**
   * Calls merge on all builders specified in the given animation definition.
   *
   * @method submerge
   * @protected
   * @param {Object} animation
   * @param {Object} newOptions
   * @param {Object} oldOptions
   * @param {AttrimatorMap} attrimatorMap
   */
  submerge: function( animation, newOptions, oldOptions, attrimatorMap )
  {
    var helper = new BuilderHelper( animation, oldOptions, newOptions );

    for (var builderName in animation)
    {
      var builder = $builder( builderName );

      if ( builder !== false && builder.merge )
      {
        builder.merge( animation, newOptions, oldOptions, attrimatorMap, helper );
      }
    }
  }
});
