
/**
 * Parses scale from a string or number.
 *
 * **See:** {{#crossLink "Core/anim8.number:method"}}anim8.number{{/crossLink}}
 *
 * @method anim8.scale
 * @param {String|Number} scale
 * @return {Number}
 */
function $scale(scale)
{
  return $number( scale, Defaults.scale );
}
