
/**
 * Returns an easing type based on the input. If the input is a function that 
 * function is immediately returned. If the input is a string the easing type 
 * with that name is returned. If no easing type could be determined an error is
 * thrown.
 *
 * @param {Function|String} easingType
 * @param [Boolean] optional
 * @return {Function|false}
 */
anim8.easingType = function(easingType, optional)
{
	if ( anim8.isFunction( easingType ) )
	{
		return easingType;
	}
	if ( anim8.isString( easingType ) && easingType in anim8.easingType )
	{
		return anim8.easingType[ easingType ];
	}
  
  if ( optional )
  {
    return false;
  }
	
	throw easingType + ' is not a valid easing type';
};

/**
 * Plays the animation forward normally.
 * 
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.in = function(easing) 
{
	return function(x) 
	{
		return easing( x );
	};
};

/**
 * Plays the animation forward by flipping the easings momentum.
 * 
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.out = function(easing) 
{
	return function(x) 
	{
		return 1.0 - easing( 1.0 - x );
	};
};

/**
 * Plays the animation forward by flipping the easings momentum halfway.
 * 
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.inout = function(easing) 
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
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.yoyo = function(easing) 
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
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.mirror = function(easing)
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
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.reverse = function(easing)
{
	return easing( 1.0 - x );
};

/**
 * Plays the animation backwards by flipping the easing's momentum.
 * 
 * @param  {Function} easing
 * @return {Function}
 */
anim8.easingType.flip = function(easing)
{
	return 1.0 - easing( x );
};
