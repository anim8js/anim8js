
/**
 * Parses duration from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/duration:property"}}anim8.defaults.duration{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.duration
 * @param {String|Number} time
 */
function $duration(time)
{
  return $time( time, Defaults.duration );
}
