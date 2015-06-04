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
      m11: 1.0, m12: 0.0, m21: 0.0, m22: 1.0
    };
  },
  
  multiply: function(a, b) {
    return {
      m11: (a.m11 * b.m11) + (a.m12 * b.m21),
      m22: (a.m21 * b.m12) + (a.m22 * b.m22),
      m21: (a.m21 * b.m11) + (a.m22 * b.m21),
      m12: (a.m11 * b.m12) + (a.m12 * b.m22)
    };
  },
  
  rotate: function(radians) {
    var cos = Math.cos( radians );
    var sin = Math.sin( radians );
    return {
      m11: cos, 
      m12: -sin,
      m21: sin,
      m22: cos
    };
  },
  
  scale: function(scaleX, scaleY) {
    return {
      m11: scaleX,
      m12: 0.0,
      m21: 0.0,
      m22: scaleY
    };
  },

  skew: function(skewX, skewY) {
    return {
      m11: 1.0,
      m12: Math.tan( skewX ),
      m21: Math.tan( skewY ),
      m22: 1.0
    };
  },

  transform: function(matrix, x, y) {
    return {
      x: matrix.m11 * x + matrix.m12 * y,
      y: matrix.m21 * x + matrix.m22 * y
    };
  },

  adjustment: function(matrix, w, h) {
    var x0 = w * matrix.m11;
    var x1 = h * matrix.m12;
    var x2 = w * matrix.m11 + h * matrix.m12;
    var xmin = Math.min( x0, Math.min( x1, Math.min( x2, 0 ) ) );
    var xmax = Math.max( x0, Math.max( x1, Math.max( x2, 0 ) ) );

    var y0 = w * matrix.m21;
    var y1 = h * matrix.m22;
    var y2 = w * matrix.m21 + h * matrix.m22;
    var ymin = Math.min( y0, Math.min( y1, Math.min( y2, 0 ) ) );
    var ymax = Math.max( y0, Math.max( y1, Math.max( y2, 0 ) ) );

    return {
      x: xmax - xmin,
      y: ymax - ymin
    };
  }
  
};

anim8.dom.concatenateStyle = function(anim, style, value)
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

anim8.dom.setProperty = function(attr, property)
{
  var attribute = anim8.dom.attribute[ attr ];

  if ( anim8.isString( attribute.property ) || !anim8.isDefined( attribute.property ) )
  {
    attribute.property = property;
  }
  else
  {
    attribute.propertyName = property;
    attribute.property = anim8.dom.property( property );
  }
};

/* transform, blur, opacity, margin top & left IE <= 8 */
if ( anim8.browser.IE && anim8.browser.IE <= 8 )
{
  anim8.dom.property.ieTransform = 
  {
    presettings:
    {
      width: {
        savedAs: 'width',
        property: 'width',
        relativeTo: 'parentWidth',
        defaultProperty: 'offsetWidth',
        toUnit: 'px'
      },
      height: {
        savedAs: 'height',
        property: 'height',
        relativeTo: 'parentHeight',
        defaultProperty: 'offsetHeight',
        toUnit: 'px'
      },
      rotate: {
        savedAs: 'rotate',
        property: 'rotate',
        toUnit: 'rad'
      },
      rotate3d: {
        savedAs: 'rotate',
        property: 'rotate3d',
        subproperty: 'angle',
        toUnit: 'rad'
      },
      skewX: {
        savedAs: 'skewX',
        property: 'skewX',
        toUnit: 'rad'
      },
      skew2dX: {
        savedAs: 'skewX',
        property: 'skew',
        subproperty: 'x',
        toUnit: 'rad'/*,
        remove: true*/
      },
      skewY: {
        savedAs: 'skewY',
        property: 'skewY',
        toUnit: 'rad'
      },
      skew2dY: {
        savedAs: 'skewY',
        property: 'skew',
        subproperty: 'y',
        toUnit: 'rad'/*,
        remove: true*/
      },
      translateX: {
        savedAs: 'translateX',
        property: 'translateX',
        relativeTo: 'width',
        toUnit: 'px'
      },
      translate2dX: {
        savedAs: 'translateX',
        property: 'translate',
        subproperty: 'x',
        toUnit: 'px',
        relativeTo: 'width'
      },
      translate3dX: {
        savedAs: 'translateX',
        property: 'translate3d',
        subproperty: 'x',
        toUnit: 'px',
        relativeTo: 'width'/*,
        remove: true*/
      },
      translateY: {
        savedAs: 'translateY',
        property: 'translateY',
        relativeTo: 'height',
        toUnit: 'px'
      },
      translate2dY: {
        savedAs: 'translateY',
        property: 'translate',
        subproperty: 'y',
        toUnit: 'px',
        relativeTo: 'height'
      },
      translate3dY: {
        savedAs: 'translateY',
        property: 'translate3d',
        subproperty: 'y',
        toUnit: 'px',
        relativeTo: 'height'/*,
        remove: true*/
      },
      scaleX: {
        savedAs: 'scaleX',
        property: 'scaleX'
      },
      scale2dX: {
        savedAs: 'scaleX',
        property: 'scale',
        subproperty: 'x'
      },
      scale3dX: {
        savedAs: 'scaleX',
        property: 'scale3d',
        subproperty: 'x'/*,
        remove: true*/
      },
      scaleY: {
        savedAs: 'scaleY',
        property: 'scaleY'
      },
      scale2dY: {
        savedAs: 'scaleY',
        property: 'scale',
        subproperty: 'y'
      },
      scale3dY: {
        savedAs: 'scaleY',
        property: 'scale3d',
        subproperty: 'y'/*,
        remove: true*/
      },
      originX: {
        savedAs: 'originX',
        property: 'originX',
        toUnit: '%',
        relativeTo: 'width'
      },
      origin2dX: {
        savedAs: 'originX',
        property: 'origin',
        subproperty: 'x',
        toUnit: '%',
        relativeTo: 'width'/*,
        remove: true*/
      },
      originY: {
        savedAs: 'originY',
        property: 'originY',
        toUnit: '%',
        relativeTo: 'height'
      },
      origin2dY: {
        savedAs: 'originY',
        property: 'origin',
        subproperty: 'y',
        toUnit: '%',
        relativeTo: 'height'/*,
        remove: true*/
      },
      marginLeft: {
        savedAs: 'marginLeft',
        property: 'marginLeft',
        toUnit: 'px',
        relativeTo: 'parentWidth'
      },
      marginTop: {
        savedAs: 'marginTop',
        property: 'marginTop',
        toUnit: 'px',
        relativeTo: 'parentWidth'
      },
      blur: {
        savedAs: 'blur',
        property: 'blur',
        toUnit: 'px',
        relativeTo: 'parentWidth',
        remove: true
      },
      opacity: {
        savedAs: 'opacity',
        property: 'opacity',
        remove: true
      }
    },
    get: function(e, anim)
    {
      var settings = this.presettings;

      anim8.dom.property.marginLeft.get( e, anim );
      anim8.dom.property.marginTop.get( e, anim );

      this.getFramed( e, anim, settings.rotate );
      this.getFramed( e, anim, settings.rotate3d );
      this.getFramed( e, anim, settings.skewX );
      this.getFramed( e, anim, settings.skewY );
      this.getFramed( e, anim, settings.skew2dX );
      this.getFramed( e, anim, settings.skew2dY );
      this.getFramed( e, anim, settings.translateX );
      this.getFramed( e, anim, settings.translate2dX );
      this.getFramed( e, anim, settings.translate3dX );
      this.getFramed( e, anim, settings.translateY );
      this.getFramed( e, anim, settings.translate2dY );
      this.getFramed( e, anim, settings.translate3dY );
      this.getFramed( e, anim, settings.scaleX );
      this.getFramed( e, anim, settings.scale2dX );
      this.getFramed( e, anim, settings.scale3dX );
      this.getFramed( e, anim, settings.scaleY );
      this.getFramed( e, anim, settings.scale2dY );
      this.getFramed( e, anim, settings.scale3dY );
      this.getFramed( e, anim, settings.originX );
      this.getFramed( e, anim, settings.originY );
      this.getFramed( e, anim, settings.origin2dX );
      this.getFramed( e, anim, settings.origin2dY );

      this.getFramed( e, anim, settings.blur );
      this.getFramed( e, anim, settings.opacity );
    },
    getFramed: function(e, flash, def)
    {
      var anim = anim8.coalesce( flash.source, flash );
      var attr = def.property; 
      var value = anim.frame[ attr ];

      if ( anim8.isBoolean( flash.animating[ attr ] ) && anim8.isDefined( value ) )
      {
        var fromUnit = def.toUnit;
        var toUnit = flash.units[ attr ];

        if ( def.subproperty )
        {
          var attribute = anim.getAttribute( attr );

          if ( !flash.frame[ attr ] )
          {
            flash.frame[ attr ] = attribute.cloneDefault();
          }

          var converted = value[ def.subproperty ];

          if ( fromUnit !== toUnit )
          {
            converted = anim8.dom.convert( e, converted + fromUnit, toUnit, def.relativeTo );
          }

          if ( converted !== false )
          {
            flash.frame[ attr ][ def.subproperty ] = converted;
            flash.animating[ attr ] = true;
          }
        }
        else
        {
          var converted = value;

          if ( fromUnit !== toUnit ) 
          {
            converted = anim8.dom.convert( e, converted + fromUnit, toUnit, def.relativeTo );
          }

          if ( converted !== false )
          {
            flash.frame[ attr ] = converted;
            flash.animating[ attr ] = true;
          }
        }
      }

      return ( flash.animating[ attr ] === true );
    },
    resolveRelativeTo: function(anim, relativeTo)
    {
      var cached = anim.cached[ relativeTo ];

      if ( anim8.isNumber( cached ) )
      {
        return cached * 0.01;
      }

      return relativeTo;
    },
    cacheConverted: function(e, anim, def)
    {
      var value = anim.frame[ def.property ];
      var canConvert = anim8.isDefined( value );

      if ( canConvert )
      {
        var valueUnit = anim.units[ def.property ];
        var actualValue = ( def.subproperty ? value[ def.subproperty ] : value );

        if ( valueUnit !== def.toUnit )
        {
          var united = actualValue + valueUnit;
          var relativeTo = this.resolveRelativeTo( anim, def.relativeTo );

          actualValue = anim8.dom.convert( e, united, def.toUnit, relativeTo );
        }

        if ( actualValue !== false )
        {
          anim.cached[ def.savedAs ] = actualValue;          
        }
        else
        {
          canConvert = false;
        }
      }
      else if ( def.remove )
      {
        delete anim.cached[ def.savedAs ];
      }

      return canConvert;
    },
    cacheValue: function(e, anim, def)
    {
      var value = anim.frame[ def.property ];
      var hasValue = anim8.isDefined( value );

      if ( hasValue )
      {
        anim.cached[ def.savedAs ] = ( def.subproperty ? value[ def.subproperty ] : value );
      }
      else if ( def.remove )
      {
        delete anim.cached[ def.savedAs ];
      }

      return hasValue;
    },
    cacheDimension: function(e, anim, def)
    {
      if ( !this.cacheConverted( e, anim, def ) )
      {
        var computedValue = anim8.dom.style( e, def.property );

        anim.cached[ def.savedAs ] = anim8.dom.convert( e, computedValue, 'px', def.relativeTo ) || e[ def.defaultProperty ];
      }
    },
    cachedOrDefault: function(e, anim, value, attribute, toUnit, relativeTo)
    {
      if ( anim8.isDefined( value ) )
      {
        return value;
      }
      if ( attribute.defaultUnit === toUnit )
      {
        return attribute.defaultValue;
      }

      relativeTo = this.resolveRelativeTo( anim, relativeTo );

      return anim8.dom.convert( e, attribute.defaultValue + attribute.defaultUnit, toUnit, relativeTo );
    },
    preset: function(e, anim)
    {
      var cached = anim.cached;
      var settings = this.presettings;
      var attrs = anim8.dom.attribute;

      this.cacheDimension( e, anim, settings.width );

      this.cacheDimension( e, anim, settings.height );

      if ( !this.cacheConverted( e, anim, settings.rotate ) )
      {
        this.cacheConverted( e, anim, settings.rotate3d );
      }

      if ( !this.cacheConverted( e, anim, settings.skewX ) )
      {
        this.cacheConverted( e, anim, settings.skew2dX );
      }

      if ( !this.cacheConverted( e, anim, settings.skewY ) )
      {
        this.cacheConverted( e, anim, settings.skew2dY );
      }

      if ( anim8.isDefined( cached.skewX ) || anim8.isDefined( cached.skewY ) )
      {
        cached.skewX = this.cachedOrDefault( e, anim, cached.skewX, attrs.skewX, 'rad' );
        cached.skewY = this.cachedOrDefault( e, anim, cached.skewY, attrs.skewY, 'rad' );
      }

      if ( !this.cacheConverted( e, anim, settings.translateX ) )
      {
        if ( !this.cacheConverted( e, anim, settings.translate2dX ) )
        {
          this.cacheConverted( e, anim, settings.translate3dX );
        }
      }

      if ( !this.cacheConverted( e, anim, settings.translateY ) )
      {
        if ( !this.cacheConverted( e, anim, settings.translate2dY ) )
        {
          this.cacheConverted( e, anim, settings.translate3dY );
        }
      }

      if ( anim8.isDefined( cached.translateX ) || anim8.isDefined( cached.translateY ) )
      {
        cached.translateX = this.cachedOrDefault( e, anim, cached.translateX, attrs.translateX, 'px', 'width' );
        cached.translateY = this.cachedOrDefault( e, anim, cached.translateY, attrs.translateY, 'px', 'height' );
      }

      if ( !this.cacheValue( e, anim, settings.scaleX ) )
      {
        if ( !this.cacheValue( e, anim, settings.scale2dX ) )
        {
          this.cacheValue( e, anim, settings.scale3dX );        
        }
      }

      if ( !this.cacheValue( e, anim, settings.scaleY ) )
      {
        if ( !this.cacheValue( e, anim, settings.scale2dY ) )
        {
          this.cacheValue( e, anim, settings.scale3dY );        
        }
      }

      if ( !this.cacheConverted( e, anim, settings.originX ) )
      {
        this.cacheConverted( e, anim, settings.origin2dX );
      }

      if ( !this.cacheConverted( e, anim, settings.originY ) )
      {
        this.cacheConverted( e, anim, settings.origin2dY );
      }

      cached.originX = this.cachedOrDefault( e, anim, cached.originX, attrs.originX, '%', 'width' );
      cached.originY = this.cachedOrDefault( e, anim, cached.originY, attrs.originY, '%', 'height' );

      if ( !anim8.isDefined( cached.baseMarginLeft ) )
      {
        var margins = anim.get({
          marginLeft: 'px',
          marginTop: 'px'
        });

        cached.baseMarginLeft = margins.marginLeft || 0;
        cached.baseMarginTop = margins.marginTop || 0;
      }

      if ( this.cacheConverted( e, anim, settings.marginLeft ) )
      {
        cached.marginLeft -= cached.baseMarginLeft;
      }
      else
      {
        cached.marginLeft = 0;
      }

      if ( this.cacheConverted( e, anim, settings.marginTop ) )
      {
        cached.marginTop -= cached.baseMarginTop;
      }
      else
      {
        cached.marginTop = 0;
      }

      this.cacheValue( e, anim, settings.opacity );

      this.cacheConverted( e, anim, settings.blur );
    },
    unset: function(e, anim)
    {
      e.style.filter = '';
      e.style.marginLeft = (anim.cached.baseMarginLeft || 0) + 'px';
      e.style.marginTop = (anim.cached.baseMarginTop || 0) + 'px';

      anim.cached = {};
    },
    set: function(e, anim)
    {
      var cached = anim.cached;
      var attrs = anim8.dom.attribute;
      var w = cached.width;
      var h = cached.height;
      var anchorX = cached.originX * 0.01;
      var anchorY = cached.originY * 0.01;
      var dx = 0;
      var dy = 0;
      var matrix = anim8.matrix.identity();

      if ( anim8.isDefined( cached.scaleX ) || anim8.isDefined( cached.scaleY ) )
      {
        matrix = anim8.matrix.multiply( matrix, anim8.matrix.scale( 
          anim8.coalesce( cached.scaleX, attrs.scaleX.defaultValue ), 
          anim8.coalesce( cached.scaleY, attrs.scaleY.defaultValue )
        ));
      }
      
      if ( anim8.isDefined( cached.skewX ) )
      {
        matrix = anim8.matrix.multiply( matrix, anim8.matrix.skew( cached.skewX, cached.skewY ) );
      }

      if ( anim8.isDefined( cached.rotate ) )
      {
        matrix = anim8.matrix.multiply( matrix, anim8.matrix.rotate( cached.rotate ) );
      }
      
      if ( anim8.isDefined( cached.translateX ) )
      {
        dx += cached.translateX;
        dy += cached.translateY;
      }

      // Calculate the new size of the element based on the matrix. We need to
      // adjust by the difference because IE is special.
      var newSize = anim8.matrix.adjustment( matrix, w, h );
      dx += (w - newSize.x) * 0.5;
      dy += (h - newSize.y) * 0.5;

      // Adjust for a non-centered transformation
      var hw = w * 0.5;
      var hh = h * 0.5;
      var origin = anim8.matrix.transform( matrix, hw, hh );
      dx += (hw - origin.x) * (anchorX * 2 - 1);
      dy += (hh - origin.y) * (anchorY * 2 - 1);

      // If margin is already specified, add it to the new margin value.
      dx += cached.marginLeft + cached.baseMarginLeft;
      dy += cached.marginTop + cached.baseMarginTop;

      // Set the margin to account for a lack of translation.
      anim.styles.marginLeft = dx + 'px';
      anim.styles.marginTop = dy + 'px';

      // The array of filter operations
      var filters = [];

      // Transformations
      if ( matrix.m11 !== 1.0 || matrix.m12 !== 0.0 || matrix.m21 !== 0.0 || matrix.m22 !== 1.0 )
      {
        var transformFilter = 'progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\'' + 
          ', M11=' + matrix.m11 + ', M12=' + matrix.m12 + 
          ', M21=' + matrix.m21 + ', M22=' + matrix.m22 + ')';

        filters.push( transformFilter );
      }

      // Opacity
      if ( anim8.isNumber( cached.opacity ) && !isNaN( cached.opacity )  )
      {
        var opacityFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + ( cached.opacity * 100 ) + ')';

        filters.push( opacityFilter );
      }

      // Blur
      if ( anim8.isNumber( cached.blur ) && !isNaN( cached.blur ) )
      {
        var blurFilter = 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=\'' + ( cached.blur ) + 'px\')';

        filters.push( blurFilter );
      }

      // Set the filter properties!
      anim.styles.filter = filters.join( ' ' );

      // Force layout
      anim.styles.zoom = 1;
    }
  };

  var attributes = [
    'marginLeft', 'marginTop', 
    'blur', 
    'opacity', 
    'origin', 'originX', 'originY', 
    'translate', 'translateX', 'translateY', 'translateZ', 'translate3d', 
    'rotate', 'rotate3d', 
    'skew', 'skewX', 'skewY',
    'scale', 'scaleX', 'scaleY', 'scaleZ', 'scale3d'
  ];

  for ( var i = 0; i < attributes.length; i++ )
  {
    anim8.dom.setProperty( attributes[ i ], 'ieTransform' );
  }
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
