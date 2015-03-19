anim8.easingType.in = function(easing) 
{
	return function(d) {
		return easing( d );
	};
};

anim8.easingType.out = function(easing) 
{
	return function(d) {
		return 1.0 - easing( 1.0 - d );
	};
};

anim8.easingType.inout = function(easing) 
{
	return function(d) {
	  if ( d < 0.5 ) {
	    return easing( 2.0 * d ) * 0.5;
	  } else {
	    return 1.0 - (easing( 2.0 - 2.0 * d ) * 0.5);
	  }
	};
};

anim8.easingType.pong = function(easing) 
{
	return function(d) {
	  if ( d < 0.5 ) {
	    return easing( 2.0 * d );
	  } else {
	    return easing( 2.0 - 2.0 * d );
	  }
	};
};

anim8.easing.linear = function(d) 
{
  return d;
};

anim8.easing.quad = function(d) 
{
  return d * d;
};

anim8.easing.cubic = function(d) 
{
  return d * d * d;
};

anim8.easing.quartic = function(d) 
{
  var d2 = d * d;
  return d2 * d2;
};

anim8.easing.quintic = function(d) 
{
  var d2 = d * d;
  return d2 * d2 * d;
};

anim8.easing.back = function(d) 
{
  var d2 = d * d;
	var d3 = d2 * d;
	return d3 + d2 - d;
};

anim8.easing.sine = (function() 
{
  var FREQUENCY = Math.PI * 0.5;
	
	return function(d) {
		return Math.sin( d * FREQUENCY );
	};
	
})();

anim8.easing.default = anim8.easing.linear;