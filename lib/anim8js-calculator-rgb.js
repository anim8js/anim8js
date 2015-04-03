
/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 */
anim8.RGBCalculator = function()
{

};

anim8.override( anim8.RGBCalculator.prototype = new anim8.Calculator(), 
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
			return {
				r: x,
				g: x,
				b: x
			};
		}
		
		return anim8.color.parse( x );
	},
  copy: function(out, copy) 
	{
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    return out;
  },
  create: function() 
	{
    return {r: 0, g:0, b:0};
  },
  zero: function(out) 
	{
    out.r = 0;
    out.g = 0;
    out.b = 0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    return dr * dr + dg * dg + db * db;
  },
  isValid: function(a) 
	{
    return anim8.isObject( a ) && 'r' in a && 'g' in a && 'b' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon;
  }
});

/**
 * Register the calculator.
 */
anim8.calculator['rgb']         = new anim8.RGBCalculator();
