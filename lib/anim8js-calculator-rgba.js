
/**
 * A calculator for objects with r, g, & b components 
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 *
 * @class CalculatorRGBA
 * @constructor
 * @extends Calculator
 */
anim8.CalculatorRGBA = function()
{
  this.createConstants();
};

anim8.override( anim8.CalculatorRGBA.prototype = new anim8.Calculator(), 
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
    // When a number is given an opaque grayscale color is returned.
    if ( anim8.isNumber( x ) )
    {
      return {
        r: x,
        g: x,
        b: x,
        a: 1.0
      };
    }
    // When an array is given, assume [r, g, b, a]
    if ( anim8.isArray( x ) )
    {
      x = { r: x[0], g: x[1], b: x[2], a: x[3] };
    }
    // When an object is given, check for relative values.
    if ( anim8.isObject( x ) )
    {
      var cr = anim8.coalesce( x.r, defaultValue.r );
      var cg = anim8.coalesce( x.g, defaultValue.g );
      var cb = anim8.coalesce( x.b, defaultValue.b );
      var ca = anim8.coalesce( x.a, defaultValue.a );
      var rr = this.getRelativeAmount( cr );
      var rg = this.getRelativeAmount( cg );
      var rb = this.getRelativeAmount( cb );
      var ra = this.getRelativeAmount( ca );

      if ( rr !== false && rg !== false && rb !== false && ra !== false )
      {
        var parsed = { r: rr, g: rg, b: rb, a: ra };
        var ir = this.isRelative( cr );
        var ig = this.isRelative( cg );
        var ib = this.isRelative( cb );
        var ia = this.isRelative( ca );

        if ( ir || ig || ib || ia )
        {
          var mask = {
            r: ir ? 1 : 0,
            g: ig ? 1 : 0,
            b: ib ? 1 : 0,
            a: ia ? 1 : 0
          };

          return anim8.computed.relative( parsed, mask );
        }

        return parsed;
      }
    }
    // If only a relative value is given it will modify the R, G, & B components.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return anim8.computed.relative( { r: rx, g: rx, b: rx, a: 0 } ); 
      }
    }
    
    // Try to parse the color.
    var parsed = anim8.color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }
    
    // If no value was given but the default value was given, clone it.
    if ( anim8.isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );      
    }
    
    return false;  
  },
  copy: function(out, copy) 
  {
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    out.a = copy.a;
    return out;
  },
  create: function() 
  {
    return {r: 0, g:0, b:0, a:0};
  },
  zero: function(out) 
  {
    out.r = 0;
    out.g = 0;
    out.b = 0;
    out.a = 0;
    return out;
  },
  adds: function(out, amount, amountScale) 
  {
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    out.a += amount.a * amountScale;
    return out;
  },
  mul: function(out, scale) 
  {
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    out.a *= scale.a;
    return out;
  },
  interpolate: function(out, start, end, delta) 
  {
    out.r = (end.r - start.r) * delta + start.r;
    out.g = (end.g - start.g) * delta + start.g;
    out.b = (end.b - start.b) * delta + start.b;
    out.a = (end.a - start.a) * delta + start.a;
    return out;
  },
  distanceSq: function(a, b) 
  {
    var dr = a.r - b.r;
    var dg = a.g - b.g;    
    var db = a.b - b.b;    
    var da = a.a - b.a;    
    return dr * dr + dg * dg + db * db + da * da;
  },
  isValid: function(a) 
  {
    return anim8.isObject( a ) && 'r' in a && 'g' in a && 'b' in a && 'a' in a;
  },
  isNaN: function(a) 
  {
    return isNaN(a.r) || isNaN(a.g) || isNaN(a.b) || isNaN(a.a);
  },
  isZero: function(a, epsilon) 
  {
    return Math.abs(a.r) < epsilon && 
           Math.abs(a.g) < epsilon && 
           Math.abs(a.b) < epsilon && 
           Math.abs(a.a) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
  {
    return Math.abs(a.r - b.r) < epsilon && 
           Math.abs(a.g - b.g) < epsilon && 
           Math.abs(a.b - b.b) < epsilon && 
           Math.abs(a.a - b.a) < epsilon;
  },
  min: function(out, a, b)
  {
    out.r = Math.min(a.r, b.r);
    out.g = Math.min(a.g, b.g);
    out.b = Math.min(a.b, b.b);
    out.a = Math.min(a.a, b.a);
    return out;
  },
  max: function(out, a, b)
  {
    out.r = Math.max(a.r, b.r);
    out.g = Math.max(a.g, b.g);
    out.b = Math.max(a.b, b.b);
    out.a = Math.max(a.a, b.a);
    return out;
  },
  dot: function(a, b)
  {
    return a.r * b.r + a.g * b.g + a.b * b.b + a.a * b.a;
  },
  random: function(out, min, max)
  {
    out.r = (max.r - min.r) * Math.random() + min.r;
    out.g = (max.g - min.g) * Math.random() + min.g;
    out.b = (max.b - min.b) * Math.random() + min.b;
    out.a = (max.a - min.a) * Math.random() + min.a;
    return out;
  }
});

/**
 * A calculator for colors; objects with r, g, b, & a Number components.
 *
 * @property {CalculatorRGBA} rgba
 * @for anim8.calculator
 */
anim8.calculator['rgba'] = new anim8.CalculatorRGBA();
