
import { isFunction, isNumber, isArray, isObject, isString, isRelative, coalesce } from '../Functions';
import { Calculator } from '../Calculator';
import { Value, ComponentTest, ComponentConverter, Vec3 } from '../Types';
import { computed } from '../computed';
import { $number } from '../parse';

/**
 * A calculator for objects with an x, y, and z component (number)
 */
export class Calculator3d extends Calculator<Vec3>
{

  public parse (x: any, defaultValue: Vec3, ignoreRelative = false): Value<Vec3>
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
        y: x,
        z: x
      };
    }

    // When an array is given, assume [x, y, z]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1], z: x[2] };
    }

    // Default when there is none given
    var def = coalesce( defaultValue, Defaults.calculator3d );

    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, def.x );
      var cy = coalesce( x.y, def.y );
      var cz = coalesce( x.z, def.z );
      var rx = $number( cx, false );
      var ry = $number( cy, false );
      var rz = $number( cz, false );

      if ( rx !== false && ry !== false && rz !== false )
      {
        var parsed = { x: rx, y: ry, z: rz };
        var ix = isRelative( cx );
        var iy = isRelative( cy );
        var iz = isRelative( cz );

        if ( !ignoreRelative && (ix || iy || iz) )
        {
          var mask = {
            x: ix ? 1 : 0,
            y: iy ? 1 : 0,
            z: iz ? 1 : 0
          };

          return computed.relative( parsed, mask );
        }

        return parsed;
      }
    }

    if ( isString( x ) )
    {
      // If only a relative value is given it will modify the X, Y, & Z components evenly.
      if ( !ignoreRelative && isRelative( x ) )
      {
        var rx = $number( x, false );

        if ( rx !== false )
        {
          return computed.relative( { x: rx, y: rx, z: rx } );
        }
      }

      var pair = x.split(/[\s,|]/);

      return {
        x: $number( pair[0], def.x ),
        y: $number( pair[1], def.y ),
        z: $number( pair[2], def.z )
      };
    }

    // If no value was given but the default value was given, clone it.
    return this.clone( def );
  }

  public copy (out: Vec3, copy: Vec3): Vec3
  {
    out.x = copy.x;
    out.y = copy.y;
    out.z = copy.z;
    return out;
  }

  public create (): Vec3
  {
    return {x: 0.0, y:0.0, z:0.0};
  }

  public zero (out: Vec3): Vec3
  {
    out.x = 0.0;
    out.y = 0.0;
    out.z = 0.0;
    return out;
  }

  public convert (out: Vec3, converter: ComponentConverter): Vec3
  {
    out.x = converter( out.x );
    out.y = converter( out.y );
    out.z = converter( out.z );
    return out;
  }

  public adds (out: Vec3, amount: Vec3, amountScale: number): Vec3
  {
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    out.z += amount.z * amountScale;
    return out;
  }

  public mul (out: Vec3, scale: Vec3): Vec3
  {
    out.x *= scale.x;
    out.y *= scale.y;
    out.z *= scale.z;
    return out;
  }

  public div (out: Vec3, denominator: Vec3): Vec3
  {
    out.x = denominator.x ? out.x / denominator.x : 0;
    out.y = denominator.y ? out.y / denominator.y : 0;
    out.z = denominator.z ? out.z / denominator.z : 0;
    return out;
  }

  public interpolate (out: Vec3, start: Vec3, end: Vec3, delta: number): Vec3
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    out.z = (end.z - start.z) * delta + start.z;
    return out;
  }

  public distanceSq (a: Vec3, b: Vec3): number
  {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  }

  public isValid (a: any): a is Vec3
  {
    return typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;
  }

  public test (a: Vec3, tester: ComponentTest, all: boolean = false): boolean
  {
    return all
      ? (tester(a.x) && tester(a.y) && tester(a.z))
      : (tester(a.x) || tester(a.y) || tester(a.z));
  }

  public isEqual (a: Vec3, b: Vec3, epsilon: number = Defaults.EPSILON): boolean
  {
    return Math.abs(a.x - b.x) < epsilon &&
           Math.abs(a.y - b.y) < epsilon &&
           Math.abs(a.z - b.z) < epsilon;
  }

  public min (out: Vec3, a: Vec3, b: Vec3): Vec3
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  }

  public max (out: Vec3, a: Vec3, b: Vec3): Vec3
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  }

  public dot (a: Vec3, b: Vec3): number
  {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  public random (out: Vec3, min: Vec3, max: Vec3): Vec3
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    out.z = (max.z - min.z) * Math.random() + min.z;
    return out;
  }

}
