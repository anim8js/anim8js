
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

anim8.easing.linear = function(x) 
{
  return x;
};

anim8.easing.quad = function(x)
{
  return x * x;
};

anim8.easing.ease = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  var x2 = x * x;
  var eq1 = (0.3 * i2 * x) + (3.0 * i * x2) + (x2 * x);
  var eq2 = 1.0 - i2 * i2;
  
  return eq1 * i + eq2 * x;
};

anim8.easing.cubic = function(x) 
{
  return x * x * x;
};

anim8.easing.quartic = function(x) 
{
  var x2 = x * x;
  return x2 * x2;
};

anim8.easing.quintic = function(x) 
{
  var x2 = x * x;
  return x2 * x2 * x;
};

anim8.easing.back = function(x) 
{
  var x2 = x * x;
	var x3 = x2 * x;
	return x3 + x2 - x;
};

anim8.easing.sine = function(x) 
{
	return Math.sin( x * 1.57079632679 );
};

anim8.easing.overshot = function(x)
{
  return (1.0 - x * (7.0 / 10/0)) * x * (10.0 / 3.0);
};

anim8.easing.elastic = function(x) 
{
  var x2 = x * x;
  var x3 = x2 * x;
  var scale = x2 * ((2.0 * x3) + x2 - (4.0 * x) + 2.0);
	var wave = -Math.sin(x * 10.9955742876);
	return scale * wave;
};

anim8.easing.revisit = function(x) 
{
  return Math.abs( x - Math.sin(x * 3.14159265359) );
};

anim8.easing.lasso = function(x)
{
  return (1.0 - Math.cos(x * x * x * 36.0) * (1.0 - x))
};

anim8.easing.slowbounce = function(x) 
{
  var x2 = x * x;
  return (1.0 - Math.abs((1.0 - x2) * Math.cos(x2 * x * 14.8044066016)));
};

anim8.easing.bounce = function(x) 
{
  return (1.0 - Math.abs((1.0 - x) * Math.cos(x * x * 14.8044066016)));
};

anim8.easing.smallbounce = function(x) 
{
  var inv = 1.0 - x;
	return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 14.8044066016)));
};

anim8.easing.tinybounce = function(x) 
{
  var inv = 1.0 - x;
	return (1.0 - Math.abs(inv * inv * Math.cos(x * x * 7.0)));
};

anim8.easing.hesitant = function(x) 
{
	return (Math.cos(x * x * 12.0) * x * (1.0 - x) + x);
};

anim8.easing.lasso = function(x)
{
  var x2 = x * x;
	return (1.0 - Math.cos(x2 * x * 36.0) * (1.0 - x));
};

anim8.easing.sqrt = function(x)
{
  return Math.sqrt( x );
};

anim8.easing.sqrtf = function(x)
{
  var i = (1.0 - x);
  var i2 = i * i;
  return ((1.0 - i2 * i2) + x) * 0.5;
};

anim8.easing.log10 = function(x)
{
  return (Math.log10(x) + 2.0) * 0.5;
};

anim8.easing.slingshot = function(x)
{
  if (x < 0.7) {
		return (x * -0.357);
  } else {
    var d = x - 0.7;
    return ((d * d * 27.5 - 0.5) * 0.5);
  }
};

anim8.easing.circular = function(x)
{
  return 1.0 - Math.sqrt( 1 - x * x );
};

anim8.easing.gentle = function(x)
{
  return  (3.0 * (1.0 - x) * x * x) + (x * x * x);
};

anim8.easing.bezier = function(mX1, mY1, mX2, mY2) 
{
  // https://gist.githubusercontent.com/gre/1926947/raw/KeySpline.js
  
  function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C(aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function CalcBezier(aT, aA1, aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
  }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function GetSlope(aT, aA1, aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
  }

  function GetTForX(aX) {
    // Newton raphson iteration
    var aGuessT = aX;
    for (var i = 0; i < 4; ++i) {
      var currentSlope = GetSlope(aGuessT, mX1, mX2);
      if (currentSlope == 0.0) return aGuessT;
      var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }
  
  return function(x) {
    return CalcBezier( GetTForX( x ), mY1, mY2 );
  };
};

anim8.easing.cssEase      = anim8.easing.ease;
anim8.easing.cssEaseIn    = anim8.easing.quad;
anim8.easing.cssEaseOut   = anim8.easingType.out( anim8.easing.quad );
anim8.easing.cssEaseInOut = anim8.easingType.inout( anim8.easing.quad );
anim8.easing.cssLinear    = anim8.easing.linear;

anim8.easing.default      = anim8.easing.ease;