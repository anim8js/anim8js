

/**
 * Parses delay from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/delay:property"}}anim8.defaults.delay{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.delay
 * @param {String|Number} time
 */
function $delay(time)
{
  return $time( time, Defaults.delay );
}
