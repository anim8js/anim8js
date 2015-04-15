
/**
 * A calculator for number primitives.
 */
anim8.CalculatorNumber = function()
{
  this.createConstants();
};

anim8.override( anim8.CalculatorNumber.prototype = new anim8.Calculator(), 
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
    // A raw number
    if ( anim8.isNumber( x ) )
    {
      return x;
    }
    // A number in a string or a relative number.
    if ( anim8.isString( x ) )
    {
      var amount = this.getRelativeAmount( x );
      
      if ( amount !== false )
      {
        if ( this.isRelative( x ) )
        {
          return anim8.computed.relative( amount );
        }
        else
        {
          return amount;
        }
      }
    }
    
    return defaultValue;
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
  adds: function(out, amount, amountScale) 
  {
    return out += amount * amountScale;
  },
  mul: function(out, scale) 
  {
    return out *= scale;
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
  }
});

/**
 * Register the calculators.
 */
anim8.calculator['default'] = anim8.calculator['number'] = new anim8.CalculatorNumber();
