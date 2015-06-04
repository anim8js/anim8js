
/**
 * Instantiates a new AnimatorDom given a subject.
 * 
 * @param {HTMLElement} e
 * @class AnimatorDom
 * @constructor
 * @extends Animator
 */
anim8.AnimatorDom = function(subject)
{
  this.reset( subject );
  this.properties = new anim8.FastMap();
  this.propertiesPreset = new anim8.FastMap();
  this.attributeToProperty = {};
  this.animating = {};
  this.cached = {};
  this.units = {};
  this.styles = {};
  this.styled = false;
  this.stylesUpdated = false;
};

/**
 * Extends anim8.Animator
 */
anim8.override( anim8.AnimatorDom.prototype = new anim8.Animator(),
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
    anim8.fn.update.apply( this, arguments );
      
    this.getStyles();
    this.stylesUpdated = true;

    return this;
  },
  onAnimation: function(animation, options, attrimatorMap)
  {  
    if ( animation.input.units )
    {
      var attrimators = attrimatorMap.values;

      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var attrimator = attrimators[ i ];
        var attr = attrimator.attribute;
      
        if ( attr in animation.input.units )
        {
          attrimator.unit = animation.input.units[ attr ];
        }
      }  
    }
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
    anim8.fn.placeAttrimator.apply( this, arguments );
    
    var attr = attrimator.attribute;
    var attribute = this.getAttribute( attr );
    var propertyName = attribute.propertyName;
    var property = attribute.property;

    this.properties.put( propertyName, property );

    this.attributeToProperty[ attr ] = propertyName;
    this.units[ attr ] = attrimator.unit || attribute.defaultUnit;

    if ( anim8.isFunction( property.preset ) )
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
      props[ i ].unset( this.subject, this );
    }
    
    this.frame = {};

    return this;
  },
  set: function(attributes)
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
      
      if ( anim8.isString( value ) )
      {
        var parsed = anim8.dom.parseValue( value, attribute.defaultUnit );
        
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
        
        if ( !anim8.isDefined( value ) )
        {
          value = attributes[ attr = other ];
        
          if ( anim8.isDefined( subproperty ) )
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
      
      if ( anim8.isFunction( property.preset ) )
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
      if ( attribute in animator.frame && anim8.isNumber( animator.frame[ attribute ] ) )
      {
        return anim8.dom.convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
      }
      
      request[ attribute ] = desiredUnit;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attribute ] ) )
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
      
    if ( !anim8.isDefined( value ) )
    {
      value = this.frame[ attr = other ];
      
      if ( anim8.isDefined( subproperty ) )
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
   * @param {String} [unit]
   * @chainable
   */
  tweenTo: function(attr, target, options, unit)
  {
    this.convertExisting( attr, unit );
    anim8.fn.tweenTo.apply( this, arguments );
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
   * @param {Object} [units]
   * @chainable
   */
  tweenManyTo: function(targets, options, units)
  {
    this.convertExistingMany( units );
    anim8.fn.tweenManyTo.apply( this, arguments );
    anim8.override( this.units, units );
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
   * @param {String} [unit]
   * @chainable
   */
  tweenFrom: function(attr, starting, options, unit)
  {
    this.convertExisting( attr, unit );
    anim8.fn.tweenFrom.apply( this, arguments );
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
   * @param {Object} [units]
   * @chainable
   */
  tweenManyFrom: function(startings, options, units)
  {
    this.convertExistingMany( units );
    anim8.fn.tweenManyFrom.apply( this, arguments );
    anim8.override( this.units, units );
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
   * @param {String} [unit]
   * @chainable
   */
  tween: function(attr, starts, ends, options, unit)
  {
    this.convertExisting( attr, unit );
    anim8.fn.tween.apply( this, arguments );
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
   * @param {Object} [units]
   * @chainable
   */
  tweenMany: function(starts, ends, options, units)
  {
    this.convertExistingMany( units );
    anim8.fn.tweenMany.apply( this, arguments );
    anim8.override( this.units, units );
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
   * @param {String} [unit]
   * @chainable
   */
  move: function(attr, amount, options, unit)
  {
    this.convertExisting( attr, unit );
    anim8.fn.move.apply( this, arguments );
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
   * @param {Object} [units]
   * @chainable
   */
  moveMany: function(amounts, options, units)
  {
    this.convertExistingMany( units );
    anim8.fn.moveMany.apply( this, arguments );
    anim8.override( this.units, units );
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
   * @param {String} [unit]
   * @chainable
   */
  follow: function(attr, path, options, unit)
  {
    this.convertExisting( attr, unit );
    anim8.fn.follow.apply( this, arguments );
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
    if ( units && anim8.isObject( units ) )
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
