
/**
 * Returns an easing based on the given input. If the input is a function it's
 * assumed to be an easing function and is returned immediately. If the input is
 * a string the easing with that name is returned. If the input is a string in
 * the format 'easing-easingType' then an easing is returned that is a
 * combination of the easing with the given name and the easingType with the
 * given name. If the given input is an array with 4 elements it's assumed to be
 * a bezier path and one is created and returned. If no input is given the
 * default easing is returned. If an easing cannot be determined then an error
 * is thrown.
 *
 * **Examples:**
 *
 *     anim8.easing();               // anim8.defaults.easing
 *     anim8.easing( 'linear' );     // anim8.easing.linear
 *     anim8.easing( 'reverse' );    // anim8.easingType.reverse( anim8.defaults.easing )
 *     anim8.easing( 'ease-yoyo' );  // anim8.easingType.yoyo( anim8.easing.ease )
 *     anim8.easing( [0,0,1,1] );    // anim8.easing.bezier( 0, 0, 1, 1 )
 *     anim8.easing( 5, false );     // false
 *     anim8.easing( 'invalid', 1 ); // 1
 *     anim8.easing( [0,0,1], 1 );   // 1
 *
 * @method anim8.easing
 * @for Core
 * @param {Function|String|Array} easing
 * @param {E} [returnOnInvalid]
 * @return {Function|E}
 */
function $easing(easing, returnOnInvalid)
{
  if ( isFunction( easing ) )
  {
    return easing;
  }
  if ( isString( easing ) )
  {
    var result = null;
    var scale = 1;

    var scaleIndex = easing.indexOf('*');

    if ( scaleIndex !== -1 )
    {
      scale = parseFloat( easing.substring( scaleIndex + 1 ) );
      easing = easing.substring( 0, scaleIndex );
    }

    if ( easing in Easings )
    {
      result = Easings[ easing ];
    }
    else if ( easing in EasingTypes )
    {
      result = EasingTypes[ easing ]( $easing( Defaults.easing ) );
    }
    else if ( easing.indexOf('-') !== -1 )
    {
      var pair = easing.split('-');
      var e = pair[0];
      var t = pair[1];

      if ( pair.length >= 2 && e in Easings && t in EasingTypes )
      {
        result = EasingTypes[ t ]( Easings[ e ] );
      }
    }

    if ( result !== null && isFinite( scale ) && scale !== 1 )
    {
      result = Easings.scale( scale, result );
    }

    if ( result !== null )
    {
      return result;
    }
  }
  if ( isArray( easing ) && easing.length === 4 && isNumber( easing[0] ) && isNumber( easing[1] ) && isNumber( easing[2] ) && isNumber( easing[3] ) )
  {
    return Easings.bezier.apply( null, easing );
  }
  if ( !isDefined( easing ) )
  {
    return $easing( Defaults.easing );
  }

  if ( isDefined( returnOnInvalid ) )
  {
    return returnOnInvalid;
  }

  throw easing + ' is not a valid easing';
}
