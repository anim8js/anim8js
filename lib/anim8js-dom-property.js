
anim8.property.factory = function(nm, relativeTo) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.style( e, nm );
        var converted = anim8.convert( e, style, anim.unit( nm ), relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
      }
    },
    set: function(e, anim) 
    { 
      anim.styles[nm] = anim.value( nm );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.factoryDerivable = function(nm, relativeTo, deriver) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.style( e, nm );
        var converted = anim8.convert( e, style, anim.unit( nm ), relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
        else if ( anim8.isFunction( deriver ) )
        {
          converted = anim8.convert( e, deriver( e ), anim.unit( nm ), relativeTo );
          
          if ( converted !== false )
          {
            anim.frame[nm] = converted;
            anim.animating[nm] = true;
          }
        }
      }
    },
    set: function(e, anim) 
    { 
      anim.styles[nm] = anim.value( nm );
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
      anim.styles[nm] = anim8.color.format( anim.frame[nm] );
    },
    unset: function(e, anim)
    {
      e.style[nm] = null;
    }
  };
};

anim8.property.padding                  = anim8.property.factory( 'padding', 'parentWidth' );
anim8.property.paddingTop               = anim8.property.factory( 'paddingTop', 'parentWidth' );
anim8.property.paddingRight             = anim8.property.factory( 'paddingRight', 'parentWidth' );
anim8.property.paddingBottom            = anim8.property.factory( 'paddingBottom', 'parentWidth' );
anim8.property.paddingLeft              = anim8.property.factory( 'paddingLeft', 'parentWidth' );

anim8.property.margin                   = anim8.property.factory( 'margin', 'parentWidth' );
anim8.property.marginTop                = anim8.property.factory( 'marginTop', 'parentWidth' );
anim8.property.marginRight              = anim8.property.factory( 'marginRight', 'parentWidth' );
anim8.property.marginBottom             = anim8.property.factory( 'marginBottom', 'parentWidth' );
anim8.property.marginLeft               = anim8.property.factory( 'marginLeft', 'parentWidth' );

anim8.property.borderRadius             = anim8.property.factory( 'borderRadius', 'width' );
anim8.property.borderTopLeftRadius      = anim8.property.factory( 'borderTopLeftRadius', 'width' );
anim8.property.borderTopRightRadius     = anim8.property.factory( 'borderTopRightRadius', 'width' );
anim8.property.borderBottomLeftRadius   = anim8.property.factory( 'borderBottomLeftRadius', 'width' );
anim8.property.borderBottomRightRadius  = anim8.property.factory( 'borderBottomRightRadius', 'width' );

anim8.property.borderWidth              = anim8.property.factory( 'borderWidth' );
anim8.property.borderTopWidth           = anim8.property.factory( 'borderTopWidth' );
anim8.property.borderRightWidth         = anim8.property.factory( 'borderRightWidth' );
anim8.property.borderBottomWidth        = anim8.property.factory( 'borderBottomWidth' );
anim8.property.borderLeftWidth          = anim8.property.factory( 'borderLeftWidth' );

anim8.property.outlineWidth             = anim8.property.factory( 'outlineWidth' );
anim8.property.textIndent               = anim8.property.factory( 'textIndent', 'parentWidth' );
anim8.property.borderSpacing            = anim8.property.factory( 'borderSpacing' );
anim8.property.fontSize                 = anim8.property.factory( 'fontSize', 'parentFontSize' );
anim8.property.lineHeight               = anim8.property.factory( 'lineHeight', 'fontSize' );
anim8.property.zIndex                   = anim8.property.factory( 'zIndex' );

anim8.property.color                    = anim8.property.factoryColor( 'color' );
anim8.property.backgroundColor          = anim8.property.factoryColor( 'backgroundColor' );
anim8.property.borderTopColor           = anim8.property.factoryColor( 'borderTopColor' );
anim8.property.borderRightColor         = anim8.property.factoryColor( 'borderRightColor' );
anim8.property.borderBottomColor        = anim8.property.factoryColor( 'borderBottomColor' );
anim8.property.borderLeftColor          = anim8.property.factoryColor( 'borderLeftColor' );
anim8.property.outlineColor             = anim8.property.factoryColor( 'outlineColor' );

anim8.property.minWidth                 = anim8.property.factory( 'minWidth', 'parentWidth' );
anim8.property.maxWidth                 = anim8.property.factory( 'maxWidth', 'parentWidth' );
anim8.property.minHeight                = anim8.property.factory( 'minHeight', 'parentHeight' );
anim8.property.maxHeight                = anim8.property.factory( 'maxHeight', 'parentHeight' );

anim8.property.width                    = anim8.property.factoryDerivable('width', 'parentWidth', function(e) { return e.offsetWidth + 'px'; });
anim8.property.height                   = anim8.property.factoryDerivable('height', 'parentHeight', function(e) { return e.offsetHeight + 'px'; });

anim8.property.top                      = anim8.property.factoryDerivable('top', 'parentHeight', function(e) { return e.offsetTop + 'px'; });
anim8.property.right                    = anim8.property.factoryDerivable('right', 'parentWidth', function(e) { return (e.parentNode.scrollWidth - (e.offsetLeft + e.offsetWidth)) + 'px'; });
anim8.property.bottom                   = anim8.property.factoryDerivable('bottom', 'parentHeight', function(e) { return (e.parentNode.scrollHeight - (e.offsetTop + e.offsetHeight)) + 'px'; });
anim8.property.left                     = anim8.property.factoryDerivable('left', 'parentWidth', function(e) { return e.offsetLeft + 'px'; });

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
    anim.styles.visibility = anim.frame.visibility < 0.5 ? 'hidden' : 'visible'
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
      anim.styles[css] = anim.frame.backface < 0.5 ? 'none' : 'visible';
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
    'left':   '0%',
    'center': '50%',
    'right':  '100%',
    'top':    '0%',
    'bottom': '100%'
  };
  
  var setOriginAttribute = function(e, value, anim, attr, relativeTo ) 
  {
    if (anim.animating[attr] === false) 
    {
      if ( value in keywords )
      {        
        value = keywords[ value ];
      }

      var converted = anim8.convert( e, value, anim.unit( attr ), relativeTo );
      
      if ( converted !== false )
      {
        anim.frame[ attr ] = converted;
        anim.animating[ attr ] = true;
      }
    }
  };
  
  var setOrigin = function(e, split, anim) 
  {
    if (anim.animating.origin === false) 
    {
      if ((split.length === 1) || 
          (split.length === 2 && split[0] === split[1]) || 
          (split.length === 3 && split[0] === split[1] && split[1] === split[2])) 
      {     
        setOriginAttribute( e, split[0], anim, 'origin', 'width' );
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
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[1], anim, 'originY', 'height' );
          setOriginAttribute( e, split[2], anim, 'originZ' );
          setOrigin( e, split, anim );
          break;
        case 2:
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[1], anim, 'originY', 'height' );
          setOrigin( e, split, anim );
          break;
        case 1:
          setOriginAttribute( e, split[0], anim, 'originX', 'width' );
          setOriginAttribute( e, split[0], anim, 'originY', 'height' );
          setOrigin( e, split, anim );
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
      
      anim.styles[css] = style;
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
  
  var parse = function( e, value, anim, attr, relativeTo )
  {
    var desiredUnit = anim.unit( attr );
    var converted = anim8.convert( e, value, desiredUnit, relativeTo );
    
    if ( converted !== false )
    {
      return converted;
    }
    
    // TODO show convert this to desiredUnit, however defaultValue may be non-scalar.
    return anim8.attribute( attr ).defaultValue;    
  };
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.style( e, css );
      
      for (var attr in anim.animating) 
      {
        if ( anim.animating[ attr ] === false && attr in regex ) 
        {
          var parsed = regex[ attr ].exec( style );
          
          if ( parsed ) 
          {
            if ( attr in d4 ) 
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' ),
                z: parse( e, parsed[3], anim, attr ),
                angle: parse( e, parsed[4], anim, attr )
              };
            }
            else if ( attr in d3 )
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' ),
                z: parse( e, parsed[3], anim, attr )
              };
            }
            else if ( attr in d2 ) 
            {
              anim.frame[attr] = {
                x: parse( e, parsed[1], anim, attr, 'width' ),
                y: parse( e, parsed[2], anim, attr, 'height' )
              };
            }
            else 
            {
              anim.frame[attr] = parse( e, parsed[1], anim, attr, 'width' );
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
        anim.styles[css] = transforms.join(' ');
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
      anim.styles[ css ] = anim.frame.opacity;
    },
    unset: function(e, anim)
    {
      e.style[ css ] = null;
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
		contrast: 	'contrast',
    blur:       'blur'
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
				if ( anim.animating[attr] === false ) 
        {
					var parsed = patterns[attr].exec( style );
          
					if (parsed !== false) 
          {
            var converted = anim8.convert( e, parsed[1], anim.unit( attr ) );
            
            if ( converted !== false )
            {
              anim.frame[ attr ] = converted;
              anim.animating[ attr ] = true;
            }
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
				anim.styles[ css ] = filters.join(' ');
			}
		},
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
	};
	
})();

anim8.property.center = 
{
  get: function(e, anim)
  {
    var cx = (e.offsetLeft + e.offsetWidth * 0.5) + 'px';
    var cy = (e.offsetTop + e.offsetHeight * 0.5) + 'px';
    
    if ( anim.animating.center === false )
    {
      var desiredUnit = anim.unit( 'center' );
      var ccx = anim8.convert( e, cx, desiredUnit, 'parentWidth' );
      var ccy = anim8.convert( e, cy, desiredUnit, 'parentHeight' );
      
      if ( ccx !== false && ccy !== false )
      {
        anim.frame.center = {
          x: ccx,
          y: ccy
        };
        anim.animating.center = true;
      }
    }
    if ( anim.animating.centerX === false )
    {
      var desiredUnit = anim.unit( 'centerX' );
      var ccx = anim8.convert( e, cx, desiredUnit, 'parentWidth' );
      
      if ( ccx !== false )
      {
        anim.frame.centerX = ccx;
        anim.animating.centerX = true;
      }
    }
    if ( anim.animating.centerY === false )
    {
      var desiredUnit = anim.unit( 'centerY' );
      var ccy = anim8.convert( e, cy, desiredUnit, 'parentHeight' );
      
      if ( ccy !== false )
      {
        anim.frame.centerY = ccy;
        anim.animating.centerY = true;
      }
    }
  },
  preset: function(e, anim)
  {
    anim.cached.width  = anim8.convert( e, e.offsetWidth + 'px', anim.units.centerX || anim.units.center, 'x' );
    anim.cached.height = anim8.convert( e, e.offsetHeight + 'px', anim.units.centerY || anim.units.center, 'y' );
  },
  set: function(e, anim)
  {
    var rw = anim.cached.width * 0.5;
    var rh = anim.cached.height * 0.5;
        
    if ( anim.updated.center )
    {      
      anim.styles.left = (anim.frame.center.x - rw) + anim.unit( 'center' );
      anim.styles.top = (anim.frame.center.y - rh) + anim.unit( 'center' );
    }
    if ( anim.updated.centerX )
    {
      anim.styles.left = (anim.frame.centerX - rw) + anim.unit( 'centerX' );
    }
    if ( anim.updated.centerY )
    {
      anim.styles.top = (anim.frame.centerY - rh) + anim.unit( 'centerY' );
    }
  }
};

anim8.property.orbit = 
{
  DEGREE_TO_RADIAN: Math.PI / 180.0,
  
  RADIAN_TO_DEGREE: 180.0 / Math.PI,
  
  get: function(e, anim)
  {
    var ox = (e.parentNode.scrollWidth * 0.5);
    var oy = (e.parentNode.scrollHeight * 0.5); 
    var cx = (e.offsetLeft + e.offsetWidth * 0.5);
    var cy = (e.offsetTop + e.offsetHeight * 0.5);
    var dx = cx - ox;
    var dy = cy - oy;
  
    if ( anim.animating.orbitOffset === false )
    {
      var cunit = anim.unit( 'orbitOffset' );
      var cox = anim8.convert( e, ox + 'px', cunit, 'parentWidth' );
      var coy = anim8.convert( e, oy + 'px', cunit, 'parentHeight' );
      
      if ( cox !== false && coy !== false )
      {
        anim.frame.orbitOffset = {
          x: cox,
          y: coy
        };
        anim.animating.orbitOffset = false;
      }
    }
    
    if ( anim.animating.distance === false )
    {
      anim.frame.distance = Math.sqrt( dx * dx + dy * dy );
      anim.animating.distance = true;
    }
    
    if ( anim.animating.angle === false )
    {
      anim.frame.angle = Math.atan2( dy, dx ) * this.RADIAN_TO_DEGREE;
      anim.animating.angle = true;
    }
  },
  
  preset: function(e, anim)
  {  
    anim.cached.parentWidth = e.parentNode.scrollWidth;
    anim.cached.parentHeight = e.parentNode.scrollHeight;
    anim.cached.width = e.offsetWidth;
    anim.cached.height = e.offsetHeight;
  },
  
  set: function(e, anim)
  {
    // TODO calculator this correctly
    var cunit = anim.unit( 'orbitOffset' ) || '%';
    var orbitX = anim.frame.orbitOffset ? anim.frame.orbitOffset.x : 50;
    var orbitY = anim.frame.orbitOffset ? anim.frame.orbitOffset.y : 50;
    
    var originUnit = anim.unit( 'origin' ) || '%';
    var originX = anim.frame.origin ? anim.frame.origin.x : 50;
    var originY = anim.frame.origin ? anim.frame.origin.y : 50;
    
    var cox = anim8.convert( e, orbitX + cunit, 'px', anim.cached.parentWidth / 100.0 );
    var coy = anim8.convert( e, orbitY + cunit, 'px', anim.cached.parentHeight / 100.0 );
    
    var ox = anim8.convert( e, originX + originUnit, 'px', anim.cached.width / 100.0 );
    var oy = anim8.convert( e, originY + originUnit, 'px', anim.cached.height / 100.0 );
    
    var angle = (anim.frame.angle || 0.0) * this.DEGREE_TO_RADIAN;
    var distance = anim.frame.distance || 0.0;
        
    var cos = Math.cos( angle ) * distance;
    var sin = Math.sin( angle ) * distance;
    
    anim.styles.left = (cox + cos - ox) + 'px';
    anim.styles.top = (coy + sin - oy) + 'px';
  }
};