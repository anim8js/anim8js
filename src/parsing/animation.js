
/**
 * Returns an instance of {{#crossLink "Animation"}}{{/crossLink}} based on the
 * given input & options. If the input is a string the animation with that name
 * is returned. If the input is a string with an animation name and an option
 * string the animation with the given name modified by any additional options
 * is returned. Commas can be used to queue animation & option pairs one after
 * another. Ampersands can be used to play animations at the same time. If the
 * input is an object an anonymous animation is created. If no animation could
 * be determined then false is returned.
 *
 * **Examples:**
 *
 *     animation('wiggle');
 *     animation('wiggle ~1s 4s z40ms x5 !1.2');
 *     animation('wiggle', {...options...});
 *     animation('wiggle, tada ~50ms, fadeOut 2s');
 *     animation('wiggle & tada !3, fadeOut');
 *     animation({...definition...});
 *
 * If the given input is a string you can cache it. An example would be
 * 'wiggle ~1s 2s x3' - if `cache` is true and you call this method again it won't
 * need to be parsed again.
 *
 * **See:** {{#crossLink "Core/options:method"}}{{/crossLink}}
 *
 * @method animation
 * @for Core
 * @param {Animation|String|Object} animation
 * @param {String|Object} [options]
 * @param {Boolean} [cache=false]
 * @return {Animation|False}
 * @throws {String} The animation string has an invalid animation name or the
 *    animation fails to create attrimators from the animation definition.
 */
function $animation(animation, options, cache, forObject)
{
  var options = $options( options, cache );
  var hasOptions = !isEmpty( options );

  if ( animation instanceof Animation )
  {
    if ( hasOptions )
    {
      var attrimators = animation.newAttrimators();

      animation.merge( options, attrimators );

      return new Animation( false, animation.input, options, attrimators);
    }

    return animation;
  }
  if ( isString( animation ) )
  {
    var key = animation.toLowerCase();

    if ( key in Animations && !hasOptions )
    {
      return Animations[ key ];
    }

    var attrimators = $attrimatorsFor( animation, options, cache );

    if ( key in Animations && !hasOptions )
    {
      return Animations[ key ];
    }

    return new Animation( false, {}, options, attrimators );
  }
  if ( isObject( animation ) )
  {
    var attrimators = $attrimatorsFor( animation, options, cache, forObject );

    return new Animation( false, animation, options, attrimators );
  }

  return false;
}
