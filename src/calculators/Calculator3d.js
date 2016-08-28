
/**
 * A calculator for objects with an x, y, and z component (number)
 *
 * @class Calculator3d
 * @constructor
 * @extends Calculator
 */
function Calculator3d()
{
  this.createConstants();
}

Class.extend( Calculator3d, Calculator,
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
    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      var cx = coalesce( x.x, defaultValue.x );
      var cy = coalesce( x.y, defaultValue.y );
      var cz = coalesce( x.z, defaultValue.z );
      var rx = this.getRelativeAmount( cx );
      var ry = this.getRelativeAmount( cy );
      var rz = this.getRelativeAmount( cz );

      if ( rx !== false && ry !== false && rz !== false )
      {
        var parsed = { x: rx, y: ry, z: rz };
        var ix = this.isRelative( cx );
        var iy = this.isRelative( cy );
        var iz = this.isRelative( cz );

        if ( ix || iy || iz )
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
    // If only a relative value is given it will modify the X, Y, & Z components evenly.
    if ( this.isRelative( x ) )
    {
      var rx = this.getRelativeAmount( x );

      if ( rx !== false )
      {
        return computed.relative( { x: rx, y: rx, z: rx } );
      }
    }

    // If no value was given but the default value was given, clone it.
    if ( isDefined( defaultValue ) )
    {
      return this.clone( defaultValue );
    }

    return false;
  },
  copy: function(out, copy)
  {
    out.x = copy.x;
    out.y = copy.y;
    out.z = copy.z;
    return out;
  },
  create: function()
  {
    return {x: 0.0, y:0.0, z:0.0};
  },
  zero: function(out)
  {
    out.x = 0.0;
    out.y = 0.0;
    out.z = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale)
  {
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    out.z += amount.z * amountScale;
    return out;
  },
  mul: function(out, scale)
  {
    out.x *= scale.x;
    out.y *= scale.y;
    out.z *= scale.z;
    return out;
  },
  interpolate: function(out, start, end, delta)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    out.z = (end.z - start.z) * delta + start.z;
    return out;
  },
  distanceSq: function(a, b)
  {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
  },
  isValid: function(a)
  {
    return typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a;
  },
  isNaN: function(a)
  {
    return isNaN(a.x) || isNaN(a.y) || isNaN(a.z);
  },
  isZero: function(a, epsilon)
  {
    return Math.abs(a.x) < epsilon &&
           Math.abs(a.y) < epsilon && Math.abs(a.z) < epsilon;
  },
  isEqual: function(a, b, epsilon)
  {
    return Math.abs(a.x - b.x) < epsilon &&
           Math.abs(a.y - b.y) < epsilon &&
           Math.abs(a.z - b.z) < epsilon;
  },
  min: function(out, a, b)
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    return out;
  },
  max: function(out, a, b)
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    return out;
  },
  dot: function(a, b)
  {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  },
  random: function(out, min, max)
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    out.z = (max.z - min.z) * Math.random() + min.z;
    return out;
  }
});
