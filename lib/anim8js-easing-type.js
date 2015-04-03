
/**
 * Returns an easing type based on the input. If the input is a function that function is immediately returned. 
 * If the input is a string the easing type with that name is returned. If no easing type could be determined
 * an error is thrown.
 *
 * @param {function|string} easingType
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
 * Easing & Easing Type functions
 */

anim8.easingType.in = function(easing) 
{
	return function(x) {
		return easing( x );
	};
};

anim8.easingType.out = function(easing) 
{
	return function(x) {
		return 1.0 - easing( 1.0 - x );
	};
};

anim8.easingType.inout = function(easing) 
{
	return function(x) {
	  if ( x < 0.5 ) {
	    return easing( 2.0 * x ) * 0.5;
	  } else {
	    return 1.0 - (easing( 2.0 - 2.0 * x ) * 0.5);
	  }
	};
};

anim8.easingType.pong = function(easing) 
{
	return function(x) {
	  if ( x < 0.5 ) {
	    return easing( 2.0 * x );
	  } else {
	    return easing( 2.0 - 2.0 * x );
	  }
	};
};

// yoyo is an alias for pong
anim8.easingType.yoyo = anim8.easingType.pong;
