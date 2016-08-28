
/**
 * Instantiates a new Animation given it's name, the input & options passed, and
 * the attrimators that were generated from the input & options. If the name is
 * false this is an anonymous animation. Input & Options are used by builders to
 * generate attrimators, options allow for an animations default properties to
 * be overriden.
 *
 * @param {String|Boolean} name
 * @param {Object} input
 * @param {Object} options
 * @param {AttrimatorMap} attrimators
 * @class Animation
 * @constructor
 */
function Animation(name, input, options, attrimators)
{
  /**
   * The name of the animation, or false if it's an anonymous animation.
   *
   * @property {String|False} name
   */
  this.name = name;

  /**
   * The object which created the animation.
   *
   * @property {Object} input
   */
  this.input = input;

  /**
   * The options given when the animation was created.
   *
   * @property {Object} [options]
   */
  this.options = options;

  /**
   * The name of the animation, or false if it's an anonymous animation.
   *
   * @property {AttrimatorMap} name
   */
  this.attrimators = attrimators;
}

Class.define( Animation,
{

  /**
   * Generates an map of event instances from the attrimators in this animation.
   *
   * @method newAttrimators
   * @return {AttrimatorMap}
   */
  newAttrimators: function()
  {
    return this.attrimators.clone();
  },

  /**
   * Merges options with the options in this animation and places them in the
   * events.
   *
   * @method merge
   * @param {Object} [options]
   * @param {AttrimatorMap} attrimatorMap
   * @return {AttrimatorMap}
   */
  merge: function(options, attrimatorMap)
  {
    var helper = new BuilderHelper( this.input, this.options, options );

    for (var builderName in this.input)
    {
      var builder = $builder( builderName );

      if ( builder !== false && builder.merge )
      {
        builder.merge( this.input, options, this.options, attrimatorMap, helper );
      }
    }

    return attrimatorMap;
  }

});
