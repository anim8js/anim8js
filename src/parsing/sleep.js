

/**
 * Parses sleep from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/sleep:property"}}anim8.defaults.sleep{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.sleep
 * @param {String|Number} time
 */
function $sleep(time)
{
  return $time( time, Defaults.sleep );
}
