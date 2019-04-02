
import { isFunction, isNumber, isArray, isObject, isString, isRelative, coalesce } from '../Functions';
import { Calculator } from '../Calculator';
import { Value, ComponentTest, ComponentConverter, Vec2 } from '../Types';
import { computed } from '../computed';
import { $number } from '../parse';


/*
 * A calculator for objects with an x and y component (number)
 */
export class Calculator2d extends Calculator<Vec2>
{

  public aliases = {
    'left':   0,
    'right':  100,
    'middle': 50,
    'center': 50,
    'top':    0,
    'bottom': 100
  };

  public parse (x: any, defaultValue: Vec2, ignoreRelative = false): Value<Vec2>
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

    // When a number is given a uniform point is returned.
    if ( isNumber( x ) )
    {
      return {
        x: x,
        y: x
      };
    }

    // When an array is given, assume [x, y]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1] };
    }

    // Default when there is none given
    var def = coalesce( defaultValue, Defaults.calculator2d );

    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, def.x );
      var cy = coalesce( x.y, def.y );
      var rx = $number( cx, false );
      var ry = $number( cy, false );

      if ( rx !== false && ry !== false )
      {
        var parsed = { x: rx, y: ry };
        var ix = isRelative( cx );
        var iy = isRelative( cy );

        if ( !ignoreRelative && (ix || iy) )
        {
          var mask = {
            x: ix ? 1 : 0,
            y: iy ? 1 : 0
          };

          return computed.relative( parsed, mask );
        }

        return parsed;
      }
    }

    // Relative values & left/right/middle/center/top/bottom aliases.
    if ( isString( x ) )
    {
      // If only a relative value is given it will modify the X & Y components evenly.
      if ( !ignoreRelative && isRelative( x ) )
      {
        var rx = $number( x, false );

        if ( rx !== false )
        {
          return computed.relative( { x: rx, y: rx } );
        }
      }

      var pair = x.split(/[\s,|]/);

      return {
        x: this.parseString( pair[0], def.x ),
        y: this.parseString( coalesce(pair[1], pair[0]), def.y )
      };
    }

    // If no value was given but the default value was given, clone it.
    return this.clone( def );
  }

  public parseString (x: string, defaultValue: number): number
  {
    return x in this.aliases ? this.aliases[ x ] : $number( x, defaultValue );
  }

  public copy (out: Vec2, copy: Vec2): Vec2
  {
    out.x = copy.x;
    out.y = copy.y;
    return out;
  }

  public create (): Vec2
  {
    return {x: 0, y: 0};
  }

  public zero (out: Vec2): Vec2
  {
    out.x = 0.0;
    out.y = 0.0;
    return out;
  }

  public convert (out: Vec2, converter: ComponentConverter): Vec2
  {
    out.x = converter( out.x );
    out.y = converter( out.y );
    return out;
  }

  public adds (out: Vec2, amount: Vec2, amountScale: number): Vec2
  {
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    return out;
  }

  public mul (out: Vec2, scale: Vec2): Vec2
  {
    out.x *= scale.x;
    out.y *= scale.y;
    return out;
  }

  public div (out: Vec2, denominator: Vec2): Vec2
  {
    out.x = denominator.x ? out.x / denominator.x : 0;
    out.y = denominator.y ? out.y / denominator.y : 0;
    return out;
  }

  public interpolate (out: Vec2, start: Vec2, end: Vec2, delta: number)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    return out;
  }

  public distanceSq (a: Vec2, b: Vec2): number
  {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  public isValid (a: any): a is Vec2
  {
    return typeof a === 'object' && 'x' in a && 'y' in a;
  }

  public test (a: Vec2, tester: ComponentTest, all: boolean = false): boolean
  {
    return all
      ? (tester(a.x) && tester(a.y))
      : (tester(a.x) || tester(a.y));
  }

  public isEqual (a: Vec2, b: Vec2, epsilon: number = Defaults.EPSILON): boolean
  {
    return Math.abs(a.x - b.x) < epsilon &&
           Math.abs(a.y - b.y) < epsilon;
  }

  public min (out: Vec2, a: Vec2, b: Vec2): Vec2
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }

  public max (out: Vec2, a: Vec2, b: Vec2): Vec2
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }

  public dot (a: Vec2, b: Vec2): number
  {
    return a.x * b.x + a.y * b.y;
  }

  public random (out: Vec2, min: Vec2, max: Vec2): Vec2
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    return out;
  }

}