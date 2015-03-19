/*

var script = document.scripts[document.scripts.length - 1];

var m8prop = script.dataset['prop'] || '$';
var m8access = script.dataset['access'] || 'property';
var m8interval = script.dataset['interval'] || 10;

 */

m8 = anim8 = function(subjects) 
{
  if ( this === window ) 
  {
		var args = Array.prototype.slice.call( arguments );
		
		if ( !anim8.isArray( subjects ) )
		{
			subjects = [];
			
			for (var i = 0; i < args.length; i++)
			{
				subjects.push( args[i] );
			}
		}
		
    var animators = [];
    
    for (var i = 0; i < subjects.length; i++) 
    {
      var arg = subjects[ i ];
      
      if ( arg instanceof anim8.Animator ) 
      {
        animators.push( arg );
      } 
      else
      {
				var factory = anim8.factories( arg );
				
				if (factory !== false)
				{
          factory.parseAnimators( arg, animators );
				}
      }
    }
		
		return new anim8( animators );
  } 
  else 
  {
    for (var i = 0; i < subjects.length; i++) 
    {
      this.push( subjects[ i ] );
    }
  }
};

/*****************************************************************
  UTILITY FUNCTIONS
******************************************************************/


anim8.noop = function() {};

anim8.isDefined = function(x) 
{
  return typeof x !== 'undefined';
};

anim8.isFunction = function(x) 
{
  return typeof x === 'function';
};

anim8.isNumber = function(x) 
{
  return typeof x === 'number';
};

anim8.isString = function(x) 
{
  return typeof x === 'string';
};

anim8.isArray = function(x) 
{
  return x instanceof Array;
};

anim8.isObject = function(x) 
{
  return typeof x === 'object';
};

anim8.isElement = function(x)
{
  return typeof HTMLElement === "object" ? x instanceof HTMLElement :
  x && typeof x === "object" && x !== null && x.nodeType === 1 && typeof x.nodeName === "string";
};

anim8.now = function() 
{
  return new Date().getTime();
};

anim8.copy = function(x) 
{
  if ( anim8.isObject(x) ) 
  {
    var copy = {};
    for (var p in x) 
    {
      copy[p] = anim8.copy( x[p] );
    }
    x = copy;
  }
  else if ( anim8.isArray(x) ) 
  {
    var copy = [];
    for (var i = 0; i < x.length; i++) 
    {
      copy.push( anim8.copy( x[i] ) );
    }
    x = copy;
  }
  
  return x;
};

anim8.clean = function(x)
{
	if ( anim8.isArray( x ) )
	{
		for (var i = x.length - 1; i >= 0; i--)
		{
			if ( !x[i] )
			{
				x.splice( i, 1 );
			}
		}
	}
	if ( anim8.isObject( x ) )
	{
		for (var prop in x)
		{
			if (!x[prop])
			{
				delete x[prop];
			}
		}
	}
	
	return x;
}

anim8.mapify = function(arr, value)
{
	var map = {};
	
	for (var i = 0; i < arr.length; i++)
	{
		map[ arr[i] ] = value;
	}
	
	return map;
};

anim8.coalesce = function(a, b, c) 
{
  if (anim8.isDefined(a)) return a;
  if (anim8.isDefined(b)) return b;
  if (anim8.isDefined(c)) return c;
};

anim8.delegate = function(functionName, returnThis) 
{  
  if (returnThis) 
  {
    return function() 
    {
      for (var i = 0; i < this.length; i++) 
      {
        this[i][functionName].apply( this[i], arguments );
      }
      
      return this;  
    };
  }
  
  return function() 
  {
    var results = [];
    
    for (var i = 0; i < this.length; i++) 
    {
      results.push( this[i][functionName].apply( this[i], arguments ) );
    }
    
    return results;
  };
  
};

anim8.extend = function(target)
{
	for (var i = 1; i < arguments.length; i++)
	{
		var a = arguments[i];
		
		if ( anim8.isObject( a ) )
		{
			for (var prop in a)
			{
				if (!(prop in target))
				{
					target[prop] = a[prop];
				}
			}	
		}
	}
	
	return target;
};


/*****************************************************************
  REGISTRIES
******************************************************************/

// FACTORY      {is(o), parseAnimators(o, out)}
anim8.factories = function(subject) 
{
	for (var factoryName in anim8.factories) 
	{		
		var factory = anim8.factories[ factoryName ];
			
		if ( factory.is( subject ) )
		{			
			return factory;
		}
	}
	
	throw 'No factory exists for subject ' + subject;
};

// PROPERTY     {get(e,anim), set(e,anim)}

/* 
  anim8.property[name] = {
    get: function(e, anim) {
      // based on anim.animating, gets one or more value from the entity and places it on anim.frame. this function should only do this for an attribute if
      // anim.animating[attribute] === false. When it successfully gets a value anim.animating[attribute] should be set to true. This is called before an animation
      // begins on attributes that will be animated based on the current value. A copy of the values placed will be put into anim.initial so any Appliers have
      // reference to the initial state of the entity before animation.
    },
    set: function(e, anim) {
      // applies the applicable attributes in anim.frame to the entity, 
    }
 }
*/
anim8.property = function(prop) 
{
  if ( anim8.isObject(prop) && anim8.isFunction(prop.get) && anim8.isFunction(prop.set) ) 
  {
    return prop;
  }
  if ( anim8.isString(prop) )
  {
	  if ( prop in anim8.property )
	  {
		  return anim8.property[ prop ];
	  }
	  if ( prop in anim8.property.cached )
	  {
		  return anim8.property.cached[ prop ];
	  }
		
		return anim8.property.cached[ prop ] = 
		{
      get: function(e, anim) {
        anim.animating[prop] = anim8.isDefined( anim.frame[prop] = e[prop] );
      },
      set: function(e, anim) {
        e[prop] = anim.frame[prop];
      }
		};
  }
	
  throw prop + ' is not a valid property';
}

anim8.property.cached = {};

/* Attributes are the animatable properties of a subject

  anim8.attribute[name] = {
    // the default value for an attribute if none exists on the subject
    defaultValue: 0,
    // the name of the property this attribute maps to. default value: name of the attribute
    property: propertyName,
    // the name of the calculator this attribute requires for mathematical operations. default value: anim8.calculator.default
    calculator: calculatorName,
    // the name of an applier that must be called each frame to calculate the value of a dynamic attribute
    applier: applier,
    // other values can be specified here that the respective factory might use
    "factory specific attributes"
  }
*/
anim8.attribute = function(attr) 
{
  if ( anim8.isObject(attr) && anim8.isDefined(attr.defaultValue) ) 
	{
    return attr;
  }
  if ( anim8.isString(attr) && attr in anim8.attribute ) 
	{
    return anim8.attribute[ attr ];
  }
	
  return anim8.attribute.default;
};

anim8.attribute.default = {defaultValue: 0};

/* Appliers takes attributes and dependent properties and use them to set other attributes

  anim8.applier[name] = {
    // array of properties required 
    properties: [],
    // function to invoke each frame
    apply: function(e, anim)
  }
*/
anim8.applier = function(applier) 
{
  if ( anim8.isObject( applier ) && anim8.isFunction( applier.apply ) ) 
	{
    return applier;
  }
  if ( anim8.isString( applier ) && applier in anim8.applier ) 
	{
    return anim8.applier[ applier ];
  }
	
	throw applier + ' is not a valid applier';
};
 
/* Easings are functions that are magic

  anim8.applier[name] = {
    // array of properties required 
    properties: [],
    // function to invoke each frame
    apply: function(e, anim)
  }
*/

anim8.easing = function(easing) 
{
  if ( anim8.isFunction( easing ) ) 
	{
    return easing;
  }
	if ( anim8.isString( easing ) )
	{
		if ( easing in anim8.easing )
		{
			return anim8.easing[ easing ];
		}
		if ( easing.indexOf('-') !== -1 )
		{
			var pair = easing.split('-');
			var e = pair[0];
			var t = pair[1];
			
			if ( pair.length >= 2 && e in anim8.easing && t in anim8.easingType )
			{				
				return anim8.easingType[ t ]( anim8.easing[ e ] );
			}
		}
	}
  if ( anim8.isArray( easing ) && easing.length === 4 ) 
	{
    return BezierEasing.apply( null, easing );
  }
  if ( !anim8.isDefined( easing ) ) 
	{
    return anim8.easing.default;
  }
	
  throw easing + ' is not a valid easing';
};

/*
 
 
 */
anim8.easingType = function(easingType)
{
	if ( anim8.isFunction( easingType ) )
	{
		return easingType;
	}
	if ( anim8.isString( easingType ) && easingType in anim8.easingType )
	{
		return anim8.easingType[ easingType ];
	}
	
	throw easingType + ' is not a valid easing type';
};


/*
 
 
 */
anim8.calculator = function(calc)
{
	if ( anim8.isObject(calc) )
	{
		return calc;
	}
	if ( anim8.isString( calc ) && calc in anim8.calculator )
	{
		return anim8.calculator[ calc ];
	}
	
	return anim8.calculator.default;
	// throw calc + ' is not a valid calculator';
};


/*
 
 
 */
anim8.parser = function(parser)
{
	if ( anim8.isFunction( parser ) )
	{
		return parser;
	}
	if ( anim8.isString( parser ) && parser in anim8.parser )
	{
		return anim8.parser[ parser ];
	}
	
	return false;
	// throw parser + ' is not a valid parser';
};


/*
 
 
 */
anim8.animation = function(animation, options)
{
	if ( anim8.isString( animation ) && animation in anim8.animation )
	{
		return anim8.animation[ animation ];
	}
	if ( anim8.isObject( animation ) )
	{
		var events = [];
		
		options = options || {};
		
		for (var parserName in animation)
		{
			var parser = anim8.parser( parserName );
			
			if ( parser !== false )
			{
				parser( animation, options, events );
			}
		}
		
		if (events.length)
		{
			return new anim8.Animation( false, animation, options, events );
		}
	}
	
	return false;
	// throw animation + ' is not a valid animation';
};


/*
 
 
 */
anim8.defaults = 
{
  duration: 1000,
  easing: function(d){return d},
  delay: 0,
  sleep: 0,
  repeat: 1
};


/*****************************************************************
  ANIM8 DEFINITION
******************************************************************/

anim8.prototype = new Array();

anim8.prototype.each = function(iterator) 
{
  for (var i = 0; i < this.length; i++) 
  {
    if ( iterator.call( this[i], this[i], i ) === false ) 
    {
      break;
    }
  }
	
	return this;
};

anim8.prototype.filter = function(func)
{
	for (var i = this.length - 1; i >= 0; i--)
	{
		if ( !func(this[i]) )
		{
			this.slice(i, 1);
		}
	}
	
	return this;
};

anim8.prototype.pause 			= anim8.delegate('pause', true);
anim8.prototype.transition 	= anim8.delegate('transition', true);
anim8.prototype.play 				= anim8.delegate('play', true);
anim8.prototype.resume 			= anim8.delegate('resume', true);
anim8.prototype.stop 				= anim8.delegate('stop', true);
anim8.prototype.end 				= anim8.delegate('end', true);