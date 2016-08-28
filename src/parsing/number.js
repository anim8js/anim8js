
/**
 * Parses a number from the given input and if the input isn't a valid number
 * then returnOnInvalid is returned.
 *
 * **Examples:**
 *
 *     anim8.number( 5 );       // 5
 *     anim8.number( '5' );     // 5
 *     anim8.number( '5e4' );   // 50000
 *     anim8.number( 'x' );     // undefined
 *     anim8.number( 'x', 23 ); // 23
 *
 * @method anim8.number
 * @param {String|Number} value
 * @param {E} returnOnInvalid
 * @return {Number|E}
 */
function $number(value, returnOnInvalid)
{
  var parsed = parseFloat( value );

  return isNaN( parsed ) ? returnOnInvalid : parsed;
}
