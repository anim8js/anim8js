
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
  if ( anim8.isObject( prop ) && anim8.isFunction( prop.get ) && anim8.isFunction( prop.set ) ) 
  {
    return prop;
  }
  if ( anim8.isString( prop ) && prop in anim8.property )
  {
	  return anim8.property[ prop ];
  }
	
  throw prop + ' is not a valid property';
}

anim8.property.cached = {};

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

anim8.style = (function()
{
  var camelize = function(str) 
	{
    return str.replace(/\-(\w)/g, function(str, letter)
    {
     return letter.toUpperCase();
    });
  };
	
	return function(e, style) 
	{
	  if (e.currentStyle) 
		{
	    return e.currentStyle[ camelize( style ) ];
	  } 
		else if (document.defaultView && document.defaultView.getComputedStyle) 
		{
	    return document.defaultView.getComputedStyle( e, null ).getPropertyValue( style );
	  } 
		else 
		{
	    return e.style[ camelize ( style ) ]; 
	  }
	};
	
})();

anim8.prefix = (function() 
{
  var a = document.createElement('a');
  
  return function(prefixes) 
  {
    for (var i = 0; i < prefixes.length; i++) 
    {
      if ( anim8.isDefined( a.style[ prefixes[ i ] ] ) ) 
      {
        return prefixes[i];
      }
    }
    return false;
  };
  
})();

anim8.parseValue = (function() 
{
  var regex = /(-?\d*(\.\d+)|-?\d+)(px|em|%|vw|ex|cm|mm|in|pt|pc|deg|rad)?/;
  
  return function(value, defaultUnit) 
  {
    if ( !anim8.isDefined( defaultUnit ) )
    {
      defaultUnit = 'px';
    }
    
    if ( anim8.isNumber( value ) ) 
    {
      return {
        value: value,
        unit: defaultUnit
      };
    }
    else if ( anim8.isString( value ) && value ) 
    {
      var parsed = regex.exec( value );
      
      if (parsed) 
      {      
        return {
          value: parseFloat( parsed[0] ),
          unit: parsed[2] || defaultUnit
        }
      }
    }
    
    return false;
  };
  
})();

anim8.factories.dom = 
{
	ids: 0,
  
	cached: {},
  
  is: function(subject) 
	{
    return anim8.isElement( subject );
  },
  
  parseAnimators: function(from, animators) 
	{
		var animatorId = from.getAttribute('anim8');
		
		if (!(animatorId in this.cached)) 
		{
			var animator = new anim8.DomAnimator( from );
			
			from.setAttribute('anim8', animatorId = animator.id = ++this.ids);
			
			animator.factory = this;
			
			this.cached[animatorId] = animator;
		}
		
		animators.push( this.cached[animatorId] );
  },
  
	cleanup: function(animator) 
	{
		delete this.cached[ animator.id ];
	}
};

anim8.property.factory = function(nm) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.style( e, nm );
        var parsed = anim8.parseValue( style );
        
        if (parsed) 
        {
          anim.frame[nm] = parsed.value;
          anim.events[nm].unit = parsed.unit;
          anim.animating[nm] = true;
        }
      }
    },
    set: function(e, anim) 
    { 
      e.style[nm] = anim.value( nm );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.factoryColor = function(nm) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var parsed = anim8.color.parse( e.style[nm] );
        
        if (parsed !== anim8.color.invalidColor) 
        {
          anim.frame[nm] = parsed;
          anim.animating[nm] = true;
        }              
      }
    },
    set: function(e, anim) 
    {
      e.style[nm] = anim8.color.format( anim.frame[nm] );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.padding                  = anim8.property.factory( 'padding' );
anim8.property.paddingTop               = anim8.property.factory( 'paddingTop' );
anim8.property.paddingRight             = anim8.property.factory( 'paddingRight' );
anim8.property.paddingBottom            = anim8.property.factory( 'paddingBottom' );
anim8.property.paddingLeft              = anim8.property.factory( 'paddingLeft' );

anim8.property.margin                   = anim8.property.factory( 'margin' );
anim8.property.marginTop                = anim8.property.factory( 'marginTop' );
anim8.property.marginRight              = anim8.property.factory( 'marginRight' );
anim8.property.marginBottom             = anim8.property.factory( 'marginBottom' );
anim8.property.marginLeft               = anim8.property.factory( 'marginLeft' );

anim8.property.borderRadius             = anim8.property.factory( 'borderRadius' );
anim8.property.borderTopLeftRadius      = anim8.property.factory( 'borderTopLeftRadius' );
anim8.property.borderTopRightRadius     = anim8.property.factory( 'borderTopRightRadius' );
anim8.property.borderBottomLeftRadius   = anim8.property.factory( 'borderBottomLeftRadius' );
anim8.property.borderBottomRightRadius  = anim8.property.factory( 'borderBottomRightRadius' );

anim8.property.borderWidth              = anim8.property.factory( 'borderWidth' );
anim8.property.borderTopWidth           = anim8.property.factory( 'borderTopWidth' );
anim8.property.borderRightWidth         = anim8.property.factory( 'borderRightWidth' );
anim8.property.borderBottomWidth        = anim8.property.factory( 'borderBottomWidth' );
anim8.property.borderLeftWidth          = anim8.property.factory( 'borderLeftWidth' );

anim8.property.outlineWidth             = anim8.property.factory( 'outlineWidth' );
anim8.property.textIndent               = anim8.property.factory( 'textIndent' );
anim8.property.borderSpacing            = anim8.property.factory( 'borderSpacing' );
anim8.property.fontSize                 = anim8.property.factory( 'fontSize' );
anim8.property.lineHeight               = anim8.property.factory( 'lineHeight' );
anim8.property.zIndex                   = anim8.property.factory( 'zIndex' );

anim8.property.color                    = anim8.property.factoryColor( 'color' );
anim8.property.backgroundColor          = anim8.property.factoryColor( 'backgroundColor' );
anim8.property.borderTopColor           = anim8.property.factoryColor( 'borderTopColor' );
anim8.property.borderRightColor         = anim8.property.factoryColor( 'borderRightColor' );
anim8.property.borderBottomColor        = anim8.property.factoryColor( 'borderBottomColor' );
anim8.property.borderLeftColor          = anim8.property.factoryColor( 'borderLeftColor' );
anim8.property.outlineColor             = anim8.property.factoryColor( 'outlineColor' );

anim8.property.minWidth                 = anim8.property.factory( 'minWidth' );
anim8.property.maxWidth                 = anim8.property.factory( 'maxWidth' );
anim8.property.minHeight                = anim8.property.factory( 'minHeight' );
anim8.property.maxHeight                = anim8.property.factory( 'maxHeight' );

anim8.property.width                    = anim8.property.factory('width');
anim8.property.width.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.width === false) 
    {
      anim.frame.width = e.offsetWidth;
      anim.animating.width = true;
    }
  };
})(anim8.property.width.get);

anim8.property.height                   = anim8.property.factory('height');
anim8.property.height.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.height === false) 
    {
      anim.frame.height = e.offsetHeight;
      anim.animating.height = true;
    }
  };
})(anim8.property.height.get);

anim8.property.top                      = anim8.property.factory('top');
anim8.property.top.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.top === false) 
    {
      anim.frame.top = e.offsetTop;
      anim.animating.top = true;
    }
  };
})(anim8.property.top.get);

anim8.property.right                    = anim8.property.factory('right');
anim8.property.right.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.right === false) 
    {
      anim.frame.right = e.parentNode.offsetWidth - (e.offsetLeft + e.offsetWidth);
      anim.animating.right = true;
    }
  };
})(anim8.property.right.get);

anim8.property.bottom                   = anim8.property.factory('bottom');
anim8.property.bottom.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.bottom === false) 
    {
      anim.frame.bottom = e.parentNode.offsetHeight - (e.offsetTop + e.offsetHeight);
      anim.animating.bottom = true;
    }
  };
})(anim8.property.bottom.get);

anim8.property.left                     = anim8.property.factory('left');
anim8.property.left.get = (function(proto) 
{
  return function(e, anim) 
  {
    proto.apply( this, arguments );
    
    if (anim.animating.left === false) 
    {
      anim.frame.left = e.offsetLeft;
      anim.animating.left = true;
    }
  };
})(anim8.property.left.get);


anim8.property.visibility = 
{
  get: function(e, anim) 
  {
    if (anim.animating.visibility === false) 
    {
      var style = anim8.style( e, 'visibility' );
      anim.frame.visibility = style === 'hidden' ? 0.0 : 1.0;
      anim.animating = true;
    }
  },
  set: function(e, anim) 
  {
    e.style.visibility = anim.frame.visibility < 0.5 ? 'hidden' : 'visible'
  },
  unset: function(e, anim)
  {
    e.style.visibility = null;
  }
}

anim8.property.backface = (function()
{
  var css = anim8.prefix(['WebkitBackfaceVisibility', 'MozBackfaceVisibility', 'msBackfaceVisibility', 'BackfaceVisibility']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim)
    {
      if ( anim.animating.backface === false )
      {
        var style = anim8.style( e, css ); 
        
        anim.frame.backface = (style === 'visible') ? 1.0 : 0.0;
        anim.animating.backface = true;
      }
    },
    set: function(e, anim)
    {
      e.style[css] = anim.frame.backface < 0.5 ? 'none' : 'visible';
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
    
  };
  
})();

anim8.property.transformOrigin = (function() 
{
  var css = anim8.prefix(['WebkitTransformOrigin', 'MozTransformOrigin', 'OTransformOrigin', 'msTransformOrigin', 'transformOrigin']);
  
  if ( !css )
  {
    return false;
  }
  
  var keywords = 
  {
    'left':   { value: 0,   unit: '%' },
    'center': { value: 50,  unit: '%' },
    'right':  { value: 100, unit: '%' },
    'top':    { value: 0,   unit: '%' },
    'bottom': { value: 100, unit: '%' },
  };
  
  var setOriginAttribute = function(value, anim, attr) 
  {
    if (anim.animating[attr] === false) 
    {
      var parsed = keywords[value] || anim8.parse( value );
      
      if (parsed) 
      {
        anim.frame[attr] = parsed.value;
        anim.units[attr] = parsed.unit;
        anim.animating[attr] = true;
      }
    }
  };
  
  var setOrigin = function(split, anim) 
  {
    if (anim.animating.origin === false) 
    {
      if ((split.length === 1) || 
          (split.length === 2 && split[0] === split[1]) || 
          (split.length === 3 && split[0] === split[1] && split[1] === split[2])) 
      {     
        setOriginAttribute( split[0], anim, 'origin' );
      }            
    }
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.style( e, css );
      
      if (style) 
      {
        var origin = style.toLowerCase();
        var split = origin.split(' ');
        
        switch (split.length) 
        {
        case 3:
          setOriginAttribute( split[0], anim, 'originX' );
          setOriginAttribute( split[1], anim, 'originY' );
          setOriginAttribute( split[2], anim, 'originZ' );
          setOrigin( split, anim );
          break;
        case 2:
          setOriginAttribute( split[0], anim, 'originX' );
          setOriginAttribute( split[1], anim, 'originY' );
          setOrigin( split, anim );
          break;
        case 1:
          setOriginAttribute( split[0], anim, 'originX' );
          setOriginAttribute( split[0], anim, 'originY' );
          setOrigin( split, anim );
          break;
        }
      }
    },
    set: function(e, anim) 
    {      
      var style = null;
      
      if ( anim8.isDefined( anim.frame.originZ ) )
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' ) + ' ' + anim.valueOr( 'originZ', 'origin', 'z' );
      } 
      else 
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' );
      }
      
      e.style[css] = style;      
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
  };
  
})();

anim8.property.transform = (function() 
{
  var css = anim8.prefix(['WebkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'transform']);
   
  if ( !css )
  {
    return false;
  }

  var d2 = { translate: true, scale: true };
  var d3 = { translate3d: true, scale3d: true };
  var d4 = { rotate3d: true };
  var axis = ['X', 'Y', 'Z'];
    
  var regex = 
  {
    translate: /translate\(([^,]+)\s*,\s*([^\)]+)\)/i,
    translate3d: /translate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    translateX: /translateX\(([^\)]+)\)/i,
    translateY: /translateY\(([^\)]+)\)/i,
    translateZ: /translateZ\(([^\)]+)\)/i,
    scale: /scale\(([^,]+)\s*,\s*([^\)]+)\)/i,
    scale3d: /scale3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    scaleX: /scaleX\(([^\)]+)\)/i,
    scaleY: /scaleY\(([^\)]+)\)/i,
    scaleZ: /scaleZ\(([^\)]+)\)/i,
    rotate: /rotate\(([^\)]+)\)/i,
    rotate3d: /rotate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    rotateX: /rotateX\(([^\)]+)\)/i,
    rotateY: /rotateY\(([^\)]+)\)/i,
    rotateZ: /rotateZ\(([^\)]+)\)/i,
    skew: /skew\(([^,]+)\s*,\s*([^\)]+)\)/i,
    skewX: /skewX\(([^\)]+)\)/i,
    skewY: /skewY\(([^\)]+)\)/i
  };
  
  var parse = function( value, anim, attr )
  {
    var attribute = anim8.attribute( attr );
    
    var parsed = anim8.parseValue( value, attribute.defaultUnit );
    
    if ( parsed === false )
    {
      return attribute.defaultValue;
    }
    
    if ( anim8.isDefined( parsed.unit ) )
    {
      anim.units[ attr ] = parsed.unit;
    }
    
    return parsed.value;
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.style( e, css );
      
      for (var attr in anim.animating) 
      {
        if (anim.animating[attr] === false && attr in regex) 
        {
          var parsed = regex[attr].exec( style );
          
          if (parsed) 
          {
            if (attr in d4) 
            {
              anim.frame[attr] = {
                x: parse( parsed[0], anim, attr ),
                y: parse( parsed[1], anim, attr ),
                z: parse( parsed[2], anim, attr ),
                angle: parse( parsed[3], anim, attr )
              };
            }
            else if (attr in d3)
            {
              anim.frame[attr] = {
                x: parse( parsed[0], anim, attr ),
                y: parse( parsed[1], anim, attr ),
                z: parse( parsed[2], anim, attr )
              };
            }
            else if (attr in d2) 
            {
              anim.frame[attr] = {
                x: parse( parsed[0], anim, attr ),
                y: parse( parsed[1], anim, attr )
              };
            }
            else 
            {
              anim.frame[attr] = parse( parsed[0], anim, attr );
            }
            
            anim.animating[attr] = true;
          }
        }
      }
    },
    set: function(e, anim) 
    {  
      var transforms = [];
      
      for (var attr in regex) 
      {
        if (attr in anim.frame) 
        {
          if ( !anim.updated[attr] )
          {
            continue;
          }
          
          var value = anim.frame[ attr ];
          var unit = anim.unit( attr );
          
          if (attr in d4) 
          {
            transforms.push( attr + '(' + value.x + ',' + value.y + ',' + value.z + ',' + value.angle + unit + ')' );
          }
          else if (attr in d3) 
          {
            transforms.push( attr + '(' + value.x + unit + ',' + value.y + unit + ',' + value.z + unit + ')' );
          }
          else if (attr in d2) 
          {
            transforms.push( attr + '(' + value.x + unit + ',' + value.y + unit + ')' );
          }
          else
          {
            transforms.push( attr + '(' + value + unit + ')' );
          }
        }
      }
			
      if (transforms.length) 
      {
        e.style[css] = transforms.join(' ');
      }
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
  };
  
})();

anim8.property.opacity = (function() 
{
  var css = anim8.prefix(['WebkitOpacity', 'MozOpacity', 'KhtmlOpacity', 'opacity']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating.opacity === false) 
      {
        var style = anim8.style( e, css );
        var opacity = parseFloat( style );
        
        if ( !isNaN(opacity) ) 
        {
          anim.frame.opacity = opacity
          anim.animating.opacity = true;
        }
      }
    },
    set: function(e, anim) 
    {
      e.style[css] = anim.frame.opacity;
    },
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
  };
  
})();

anim8.property.filter = (function() 
{
  var css = anim8.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
  
  if ( !css )
  {
    return false;
  }
  
	var methods = 
  {
		grayscale: 	'grayscale',
		sepia: 			'sepia',
		saturate: 	'saturate',
		hueRotate: 	'hue-rotate',
		invert: 		'invert',
		brightness: 'brightness',
		contrast: 	'contrast'
	};
	
	var patterns = {};
	
	for (var attr in methods) 
  {
		patterns[attr] = new RegExp( methods[attr] + '\(([^\)]+)\)', 'i');
	}
  
	return {
    
		get: function(e, anim) 
    {
			var style = anim8.style( e, css );
      
			for (var attr in patterns) 
      {
				if (anim.animating[attr] === false) 
        {
					var parsed = patterns[attr].exec( style );
          
					if (parsed !== false) 
          {
						anim.frame[attr] = anim8.parseValue( parsed[0] );
						anim.animating[attr] = true;
					}
				}
			}
		}, 
		set: function(e, anim) 
    {
			var filters = [];
      
			for (var attr in methods) 
      {
				if ( attr in anim.frame ) 
        {
          if ( anim.updated[attr] )
          {
            filters.push( methods[attr] + '(' + anim.value( attr ) + ')' );
          }
				}
			}
      
			if (filters.length) 
      {
				e.style[css] = filters.join(' ');
			}
		},
    unset: function(e, anim)
    {
      e.style[css] = null;
    }
	};
	
})();

anim8.attribute.padding                 = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.margin                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.outlineWidth						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.outlineOffset						= {defaultValue: 0};
anim8.attribute.textIndent							= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderSpacing						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.fontSize								= {defaultValue: 1, defaultUnit: 'em'};
anim8.attribute.lineHeight							= {defaultValue: 1, defaultUnit: 'em'};

anim8.attribute.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
anim8.attribute.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
anim8.attribute.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

anim8.attribute.opacity                 = {defaultValue: 1};
anim8.attribute.zIndex                  = {defaultValue: 1};

anim8.attribute.width                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.height                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.angle                   = {defaultValue: 0, applier: 'orbit'};
anim8.attribute.distance                = {defaultValue: 0, applier: 'orbit'};

anim8.attribute.top                     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.right                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.left                    = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.centerX                 = {defaultValue: 0, defaultUnit: 'px', applier: 'center'};
anim8.attribute.centerY                 = {defaultValue: 0, defaultUnit: 'px', applier: 'center'};

anim8.attribute.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
anim8.attribute.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.brightness              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.contrast                = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

anim8.attribute.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
anim8.attribute.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

anim8.attribute.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
anim8.attribute.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

anim8.attribute.scale                   = {defaultValue: {x: 0, y:0}, property: 'transform', calculator: '2d'};
anim8.attribute.scaleX	                = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleY  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleZ  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

anim8.attribute.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
anim8.attribute.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
anim8.attribute.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

anim8.attribute.backface                = {defaultValue: 0};
anim8.attribute.visibility              = {defaultValue: 1};

anim8.attribute.backgroundColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.color                   = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderTopColor          = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderRightColor        = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderBottomColor       = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderLeftColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.outlineColor            = {defaultValue: anim8.color(), calculator: 'rgba'};

anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
  this.trues = {};
  this.attributeToProperty = [];
  this.animating = {};
  this.animation = null;
};

anim8.DomAnimator.prototype = new anim8.Animator();

anim8.DomAnimator.prototype.preupdate = function()
{
  if ( this.trues.length === 0 )
  {
    return;
  }
  
  var properties = {};
  
  for (var attr in this.trues)
  {
    properties[ this.attributeToProperty[attr] ] = true;
      
    this.animating[ attr ] = false;
  }
  
  for (var prop in properties)
  {
    this.properties[ prop ].get( this.e, this );
  }
  
  for (var attr in this.trues)
  {
    if ( this.animating[attr] === true )
    {      
      var e = this.trues[ attr ];
      var p = e.path.copy();
      var ps = p.points;
            
      for (var i = 0; i < ps.length; i++)
      {
        if ( ps[i] === true )
        {
          ps[i] = this.frame[attr];
        }
      }
    
      e.path = p;
    }
    
    delete this.trues[ attr ];
  }
};

anim8.DomAnimator.prototype.onAnimation = function(animation, options, events)
{
  this.animation = animation;
};

anim8.DomAnimator.prototype.apply = function()
{
  var applyProperties = {};
  
  for (var attr in this.frame)
  {
    if ( this.updated[ attr ] )
    {
      var prop = this.attributeToProperty[ attr ];
      
      if ( prop in this.properties )
      {
        applyProperties[ prop ] = true; 
      }
    }
  }
  
  for (var prop in applyProperties)
  {
    this.properties[ prop ].set( this.e, this );
  }
  
  for (var attr in this.frame)
  {
    this.updated[ attr ] = false;
  }
  
  this.trimEvents();
};

anim8.DomAnimator.prototype.placeEvent = function( e )
{
  anim8.Animator.prototype.placeEvent.apply( this, arguments );
  
  var attr = e.attribute;
  var attribute = anim8.attribute( attr );
  var prop = anim8.coalesce( attribute.property, attr );
  var property = anim8.property( prop );
    
  if ( e.hasTrue() )
  {    
    this.trues[ attr ] = e;
  }
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  
  if ( this.animation && this.animation.input && this.animation.input.units && attr in this.animation.input.units )
  {
    e.unit = this.animation.input.units[ attr ];
  }
  else
  {
    e.unit = attribute.defaultUnit; 
  }
};

anim8.DomAnimator.prototype.restore = function()
{
  for (var prop in this.properties)
  {
    this.properties[prop].unset( this.e, this );
    
    delete this.properties[prop];
  }
};

anim8.DomAnimator.prototype.cleanup = function()
{
	this.factory.cleanup( this );
  
  this.trigger('cleanup');
};

anim8.DomAnimator.prototype.value = function(attr)
{
  return this.frame[ attr ] + this.unit( attr );
};

anim8.DomAnimator.prototype.valueOr = function(attr, other, subproperty)
{
  var value = this.frame[ attr ];
    
  if ( !anim8.isDefined( value ) )
  {
    value = this.frame[ attr = other ];
      
    if ( anim8.isDefined( subproperty ) )
    {
      value = value[ subproperty ];
    }
  }
  
  return value + this.unit( attr );
};

anim8.DomAnimator.prototype.unit = function(attr)
{
  return ( attr in this.events ? this.events[ attr ].unit || '' : '' );
};