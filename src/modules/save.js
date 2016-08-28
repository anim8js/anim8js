
var Animations = {};

/**
 * Saves an animation under the given name. It can be played, queued, and
 * transitioned into at a later time providing the name and optionally options
 * to override with.
 *
 * **See:** {{#crossLink "Core/anim8.animation:method"}}anim8.animation{{/crossLink}},
 *          {{#crossLink "Core/anim8.options:method"}}anim8.options{{/crossLink}}
 *
 * @method anim8.save
 * @for Core
 * @param {String} name
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 */
function save( name, animation, options )
{
  var animation = $animation( animation, options );
  var key = name.toLowerCase();

  animation.name = name;

  Animations[ key ] = animation;
}
