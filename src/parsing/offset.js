

/**
 * Parses offset from a string or number. If the input is not a valid time then
 * {{#crossLink "anim8.defaults/offset:property"}}anim8.defaults.offset{{/crossLink}}
 * is returned.
 *
 * **See:** {{#crossLink "Core/anim8.time:method"}}anim8.time{{/crossLink}}
 *
 * @method anim8.offset
 * @param {String|Number} time
 */
function $offset(time)
{
  return $time( time, Defaults.offset );
}
