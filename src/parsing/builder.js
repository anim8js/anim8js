
/**
 * A collection of {{#crossLink "Builder"}}builders{{/crossLink}} which takes
 * animation definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generates {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 *
 * @class anim8.builder
 */

/**
 * Returns a builder based on the input. If the input is an instance of Builder
 * it's returned immediately. If the input is a string the builder with that name
 * is returned. If no builder could be determined then false is returned.
 *
 * **See:** {{#crossLink "anim8.builder"}}{{/crossLink}}
 *
 * @method anim8.builder
 * @for Core
 * @param {Builder|String} builderInput
 * @return {Builder|false}
 */
function $builder(builderInput)
{
  if ( builderInput instanceof Builder )
  {
    return builderInput;
  }
  if ( isString( builderInput ) && builderInput in Builders )
  {
    return Builders[ builderInput ];
  }

  return false;
}
