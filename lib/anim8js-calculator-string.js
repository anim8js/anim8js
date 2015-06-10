
/**
 * A calculator for strings.
 *
 * @class CalculatorString
 * @constructor
 * @extends Calculator
 */
anim8.CalculatorString = function()
{
  this.createConstants();
};

anim8.override( anim8.CalculatorString.prototype = new anim8.Calculator(), 
{
  parse: function(x, defaultValue)
  {
    // Values computed live.
    if ( anim8.isFunction( x ) )
    {
      return x;
    }
    // Value computed from current value on animator.
    if ( x === true )
    {
      return anim8.computed.current;
    }
    // A raw string
    if ( anim8.isString( x ) )
    {
      return x;
    }
    
    return defaultValue;
  },
  copy: function(out, copy) 
  { 
    return copy;
  },
  create: function() 
  {
    return '';
  },
  zero: function(out) 
  {
    return '';
  },
  adds: function(out, amount, amountScale) 
  {
    return amount;
  },
  mul: function(out, scale) 
  {
    return scale;
  },
  interpolate: function(out, start, end, delta) 
  {
    return delta < 0.5 ? start : end;
  },
  distanceSq: function(a, b) 
  {
    var d = Math.abs( a.length - b.length );
    return d * d;
  },
  distance: function(a, b)
  {
    return Math.abs( a.length - b.length );
  },
  length: function(a)
  {
    return a.length;
  },
  lengthSq: function(a)
  {
    return a.length * a.length;
  },
  isValid: function(a) 
  {
    return typeof a === 'string';
  },
  isNaN: function(a) 
  {
    return false;
  },
  isZero: function(a, epsilon) 
  {
    return a.length <= epsilon;
  },
  isEqual: function(a, b, epsilon) 
  {
    return a === b;
  },
  min: function(out, a, b)
  {
    return a < b ? a : b;
  },
  max: function(out, a, b)
  {
    return a > b ? a : b;
  },
  dot: function(a, b)
  {
    return a.length * b.length;
  }
});

/**
 * A calculator for strings.
 *
 * @property {CalculatorString} string
 * @for anim8.calculator
 */
anim8.calculator['string'] = new anim8.CalculatorString();