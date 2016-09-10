

/**
 * A calculator for number primitives.
 *
 * @class CalculatorNumber
 * @constructor
 * @extends Calculator
 */
function CalculatorNumber()
{
  this.createConstants();
}

Class.extend( CalculatorNumber, Calculator,
{
  parse: function(x, defaultValue)
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

    // A raw number
    if ( isNumber( x ) )
    {
      return x;
    }

    // A number in a string or a relative number.
    if ( isString( x ) )
    {
      var amount = this.getRelativeAmount( x );

      if ( amount !== false )
      {
        if ( this.isRelative( x ) )
        {
          return computed.relative( amount );
        }
        else
        {
          return amount;
        }
      }
    }

    return $number( defaultValue, Defaults.calculatorNumber );
  },
  copy: function(out, copy)
  {
    return copy;
  },
  create: function()
  {
    return 0.0;
  },
  zero: function(out)
  {
    return 0.0;
  },
  convert: function(out, converter)
  {
    return converter( out );
  },
  adds: function(out, amount, amountScale)
  {
    return out += amount * amountScale;
  },
  mul: function(out, scale)
  {
    return out *= scale;
  },
  div: function(out, denominator)
  {
    return denominator ? out / denominator : 0;
  },
  interpolate: function(out, start, end, delta)
  {
    return (end - start) * delta + start;
  },
  distanceSq: function(a, b)
  {
    var ab = a - b;
    return ab * ab;
  },
  distance: function(a, b)
  {
    return Math.abs( a - b );
  },
  length: function(a)
  {
    return Math.abs( a );
  },
  lengthSq: function(a)
  {
    return a * a;
  },
  isValid: function(a)
  {
    return typeof a === 'number';
  },
  isNaN: function(a)
  {
    return isNaN(a);
  },
  isZero: function(a, epsilon)
  {
    return Math.abs(a) < epsilon;
  },
  isEqual: function(a, b, epsilon)
  {
    return Math.abs(a - b) < epsilon;
  },
  min: function(out, a, b)
  {
    return Math.min( a, b );
  },
  max: function(out, a, b)
  {
    return Math.max( a, b );
  },
  dot: function(a, b)
  {
    return a * b;
  }
});
