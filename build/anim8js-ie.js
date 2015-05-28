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

anim8.matrix = {
  
  identity: function() {
    return {
      m11: 1.0, m12: 0.0, m21: 0.0, m22: 1.0, dx: 0.0, dy: 0.0
    };
  },
  
  multiply: function(a, b) {
    var out = this.identity(); 
    out.m11 = (a.m11 * b.m11) + (a.m12 * b.m21);
    out.m22 = (a.m21 * b.m12) + (a.m22 * b.m22);
    out.m21 = (a.m21 * b.m11) + (a.m22 * b.m21);
    out.m12 = (a.m11 * b.m12) + (a.m12 * b.m22);
    out.dx = (a.dx * b.m11) + (a.dy * b.dx) + b.dx;
    out.dy = (a.dx * b.m12) + (a.dy * b.dy) + b.dy;
    return out;
  },
  
  rotate: function(cos, sin) {
    var out = this.identity();          
    out.m11 = cos;
    out.m12 = sin;
    out.m21 = -sin;
    out.m22 = cos;
    return out;
  },
  
  scale: function(scaleX, scaleY) {
    var out = this.identity();          
    out.m11 = scaleX;
    out.m22 = scaleY;
    return out;
  },
  
  translate: function(dx, dy) {
    var out = this.identity();          
    out.dx = dx;
    out.dy = dy;
    return out;
  }
  
};

function concatenateStyle(anim, style, value)
{
  if ( anim8.isDefined( anim.styles[ style ] ) )
  {
    anim.styles[ style ] += ' ' + value;
  }
  else
  {
    anim.styles[ style ] = value;
  }
}

/* transform IE <= 8 */
if ( anim8.browser.IE && anim8.browser.IE <= 8 )
{
  var cascadeGet = function(point1d, point2d, axis, defaultValue)
  {
    if ( anim8.isDefined( point1d ) )
    {
      return point1d;
    }
    if ( anim8.isDefined( point2d ) )
    {
      return point2d[ axis ];
    }
    return defaultValue;
  };

  anim8.dom.property.transform = 
  {
    get: function()
    {

    },
    preset: function(e, anim)
    {
      if ( anim8.isDefined( anim.frame.width ) )
      {
        anim.cached.width = anim8.dom.convert( e, anim.value('width'), 'px', 'parentWidth' );
      }
      else
      {
        anim.cached.width = anim8.dom.convert( e, anim8.dom.style( e, 'width' ), 'px', 'parentWidth' ) || e.offsetWidth;
      }

      if ( anim8.isDefined( anim.frame.height ) )
      {
        anim.cached.height = anim8.dom.convert( e, anim.value('height'), 'px', 'parentHeight' );
      }
      else
      {
        anim.cached.height = anim8.dom.convert( e, anim8.dom.style( e, 'height' ), 'px', 'parentHeight' ) || e.offsetHeight;
      }

      var rotate = cascadeGet( anim.frame.rotate, anim.frame.rotate3d, 'angle', 0 );
      var rotateUnit = anim8.coalesce( anim.units.rotate, anim.units.rotate3d, anim8.dom.attribute.rotate.defaultUnit );

      anim.cached.radians = anim8.dom.convert( e, rotate + rotateUnit, 'rad' );
    },
    set: function(e, anim)
    {
      var frame = anim.frame;
      var sourceWidth = anim.cached.width;
      var sourceHeight = anim.cached.height;

      var scales      = anim8.isDefined( frame.scale ) || anim8.isDefined( frame.scaleX ) || anim8.isDefined( frame.scaleY );
      var translates  = anim8.isDefined( frame.translateX ) || anim8.isDefined( frame.translateY ) || anim8.isDefined( frame.translate );
      var rotates     = anim8.isDefined( frame.rotate ) || anim8.isDefined( frame.rotate3d );

      if (scales || rotates || translates)
      {
        var anchorX = cascadeGet( frame.originX, frame.origin, 'x', anim8.dom.attribute.origin.defaultValue.x ) * 0.01;
        var anchorY = cascadeGet( frame.originY, frame.origin, 'y', anim8.dom.attribute.origin.defaultValue.y ) * 0.01;

        var scaleX = cascadeGet( frame.scaleX, frame.scale, 'x', anim8.dom.attribute.scale.defaultValue.x );
        var scaleY = cascadeGet( frame.scaleY, frame.scale, 'y', anim8.dom.attribute.scale.defaultValue.y );

        var w = sourceWidth * scaleX;
        var h = sourceHeight * scaleY;
        var centerX = anchorX * w;
        var centerY = anchorY * h;

        var dx = 0;
        var dy = 0;
        
        var matrix = anim8.matrix.identity();
        
        /*
        if (scales || rotates)
        { 
          matrix = anim8.matrix.multiply( matrix, anim8.matrix.translate( centerX, centerY ) );
        }
        */
        
        if (scales)
        {
          dx += (1 - scaleX) * (sourceWidth * anchorX);
          dy += (1 - scaleY) * (sourceHeight * anchorY);

          matrix = anim8.matrix.multiply( matrix, anim8.matrix.scale( scaleX, scaleY ) );
        }
        
        if (rotates)
        {
          var cos = Math.cos( anim.cached.radians );
          var sin = Math.sin( anim.cached.radians );
          var abscos = Math.abs( cos );
          var abssin = Math.abs( sin );
          var boundsWidth = abscos * w + abssin * h;
          var boundsHeight = abscos * h + abssin * w;

          dx += ( centerX - ( boundsWidth * anchorX ) );
          dy += ( centerY - ( boundsHeight * anchorY ) );

          matrix = anim8.matrix.multiply( matrix, anim8.matrix.rotate( cos, sin ) );
        }
        
        /*
        if (scales || rotates)
        {
          matrix = anim8.matrix.multiply( matrix, anim8.matrix.translate( -centerX, -centerY ) );
        }
        */
        
        if (translates)
        {
          var translateX = cascadeGet( frame.translateX, frame.translate, 'x', anim8.dom.attribute.translate.defaultValue.x );
          var translateY = cascadeGet( frame.translateY, frame.translate, 'y', anim8.dom.attribute.translate.defaultValue.y );

          dx += translateX;
          dy += translateY;
        }

        var imageTransform = 'progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\'' + 
          ', M11=' + matrix.m11 + ', M12=' + matrix.m12 + 
          ', M21=' + matrix.m21 + ', M22=' + matrix.m22 + ')';

        if ( anim8.isDefined( anim.styles.marginLeft ) )
        {
          dx += anim8.convert( e, anim.styles.marginLeft, 'px', 'width' );
        }
        if ( anim8.isDefined( anim.styles.marginTop ) )
        {
          dy += anim8.convert( e, anim.styles.marginTop, 'px', 'height' );
        }

        anim.styles.marginLeft = dx + 'px';
        anim.styles.marginTop = dy + 'px';

        concatenateStyle( anim, 'msFilter', '"' + imageTransform + '"' );
        concatenateStyle( anim, 'filter', imageTransform );

        anim.styles.zoom = 1;
      }
    }
  };
}

/* blur IE <= 8 */
if ( anim8.browser.IE && anim8.browser.IE <= 8 )
{
  // var regex = /progid:DXImageTransform\.Microsoft\.Blur\(PixelRadius=([^']+)\)/;

  anim8.dom.attribute.blur.property = 'blur';

  anim8.dom.property.blur = 
  {
    get: function() 
    {

    },
    set: function(e, anim) 
    {
      var imageTransform = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'' + (anim.frame.blur) + 'px\')';

      concatenateStyle( anim, 'msFilter', '"' + imageTransform + '"' );
      concatenateStyle( anim, 'filter', imageTransform );

      anim.styles.zoom = 1;
    }
  };
}

/* opacity <= IE 8 */
if ( anim8.browser.IE && anim8.browser.IE <= 8 )
{
  // var regex = /alpha\(opacity=([^\)]+)\)/i;

  anim8.dom.property.opacity = 
  {
    get: function() 
    {

    },
    set: function(e, anim)
    {
      var filter = 'alpha(opacity=' + (anim.frame.opacity * 100) + ')';

      concatenateStyle( anim, 'filter', filter );

      anim.styles.zoom = 1;
    }
  };
}

/* minWidth < IE 8 */
if ( anim8.browser.IE && anim8.browser.IE < 8 )
{
  anim8.dom.property.minWidth.set = function(e, anim)
  {
    anim.styles.width = 'expression( this.scrollWidth \< ' + (anim.frame.minWidth + 1) + ' ? "' + anim.frame.minWidth + anim.units.minWidth + '" : "auto")';
  };
}

/* maxWidth < IE 8 */
if ( anim8.browser.IE && anim8.browser.IE < 8 )
{
  anim8.dom.property.maxWidth.set = function(e, anim) 
  {
    anim.styles.width = 'expression( this.scrollWidth > ' + (anim.frame.maxWidth - 1) + ' ? "' + anim.frame.maxWidth + anim.units.maxWidth + '" : "auto")';
  };
}

/* minHeight < IE 8 */
if ( anim8.browser.IE && anim8.browser.IE < 8 )
{
  anim8.dom.property.minHeight.set = function(e, anim) 
  {
    anim.styles.height = 'expression( this.scrollHeight \< ' + (anim.frame.minHeight + 1) + ' ? "' + anim.frame.minHeight + anim.units.minHeight + '" : "auto")';
  };
}
/* maxHeight < IE 8 */
if ( anim8.browser.IE && anim8.browser.IE < 8 )
{
  anim8.dom.property.maxHeight.set = function(e, anim) 
  {
    anim.styles.height = 'expression( this.scrollHeight > ' + (anim.frame.maxHeight - 1) + ' ? "' + anim.frame.maxHeight + anim.units.maxHeight + '" : "auto")';
  };
}
