
/**
 * A calculator for number primitives.
 */
anim8.NumberCalculator = function()
{

};

anim8.override( anim8.NumberCalculator.prototype = new anim8.Calculator(), 
{
  /**
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parse: function(x, defaultValue)
  {
    if ( this.isPristine( x ) )
    {
      return x;
    }
    if ( anim8.isNumber( x ) )
    {
      return x;
    }
    if ( anim8.isString( x ) )
    {
      x = parseFloat( x );
      
      if (!isNaN(x))
      {
        return x;
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
  distanceSq: function(a, b) 
  {
    var ab = a - b;
    return ab * ab;
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
  }
});

/**
 * Register the calculators.
 */
anim8.calculator['number']      = new anim8.NumberCalculator();
anim8.calculator['default']     = anim8.calculator['number'];
