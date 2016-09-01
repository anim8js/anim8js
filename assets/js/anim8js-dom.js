/* anim8js-dom 1.0.1 - anim8 your HTML elements by Philip Diffenderfer */
// UMD (Universal Module Definition)
(function (root, factory)
{
  if (typeof define === 'function' && define.amd) // jshint ignore:line
  {
    // AMD. Register as an anonymous module.
    define(['anim8'], function(anim8) { // jshint ignore:line
      return factory(anim8, root);
    });
  }
  else if (typeof module === 'object' && module.exports)  // jshint ignore:line
  {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('anim8'), global);  // jshint ignore:line
  }
  else
  {
    // Browser globals (root is window)
    factory(root.anim8, root);
  }
}(this, function(anim8, window)
{

  var FastMap = anim8.FastMap;
  var Animator = anim8.Animator;
  var Factory = anim8.Factory;
  var Class = anim8.Class;
  var Color = anim8.Color;
  var Easings = anim8.Easings;
  var EasingTypes = anim8.EasingTypes;
  var isFunction = anim8.isFunction;
  var isString = anim8.isString;
  var isNumber = anim8.isNumber;
  var isDefined = anim8.isDefined;
  var isObject = anim8.isObject;
  var isBoolean = anim8.isBoolean;
  var coalesce = anim8.coalesce;
  var clamp = anim8.clamp;
  var toArray = anim8.toArray;

  var $calculator = anim8.calculator;

  var HTMLElement = window.HTMLElement;
  var document = window.document;

  function override(target, source)
  {
    for (var prop in source)
    {
      target[ prop ] = source[ prop ];
    }
  }


/**
 * Returns true if the given variable is an HTML element.
 *
 * @method anim8.isElement
 * @param {Any} x
 * @return {Boolean}
 */
function isElement(x)
{
  return typeof HTMLElement === "object" ? x instanceof HTMLElement :
  x && typeof x === "object" && x !== null && x.nodeType === 1 && typeof x.nodeName === "string";
}


function unset( e, anim, attr, property, css, clearedValue )
{
  if ( attr === true )
  {
    e.style[ css ] = clearedValue;
  }
  else
  {
    delete anim.frame[ attr ];

    property.set( e, anim );

    e.style[ css ] = anim.styles[ css ];
  }
}


/**
 * Computes the desired style of the given element and returns it as a string.
 * The style given must be in hyphenated format like so:
 * anim8.dom.style( element, 'font-size' ) = '12px'
 *
 * @param {HTMLElement} e
 * @param {String} style
 * @return {String}
 */
var $style = (function()
{
  var hyphenated = {};

  var hyphenize = function(str)
  {
    if ( str in hyphenated )
    {
      return hyphenated[ str ];
    }

    var key = str;

    str = str.replace(/[a-z][A-Z]/g, function(str, letter)
    {
     return str[0] + '-' + str[1].toLowerCase();
    });

    str = str.replace(/^Webkit/, '-webkit');
    str = str.replace(/^Moz/, '-moz');
    str = str.replace(/^Ms/, '-ms');
    str = str.replace(/^O/, '-o');
    str = str.replace(/^Khtml/, '-khtml');

    hyphenated[ key ] = str;

    return str;
  };

  return function(e, style)
  {
    if (e.currentStyle)
    {
      return e.currentStyle[ style ];
    }
    else if (document.defaultView && document.defaultView.getComputedStyle)
    {
      return document.defaultView.getComputedStyle( e, null ).getPropertyValue( hyphenize( style ) );
    }
    else
    {
      return e.style[ style ];
    }
  };

})();

/**
 * Given an array of styles this will return the first one that is present on elements in the current browser.
 *
 * @param {Array} prefixes
 * @return {String|false}
 */
var $prefix = (function()
{
  var a = document.createElement('a');

  return function(prefixes)
  {
    for (var i = 0; i < prefixes.length; i++)
    {
      if ( isDefined( a.style[ prefixes[ i ] ] ) )
      {
        return prefixes[i];
      }
    }
    return false;
  };

})();

/**
 * Parses the string for a value and a unit.
 *
 * @param {String} value
 * @return {Object|false}
 */
var $parseValue = (function()
{
  var regex = /(-?\d*(\.\d+)|-?\d+)(px|em|%|vw|ex|cm|mm|in|pt|pc|deg|rad)?/;

  return function(x)
  {
    var parsed = regex.exec( x );

    if (parsed)
    {
      return {
        value: parseFloat( parsed[1] ),
        unit: parsed[3]
      };
    }

    return false;
  };
})();


/**
 * Converts one unit to another for a given element.
 *
 * For Example: anim8.dom.convert( element, '100px', '%', 'parentWidth' )
 *    returns how much percent 100px relativeTo parentWidth of the given element
 *
 * @param {HTMLElement} e
 * @param {String} from
 * @param {String} toUnit
 * @param {String|Number} relativeTo
 * @return {Number|false}
 */
var $convert = (function()
{
  /**
   * Calculators how many pixels a given value & unit is.
   *
   * For Example: anim8.toPixels( 100, 'in' )
   *    returns how many pixels are in 1 inch, with up to 2 decimal points of accuracy.
   */
  var toPixels = function(baseValue, baseUnit, defaultRate)
  {
    if ( document.body )
    {
      try
      {
        var div = document.createElement('div');
        document.body.appendChild( div );
        div.style.width = baseValue + baseUnit;
        var pixels = (div.offsetWidth / baseValue);
        document.body.removeChild( div );

        return pixels || defaultRate;
      }
      catch (e)
      {
        // Do nothing
      }
    }

    return defaultRate;
  };

  var getFontSize = function(e, notUnit, relativeTo)
  {
    var fontSize = $style( e, 'fontSize' );
    var parsed = $parseValue( fontSize );

    if ( !parsed || parsed.unit === notUnit )
    {
      return 12;
    }

    if ( parsed.unit === 'px' )
    {
      return parsed.value;
    }

    return getConverterScale( e, conversions[ parsed.unit ].px, relativeTo );
  };

  var variables = {};

  variables.parentWidth = function(e)
  {
    return e.parentNode.scrollWidth;
  };
  variables.parentHeight = function(e)
  {
    return e.parentNode.scrollHeight;
  };
  variables.width = function(e)
  {
    return e.offsetWidth;
  };
  variables.height = function(e)
  {
    return e.offsetHeight;
  };
  variables.fontSize = function(e)
  {
    return getFontSize( e, '%' );
  };
  variables.parentFontSize = function(e)
  {
    return getFontSize( e.parentNode, '%' );
  };
  variables.htmlFontSize = function(e)
  {
    var htmlElement = document.getElementsByTagName("html")[0];

    return getFontSize( htmlElement, '%' );
  };

  var conversions = {};

  conversions['pt']  = { px: toPixels( 100, 'pt', 1 ) };
  conversions['in']  = { px: toPixels( 100, 'in', 72 ) };
  conversions['cm']  = { px: toPixels( 1000, 'cm', 72 / 2.54 ) };
  conversions['mm']  = { px: toPixels( 100000, 'mm', 72 / 25.4 ) };
  conversions['vw']  = { px: toPixels( 1000, 'vw', 1024 * 0.01 ) };
  conversions['deg'] = { rad: Math.PI / 180.0 };

  conversions['em'] =
  {
    px: function(e, relativeTo)
    {
      return getFontSize( e, 'em', relativeTo );
    }
  };

  conversions['rem'] =
  {
    px: function(e, relativeTo)
    {
      var htmlElement = document.getElementsByTagName("html")[0];

      return getFontSize( htmlElement, 'rem', relativeTo );
    }
  };

  conversions['%'] =
  {
    px: function(e, relativeTo)
    {
      if ( isNumber( relativeTo ) )
      {
        return relativeTo;
      }
      if ( relativeTo in variables )
      {
        return variables[ relativeTo ]( e ) * 0.01;
      }

      return 1.0;
    }
  };

  // Populate conversions going other way.
  for (var unit in conversions)
  {
    for (var to in conversions[ unit ])
    {
      if ( !(to in conversions) )
      {
        conversions[ to ] = {};
      }

      if ( !(unit in conversions[ to ]) )
      {
        var given = conversions[ unit ][ to ];

        if ( isNumber( given ) )
        {
          conversions[ to ][ unit ] = 1.0 / given;
        }
        if ( isFunction( given ) )
        {
          conversions[ to ][ unit ] = (function(converter)
          {
            return function(e, relativeTo)
            {
              return 1.0 / converter( e, relativeTo );
            };
          })( given );
        }
      }
    }
  }

  // Given an element, convert, and relativeTo - return the number we need to multiply by.
  var getConverterScale = function(e, converter, relativeTo)
  {
    if ( isNumber( converter ) )
    {
      return converter;
    }
    else if ( isFunction( converter ) )
    {
      return converter( e, relativeTo );
    }

    return 1.0;
  };

  return function(e, from, toUnit, relativeTo)
  {
    if ( isNumber( from ) )
    {
      return from;
    }

    var parsed = $parseValue( from );

    if ( !parsed )
    {
      return false;
    }

    var value = parsed.value;
    var fromUnit = parsed.unit;

    if ( !fromUnit || fromUnit === toUnit )
    {
      return value;
    }

    // First see if we have a direct conversion available...
    if ( fromUnit in conversions && toUnit in conversions[ fromUnit ] )
    {
      var converter = conversions[ fromUnit ][ toUnit ];

      value *= getConverterScale( e, converter, relativeTo );
    }
    // Otherwise convert it to px, then to the desired unit
    else if ( fromUnit in conversions && conversions[ fromUnit ].px && toUnit in conversions.px )
    {
      var converter1 = conversions[ fromUnit ].px;
      var converter2 = conversions.px[ toUnit ];

      var combined = getConverterScale( e, converter1, relativeTo ) *
                     getConverterScale( e, converter2, relativeTo );

      value *= combined;
    }

    return value;
  };

})();


/**
 * Easings equivalent to the CSS animations. These are approximations since the
 * exact functions are not performant enough.
 */

Easings['cssEase']      = Easings.ease;

Easings['cssEaseIn']    = Easings.quad;

Easings['cssEaseOut']   = EasingTypes.out( Easings.quad );

Easings['cssEaseInOut'] = EasingTypes.inout( Easings.quad );

Easings['cssLinear']    = Easings.linear;


var Attributes = {};

/**
 * The default attribute.
 */
Attributes['default']              = {defaultValue: 0};

/**
 * All animatable attributes for AnimatorDoms & HTMLElements.
 */

Attributes.padding                 = {defaultValue: 0, defaultUnit: 'px'};
Attributes.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
Attributes.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
Attributes.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
Attributes.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

Attributes.margin                  = {defaultValue: 0, defaultUnit: 'px'};
Attributes.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
Attributes.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
Attributes.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
Attributes.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

Attributes.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

Attributes.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

Attributes.outlineWidth            = {defaultValue: 0, defaultUnit: 'px'};
Attributes.outlineOffset           = {defaultValue: 0};
Attributes.textIndent              = {defaultValue: 0, defaultUnit: 'px'};
Attributes.borderSpacing           = {defaultValue: 0, defaultUnit: 'px'};
Attributes.fontSize                = {defaultValue: 1, defaultUnit: 'em'};
Attributes.lineHeight              = {defaultValue: 1, defaultUnit: 'em'};
Attributes.letterSpacing           = {defaultValue: 0, defaultUnit: 'px'};

Attributes.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
Attributes.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
Attributes.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

Attributes.opacity                 = {defaultValue: 1};
Attributes.zIndex                  = {defaultValue: 1};

Attributes.width                   = {defaultValue: 0, defaultUnit: 'px'};
Attributes.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
Attributes.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

Attributes.height                  = {defaultValue: 0, defaultUnit: 'px'};
Attributes.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
Attributes.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

Attributes.angle                   = {defaultValue: 0, property: 'orbit', defaultUnit: 'deg'};
Attributes.distance                = {defaultValue: 0, property: 'orbit', defaultUnit: 'px'};
Attributes.orbitOffset             = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'orbitOffset', calculator: '2d'};

Attributes.top                     = {defaultValue: 0, defaultUnit: 'px'};
Attributes.right                   = {defaultValue: 0, defaultUnit: 'px'};
Attributes.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
Attributes.left                    = {defaultValue: 0, defaultUnit: 'px'};

Attributes.center                  = {defaultValue: {x:0, y:0}, defaultUnit: 'px', property: 'center', calculator: '2d'};
Attributes.centerX                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};
Attributes.centerY                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};

Attributes.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
Attributes.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
Attributes.brightness              = {defaultValue: 100, property: 'filter', defaultUnit: '%'};
Attributes.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
Attributes.contrast                = {defaultValue: 100, property: 'filter', defaultUnit: '%'};
Attributes.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
Attributes.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
Attributes.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

Attributes.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
Attributes.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

Attributes.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
Attributes.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
Attributes.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
Attributes.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
Attributes.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

Attributes.scale                   = {defaultValue: {x:1, y:1}, property: 'transform', calculator: '2d'};
Attributes.scaleX                  = {defaultValue: 1, property: 'transform'};
Attributes.scaleY                  = {defaultValue: 1, property: 'transform'};
Attributes.scaleZ                  = {defaultValue: 1, property: 'transform'};
Attributes.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

Attributes.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
Attributes.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
Attributes.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

Attributes.backface                = {defaultValue: 0};
Attributes.visibility              = {defaultValue: 1};

Attributes.backgroundColor         = {defaultValue: Color(), calculator: 'rgba'};
Attributes.color                   = {defaultValue: Color(), calculator: 'rgba'};
Attributes.borderTopColor          = {defaultValue: Color(), calculator: 'rgba'};
Attributes.borderRightColor        = {defaultValue: Color(), calculator: 'rgba'};
Attributes.borderBottomColor       = {defaultValue: Color(), calculator: 'rgba'};
Attributes.borderLeftColor         = {defaultValue: Color(), calculator: 'rgba'};
Attributes.borderColor             = {defaultValue: Color(), calculator: 'rgba'};
Attributes.outlineColor            = {defaultValue: Color(), calculator: 'rgba'};

Attributes.textShadowX             = {defaultValue: 0, defaultUnit: 'px', property: 'textShadow'};
Attributes.textShadowY             = {defaultValue: 0, defaultUnit: 'px', property: 'textShadow'};
Attributes.textShadowPosition      = {defaultValue: {x: 0, y: 0}, defaultUnit: 'px', calculator: '2d', property: 'textShadow'};
Attributes.textShadowBlur          = {defaultValue: 0, defaultUnit: 'px', property: 'textShadow'};
Attributes.textShadowColor         = {defaultValue: Color(), calculator: 'rgba', property: 'textShadow'};

Attributes.shadowX                 = {defaultValue: 0, defaultUnit: 'px', property: 'shadow'};
Attributes.shadowY                 = {defaultValue: 0, defaultUnit: 'px', property: 'shadow'};
Attributes.shadowPosition          = {defaultValue: {x: 0, y: 0}, defaultUnit: 'px', calculator: '2d', property: 'shadow'};
Attributes.shadowBlur              = {defaultValue: 0, defaultUnit: 'px', property: 'shadow'};
Attributes.shadowSpread            = {defaultValue: 0, defaultUnit: 'px', property: 'shadow'};
Attributes.shadowColor             = {defaultValue: Color(), calculator: 'rgba', property: 'shadow'};
Attributes.shadowInset             = {defaultValue: 0, property: 'shadow'};


/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {Object|String} attr
 */
function $attribute(attr)
{
  if ( isObject( attr ) && isDefined( attr.defaultValue ) )
  {
    return attr;
  }
  if ( isString( attr ) && attr in Attributes )
  {
    return Attributes[ attr ];
  }

  return Attributes['default'];
}



function factory(nm, relativeTo)
{
  return {

    get: function(e, anim)
    {
      if (anim.animating[nm] === false)
      {
        var style = $style( e, nm );
        var converted = $convert( e, style, anim.units[ nm ], relativeTo );

        if ( converted !== false )
        {
          anim.frame[ nm ] = converted;
          anim.animating[ nm  ] = true;
        }
      }
    },
    set: function(e, anim)
    {
      anim.styles[ nm ] = anim.value( nm );
    },
    unset: function(e, anim, attr)
    {
      e.style[ nm ] = null;
    }
  };
}

function factoryDerivable(nm, relativeTo, deriver)
{
  return {

    get: function(e, anim)
    {
      if (anim.animating[nm] === false)
      {
        var style = $style( e, nm );
        var converted = $convert( e, style, anim.units[ nm ], relativeTo );

        if ( converted !== false )
        {
          anim.frame[ nm ] = converted;
          anim.animating[ nm ] = true;
        }
        else if ( isFunction( deriver ) )
        {
          converted = $convert( e, deriver( e ), anim.units[ nm ], relativeTo );

          if ( converted !== false )
          {
            anim.frame[ nm ] = converted;
            anim.animating[ nm ] = true;
          }
        }
      }
    },
    set: function(e, anim)
    {
      anim.styles[ nm ] = anim.value( nm );
    },
    unset: function(e, anim, attr)
    {
      e.style[ nm ] = null;
    }
  };
}

function factoryColor(nm)
{
  return {

    get: function(e, anim)
    {
      if (anim.animating[nm] === false)
      {
        var style = $style( e, nm );
        var parsed = Color.parse( style );

        if (parsed !== false)
        {
          anim.frame[nm] = parsed;
          anim.animating[nm] = true;
        }
      }
    },
    set: function(e, anim)
    {
      anim.styles[ nm ] = Color.format( anim.frame[nm] );
    },
    unset: function(e, anim, attr)
    {
      e.style[ nm ] = null;
    }
  };
}


var Properties = {};

Properties.noop =
{
  get: function(e, anim)
  {
  },
  set: function(e, anim)
  {
  },
  unset: function(e, anim)
  {
  }
};

Properties.padding                  = factory( 'padding', 'parentWidth' );
Properties.paddingTop               = factory( 'paddingTop', 'parentWidth' );
Properties.paddingRight             = factory( 'paddingRight', 'parentWidth' );
Properties.paddingBottom            = factory( 'paddingBottom', 'parentWidth' );
Properties.paddingLeft              = factory( 'paddingLeft', 'parentWidth' );

Properties.margin                   = factory( 'margin', 'parentWidth' );
Properties.marginTop                = factory( 'marginTop', 'parentWidth' );
Properties.marginRight              = factory( 'marginRight', 'parentWidth' );
Properties.marginBottom             = factory( 'marginBottom', 'parentWidth' );
Properties.marginLeft               = factory( 'marginLeft', 'parentWidth' );

Properties.borderRadius             = factory( 'borderRadius', 'width' );
Properties.borderTopLeftRadius      = factory( 'borderTopLeftRadius', 'width' );
Properties.borderTopRightRadius     = factory( 'borderTopRightRadius', 'width' );
Properties.borderBottomLeftRadius   = factory( 'borderBottomLeftRadius', 'width' );
Properties.borderBottomRightRadius  = factory( 'borderBottomRightRadius', 'width' );

Properties.borderWidth              = factory( 'borderWidth' );
Properties.borderTopWidth           = factory( 'borderTopWidth' );
Properties.borderRightWidth         = factory( 'borderRightWidth' );
Properties.borderBottomWidth        = factory( 'borderBottomWidth' );
Properties.borderLeftWidth          = factory( 'borderLeftWidth' );

Properties.outlineWidth             = factory( 'outlineWidth' );
Properties.textIndent               = factory( 'textIndent', 'parentWidth' );
Properties.borderSpacing            = factory( 'borderSpacing' );
Properties.fontSize                 = factory( 'fontSize', 'parentFontSize' );
Properties.lineHeight               = factory( 'lineHeight', 'fontSize' );
Properties.letterSpacing            = factory( 'letterSpacing' );

Properties.zIndex                   = factory( 'zIndex' );

Properties.color                    = factoryColor( 'color' );
Properties.backgroundColor          = factoryColor( 'backgroundColor' );
Properties.borderTopColor           = factoryColor( 'borderTopColor' );
Properties.borderRightColor         = factoryColor( 'borderRightColor' );
Properties.borderBottomColor        = factoryColor( 'borderBottomColor' );
Properties.borderLeftColor          = factoryColor( 'borderLeftColor' );
Properties.borderColor              = factoryColor( 'borderColor' );
Properties.outlineColor             = factoryColor( 'outlineColor' );

Properties.minWidth                 = factory( 'minWidth', 'parentWidth' );
Properties.maxWidth                 = factory( 'maxWidth', 'parentWidth' );
Properties.minHeight                = factory( 'minHeight', 'parentHeight' );
Properties.maxHeight                = factory( 'maxHeight', 'parentHeight' );

Properties.width                    = factoryDerivable('width', 'parentWidth', function(e) { return e.offsetWidth + 'px'; });
Properties.height                   = factoryDerivable('height', 'parentHeight', function(e) { return e.offsetHeight + 'px'; });

Properties.top                      = factoryDerivable('top', 'parentHeight', function(e) { return e.offsetTop + 'px'; });
Properties.right                    = factoryDerivable('right', 'parentWidth', function(e) { return (e.parentNode.scrollWidth - (e.offsetLeft + e.offsetWidth)) + 'px'; });
Properties.bottom                   = factoryDerivable('bottom', 'parentHeight', function(e) { return (e.parentNode.scrollHeight - (e.offsetTop + e.offsetHeight)) + 'px'; });
Properties.left                     = factoryDerivable('left', 'parentWidth', function(e) { return e.offsetLeft + 'px'; });


Properties.zIndex.set = function(e, anim)
{
  anim.styles.zIndex = Math.floor( anim.frame.zIndex );
};

Properties.visibility =
{
  get: function(e, anim)
  {
    if (anim.animating.visibility === false)
    {
      var style = $style( e, 'visibility' );
      anim.frame.visibility = style === 'hidden' ? 0.0 : 1.0;
      anim.animating = true;
    }
  },
  set: function(e, anim)
  {
    anim.styles.visibility = anim.frame.visibility < 0.5 ? 'hidden' : 'visible';
  },
  unset: function(e, anim)
  {
    e.style.visibility = null;
  }
};

Properties.backface = (function()
{
  var css = $prefix(['WebkitBackfaceVisibility', 'MozBackfaceVisibility', 'msBackfaceVisibility', 'BackfaceVisibility']);

  if ( !css )
  {
    return Properties.noop;
  }

  return {

    get: function(e, anim)
    {
      if ( anim.animating.backface === false )
      {
        var style = $style( e, css );

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
      e.style[ css ] = null;
    }

  };

})();

Properties.transformOrigin = (function()
{
  var css = $prefix(['WebkitTransformOrigin', 'MozTransformOrigin', 'OTransformOrigin', 'msTransformOrigin', 'transformOrigin']);

  if ( !css )
  {
    return Properties.noop;
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

      var converted = $convert( e, value, anim.units[ attr ], relativeTo );

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
      var style = $style( e, css );

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

      if ( isDefined( anim.frame.originZ ) )
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' ) + ' ' + anim.valueOr( 'originZ', 'origin', 'z' );
      }
      else
      {
        style = anim.valueOr( 'originX', 'origin', 'x' ) + ' ' + anim.valueOr( 'originY', 'origin', 'y' );
      }

      anim.styles[css] = style;
    },
    unset: function(e, anim, attr)
    {
      unset( e, anim, attr, this, css, null );
    }
  };

})();

Properties.transform = (function()
{
  var css = $prefix(['WebkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'transform']);

  if ( !css )
  {
    return Properties.noop;
  }

  var parse = function( e, value, anim, attr, relativeTo )
  {
    var desiredUnit = anim.units[ attr ];
    var converted = $convert( e, value, desiredUnit, relativeTo );

    if ( converted !== false )
    {
      return converted;
    }

    // TODO show convert this to desiredUnit, however defaultValue may be non-scalar.
    return anim.getAttribute( attr ).defaultValue;
  };

  var getter1d = function(e, anim, parsed, attr)
  {
    return parse( e, parsed[1], anim, attr, 'width' );
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
  var combine = function(ax, ay, bx, by, ascl, bscl)
  {
    return {
      x: (ascl * ax) + (bscl * bx),
      y: (ascl * ay) + (bscl * by)
    };
  };
  var place1d = function(anim, e, attr, value, relativeTo)
  {
    if ( anim.animating[ attr ] === false )
    {
      anim.frame[ attr ] = $convert( e, value, anim.units[ attr ], relativeTo );
      anim.animating[ attr ] = true;
    }
  };
  var place2d = function(anim, e, attr, valueX, valueY, relativeToX, relativeToY)
  {
    if ( anim.animating[ attr ] === false )
    {
      anim.frame[ attr ] = {
        x: $convert( e, valueX, anim.units[ attr ], relativeToX ),
        y: $convert( e, valueY, anim.units[ attr ], relativeToY )
      };
      anim.animating[ attr ] = true;
    }
  };
  var place3d = function(anim, e, attr, valueX, valueY, valueZ, relativeToX, relativeToY, relativeToZ)
  {
    if ( anim.animating[ attr ] === false )
    {
      anim.frame[ attr ] = {
        x: $convert( e, valueX, anim.units[ attr ], relativeToX ),
        y: $convert( e, valueY, anim.units[ attr ], relativeToY ),
        z: $convert( e, valueZ, anim.units[ attr ], relativeToZ )
      };
      anim.animating[ attr ] = true;
    }
  };
  var place4d = function(anim, e, attr, valueX, valueY, valueZ, valueRotate, relativeToX, relativeToY, relativeToZ, relativeToRotate)
  {
    if ( anim.animating[ attr ] === false )
    {
      anim.frame[ attr ] = {
        x: $convert( e, valueX, anim.units[ attr ], relativeToX ),
        y: $convert( e, valueY, anim.units[ attr ], relativeToY ),
        z: $convert( e, valueZ, anim.units[ attr ], relativeToZ ),
        angle: $convert( e, valueRotate, anim.units[ attr ], relativeToRotate )
      };
      anim.animating[ attr ] = true;
    }
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
    skew:         /skew\(([^,]+)\s*,\s*([^\)]+)\)/i,
    skewX:        /skewX\(([^\)]+)\)/i,
    skewY:        /skewY\(([^\)]+)\)/i,
    rotate3d:     /rotate3d\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^\)]+)\)/i,
    rotateX:      /rotateX\(([^\)]+)\)/i,
    rotateY:      /rotateY\(([^\)]+)\)/i,
    rotateZ:      /rotateZ\(([^\)]+)\)/i
  };

  var matrix = /matrix\(([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\)/i;

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

  var props = new FastMap( regexes );
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
      var style = $style( e, css );

      var matrixParsed = matrix.exec( style );

      if ( matrixParsed )
      {
        var a = parseFloat( matrixParsed[ 1 ] );
        var b = parseFloat( matrixParsed[ 2 ] );
        var c = parseFloat( matrixParsed[ 3 ] );
        var d = parseFloat( matrixParsed[ 4 ] );
        var tx = parseFloat( matrixParsed[ 5 ] );
        var ty = parseFloat( matrixParsed[ 6 ] );

        // Make sure the matrix is invertible
        if ((a * d - b * c) !== 0)
        {
          // Take care of translation
          var translateX = tx + 'px';
          var translateY = ty + 'px';

          // Compute X scale factor and normalize first row.
          var scaleX = Math.sqrt( a * a + b * b );
          if ( scaleX !== 0 )
          {
            a /= scaleX;
            b /= scaleX;
          }

          // Compute shear factor and make 2nd row orthogonal to 1st.
          var skew = a * c + b * d;
          var combined = combine( c, d, a, b, 1.0, -skew );
          c = combined.x;
          d = combined.y;

          // Now, compute Y scale and normalize 2nd row.
          var scaleY = Math.sqrt( c * c + d * d );
          if ( scaleY !== 0 )
          {
            c /= scaleY;
            d /= scaleY;
            skew /= scaleY;
          }

          // Now, get the rotation out
          var rotate = Math.atan2( b, a ) + 'rad';

          // Place values in animator.
          place2d( anim, e, 'translate', translateX, translateY, 'width', 'height' );
          place3d( anim, e, 'translate3d', translateX, translateY, 0, 'width', 'height' );
          place1d( anim, e, 'translateX', translateX, 'width' );
          place1d( anim, e, 'translateY', translateY, 'height' );
          place2d( anim, e, 'scale', scaleX, scaleY );
          place1d( anim, e, 'scaleX', scaleX );
          place1d( anim, e, 'scaleY', scaleY );
          place3d( anim, e, 'scale3d', scaleX, scaleY, 1 );
          place1d( anim, e, 'rotate', rotate );
          place4d( anim, e, 'rotate3d', 0, 0, 1, rotate );
          place1d( anim, e, 'rotateZ', rotate );
          place2d( anim, e, 'skew', skew, skew );
          place1d( anim, e, 'skewX', skew );
          place1d( anim, e, 'skewY', skew );

          return;
        }
      }

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

      for (var i = 0; i < attrs.length; i++)
      {
        var attr = attrs[ i ];

        if ( attr in anim.frame )
        {
          transforms.push( props.setters[ i ]( attr, anim.frame[ attr ], anim.units[ attr ] ) );
        }
      }

      if (transforms.length)
      {
        anim.styles[ css ] = transforms.join( ' ' );
      }
    },
    unset: function(e, anim, attr)
    {
      unset( e, anim, attr, this, css, '' );
    }
  };

})();

Properties.opacity = (function()
{
  var css = $prefix(['WebkitOpacity', 'MozOpacity', 'KhtmlOpacity', 'opacity']);

  if ( !css )
  {
    return Properties.noop;
  }

  return {

    get: function(e, anim)
    {
      if (anim.animating.opacity === false)
      {
        var style = $style( e, css );
        var opacity = parseFloat( style );

        if ( !isNaN(opacity) )
        {
          anim.frame.opacity = opacity;
          anim.animating.opacity = true;
        }
      }
    },
    set: function(e, anim)
    {
      anim.styles[ css ] = clamp( anim.frame.opacity, 0, 1 );
    },
    unset: function(e, anim)
    {
      e.style[ css ] = null;
    }
  };

})();

Properties.shadow = (function()
{
  var css = $prefix(['WebkitBoxShadow', 'MozBoxShadow', 'boxShadow']);

  if ( !css )
  {
    return Properties.noop;
  }

  var parsePart = function( e, anim, attr, value, relativeTo )
  {
    if ( anim.updating[ attr ] === false && value )
    {
      var parsed = $convert( e, value, anim.units[ attr ], relativeTo );

      if ( parsed !== false )
      {
        anim.frame[ attr ] = parsed;
        anim.updating[ attr ] = true;
      }
    }
  };

  return {

    get: function(e, anim)
    {
      var style = $style( e, css );
      var parts = style.split( ' ' );

      if ( parts.length < 3 )
      {
        return;
      }

      var inset = 0;

      if ( parts[ 0 ] === 'inset' )
      {
        inset = 1;
        parts.shift();
      }

      var x = parts[ 0 ];
      var y = parts[ 1 ];
      var blur = false, spread = false, color = false;

      switch ( parts.length ) {
        case 3:
          color = parts[ 2 ];
          break;
        case 4:
          blur = parts[ 2 ];
          color = parts[ 3 ];
          break;
        case 5:
          blur = parts[ 2 ];
          spread = parts[ 3 ];
          color = parts[ 4 ];
          break;
      }

      parsePart( e, anim, 'shadowX', x, 'width' );
      parsePart( e, anim, 'shadowY', y, 'height' );
      parsePart( e, anim, 'shadowBlur', blur, 'width' );
      parsePart( e, anim, 'shadowSpread', spread, 'width' );

      if ( anim.updating.shadowPosition === false )
      {
        var parsedX = $convert( e, x, anim.units.shadowPosition, 'width' );
        var parsedY = $convert( e, y, anim.units.shadowPosition, 'height' );

        if ( parsedX !== false && parsedY !== false )
        {
          anim.frame.shadowPosition = {
            x: parsedX,
            y: parsedY
          };
          anim.updating.shadowPosition = true;
        }
      }

      if ( anim.updating.shadowInset === false )
      {
        anim.frame.shadowInset = inset;
        anim.updating.shadowInset = true;
      }

      if ( anim.updating.shadowColor === false )
      {
        var parsed = Color.parse( color );

        if ( parsed !== false )
        {
          anim.frame.shadowColor = parsed;
          anim.updating.shadowColor = true;
        }
      }

    },

    set: function(e, anim)
    {
      var style = '';

      if ( anim.frame.inset )
      {
        style += 'inset '; // TODO test - fixed but not sure
      }

      style += anim.valueOr( 'shadowX', 'shadowPosition', 'x' ) + ' ';
      style += anim.valueOr( 'shadowY', 'shadowPosition', 'y' ) + ' ';

      if ( isNumber( anim.frame.shadowBlur ) )
      {
        style += anim.value( 'shadowBlur' ) + ' ';
      }

      if ( isNumber( anim.frame.shadowSpread ) )
      {
        style += anim.value( 'shadowSpread' ) + ' ';
      }

      style += Color.format( anim.frame.shadowColor );

      anim.styles[ css ] = style;
    },

    unset: function(e, anim, attr)
    {
      unset( e, anim, attr, this, css, null );
    }

  };

})();


Properties.textShadow = (function()
{
  var css = $prefix(['WebkitTextShadow', 'MozTextShadow', 'textShadow']);

  if ( !css )
  {
    return Properties.noop;
  }

  var parsePart = function( e, anim, attr, value, relativeTo )
  {
    if ( anim.updating[ attr ] === false && value )
    {
      var parsed = $convert( e, value, anim.units[ attr ], relativeTo );

      if ( parsed !== false )
      {
        anim.frame[ attr ] = parsed;
        anim.updating[ attr ] = true;
      }
    }
  };

  return {

    get: function(e, anim)
    {
      var style = $style( e, css );
      var parts = style.split( ' ' );

      if ( parts.length < 3 )
      {
        return;
      }

      var x = parts[ 0 ];
      var y = parts[ 1 ];
      var blur = false, color = false;

      switch ( parts.length ) {
        case 3:
          color = parts[ 2 ];
          break;
        case 4:
          blur = parts[ 2 ];
          color = parts[ 3 ];
          break;
      }

      parsePart( e, anim, 'textShadowX', x, 'width' );
      parsePart( e, anim, 'textShadowY', y, 'height' );
      parsePart( e, anim, 'textShadowBlur', blur, 'width' );

      if ( anim.updating.textShadowPosition === false )
      {
        var parsedX = $convert( e, x, anim.units.textShadowPosition, 'width' );
        var parsedY = $convert( e, y, anim.units.textShadowPosition, 'height' );

        if ( parsedX !== false && parsedY !== false )
        {
          anim.frame.textShadowPosition = {
            x: parsedX,
            y: parsedY
          };
          anim.updating.textShadowPosition = true;
        }
      }

      if ( anim.updating.textShadowColor === false )
      {
        var parsed = Color.parse( color );

        if ( parsed !== false )
        {
          anim.frame.textShadowColor = parsed;
          anim.updating.textShadowColor = true;
        }
      }
    },

    set: function(e, anim)
    {
      var style = '';

      if ( anim.frame.inset )
      {
        style += 'inset '; // TODO test - fixed but not sure
      }

      style += anim.valueOr( 'textShadowX', 'textShadowPosition', 'x' ) + ' ';
      style += anim.valueOr( 'textShadowY', 'textShadowPosition', 'y' ) + ' ';

      if ( isNumber( anim.frame.textShadowBlur ) )
      {
        style += anim.value( 'textShadowBlur' ) + ' ';
      }

      if ( isNumber( anim.frame.textShadowSpread ) )
      {
        style += anim.value( 'textShadowSpread' ) + ' ';
      }

      style += Color.format( anim.frame.textShadowColor );

      anim.styles[ css ] = style;
    },

    unset: function(e, anim, attr)
    {
      unset( e, anim, attr, this, css, null );
    }

  };

})();

Properties.filter = (function()
{
  var css = $prefix(['WebkitFilter', 'MozFilter', 'OFilter', 'msFilter', 'filter']);

  if ( !css )
  {
    return Properties.noop;
  }

  var methods =
  {
    grayscale:  'grayscale',
    sepia:      'sepia',
    saturate:   'saturate',
    hueRotate:  'hue-rotate',
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
      var style = $style( e, css );

      for (var attr in patterns)
      {
        if ( anim.animating[attr] === false )
        {
          var parsed = patterns[attr].exec( style );

          if ( parsed )
          {
            var converted = $convert( e, parsed[1], anim.units[ attr ] );

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
    unset: function(e, anim, attr)
    {
      unset( e, anim, attr, this, css, null );
    }
  };

})();

Properties.center =
{
  get: function(e, anim)
  {
    var cx = (e.offsetLeft + e.offsetWidth * 0.5) + 'px';
    var cy = (e.offsetTop + e.offsetHeight * 0.5) + 'px';

    if ( anim.animating.center === false )
    {
      var desiredUnit = anim.units.center;
      var ccx = $convert( e, cx, desiredUnit, 'parentWidth' );
      var ccy = $convert( e, cy, desiredUnit, 'parentHeight' );

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
      var ccx = $convert( e, cx, desiredUnit, 'parentWidth' );

      if ( ccx !== false )
      {
        anim.frame.centerX = ccx;
        anim.animating.centerX = true;
      }
    }
    if ( anim.animating.centerY === false )
    {
      var desiredUnit = anim.units.centerY;
      var ccy = $convert( e, cy, desiredUnit, 'parentHeight' );

      if ( ccy !== false )
      {
        anim.frame.centerY = ccy;
        anim.animating.centerY = true;
      }
    }
  },
  preset: function(e, anim)
  {
    anim.cached.width  = $convert( e, e.offsetWidth + 'px', anim.units.centerX || anim.units.center, 'parentWidth' );
    anim.cached.height = $convert( e, e.offsetHeight + 'px', anim.units.centerY || anim.units.center, 'parentHeight' );
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
  },
  unset: function(e, anim, attr)
  {

  }
};

Properties.orbit =
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
      var cox = $convert( e, ox + 'px', cunit, 'parentWidth' );
      var coy = $convert( e, oy + 'px', cunit, 'parentHeight' );

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

    var cox = $convert( e, orbitX + cunit, 'px', anim.cached.parentWidth / 100.0 );
    var coy = $convert( e, orbitY + cunit, 'px', anim.cached.parentHeight / 100.0 );

    var ox = $convert( e, originX + originUnit, 'px', anim.cached.width / 100.0 );
    var oy = $convert( e, originY + originUnit, 'px', anim.cached.height / 100.0 );

    var angle = (anim.frame.angle || 0.0) * this.DEGREE_TO_RADIAN;
    var distance = anim.frame.distance || 0.0;

    var cos = Math.cos( angle ) * distance;
    var sin = Math.sin( angle ) * distance;

    anim.styles.left = (cox + cos - ox) + 'px';
    anim.styles.top = (coy + sin - oy) + 'px';
  },

  unset: function(e, anim, attr)
  {

  }
};


/**
 * Returns a property for the given name.
 *
 * @param  {String|Object}
 * @return {Object}
 */
function $property(prop)
{
  if ( isObject( prop ) && isFunction( prop.get ) && isFunction( prop.set ) )
  {
    return prop;
  }
  if ( isString( prop ) && prop in Properties )
  {
    return Properties[ prop ];
  }

  throw prop + ' is not a valid property';
}

function unset( e, anim, attr, property, css, clearedValue )
{
  if ( attr === true )
  {
    e.style[ css ] = clearedValue;
  }
  else
  {
    delete anim.frame[ attr ];

    property.set( e, anim );

    e.style[ css ] = anim.styles[ css ];
  }
}


/**
 * Instantiates a new AnimatorDom given a subject.
 *
 * @param {HTMLElement} e
 * @class AnimatorDom
 * @constructor
 * @extends Animator
 */
function AnimatorDom(subject)
{
  this.reset( subject );
  this.properties = new FastMap();
  this.propertiesPreset = new FastMap();
  this.attributeToProperty = {};
  this.animating = {};
  this.cached = {};
  this.units = {};
  this.styles = {};
  this.styled = false;
  this.stylesUpdated = false;
}

/**
 * Extends anim8.Animator
 */
Class.extend( AnimatorDom, Animator,
{
  preupdate: function(now)
  {
    // If there are events with paths that contain computed values we should
    // populate the frame directly from the HTML element.
    var aa = this.attrimatorsAdded;

    if ( aa.length )
    {
      var properties = {};

      for (var i = aa.length - 1; i >= 0; i--)
      {
        var attrimator = aa[ i ];
        var attr = attrimator.attribute;

        if ( !(attr in this.frame) && attrimator.hasComputed() )
        {
          properties[ this.attributeToProperty[ attr ] ] = true;

          this.animating[ attr ] = false;
        }
      }

      for (var prop in properties)
      {
        this.properties.get( prop ).get( this.subject, this );
      }

      for (var i = aa.length - 1; i >= 0; i--)
      {
        var attrimator = aa[ i ];
        var attr = attrimator.attribute;

        this.setDefault( attr );

        attrimator.start( now, this );
      }

      aa.length = 0;
    }

    // If a property currently being animated requires some heads up before it
    // gets or sets a value, notify it. TODO removed dead properties.
    var presets = this.propertiesPreset.values;
    for (var i = presets.length - 1; i >= 0; i--)
    {
      presets[ i ].preset( this.subject, this );
    }

    this.trigger('preupdate');

    return this;
  },

  update: function(now)
  {
    this._update( now );

    this.getStyles();
    this.stylesUpdated = true;

    return this;
  },

  apply: function()
  {
    if ( !this.styled && !this.stylesUpdated )
    {
      this.getStyles();
    }

    if ( this.styled )
    {
      for (var prop in this.styles)
      {
         this.subject.style[ prop ] = this.styles[ prop ];
      }

      for (var attr in this.frame)
      {
        this.updated[ attr ] = false;
      }

      this.styled = false;
    }

    this.stylesUpdated = false;

    this.trigger('apply');

    this.trimAttrimators();

    return this;
  },

  placeAttrimator: function( attrimator )
  {
    this._placeAttrimator( attrimator );

    var attr = attrimator.attribute;
    var attribute = this.getAttribute( attr );
    var propertyName = attribute.propertyName;
    var property = attribute.property;

    this.properties.put( propertyName, property );

    this.attributeToProperty[ attr ] = propertyName;
    this.units[ attr ] = attribute.defaultUnit;

    if ( attrimator.input && attrimator.input.units && attr in attrimator.input.units )
    {
      this.units[ attr ] = attrimator.input.units[ attr ];
    }

    if ( isFunction( property.preset ) )
    {
      this.propertiesPreset.put( propertyName, property );
    }

    return this;
  },
  restore: function()
  {
    var props = this.properties.values;

    for (var i = props.length - 1; i >= 0; i--)
    {
      props[ i ].unset( this.subject, this, true );
    }

    this.frame = {};

    return this;
  },
  unset: function( attributes )
  {
    var attributes = toArray( coalesce( attributes, this.frame ) );

    for (var i = attributes.length - 1; i >= 0; i--)
    {
      var attr = attributes[ i ];
      var prop = this.attributeToProperty[ attr ];
      var property = this.properties.get( prop );

      if ( property )
      {
        property.unset( this.subject, this, attr );
      }

      this.attrimators.remove( attr );

      delete this.frame[ attr ];
    }

    return this;
  },
  set: function( attributes )
  {
    var props = {};
    var updated = {};
    var units = {};
    var styles = {};

    for (var attr in attributes)
    {
      var attribute = this.getAttribute( attr );
      var value     = attributes[ attr ];

      units[ attr ] = attribute.defaultUnit;

      if ( isString( value ) )
      {
        var parsed = $parseValue( value, attribute.defaultUnit );

        if ( parsed !== false )
        {
          units[ attr ] = parsed.unit || attribute.defaultUnit;
          value = parsed.value;
        }
      }

      var parsed = attribute.parse( value );

      if ( parsed !== false )
      {
        props[ attribute.propertyName ] = attribute.property;
        attributes[ attr ] = parsed;
        updated[ attr ] = true;
      }
    }

    var flash =
    {
      source: this,

      units: units,

      frame: attributes,

      updated: updated,

      styles: styles,

      cached: {},

      get: function(attributes)
      {
        return this.source.get( attributes );
      },

      value: function(attr)
      {
        return attributes[ attr ] + units[ attr ];
      },

      valueOr: function(attr, other, subproperty)
      {
        var value = attributes[ attr ];

        if ( !isDefined( value ) )
        {
          value = attributes[ attr = other ];

          if ( isDefined( subproperty ) )
          {
            value = value[ subproperty ];
          }
        }

        return value + units[ attr ];
      }
    };

    for (var prop in props)
    {
      var property = props[ prop ];

      if ( isFunction( property.preset ) )
      {
        props[ prop ].preset( this.subject, flash );
      }
    }

    for (var prop in props)
    {
      props[ prop ].set( this.subject, flash );
    }

    for (var prop in styles)
    {
      this.subject.style[ prop ] = styles[ prop ];
    }

    return this;
  },

  /**
   * Builds the styles map in preparation to be applied.
   *
   * @method getStyles
   */
  getStyles: function()
  {
    this.styles = {};

    var applyProperties = {};

    for (var attr in this.frame)
    {
      if ( this.updated[ attr ] )
      {
        var prop = this.attributeToProperty[ attr ];

        if ( this.properties.has( prop ) )
        {
          applyProperties[ prop ] = true;
        }
      }
    }

    for (var prop in applyProperties)
    {
      this.properties.get( prop ).set( this.subject, this );

      this.styled = true;
    }
  },

  /**
   * Gets the current attribute values for all attributes specified. The argument must be an object
   * where the key is the name of an attribute and the value is the desired unit.
   *
   * @method get
   * @param {Object} attributes
   * @return {Object}
   */
  get: function(attributes)
  {
    var props = {};
    var animating = {};
    var units = {};
    var out = {};

    for (var attr in attributes)
    {
      var attribute = this.getAttribute( attr );

      animating[ attr ] = false;
      units[ attr ] = attributes[ attr ] || attribute.defaultUnit;
      props[ attribute.propertyName ] = attribute.property;
      out[ attr ] = attribute.cloneDefault();
    }

    var flash =
    {
      source: this,

      units: units,

      frame: out,

      animating: animating,

      unit: function(attr)
      {
        return units[ attr ];
      }
    };

    for (var prop in props)
    {
      props[ prop ].get( this.subject, flash );
    }

    return out;
  },

  /**
   * Returns a function that returns the current value for the given attribute when invoked.
   *
   * @param {String} attribute
   * @param {String} desiredUnit
   * @param {String} relativeTo
   * @return {Function}
   */
  ref: function(attribute, desiredUnit, relativeTo)
  {
    var animator = this;
    var request = {};

    return function()
    {
      if ( attribute in animator.frame && isNumber( animator.frame[ attribute ] ) )
      {
        return $convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
      }

      request[ attribute ] = desiredUnit;

      var current = animator.get( request );

      if ( isDefined( current[ attribute ] ) )
      {
        return current[ attribute ];
      }

      return animator.getAttribute( attribute ).defaultValue;
    };
  },

  /**
   * Returns the value for the given attribute as a string with the current units.
   *
   * @method value
   * @param {String} attr
   * @return {String}
   */
  value: function(attr)
  {
    return this.frame[ attr ] + this.units[ attr ];
  },

  /**
   * Returns the value for the given attribute as a string with the current units.
   * if the attribute doesn't exist a secondary one is looked up. If that value
   * is an object and contains the given subproperty the value is resolved once again.
   *
   * @method valueOr
   * @param {String} attr
   * @param {String} other
   * @param [String] subproperty
   * @return {String}
   */
  valueOr: function(attr, other, subproperty)
  {
    var value = this.frame[ attr ];

    if ( !isDefined( value ) )
    {
      value = this.frame[ attr = other ];

      if ( isDefined( subproperty ) )
      {
        value = value[ subproperty ];
      }
    }

    return value + this.units[ attr ];
  },

  /**
   * Tweens a single attribute to a target value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenTo
   * @param {String} attr
   * @param {T} target
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {String} [unit]
   * @chainable
   */
  tweenTo: function(attr, target, options, cache, unit)
  {
    this.convertExisting( attr, unit );
    this._tweenTo( attr, target, options, cache );
    this.units[ attr ] = unit || this.units[ attr ];
    return this;
  },

  /**
   * Tweens multiple attributes to target values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyTo
   * @param {Object} targets
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {Object} [units]
   * @chainable
   */
  tweenManyTo: function(targets, options, cache, units)
  {
    this.convertExistingMany( units );
    this._tweenManyTo( targets, options, cache );
    override( this.units, units );
    return this;
  },

  /**
   * Tweens a single attribute from a starting value to the current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenFrom
   * @param {String} attr
   * @param {T} starting
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {String} [unit]
   * @chainable
   */
  tweenFrom: function(attr, starting, options, cache, unit)
  {
    this.convertExisting( attr, unit );
    this._tweenFrom( attr, starting, options, cache );
    this.units[ attr ] = unit || this.units[ attr ];
    return this;
  },

  /**
   * Tweens multiple attributes from starting values to the current values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenManyFrom
   * @param {Object} startings
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {Object} [units]
   * @chainable
   */
  tweenManyFrom: function(startings, options, cache, units)
  {
    this.convertExistingMany( units );
    this._tweenManyFrom( startings, options, cache );
    override( this.units, units );
    return this;
  },

  /**
   * Tweens an attribute from a starting value to an ending value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tween
   * @param {String} attr
   * @param {T} starts
   * @param {T} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {String} [unit]
   * @chainable
   */
  tween: function(attr, starts, ends, options, cache, unit)
  {
    this.convertExisting( attr, unit );
    this._tween( attr, starts, ends, options, cache );
    this.units[ attr ] = unit || this.units[ attr ];
    return this;
  },

  /**
   * Tweens multiple attributes from starting values to ending values.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method tweenMany
   * @param {Object} starts
   * @param {Object} ends
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {Object} [units]
   * @chainable
   */
  tweenMany: function(starts, ends, options, cache, units)
  {
    this.convertExistingMany( units );
    this._tweenMany( starts, ends, options, cache );
    override( this.units, units );
    return this;
  },

  /**
   * Moves an attribute relative to its current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method move
   * @param {String} attr
   * @param {T} amount
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {String} [unit]
   * @chainable
   */
  move: function(attr, amount, options, cache, unit)
  {
    this.convertExisting( attr, unit );
    this._move( attr, amount, options, cache );
    this.units[ attr ] = unit || this.units[ attr ];
    return this;
  },

  /**
   * Moves multiple attribute relative to their current value.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method moveMany
   * @param {Object} amounts
   * @param {String|Array|Object} [options]
   * @param {Boolean} [cache=false]
   * @param {Object} [units]
   * @chainable
   */
  moveMany: function(amounts, options, cache, units)
  {
    this.convertExistingMany( units );
    this._moveMany( amounts, options, cache );
    override( this.units, units );
    return this;
  },

  /**
   * Follows the attribute along the given path definition.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @method follow
   * @param {String} attr
   * @param {Path|Object|String} path
   * @param {Object} [options]
   * @param {Boolean} [cache=false]
   * @param {String} [unit]
   * @chainable
   */
  follow: function(attr, path, options, cache, unit)
  {
    this.convertExisting( attr, unit );
    this._follow( attr, path, options, cache );
    this.units[ attr ] = unit || this.units[ attr ];
    return this;
  },

  /**
   * Converts any existing attributes to the desired units.
   *
   * @method convertExistingMany
   * @param  {Object} units
   */
  convertExistingMany: function(units)
  {
    if ( units && isObject( units ) )
    {
      var current = this.get( units );

      for (var attr in current)
      {
        this.frame[ attr ] = current[ attr ];
      }
    }
  },

  /**
   * Converts any existing attribute to the desired unit.
   *
   * @method convertExisting
   * @param  {String} attr
   * @param  {String} toUnit
   */
  convertExisting: function(attr, toUnit)
  {
    if ( toUnit && attr in this.frame && attr in this.units && this.units[ attr ] !== toUnit )
    {
      var request = {};
      request[ attr ] = toUnit;

      this.convertExistingMany( request );
    }
  }

});


/**
 * A factory for HTML Elements
 */
function FactoryDom()
{
  this.cached = {};
  this.ids = 0;
  this.elementAttribute = 'anim8';
  this.priority = 5;
  this.attributes = {};
}

Class.extend( FactoryDom, Factory,
{

  /**
   * Determines whether the given subject is valid for this factory to create Animators for.
   *
   * @param  {any} subject
   * @return {Boolean}
   */
  is: function(subject)
  {
    return isElement( subject );
  },

  /**
   * Returns an animator given a subject.
   *
   * @param  {HTMLElement} subject
   * @return {anim8.Animator}
   */
  animatorFor: function(subject)
  {
    var animatorId = subject.getAttribute( this.elementAttribute );

    if (!(animatorId in this.cached))
    {
      var animator = new AnimatorDom( subject );

      subject.setAttribute( this.elementAttribute, animatorId = animator.id = ++this.ids );

      animator.factory = this;

      this.cached[animatorId] = animator;
    }

    return this.cached[ animatorId ];
  },

  /**
   * Destroys the animator by unlinking the animator from the subject.
   *
   * @param  {anim8.Animator} animator
   */
  destroy: function(animator)
  {
    delete this.cached[ animator.id ];
  },

  /**
   * Returns the attribute descriptor for the given attribute.
   *
   * @param  {String} attr
   * @return {Object}
   */
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = $attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = $calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );
      var propertyName = coalesce( attribute.property, attr );
      var property = $property( propertyName );
      var defaultUnit = attribute.defaultUnit || '';

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.propertyName = propertyName;
      attribute.property = property;
      attribute.defaultUnit = defaultUnit;
      attribute.parse = function(value) {
        return this.calculator.parse( value, this.defaultValue );
      };
      attribute.cloneDefault = function() {
        return this.calculator.clone( this.defaultValue );
      };
    }

    return attribute;
  }

});

var browser =
{
  IE: (function() {
    if (!(window.ActiveXObject) && "ActiveXObject" in window) { return 11; }
    if (!document.all) { return false; }
    if (!document.compatMode) { return 5; }
    if (!window.XMLHttpRequest) { return 6; }
    if (!document.querySelector) { return 7; }
    if (!document.addEventListener) { return 8; }
    if (!window.atob) { return 9; }
    return 10;
  })()
};

var Matrix = {

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

function concatenateStyle(anim, style, value)
{
  if ( isDefined( anim.styles[ style ] ) )
  {
    anim.styles[ style ] += ' ' + value;
  }
  else
  {
    anim.styles[ style ] = value;
  }
}

function setProperty(attr, property)
{
  var attribute = Attributes[ attr ];

  if ( isString( attribute.property ) || !isDefined( attribute.property ) )
  {
    attribute.property = property;
  }
  else
  {
    attribute.propertyName = property;
    attribute.property = $property( property );
  }
}

/* transform, blur, opacity, margin top & left IE <= 8 */
if ( browser.IE && browser.IE <= 8 )
{
  Properties.ieTransform =
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

      Properties.marginLeft.get( e, anim );
      Properties.marginTop.get( e, anim );

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
      var anim = coalesce( flash.source, flash );
      var attr = def.property;
      var value = anim.frame[ attr ];

      if ( isBoolean( flash.animating[ attr ] ) && isDefined( value ) )
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
            converted = $convert( e, converted + fromUnit, toUnit, def.relativeTo );
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
            converted = $convert( e, converted + fromUnit, toUnit, def.relativeTo );
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

      if ( isNumber( cached ) )
      {
        return cached * 0.01;
      }

      return relativeTo;
    },
    cacheConverted: function(e, anim, def)
    {
      var value = anim.frame[ def.property ];
      var canConvert = isDefined( value );

      if ( canConvert )
      {
        var valueUnit = anim.units[ def.property ];
        var actualValue = ( def.subproperty ? value[ def.subproperty ] : value );

        if ( valueUnit !== def.toUnit )
        {
          var united = actualValue + valueUnit;
          var relativeTo = this.resolveRelativeTo( anim, def.relativeTo );

          actualValue = $convert( e, united, def.toUnit, relativeTo );
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
      var hasValue = isDefined( value );

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
        var computedValue = $style( e, def.property );

        anim.cached[ def.savedAs ] = $convert( e, computedValue, 'px', def.relativeTo ) || e[ def.defaultProperty ];
      }
    },
    cachedOrDefault: function(e, anim, value, attribute, toUnit, relativeTo)
    {
      if ( isDefined( value ) )
      {
        return value;
      }
      if ( attribute.defaultUnit === toUnit )
      {
        return attribute.defaultValue;
      }

      relativeTo = this.resolveRelativeTo( anim, relativeTo );

      return $convert( e, attribute.defaultValue + attribute.defaultUnit, toUnit, relativeTo );
    },
    preset: function(e, anim)
    {
      var cached = anim.cached;
      var settings = this.presettings;
      var attrs = Attributes;

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

      if ( isDefined( cached.skewX ) || isDefined( cached.skewY ) )
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

      if ( isDefined( cached.translateX ) || isDefined( cached.translateY ) )
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

      if ( !isDefined( cached.baseMarginLeft ) )
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
    unset: function(e, anim, attr)
    {
      if ( attr === true )
      {
        e.style.filter = '';
        e.style.marginLeft = (anim.cached.baseMarginLeft || 0) + 'px';
        e.style.marginTop = (anim.cached.baseMarginTop || 0) + 'px';

        anim.cached = {};
      }
    },
    set: function(e, anim)
    {
      var cached = anim.cached;
      var attrs = Attributes;
      var w = cached.width;
      var h = cached.height;
      var anchorX = cached.originX * 0.01;
      var anchorY = cached.originY * 0.01;
      var dx = 0;
      var dy = 0;
      var matrix = Matrix.identity();

      if ( isDefined( cached.scaleX ) || isDefined( cached.scaleY ) )
      {
        matrix = Matrix.multiply( matrix, Matrix.scale(
          coalesce( cached.scaleX, attrs.scaleX.defaultValue ),
          coalesce( cached.scaleY, attrs.scaleY.defaultValue )
        ));
      }

      if ( isDefined( cached.skewX ) )
      {
        matrix = Matrix.multiply( matrix, Matrix.skew( cached.skewX, cached.skewY ) );
      }

      if ( isDefined( cached.rotate ) )
      {
        matrix = Matrix.multiply( matrix, Matrix.rotate( cached.rotate ) );
      }

      if ( isDefined( cached.translateX ) )
      {
        dx += cached.translateX;
        dy += cached.translateY;
      }

      // Calculate the new size of the element based on the matrix. We need to
      // adjust by the difference because IE is special.
      var newSize = Matrix.adjustment( matrix, w, h );
      dx += (w - newSize.x) * 0.5;
      dy += (h - newSize.y) * 0.5;

      // Adjust for a non-centered transformation
      var hw = w * 0.5;
      var hh = h * 0.5;
      var origin = Matrix.transform( matrix, hw, hh );
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
      if ( isNumber( cached.opacity ) && !isNaN( cached.opacity )  )
      {
        var opacityFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + ( cached.opacity * 100 ) + ')';

        filters.push( opacityFilter );
      }

      // Blur
      if ( isNumber( cached.blur ) && !isNaN( cached.blur ) )
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
    setProperty( attributes[ i ], 'ieTransform' );
  }
}

/* minWidth < IE 8 */
if ( browser.IE && browser.IE < 8 )
{
  Properties.minWidth.set = function(e, anim)
  {
    anim.styles.width = 'expression( this.scrollWidth \< ' + (anim.frame.minWidth + 1) + ' ? "' + anim.frame.minWidth + anim.units.minWidth + '" : "auto")';
  };
}

/* maxWidth < IE 8 */
if ( browser.IE && browser.IE < 8 )
{
  Properties.maxWidth.set = function(e, anim)
  {
    anim.styles.width = 'expression( this.scrollWidth > ' + (anim.frame.maxWidth - 1) + ' ? "' + anim.frame.maxWidth + anim.units.maxWidth + '" : "auto")';
  };
}

/* minHeight < IE 8 */
if ( browser.IE && browser.IE < 8 )
{
  Properties.minHeight.set = function(e, anim)
  {
    anim.styles.height = 'expression( this.scrollHeight \< ' + (anim.frame.minHeight + 1) + ' ? "' + anim.frame.minHeight + anim.units.minHeight + '" : "auto")';
  };
}
/* maxHeight < IE 8 */
if ( browser.IE && browser.IE < 8 )
{
  Properties.maxHeight.set = function(e, anim)
  {
    anim.styles.height = 'expression( this.scrollHeight > ' + (anim.frame.maxHeight - 1) + ' ? "' + anim.frame.maxHeight + anim.units.maxHeight + '" : "auto")';
  };
}



  // Register Factory
  anim8.Factories['default'] = anim8.Factories['dom'] = new FactoryDom();

  // Classes
  anim8.AnimatorDom = AnimatorDom;
  anim8.FactoryDom = FactoryDom;

  // Functions
  anim8.isElement = isElement;

  // Variables
  anim8.browser = browser;
  anim8.Matrix = Matrix;

  // Namespace
  anim8.dom = {
    Attributes:           Attributes,
    attribute:            $attribute,
    convert:              $convert,
    style:                $style,
    parseValue:           $parseValue,
    property:             $property,
    prefix:               $prefix,
    concatenateStyle:     concatenateStyle,
    setProperty:          setProperty,
    unset:                unset,
    factory:              factory,
    factoryDerivable:     factoryDerivable,
    factoryColor:         factoryColor
  };

  return anim8;

}));
