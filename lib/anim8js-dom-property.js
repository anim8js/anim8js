
/**
 * Properties for the DOM animator.
 */

anim8.dom.property.factory = function(nm, relativeTo) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.dom.style( e, nm );
        var converted = anim8.dom.convert( e, style, anim.units[ nm ], relativeTo );
        
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

anim8.dom.property.factoryDerivable = function(nm, relativeTo, deriver) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var style = anim8.dom.style( e, nm );
        var converted = anim8.dom.convert( e, style, anim.units[ nm ], relativeTo );
        
        if ( converted !== false ) 
        {
          anim.frame[nm] = converted;
          anim.animating[nm] = true;
        }
        else if ( anim8.isFunction( deriver ) )
        {
          converted = anim8.dom.convert( e, deriver( e ), anim.units[ nm ], relativeTo );
          
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

anim8.dom.property.factoryColor = function(nm) 
{
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating[nm] === false) 
      {
        var parsed = anim8.color.parse( e.style[nm] );
        
        if (parsed !== false) 
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

anim8.dom.property.padding                  = anim8.dom.property.factory( 'padding', 'parentWidth' );
anim8.dom.property.paddingTop               = anim8.dom.property.factory( 'paddingTop', 'parentWidth' );
anim8.dom.property.paddingRight             = anim8.dom.property.factory( 'paddingRight', 'parentWidth' );
anim8.dom.property.paddingBottom            = anim8.dom.property.factory( 'paddingBottom', 'parentWidth' );
anim8.dom.property.paddingLeft              = anim8.dom.property.factory( 'paddingLeft', 'parentWidth' );

anim8.dom.property.margin                   = anim8.dom.property.factory( 'margin', 'parentWidth' );
anim8.dom.property.marginTop                = anim8.dom.property.factory( 'marginTop', 'parentWidth' );
anim8.dom.property.marginRight              = anim8.dom.property.factory( 'marginRight', 'parentWidth' );
anim8.dom.property.marginBottom             = anim8.dom.property.factory( 'marginBottom', 'parentWidth' );
anim8.dom.property.marginLeft               = anim8.dom.property.factory( 'marginLeft', 'parentWidth' );

anim8.dom.property.borderRadius             = anim8.dom.property.factory( 'borderRadius', 'width' );
anim8.dom.property.borderTopLeftRadius      = anim8.dom.property.factory( 'borderTopLeftRadius', 'width' );
anim8.dom.property.borderTopRightRadius     = anim8.dom.property.factory( 'borderTopRightRadius', 'width' );
anim8.dom.property.borderBottomLeftRadius   = anim8.dom.property.factory( 'borderBottomLeftRadius', 'width' );
anim8.dom.property.borderBottomRightRadius  = anim8.dom.property.factory( 'borderBottomRightRadius', 'width' );

anim8.dom.property.borderWidth              = anim8.dom.property.factory( 'borderWidth' );
anim8.dom.property.borderTopWidth           = anim8.dom.property.factory( 'borderTopWidth' );
anim8.dom.property.borderRightWidth         = anim8.dom.property.factory( 'borderRightWidth' );
anim8.dom.property.borderBottomWidth        = anim8.dom.property.factory( 'borderBottomWidth' );
anim8.dom.property.borderLeftWidth          = anim8.dom.property.factory( 'borderLeftWidth' );

anim8.dom.property.outlineWidth             = anim8.dom.property.factory( 'outlineWidth' );
anim8.dom.property.textIndent               = anim8.dom.property.factory( 'textIndent', 'parentWidth' );
anim8.dom.property.borderSpacing            = anim8.dom.property.factory( 'borderSpacing' );
anim8.dom.property.fontSize                 = anim8.dom.property.factory( 'fontSize', 'parentFontSize' );
anim8.dom.property.lineHeight               = anim8.dom.property.factory( 'lineHeight', 'fontSize' );
anim8.dom.property.zIndex                   = anim8.dom.property.factory( 'zIndex' );

anim8.dom.property.color                    = anim8.dom.property.factoryColor( 'color' );
anim8.dom.property.backgroundColor          = anim8.dom.property.factoryColor( 'backgroundColor' );
anim8.dom.property.borderTopColor           = anim8.dom.property.factoryColor( 'borderTopColor' );
anim8.dom.property.borderRightColor         = anim8.dom.property.factoryColor( 'borderRightColor' );
anim8.dom.property.borderBottomColor        = anim8.dom.property.factoryColor( 'borderBottomColor' );
anim8.dom.property.borderLeftColor          = anim8.dom.property.factoryColor( 'borderLeftColor' );
anim8.dom.property.outlineColor             = anim8.dom.property.factoryColor( 'outlineColor' );

anim8.dom.property.minWidth                 = anim8.dom.property.factory( 'minWidth', 'parentWidth' );
anim8.dom.property.maxWidth                 = anim8.dom.property.factory( 'maxWidth', 'parentWidth' );
anim8.dom.property.minHeight                = anim8.dom.property.factory( 'minHeight', 'parentHeight' );
anim8.dom.property.maxHeight                = anim8.dom.property.factory( 'maxHeight', 'parentHeight' );

anim8.dom.property.width                    = anim8.dom.property.factoryDerivable('width', 'parentWidth', function(e) { return e.offsetWidth + 'px'; });
anim8.dom.property.height                   = anim8.dom.property.factoryDerivable('height', 'parentHeight', function(e) { return e.offsetHeight + 'px'; });

anim8.dom.property.top                      = anim8.dom.property.factoryDerivable('top', 'parentHeight', function(e) { return e.offsetTop + 'px'; });
anim8.dom.property.right                    = anim8.dom.property.factoryDerivable('right', 'parentWidth', function(e) { return (e.parentNode.scrollWidth - (e.offsetLeft + e.offsetWidth)) + 'px'; });
anim8.dom.property.bottom                   = anim8.dom.property.factoryDerivable('bottom', 'parentHeight', function(e) { return (e.parentNode.scrollHeight - (e.offsetTop + e.offsetHeight)) + 'px'; });
anim8.dom.property.left                     = anim8.dom.property.factoryDerivable('left', 'parentWidth', function(e) { return e.offsetLeft + 'px'; });

anim8.dom.property.visibility = 
{
  get: function(e, anim) 
  {
    if (anim.animating.visibility === false) 
    {
      var style = anim8.dom.style( e, 'visibility' );
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

anim8.dom.property.backface = (function()
{
  var css = anim8.dom.prefix(['WebkitBackfaceVisibility', 'MozBackfaceVisibility', 'msBackfaceVisibility', 'BackfaceVisibility']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim)
    {
      if ( anim.animating.backface === false )
      {
        var style = anim8.dom.style( e, css ); 
        
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

anim8.dom.property.transformOrigin = (function() 
{
  var css = anim8.dom.prefix(['WebkitTransformOrigin', 'MozTransformOrigin', 'OTransformOrigin', 'msTransformOrigin', 'transformOrigin']);
  
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

      var converted = anim8.dom.convert( e, value, anim.units[ attr ], relativeTo );
      
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
      var style = anim8.dom.style( e, css );
      
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

anim8.dom.property.transform = (function() 
{
  var css = anim8.dom.prefix(['WebkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'transform']);
   
  if ( !css )
  {
    return false;
  }
  
  var parse = function( e, value, anim, attr, relativeTo )
  {
    var desiredUnit = anim.units[ attr ];
    var converted = anim8.dom.convert( e, value, desiredUnit, relativeTo );
    
    if ( converted !== false )
    {
      return converted;
    }
    
    // TODO show convert this to desiredUnit, however defaultValue may be non-scalar.
    return anim.getAttribute( attr ).defaultValue;    
  };

  var getter1d = function(e, anim, parsed, attr)
  {
    return parse( e, parsed[1], anim, attr, 'width' )
  };
  var getter2d = function(e, anim, parsed, attr)
  {
    return {
      x: parse( e, parsed[1], anim, attr, 'width' ),
      y: parse( e, parsed[2], anim, attr, 'height' )
    };
  };
  var getter3d = function(e, anim, parsed, attr)
  {
    return {
      x: parse( e, parsed[1], anim, attr, 'width' ),
      y: parse( e, parsed[2], anim, attr, 'height' ),
      z: parse( e, parsed[3], anim, attr )
    };
  };
  var getter4d = function(e, anim, parsed, attr)
  {
    return {
      x: parse( e, parsed[1], anim, attr, 'width' ),
      y: parse( e, parsed[2], anim, attr, 'height' ),
      z: parse( e, parsed[3], anim, attr ),
      angle: parse( e, parsed[4], anim, attr )
    };
  };

  var setter1d = function(attr, value, unit)
  {
    return attr + '(' + value + unit + ')';
  };
  var setter2d = function(attr, value, unit)
  {
    return attr + '(' + value.x + unit + ',' + value.y + unit + ')';
  };
  var setter3d = function(attr, value, unit)
  {
    return attr + '(' + value.x + unit + ',' + value.y + unit + ',' + value.z + unit + ')';
  };
  var setter4d = function(attr, value, unit)
  {
    return attr + '(' + value.x + ',' + value.y + ',' + value.z + ',' + value.angle + unit + ')';
  };
    
  var regexes = 
  {
    translate:    /translate\(([^,]+)\s*,\s*([^\)]+)\)/i,
    translate3d:  /translate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    translateX:   /translateX\(([^\)]+)\)/i,
    translateY:   /translateY\(([^\)]+)\)/i,
    translateZ:   /translateZ\(([^\)]+)\)/i,
    scale:        /scale\(([^,]+)\s*,\s*([^\)]+)\)/i,
    scale3d:      /scale3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    scaleX:       /scaleX\(([^\)]+)\)/i,
    scaleY:       /scaleY\(([^\)]+)\)/i,
    scaleZ:       /scaleZ\(([^\)]+)\)/i,
    rotate:       /rotate\(([^\)]+)\)/i,
    rotate3d:     /rotate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    rotateX:      /rotateX\(([^\)]+)\)/i,
    rotateY:      /rotateY\(([^\)]+)\)/i,
    rotateZ:      /rotateZ\(([^\)]+)\)/i,
    skew:         /skew\(([^,]+)\s*,\s*([^\)]+)\)/i,
    skewX:        /skewX\(([^\)]+)\)/i,
    skewY:        /skewY\(([^\)]+)\)/i
  };

  var getters = 
  {
    translate:    getter2d,
    translate3d:  getter3d,
    translateX:   getter1d,
    translateY:   getter1d,
    translateZ:   getter1d,
    scale:        getter2d,
    scale3d:      getter3d,
    scaleX:       getter1d,
    scaleY:       getter1d,
    scaleZ:       getter1d,
    rotate:       getter1d,
    rotate3d:     getter4d,
    rotateX:      getter1d,
    rotateY:      getter1d,
    rotateZ:      getter1d,
    skew:         getter2d,
    skewX:        getter1d,
    skewY:        getter1d
  };

  var setters =
  {
    translate:    setter2d,
    translate3d:  setter3d,
    translateX:   setter1d,
    translateY:   setter1d,
    translateZ:   setter1d,
    scale:        setter2d,
    scale3d:      setter3d,
    scaleX:       setter1d,
    scaleY:       setter1d,
    scaleZ:       setter1d,
    rotate:       setter1d,
    rotate3d:     setter4d,
    rotateX:      setter1d,
    rotateY:      setter1d,
    rotateZ:      setter1d,
    skew:         setter2d,
    skewX:        setter1d,
    skewY:        setter1d
  };

  var props = new anim8.FastMap( regexes );
  var regex = props.values;
  var attrs = props.keys;
  props.setters = [];
  props.getters = [];

  for (var prop in getters)
  {
    var i = props.indexOf( prop );

    props.getters[ i ] = getters[ prop ];
    props.setters[ i ] = setters[ prop ];
  }
  
  return {
    
    get: function(e, anim) 
    {
      var style = anim8.dom.style( e, css );
      
      for (var attr in anim.animating) 
      {
        var i = props.indexOf( attr );

        if ( i !== -1 && anim.animating[ attr ] === false ) 
        {
          var parsed = regex[ i ].exec( style );

          if ( parsed ) 
          {
            anim.frame[ attr ] = props.getters[ i ]( e, anim, parsed, attr );
            anim.animating[ attr ] = true;
          }
        }
      }
    },
    set: function(e, anim) 
    {      
      var transforms = [];
      
      for (var i = 0; i < regex.length; i++) 
      {
        var attr = attrs[ i ];

        if (attr in anim.frame) 
        {
          transforms.push( props.setters[ i ]( attr, anim.frame[ attr ], anim.units[ attr ] ) );
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

anim8.dom.property.opacity = (function() 
{
  var css = anim8.dom.prefix(['WebkitOpacity', 'MozOpacity', 'KhtmlOpacity', 'opacity']);
  
  if ( !css )
  {
    return false;
  }
  
  return {
    
    get: function(e, anim) 
    {
      if (anim.animating.opacity === false) 
      {
        var style = anim8.dom.style( e, css );
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
      anim.styles[ css ] = anim8.clamp( anim.frame.opacity, 0, 1 );
    },
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
  };
  
})();

anim8.dom.property.filter = (function() 
{
  var css = anim8.dom.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
  
  if ( !css )
  {
    return false;
  }
  
  var methods = 
  {
    grayscale:   'grayscale',
    sepia:       'sepia',
    saturate:   'saturate',
    hueRotate:   'hue-rotate',
    invert:     'invert',
    brightness: 'brightness',
    contrast:   'contrast',
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
      var style = anim8.dom.style( e, css );
      
      for (var attr in patterns) 
      {
        if ( anim.animating[attr] === false ) 
        {
          var parsed = patterns[attr].exec( style );
          
          if (parsed !== false) 
          {
            var converted = anim8.dom.convert( e, parsed[1], anim.units[ attr ] );
            
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
      // we don't check anim.updated[attr] here since the current value of a transform property is important
      
      var filters = [];
      
      for (var attr in methods) 
      {
        if ( attr in anim.frame ) 
        {
          filters.push( methods[attr] + '(' + anim.value( attr ) + ')' );
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

anim8.dom.property.center = 
{
  get: function(e, anim)
  {
    var cx = (e.offsetLeft + e.offsetWidth * 0.5) + 'px';
    var cy = (e.offsetTop + e.offsetHeight * 0.5) + 'px';
    
    if ( anim.animating.center === false )
    {
      var desiredUnit = anim.units.center;
      var ccx = anim8.dom.convert( e, cx, desiredUnit, 'parentWidth' );
      var ccy = anim8.dom.convert( e, cy, desiredUnit, 'parentHeight' );
    
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
      var desiredUnit = anim.units.centerX;
      var ccx = anim8.dom.convert( e, cx, desiredUnit, 'parentWidth' );
      
      if ( ccx !== false )
      {
        anim.frame.centerX = ccx;
        anim.animating.centerX = true;
      }
    }
    if ( anim.animating.centerY === false )
    {
      var desiredUnit = anim.units.centerY;
      var ccy = anim8.dom.convert( e, cy, desiredUnit, 'parentHeight' );
      
      if ( ccy !== false )
      {
        anim.frame.centerY = ccy;
        anim.animating.centerY = true;
      }
    }
  },
  preset: function(e, anim)
  {
    anim.cached.width  = anim8.dom.convert( e, e.offsetWidth + 'px', anim.units.centerX || anim.units.center, 'parentWidth' );
    anim.cached.height = anim8.dom.convert( e, e.offsetHeight + 'px', anim.units.centerY || anim.units.center, 'parentHeight' );
  },
  set: function(e, anim)
  {
    var rw = anim.cached.width * 0.5;
    var rh = anim.cached.height * 0.5;
        
    if ( anim.updated.center )
    {
      anim.styles.left = (anim.frame.center.x - rw) + anim.units.center;
      anim.styles.top = (anim.frame.center.y - rh) + anim.units.center;
    }
    if ( anim.updated.centerX )
    {
      anim.styles.left = (anim.frame.centerX - rw) + anim.units.centerX;
    }
    if ( anim.updated.centerY )
    {
      anim.styles.top = (anim.frame.centerY - rh) + anim.units.centerY;
    }
  }
};

anim8.dom.property.orbit = 
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
      var cunit = anim.units.orbitOffset;
      var cox = anim8.dom.convert( e, ox + 'px', cunit, 'parentWidth' );
      var coy = anim8.dom.convert( e, oy + 'px', cunit, 'parentHeight' );
      
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
    var cunit = anim.units.orbitOffset || '%';
    var orbitX = anim.frame.orbitOffset ? anim.frame.orbitOffset.x : 50;
    var orbitY = anim.frame.orbitOffset ? anim.frame.orbitOffset.y : 50;
    
    var originUnit = anim.units.origin || '%';
    var originX = anim.frame.origin ? anim.frame.origin.x : 50;
    var originY = anim.frame.origin ? anim.frame.origin.y : 50;
    
    var cox = anim8.dom.convert( e, orbitX + cunit, 'px', anim.cached.parentWidth / 100.0 );
    var coy = anim8.dom.convert( e, orbitY + cunit, 'px', anim.cached.parentHeight / 100.0 );
    
    var ox = anim8.dom.convert( e, originX + originUnit, 'px', anim.cached.width / 100.0 );
    var oy = anim8.dom.convert( e, originY + originUnit, 'px', anim.cached.height / 100.0 );
    
    var angle = (anim.frame.angle || 0.0) * this.DEGREE_TO_RADIAN;
    var distance = anim.frame.distance || 0.0;
        
    var cos = Math.cos( angle ) * distance;
    var sin = Math.sin( angle ) * distance;
    
    anim.styles.left = (cox + cos - ox) + 'px';
    anim.styles.top = (coy + sin - oy) + 'px';
  }
};