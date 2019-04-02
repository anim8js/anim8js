
import { isFunction, isNumber, isArray, isObject, isString, isRelative, coalesce } from '../Functions';
import { Calculator } from '../Calculator';
import { Value, ComponentTest, ComponentConverter, Color } from '../Types';
import { computed } from '../computed';
import { Colors, $number } from '../parse';



/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 */
export class CalculatorColor extends Calculator<Color>
{

  public parse (x: any, defaultValue: Color, ignoreRelative = false): Value<Color>
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
        b: x,
        a: 1.0
      };
    }

    // When an array is given, assume [r, g, b, a?]
    if ( isArray( x ) )
    {
      x = { r: x[0], g: x[1], b: x[2], a: coalesce(x[3], 1.0) };
    }

    // Default when there is none given
    var def = coalesce( defaultValue, Defaults.calculatorColor );

    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cr = coalesce( x.r, def.r );
      var cg = coalesce( x.g, def.g );
      var cb = coalesce( x.b, def.b );
      var ca = coalesce( x.a, def.a );
      var rr = $number( cr, false );
      var rg = $number( cg, false );
      var rb = $number( cb, false );
      var ra = $number( ca, false );

      if ( rr !== false && rg !== false && rb !== false && ra !== false )
      {
        var parsed = { r: rr, g: rg, b: rb, a: ra };
        var ir = isRelative( cr );
        var ig = isRelative( cg );
        var ib = isRelative( cb );
        var ia = isRelative( ca );

        if ( !ignoreRelative && (ir || ig || ib || ia) )
        {
          var mask = {
            r: ir ? 1 : 0,
            g: ig ? 1 : 0,
            b: ib ? 1 : 0,
            a: ia ? 1 : 0
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
          return computed.relative( { r: rx, g: rx, b: rx, a: 0 } );
        }
      }

      var pair = x.split(/[\s,|]/);

      return {
        r: $number( pair[0], def.r ),
        g: $number( pair[1], def.g ),
        b: $number( pair[2], def.b ),
        a: $number( pair[3], def.a )
      };
    }

    // If no value was given but the default value was given, clone it.
    return this.clone( def );
  }

  public copy (out: Color, copy: Color): Color
  {
    out.r = copy.r;
    out.g = copy.g;
    out.b = copy.b;
    out.a = copy.a;
    return out;
  }

  public create (): Color
  {
    return {r: 0, g: 0, b: 0, a: 0};
  }

  public zero (out: Color): Color
  {
    out.r = 0;
    out.g = 0;
    out.b = 0;
    out.a = 0;
    return out;
  }

  public convert (out: Color, converter: ComponentConverter): Color
  {
    out.r = converter( out.r );
    out.g = converter( out.g );
    out.b = converter( out.b );
    out.a = converter( out.a );
    return out;
  }

  public adds (out: Color, amount: Color, amountScale: number): Color
  {
    out.r += amount.r * amountScale;
    out.g += amount.g * amountScale;
    out.b += amount.b * amountScale;
    out.a += amount.a * amountScale;
    return out;
  }

  public mul (out: Color, scale: Color): Color
  {
    out.r *= scale.r;
    out.g *= scale.g;
    out.b *= scale.b;
    out.a *= scale.a;
    return out;
  }

  public div (out: Color, denominator: Color): Color
  {
    out.r = denominator.r ? out.r / denominator.r : 0;
    out.g = denominator.g ? out.g / denominator.g : 0;
    out.b = denominator.b ? out.b / denominator.b : 0;
    out.a = denominator.a ? out.a / denominator.a : 0;
    return out;
  }

  public interpolate (out: Color, start: Color, end: Color, delta: number): Color
  {
    out.r = (end.r - start.r) * delta + start.r;
    out.g = (end.g - start.g) * delta + start.g;
    out.b = (end.b - start.b) * delta + start.b;
    out.a = (end.a - start.a) * delta + start.a;
    return out;
  }

  public distanceSq (a: Color, b: Color): number
  {
    var dr = a.r - b.r;
    var dg = a.g - b.g;
    var db = a.b - b.b;
    var da = a.a - b.a;
    return dr * dr + dg * dg + db * db + da * da;
  }

  public isValid (a: any): a is Color
  {
    return isObject( a ) && 'r' in a && 'g' in a && 'b' in a;
  }

  public test (a: Color, tester: ComponentTest, all: boolean = false): boolean
  {
    return all
      ? (tester(a.r) && tester(a.g) && tester(a.b) && tester(a.a))
      : (tester(a.r) || tester(a.g) || tester(a.b) || tester(a.a));
  }

  public isEqual (a: Color, b: Color, epsilon: number = Defaults.EPSILON): boolean
  {
    return Math.abs(a.r - b.r) < epsilon &&
           Math.abs(a.g - b.g) < epsilon &&
           Math.abs(a.b - b.b) < epsilon &&
           Math.abs(a.a - b.a) < epsilon;
  }

  public min (out: Color, a: Color, b: Color): Color
  {
    out.r = Math.min(a.r, b.r);
    out.g = Math.min(a.g, b.g);
    out.b = Math.min(a.b, b.b);
    out.a = Math.min(a.a, b.a);
    return out;
  }

  public max (out: Color, a: Color, b: Color): Color
  {
    out.r = Math.max(a.r, b.r);
    out.g = Math.max(a.g, b.g);
    out.b = Math.max(a.b, b.b);
    out.a = Math.max(a.a, b.a);
    return out;
  }

  public dot (a: Color, b: Color): number
  {
    return a.r * b.r + a.g * b.g + a.b * b.b + a.a * b.a;
  }

  public random (out: Color, min: Color, max: Color): Color
  {
    out.r = (max.r - min.r) * Math.random() + min.r;
    out.g = (max.g - min.g) * Math.random() + min.g;
    out.b = (max.b - min.b) * Math.random() + min.b;
    out.a = (max.a - min.a) * Math.random() + min.a;
    return out;
  }

}
