m8 = anim8 = function(animators) 
{
  if ( this === window ) 
  {
    if ( anim8.isArray( animators ) ) 
    {
      return new anim8( animators );
    }
    else 
    {
      var animators = [];
      
      for (var i = 0; i < arguments.length; i++) 
      {
        var arg = arguments[ i ];
        
        if ( arg instanceof anim8.Animator ) 
        {
          animators.push( arg );
        } 
        else 
        {
          for (var k = 0; k < anim8.factories; k++) 
          {
            var factory = anim8.factories[ k ];
            
            if ( factory.is( arg ) ) 
            {
              factory.parseAnimators( arg, animators );
            }
          }
        }
      }
      return new anim8( subjects );
    }
  } 
  else 
  {
    for (var i = 0; i < animators.length; i++) 
    {
      this.push( animators[ i ] );
    }
  }
};

/*****************************************************************
  UTILITY FUNCTIONS
******************************************************************/

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

anim8.coalesce = function(a, b, c) 
{
  if (anim8.isDefined(a)) return a;
  if (anim8.isDefined(b)) return b;
  if (anim8.isDefined(c)) return c;
};

anim8.now = function() 
{
  return new Date().getTime();
};

anim8.noop = function() {};

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


/*****************************************************************
  REGISTRIES
******************************************************************/

// FACTORY      {is(o), parseAnimators(o, out)}
anim8.factories = [];

// PROPERTY     {get(e,anim), set(e,anim)}

/*  TODO move to DOM
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
anim8.property = function(prop) {
  if ( anim8.isObject(prop) && anim8.isFunction(prop.get) && anim8.isFunction(prop.set) ) {
    return prop;
  }
  if ( anim8.isString(prop) && prop in anim8.property ) {
    return anim8.property[ prop ];
  }
  if ( anim8.isString(prop) ) {
    return {
      get: function(e, anim) {
        anim.animating[prop] = anim8.isDefined( anim.frame[prop] = e[prop] );
      },
      set: function(e, anim) {
        e[prop] = anim.frame[prop];
      }
    }
  }
  throw prop + ' is not a valid property';
}


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
anim8.attribute = function(attr) {
  if ( anim8.isObject(attr) && anim8.isDefined(attr.defaultValue) ) {
    return attr;
  }
  if ( anim8.isString(attr) && attr in anim8.attribute ) {
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
anim8.applier = function(applier) {
  if ( anim8.isObject(applier) && anim8.isFunction(applier.apply) ) {
    return applier;
  }
  if ( anim8.isString(applier) && applier in anim8.applier ) {
    return anim8.applier[ applier ];
  }
  return anim8.applier.default;
};

anim8.applier.default = {
  apply: function(e, anim) {
    
  }
}

 
/* Easings are functions that are magic

  anim8.applier[name] = {
    // array of properties required 
    properties: [],
    // function to invoke each frame
    apply: function(e, anim)
  }
*/

anim8.easing = function(easing) {
  if ( anim8.isFunction(easing) ) {
    return easing;
  }
  if ( anim8.isString(easing) && easing in anim8.easing ) {
    return anim8.easing[ easing ];
  }
  if ( anim8.isArray(easing) && easing.length === 4 ) {
    return BezierEasing.apply( null, easing );
  }
  if ( !anim8.isDefined(easing) ) {
    return anim8.easing.default;
  }
  throw easing + ' is not a valid easing';
};

anim8.easing.linear = function(d) {
  return d;
};

anim8.easing.default = anim8.easing.default;


/*
anim8.easings = {};
anim8.easings.bezier = function(a, b, c, d) {
    return BezierEasing(a, b, c, d);
};
anim8.easings.ease = anim8.easings.bezier(0.25, 0.1, 0.25, 1);
anim8.easings.linear = anim8.easings.bezier(0, 0, 1, 1);
anim8.easings.easeIn = anim8.easings.bezier(0.42, 0, 1, 1);
anim8.easings.easeOut = anim8.easings.bezier(0, 0, 0.58, 1);
anim8.easings.easeInOut = anim8.easings.bezier(0.42, 0, 0.58, 1);
anim8.easings.default = anim8.easings.ease;
*/



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
};

anim8.prototype.pause = anim8.delegate('pause', true);