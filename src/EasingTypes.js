
var EasingTypes = {};

/**
 * A collection of easing type functions. An easing type functions takes an
 * easing function as an argument and modifies it's input and output values.
 *
 * **See:** {{#crossLink "Core/anim8.easing"}}{{/crossLink}}
 *
 * @class anim8.easingType
 */

/**
 * Plays the animation forward normally.
 *
 * @method in
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['in'] = function(easing)
{
  return function(x)
  {
    return easing( x );
  };
};

/**
 * Plays the animation forward by flipping the easings momentum.
 *
 * @method out
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['out'] = function(easing)
{
  return function(x)
  {
    return 1.0 - easing( 1.0 - x );
  };
};

/**
 * Plays the animation forward by flipping the easings momentum halfway.
 *
 * @method inout
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['inout'] = function(easing)
{
  return function(x)
  {
    if ( x < 0.5 )
    {
      return easing( 2.0 * x ) * 0.5;
    }
    else
    {
      return 1.0 - (easing( 2.0 - 2.0 * x ) * 0.5);
    }
  };
};

/**
 * Plays the aninmation forwards with the given easing, and backwards with the same easing momentum.
 *
 * @method yoyo
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['yoyo'] = function(easing)
{
  return function(x)
  {
    if ( x < 0.5 )
    {
      return easing( 2.0 * x );
    }
    else
    {
      return easing( 2.0 - 2.0 * x );
    }
  };
};

/**
 * Plays the animation forwards with the given easing, and backwards reflecting the easing's momentum.
 *
 * @method mirror
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['mirror'] = function(easing)
{
  return function(x)
  {
    if ( x < 0.5 )
    {
      return easing( 2.0 * x );
    }
    else
    {
      return 1.0 - easing( 2.0 - 2.0 * x );
    }
  };
};

/**
 * Plays the animation backwards with using the same easing momentum.
 *
 * @method reverse
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['reverse'] = function(easing)
{
  return function(x)
  {
    return easing( 1.0 - x );
  };
};

/**
 * Plays the animation backwards by flipping the easing's momentum.
 *
 * @method flip
 * @for anim8.easingType
 * @param {Function} easing
 * @return {Function}
 */
EasingTypes['flip'] = function(easing)
{
  return function(x)
  {
    return 1.0 - easing( x );
  };
};
