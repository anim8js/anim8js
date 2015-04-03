anim8.browser = 
{
  IE: (function() {
    if (!(window.ActiveXObject) && "ActiveXObject" in window) return 11;
    if (!document.all) return false;
    if (!document.compatMode) return 5;
    if (!window.XMLHttpRequest) return 6;
    if (!document.querySelector) return 7;
    if (!document.addEventListener) return 8;
    if (!window.atob) return 9;
    return 10;
  })()
};


// IE10 transform
// IE9 msTransform
// IE8 msFilter "progid:DXImageTransform.Microsoft.Matrix( )"
// IE6&7 filter progid:DXImageTransform.Microsoft.Matrix( )
if (anim8.browser.IE) {
  // TODO
}


anim8.matrix = {
  
  identity: function() {
    return {
      m11: 1.0, m12: 0.0, m21: 0.0, m22: 1.0, dx: 0.0, dy: 0.0
    };
  },
  
  multiply: function(a, b) {
    var out = identity(); 
    out.m11 = (a.m11 * b.m11) + (a.m12 * b.m21);
		out.m22 = (a.m21 * b.m12) + (a.m22 * b.m22);
		out.m21 = (a.m21 * b.m11) + (a.m22 * b.m21);
		out.m12 = (a.m11 * b.m12) + (a.m12 * b.m22);
		out.dx = (a.dx * b.m11) + (a.dy * b.dx) + b.dx;
		out.dy = (a.dx * b.m12) + (a.dy * b.dy) + b.dy;
    return out;
  },
  
  rotate: function(degrees) {
    var radians = degrees * Math.PI / 180.0;
    var cos = Math.cos( radians );
    var sin = Math.sin( radians );
    var out = identity();          
    out.m11 = cos;
    out.m12 = sin;
    out.m21 = -sin;
    out.m22 = cos;
    return out;
  },
  
  scale: function(scaleX, scaleY) {
    var out = identity();          
    out.m11 = scaleX;
    out.m22 = scaleY;
    return out;
  },
  
  translate: function(dx, dy) {
    var out = identity();          
    out.dx = dx;
    out.dy = dy;
    return out;
  }
  
};

var iematrix = function(e, frame)
{
  var w = e.offsetWidth;
  var h = e.offsetHeight;
  
  var scales      = anim8.isDefined(frame.scale) || anim8.isDefined(frame.scaleX) || anim8.isDefined(frame.scaleY);
  var translates  = anim8.isDefined(frame.translateX) || anim8.isDefined(frame.translateY);
  var rotates     = anim8.isDefined(frame.rotate);
  
  if (scales || rotates || translates)
  {
    var centerX = anim8.coalesce(frame.anchorX, frame.anchor, 0.5) * w;
    var centerY = anim8.coalesce(frame.anchorY, frame.anchor, 0.5) * h;
    
    var matrix = anim8.matrix.identity();
    
    if (scales || rotates)
    { 
      matrix = anim8.matrix.multiply( matrix, anim8.matrix.translate( centerX, centerY ) );
    }
    
    if (scales)
    {
      var scaleX = anim8.coalesce(frame.scaleX, frame.scale, 1.0);
      var scaleY = anim8.coalesce(frame.scaleY, frame.scale, 1.0);
      
      matrix = anim8.matrix.multiply( matrix, anim8.matrix.scale( scaleX, scaleY ) );
    }
    
    if (rotates)
    {              
      matrix = multiply( matrix, anim8.matrix.rotate( frame.rotate ) );
    }
    
    if (scales || rotates)
    {
      matrix = multiply( matrix, anim8.matrix.translate( -centerX, -centerY ) );
    }
    
    if (translates)
    {
      matrix.dx += anim8.coalesce( frame.translateX, 0.0 );
      matrix.dy += anim8.coalesce( frame.translateY, 0.0 ); 
    }
    
    e.style['transform'] = 'matrix(' + matrix.m11 + ', ' + matrix.m12 + ', ' + matrix.m21 + ', ' + matrix.m22 + ', ' + matrix.dx + ', ' + matrix.dy + ')';
  }
};

anim8.dom.property.filter = (function() {
  
  var css = anim8.dom.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
  
  var patterns = {};
  
  if (anim8.browser.IE) {
    
    patterns.blur = /progid:DXImageTransform\.Microsoft\.Blur\(PixelRadius=([^']+)\)/;
    pattners.opacity = /progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=([^\)]+)\)/;

    /*
    
    grayscale_( e, current );
    sepia_( e, current );
    saturate_( e, current );
    hueRotate_( e, current );
    invert_( e, current );
    brightness_( e, current );
    contrast_( e, current );
    
        var hueRotate_ = function(e, frame)
        {
          if (!anim8.isDefined(frame.hueRotate)) {
            return;
          }
          var css = anim8.dom.prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);
          if (css) {
            e.style[css] = 'hue-rotate(' + frame.hueRotate + 'deg)';
          }
        };
    
    */
    
    /* IE 8 */
    if (anim8.browser.IE === 8) {
      return function(out, attrs, props) {
        out.filter = '"progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'' + out.blur + 'px\')"'
      };
    }
    /* < IE 8 */  
    if (anim8.browser.IE < 8) {
      return function(out, attrs, props) {
        out.filter = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'' + out.blur + 'px\')'
      };
    }
  }
  
})();

anim8.dom.property.opacity = (function() {
  
  /* IE 8 */
  if (anim8.browser.IE === 8) 
  {
    var regex = /progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=([^\)]+)\)/i;
    
    return {
      get: function(e, anim) {
        if (anim.animating.opacity === false) {
          var parsed = regex.exec( e.style.msFilter );
          if (parsed) {
            anim.frame.opacity = { value: parseFloat( parsed[1] ) };
            anim.animating.opacity = true;
          }
        }
      },
      set: function(e, anim) {
        e.style.msFilter = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (attrs.opacity * 100) + ')"';
      }
    };
    
  }
  
  /* IE 5 - 7 */
  if (anim8.browser.IE === 7 || anim8.browser.IE === 6 || anim8.browser.IE === 5) 
  {  
    var regex = /alpha\(opacity=([^\)]+)\)/i;
    
    return {
      get: function(e, anim) {
        if (anim.animating.opacity === false) {
          var parsed = regex.exec( e.style.filter );
          if (parsed) {
            anim.frame.opacity = { value: parseFloat( parsed[1] ) };
            anim.animating.opacity = true;
          }
        }
      },
      set: function(e, anim) {
        e.style.filter = 'alpha(opacity=' + (attrs.opacity * 100) + ')';
        e.style.zoom = 1;
      }
    }; 
  }
  
})();

anim8.dom.property.minWidth.set             = (function() {
  
  /* < IE 8 */
  if (anim8.browser.IE && anim8.browser.IE < 8)
  {
    return function(e, anim) {
      e.style.width = 'expression( this.scrollWidth \< ' + (anim.frame.minWidth + 1) + ' ? "' + anim.frame.minWidth + anim.units.minWidth + '" : "auto")';
    };
  }
  
  /* Others */
  return function(e, anim) {
    e.style.minWidth = anim.frame.minWidth + anim.units.minWidth;
  };
  
})();

anim8.dom.property.maxWidth.set             = (function() {
  
  /* < IE 8 */
  if (anim8.browser.IE && anim8.browser.IE < 8)
  {
    return function(e, anim) {
      e.style.width = 'expression( this.scrollWidth > ' + (anim.frame.maxWidth - 1) + ' ? "' + anim.frame.maxWidth + anim.units.maxWidth + '" : "auto")';
    };
  }
  
  /* Others */
  return function(e, anim) {
    e.style.maxWidth = anim.frame.maxWidth + anim.units.maxWidth;
  };
  
})();

anim8.dom.property.minHeight.set            = (function() {
  
  /* < IE 8 */
  if (anim8.browser.IE && anim8.browser.IE < 8)
  {
    return function(e, anim) {
      e.style.height = 'expression( this.scrollHeight \< ' + (anim.frame.minHeight + 1) + ' ? "' + anim.frame.minHeight + anim.units.minHeight + '" : "auto")';
    };
  }
  
  /* Others */
  return function(e, anim) {
    e.style.minHeight = anim.frame.minHeight + anim.units.minHeight;
  };
  
})();

anim8.dom.property.maxHeight.set            = (function() {
  
  /* < IE 8 */
  if (anim8.browser.IE && anim8.browser.IE < 8)
  {
    return function(e, anim) {
      e.style.height = 'expression( this.scrollHeight > ' + (anim.frame.maxHeight - 1) + ' ? "' + anim.frame.maxHeight + anim.units.maxHeight + '" : "auto")';
    };
  }
  
  /* Others */
  return function(e, anim) {
    e.style.maxHeight = anim.frame.maxHeight + anim.units.maxHeight;
  };
  
})();