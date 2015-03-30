
/*
  DOM create styles to apply, then apply them all at the same time
  don't apply styles if they're impercivable (convert value to pixels of applicable)

*/

/**
 * All DOM related
 */
anim8.dom = {};

/* 
  anim8.property[name] = {
    get: function(e, anim) {
      // based on anim.animating, gets one or more value from the entity and places it on anim.frame. this function should only do this for an attribute if
      // anim.animating[attribute] === false. When it successfully gets a value anim.animating[attribute] should be set to true. This is called before an animation
      // begins on attributes that will be animated based on the current value. 
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

/**
 * Computes the desired style of the given element and returns it as a string. The style
 * given must be in hyphenated format like so: anim8.style( element, 'font-size' ) = '12px'
 */
anim8.style = (function()
{
  var hyphenize = function(str) 
	{
    str = str.replace(/[a-z][A-Z]/g, function(str, letter)
    {
     return str[0] + '-' + str[1].toLowerCase();
    });
    
    str = str.replace(/^Webkit/, '-webkit');
    str = str.replace(/^Moz/, '-moz');
    str = str.replace(/^Ms/, '-ms');
    str = str.replace(/^O/, '-o');
    str = str.replace(/^Khtml/, '-khtml');
    
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
 */
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

/**
 * Calculators how many pixels a given value & unit is.
 * 
 * For Example: anim8.toPixels( 100, 'in' ) 
 *    returns how many pixels are in 1 inch, with up to 2 decimal points of accuracy.
 */
anim8.toPixels = function(baseValue, baseUnit, defaultRate)
{
  if ( document.body )
  {
    var div = document.createElement('div');
    document.body.appendChild( div );
    div.style.width = baseValue + baseUnit;
    var pixels = (div.offsetWidth / baseValue);
    document.body.removeChild( div );
    return pixels || defaultRate;
  }
  
  return defaultRate;
};

/**
 * Parses the string for a value and a unit.
 *
 * @param {string} value
 */
anim8.parseValue = (function()
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
      }
    }
    
    return false;
  };
})();


/**
 * Converts one unit to another for a given element.
 *
 * For Example: anim8.convert( element, '100px', '%', 'parentWidth' )
 *    returns how much percent 100px relativeTo parentWidth of the given element
 *
 * @param {HTMLElement} e
 * @param {string} from
 * @param {string} toUnit
 * @param {string} relativeTo
 */
anim8.convert = (function()
{  
  var getFontSize = function(e, notUnit)
  {
    var fontSize = anim8.style( e, 'fontSize' );
    var parsed = anim8.parseValue( fontSize );
    
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
  
  conversions.pt  = { px: anim8.toPixels(100, 'pt') };
  conversions.in  = { px: anim8.toPixels(100, 'in') };
  conversions.cm  = { px: anim8.toPixels(1000, 'cm') };
  conversions.mm  = { px: anim8.toPixels(100000, 'mm') };
  conversions.vw  = { px: anim8.toPixels(1000, 'vw') };
  conversions.deg = { rad: Math.PI / 180.0};

  conversions.em = 
  {
    px: function(e, relativeTo) 
    {
      return getFontSize( e, 'em' );
    }
  };
  
  conversions.rem = 
  {
    px: function(e, relativeTo) 
    {
      var htmlElement = document.getElementsByTagName("html")[0];
      
      return getFontSize( htmlElement, 'rem' );
    }
  };
  
  conversions['%'] = 
  {
    px: function(e, relativeTo) 
    {
      if ( anim8.isNumber( relativeTo ) )
      {
        return relativeTo;
      }
      if ( relativeTo in variables )
      {
        return variables[ relativeTo ]( e ) / 100.0;
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
      
      if ( !(unit in conversions[ to ]) )
      {
        var given = conversions[ unit ][ to ];
        
        if ( anim8.isNumber( given ) )
        {
          conversions[ to ][ unit ] = 1.0 / given;  
        }
        if ( anim8.isFunction( given ) )
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
    if ( anim8.isNumber( converter ) )
    {
      return converter;
    }
    else if ( anim8.isFunction( converter ) )
    {
      return converter( e, relativeTo );
    }
    
    return 1.0;
  };
  
  return function(e, from, toUnit, relativeTo)
  {
    if ( anim8.isNumber( from ) )
    {
      return from;
    }
    
    var parsed = anim8.parseValue( from );
    
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
      
      value *= getConverterScale( e, converter1, relativeTo );
      value *= getConverterScale( e, converter2, relativeTo );
    }
    
    return value;
  };
  
})();


anim8.factories.dom = 
{
	ids: 0,
  
	cached: {},
  
  attribute: 'anim8',
  
  is: function(subject) 
	{
    return anim8.isElement( subject );
  },
  
  has: function(from)
  {
    return from.getAttribute( this.attribute ) in this.cached;
  },
  
  parseAnimators: function(from, animators) 
  {
    animators.push( this.parseAnimator( from ) );
  },
  
  parseAnimator: function(from) 
	{
		var animatorId = from.getAttribute( this.attribute );
		
		if (!(animatorId in this.cached)) 
		{
			var animator = new anim8.DomAnimator( from );
			
			from.setAttribute( this.attribute, animatorId = animator.id = ++this.ids );
			
			animator.factory = this;
			
			this.cached[animatorId] = animator;
		}

    return this.cached[ animatorId ];
  },
  
	destroy: function(animator) 
	{
		delete this.cached[ animator.id ];
	}
};