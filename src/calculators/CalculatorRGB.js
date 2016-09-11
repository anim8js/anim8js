

/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 *
 * @class CalculatorRGB
 * @constructor
 * @extends Calculator
 */
function CalculatorRGB()
{
  this.createConstants();
}

Class.extend( CalculatorRGB, Calculator,
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

    // When a number is given a grayscale color is returned.
    if ( isNumber( x ) )
    {
      return {
        r: x,
        g: x,
        b: x
      };
    }

    // When an array is given, assume [r, g, b]
    if ( isArray( x ) )
    {
      x = { r: x[0], g: x[1], b: x[2] };
    }

    // Default when there is none given
    var def = coalesce( defaultValue, Defaults.calculatorRGB );

    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cr = coalesce( x.r, def.r );
      var cg = coalesce( x.g, def.g );
      var cb = coalesce( x.b, def.b );
      var rr = $number( cr, false );
      var rg = $number( cg, false );
      var rb = $number( cb, false );

      if ( rr !== false && rg !== false && rb !== false )
      {
        var parsed = { r: rr, g: rg, b: rb };
        var ir = isRelative( cr );
        var ig = isRelative( cg );
        var ib = isRelative( cb );

        if ( !ignoreRelative && (ir || ig || ib) )
        {
          var mask = {
            r: ir ? 1 : 0,
            g: ig ? 1 : 0,
            b: ib ? 1 : 0
          };

          return computed.relative( parsed, mask );
        }

        return parsed;
      }
    }

    // Try to parse the color.
    var parsed = Color.parse( x );

    if ( parsed !== false )
    {
      return parsed;
    }

    if ( isString( x ) )
    {
      // If only a relative value is given it will modify the R, G, & B components.
      if ( isRelative( x ) )
      {
        var rx = $number( x, false );

        if ( !ignoreRelative && rx !== false )
        {
          return computed.relative( { r: rx, g: rx, b: rx } );
        }
      }

      var pair = x.split(/[\s,|]/);

      return {
        r: $number( pair[0], def.r ),
        g: $number( pair[1], def.g ),
        b: $number( pair[2], def.b )
      };
    }

    // If no value was given but the default value was given, clone it.
    return this.clone( def );
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
  convert: function(out, converter)
  {
    out.r = converter( out.r );
    out.g = converter( out.g );
    out.b = converter( out.b );
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
  div: function(out, denominator)
  {
    out.r = denominator.r ? out.r / denominator.r : 0;
    out.g = denominator.g ? out.g / denominator.g : 0;
    out.b = denominator.b ? out.b / denominator.b : 0;
    return out;
  },
  interpolate: function(out, start, end, delta)
  {
    out.r = (end.r - start.r) * delta + start.r;
    out.g = (end.g - start.g) * delta + start.g;
    out.b = (end.b - start.b) * delta + start.b;
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
    return isObject( a ) && 'r' in a && 'g' in a && 'b' in a;
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
  },
  min: function(out, a, b)
  {
    out.r = Math.min(a.r, b.r);
    out.g = Math.min(a.g, b.g);
    out.b = Math.min(a.b, b.b);
    return out;
  },
  max: function(out, a, b)
  {
    out.r = Math.max(a.r, b.r);
    out.g = Math.max(a.g, b.g);
    out.b = Math.max(a.b, b.b);
    return out;
  },
  dot: function(a, b)
  {
    return a.r * b.r + a.g * b.g + a.b * b.b;
  },
  random: function(out, min, max)
  {
    out.r = (max.r - min.r) * Math.random() + min.r;
    out.g = (max.g - min.g) * Math.random() + min.g;
    out.b = (max.b - min.b) * Math.random() + min.b;
    return out;
  }
});
