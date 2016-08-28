

/**
 * Parses repeats from a string or number. If a valid repeat is not given then
 * `returnOnInvalid` is returned, if that is not given then
 * {{#crossLink "anim8.defaults/repeat:property"}}anim8.defaults.repeat{{/crossLink}}
 * is returned.
 *
 * **Examples:**
 *
 *     anim8.repeat( 5 );            // 5
 *     anim8.repeat( 'inf' );        // Infinity
 *     anim8.repeat( 'infinity' );   // Infinity
 *     anim8.repeat( 'infinite' );   // Infinity
 *     anim8.repeat( 'once' );       // 1
 *     anim8.repeat( 'twice' );      // 2
 *     anim8.repeat( 'thrice' );     // 3
 *     anim8.repeat( 'dozen' );      // 12
 *     anim8.repeat( 'random' );     // 4
 *     anim8.repeat( 'invalid', 6 ); // 6
 *     anim8.repeat( false, 7 );     // 7
 *     anim8.repeat();               // anim8.defaults.repeat
 *
 * @method anim8.repeat
 * @param {String|Number} time
 * @param {E} [returnOnInvalid]
 * @return {Number|E}
 */
var $repeat = (function()
{
  var conversions = {
    inf:        Number.POSITIVE_INFINITY,
    infinity:   Number.POSITIVE_INFINITY,
    infinite:   Number.POSITIVE_INFINITY,
    once:       1,
    twice:      2,
    thrice:     3,
    dozen:      12,
    random:     4 // chosen by fair dice roll. guaranteed to be random.
  };

  return function(repeat, returnOnInvalid)
  {
    if ( isNumber( repeat ) )
    {
      return repeat;
    }
    if ( isString( repeat ) )
    {
      repeat = repeat.toLowerCase();

      if ( repeat in conversions )
      {
        return conversions[ repeat ];
      }
      else
      {
        var parsed = parseInt( repeat );

        if ( !isNaN(parsed) )
        {
          return parsed;
        }
      }
    }

    return coalesce( returnOnInvalid, Defaults.repeat );
  };

})();
