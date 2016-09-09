
/*
 * A calculator for objects with an x and y component (number)
 *
 * @class Calculator2d
 * @constructor
 * @extends Calculator
 */
function Calculator2d()
{
  this.createConstants();
}

Class.extend( Calculator2d, Calculator,
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
        y: x
      };
    }

    // When an array is given, assume [x, y]
    if ( isArray( x ) )
    {
      x = { x: x[0], y: x[1] };
    }

    // When an object is given, check for relative values.
    if ( isObject( x ) )
    {
      // Default when there is none given
      var dx = 0, dy = 0;

      if ( defaultValue )
      {
        dx = defaultValue.x;
        dy = defaultValue.y;
      }

      var cx = coalesce( x.x, dx );
      var cy = coalesce( x.y, dy );
      var rx = this.getRelativeAmount( cx );
      var ry = this.getRelativeAmount( cy );

      if ( rx !== false && ry !== false )
      {
        var parsed = { x: rx, y: ry };
        var ix = this.isRelative( cx );
        var iy = this.isRelative( cy );

        if ( ix || iy )
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
      if ( this.isRelative( x ) )
      {
        var rx = this.getRelativeAmount( x );

        if ( rx !== false )
        {
          return computed.relative( { x: rx, y: rx } );
        }
      }

      var aliases = {
        'left':   0,
        'right':  100,
        'middle': 50,
        'center': 50,
        'top':    0,
        'bottom': 100
      };

      if ( x.indexOf(' ') === -1 )
      {
        var _x = parseFloat( x );

        if ( !isNaN(_x) || x in aliases )
        {
          return {
            x: x in aliases ? aliases[x] : _x,
            y: x in aliases ? aliases[x] : _x
          };
        }
      }
      else
      {
        var pair = x.split(' ');
        var _x = parseFloat( pair[0] );
        var _y = parseFloat( pair[1] );

        if ((!isNaN(_x) || pair[0] in aliases) && (!isNaN(_y) || pair[1] in aliases))
        {
          return {
            x: pair[0] in aliases ? aliases[pair[0]] : _x,
            y: pair[1] in aliases ? aliases[pair[1]] : _y
          };
        }
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
    return out;
  },
  create: function()
  {
    return {x: 0.0, y:0.0};
  },
  zero: function(out)
  {
    out.x = 0.0;
    out.y = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale)
  {
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
    return out;
  },
  mul: function(out, scale)
  {
    out.x *= scale.x;
    out.y *= scale.y;
    return out;
  },
  interpolate: function(out, start, end, delta)
  {
    out.x = (end.x - start.x) * delta + start.x;
    out.y = (end.y - start.y) * delta + start.y;
    return out;
  },
  distanceSq: function(a, b)
  {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return dx * dx + dy * dy;
  },
  isValid: function(a)
  {
    return typeof a === 'object' && 'x' in a && 'y' in a;
  },
  isNaN: function(a)
  {
    return isNaN(a.x) || isNaN(a.y);
  },
  isZero: function(a, epsilon)
  {
    return Math.abs(a.x) < epsilon &&
           Math.abs(a.y) < epsilon;
  },
  isEqual: function(a, b, epsilon)
  {
    return Math.abs(a.x - b.x) < epsilon &&
           Math.abs(a.y - b.y) < epsilon;
  },
  min: function(out, a, b)
  {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  },
  max: function(out, a, b)
  {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  },
  dot: function(a, b)
  {
    return a.x * b.x + a.y * b.y;
  },
  random: function(out, min, max)
  {
    out.x = (max.x - min.x) * Math.random() + min.x;
    out.y = (max.y - min.y) * Math.random() + min.y;
    return out;
  }
});
