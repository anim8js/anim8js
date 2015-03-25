/**
 * Calculators perform math and basic operations for a specific data structure. Calculators have the following methods.
 *
 *  parse(x, default)
 *  copy(out, copy)
 * -clone(out)
 *  create()
 *  zero(out)
 * -scale(out, scale)
 * -add(out, amount)
 *  adds(out, amount, amountScale)
 * -sub(out, amount)
 *  mul(out, scale)
 * -interpolate(out, start, end, delta)
 *  distanceSq(a, b)
 *  isValid(a)
 *  isNaN(a)
 *  isZero(a, epsilon)
 *  isEqual(a, b, epsilon)
 */

/**
 * Creates a calculator and fills in any missing methods where possible.
 * 
 * @param {string} name
 * @param {object} methods
 */
anim8.calculator.create = function(name, methods)
{
  var defaultMethods = 
	{
	  clone: function(out) 
		{
	    return this.copy( this.create(), out );
	  },
	  scale: function(out, scale) 
		{
	    return this.adds( out, out, scale - 1 );
	  },
	  add: function(out, amount) 
		{
	    return this.adds( out, amount, 1 );
	  },
	  sub: function(out, amount) 
		{
	    return this.adds( out, amount, -1 );
	  },
	  interpolate: function(out, start, end, delta) 
		{
	    out = this.zero( out );
	    out = this.adds( out, start, 1 - delta );
	    out = this.adds( out, end, delta );
	    return out;
	  },
		distance: function(a, b)
		{
			return Math.sqrt( this.distanceSq( a, b ) );
		},
    isPristine: function(x)
    {
      return ( x === true || anim8.isFunction( x ) );
    }
	};
  
  for (var method in defaultMethods)
  {
    if ( !(method in methods) )
    {
      methods[ method ] = defaultMethods[ method ];
    }
  }
  
	anim8.calculator[name] = methods; 
};

/**
 * A calculator for number primitives.
 */
anim8.calculator.create('number', 
{
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

/*
 * A calculator for objects with an x and y component (number)
 */
anim8.calculator.create('2d', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x
			};
		}
		if ( anim8.isObject( x ) )
		{
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y )
			};
		}
    if ( anim8.isString( x ) )
    {
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
    
    if ( anim8.isDefined( defaultValue ) )
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
  }
});

/**
 * A calculator for objects with an x, y, and z component (number)
 */
anim8.calculator.create('3d',
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: x,
				y: x,
				z: x
			};
		}
		if ( anim8.isObject( x ) )
		{	
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y ),
				z: anim8.coalesce( x.z, defaultValue.z )
			};
		}
    
    if ( anim8.isDefined( defaultValue ) )
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
  }
});

/**
 * A calculator for objects with an x, y, z, and angle components.
 */
anim8.calculator.create('quaternion', 
{
	parse: function(x, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( x ) )
		{
			return {
				x: 0,
				y: 0,
				z: 1,
				angle: x
			};
		}
		if ( anim8.isObject( x ) )
		{
			return {
				x: anim8.coalesce( x.x, defaultValue.x ),
				y: anim8.coalesce( x.y, defaultValue.y ),
				z: anim8.coalesce( x.z, defaultValue.z ),
				angle: anim8.coalesce( x.angle, defaultValue.angle )
			};
		}
    
    if ( anim8.isDefined( defaultValue ) )
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
		out.angle = copy.angle;
    return out;
  },
  create: function() 
	{
    return {x: 0.0, y:0.0, z:0.0, angle:0.0};
  },
  zero: function(out) 
	{
    out.x = 0.0;
    out.y = 0.0;
		out.z = 0.0;
		out.angle = 0.0;
    return out;
  },
  adds: function(out, amount, amountScale) 
	{
    out.x += amount.x * amountScale;
    out.y += amount.y * amountScale;
		out.z += amount.z * amountScale;
		out.angle += amount.angle * amountScale;
    return out;
  },
  mul: function(out, scale) 
	{
    out.x *= scale.x;
    out.y *= scale.y;
		out.z *= scale.z;
		out.angle *= scale.angle;
    return out;
  },
  distanceSq: function(a, b) 
	{
    var dx = a.x - b.x;
    var dy = a.y - b.y;   
		var dz = a.z - b.z; 
		var da = a.angle - b.angle;
    return dx * dx + dy * dy + dz * dz + da * da;
  },
  isValid: function(a) 
	{
    return typeof a === 'object' && 'x' in a && 'y' in a && 'z' in a && 'angle' in a;
  },
  isNaN: function(a) 
	{
    return isNaN(a.x) || isNaN(a.y) || isNaN(a.z) || isNaN(a.angle);
  },
  isZero: function(a, epsilon) 
	{
    return Math.abs(a.x) < epsilon && 
		  		 Math.abs(a.y) < epsilon && 
		       Math.abs(a.z) < epsilon && 
		       Math.abs(a.angle) < epsilon;
  },
  isEqual: function(a, b, epsilon) 
	{
    return Math.abs(a.x - b.x) < epsilon && 
					 Math.abs(a.y - b.y) < epsilon && 
				   Math.abs(a.z - b.z) < epsilon && 
		       Math.abs(a.angle - b.angle) < epsilon;
  }
});

/**
 * A calculator for objects with r, g, & b components (numbers 0 -> 255)
 */
anim8.calculator.create('rgb', 
{
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
 * A calculator for objects with r, g, & b components 
 * (numbers 0 -> 255) and an a (alpha) component (0.0 -> 1.0).
 */
anim8.calculator.create('rgba', 
{
	parse: function(a, defaultValue)
	{
    if ( this.isPristine( x ) )
    {
      return x;
    }
		if ( anim8.isNumber( a ) )
		{
			return {
				r: a,
				g: a,
				b: a,
				a: 1.0
			};
		}
		
		return anim8.color.parse( a );
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
  }
});

/**
 * Sets the default calculator to the numeric calculator.
 */
anim8.calculator.default = anim8.calculator.number;