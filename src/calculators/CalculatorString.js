
/**
 * A calculator for strings.
 *
 * @class CalculatorString
 * @constructor
 * @extends Calculator
 */
function CalculatorString()
{
  this.createConstants();
}

Class.extend( CalculatorString, Calculator,
{
  parse: function(x, defaultValue, ignoreRelative)
  {
    // Values computed live.
    if ( isFunction( x ) )
    {
      return x;
    }

    // Value computed from current value on animator.
    if ( x === true )
    {
      return computed.current;
    }

    // An array
    if ( isArray( x ) )
    {
      x = x[ 0 ];
    }

    // A raw string
    if ( isString( x ) )
    {
      return x;
    }

    return coalesce( defaultValue, Defaults.calculatorString );
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
  convert: function(out, converter)
  {
    return converter( out );
  },
  adds: function(out, amount, amountScale)
  {
    return amount;
  },
  mul: function(out, scale)
  {
    return scale;
  },
  div: function(out, denominator)
  {
    return out;
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
