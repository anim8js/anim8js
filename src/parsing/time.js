
/**
 * Parses milliseconds from a string or number. If a number is given it's
 * assumed to be milliseconds and is returned immediately. If a string is given
 * a unit is looked for to determine how to scale the number into milliseconds.
 * If the given time is invalid and returnOnInvalid is not given then zero is
 * returned.
 *
 * **Examples:**
 *
 *     anim8.time( 45 );       // 45
 *     anim8.time( 45.9 );     // 45
 *     anim8.time( -4.1 );     // -5
 *     anim8.time( '5ms' );    // 5
 *     anim8.time( '23' );     // 23
 *     anim8.time( '5c' );     // 500
 *     anim8.time( '5cs' );    // 500
 *     anim8.time( '5jiffy' ); // 833
 *     anim8.time( '5third' ); // 833
 *     anim8.time( '10s' );    // 10000
 *     anim8.time( '10sec' );  // 10000
 *     anim8.time( '1.5m' );   // 90000
 *     anim8.time( '1.5min' ); // 90000
 *     anim8.time( '0.4h' );   // 144000
 *     anim8.time( '0.4hr' );  // 144000
 *
 * @method anim8.time
 * @param {String|Number} time
 * @param {Any} [returnOnInvalid]
 */
var $time = (function()
{
  var regex = /^(-?\d*(\.\d+)|-?\d+)(ms|s|c|cs|third|jiffy|sec|m|min|h|hr)?$/;

  var conversions = {
    ms:     1,
    c:      100,
    cs:     100,
    jiffy:  1000 / 60,
    third:  1000 / 60,
    s:      1000,
    sec:    1000,
    m:      1000 * 60,
    min:    1000 * 60,
    h:      1000 * 60 * 60,
    hr:     1000 * 60 * 60
  };

  return function(time, returnOnInvalid)
  {
    if ( isNumber( time ) )
    {
      // raw numbers are considered milliseconds
      return Math.floor( time );
    }
    if ( isString( time ) )
    {
      var parsed = regex.exec( time );

      if ( parsed )
      {
        var time = parseFloat( parsed[1] );
        var unit = parsed[3];

        if ( unit in conversions )
        {
          time *= conversions[ unit ];
        }

        return Math.floor( time );
      }
    }

    return coalesce( returnOnInvalid, 0 );
  };

})();
