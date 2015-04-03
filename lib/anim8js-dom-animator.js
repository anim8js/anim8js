
/**
 * Instantiates a new DomAnimator given a subject.
 * 
 * @param {HTMLElement} e
 */
anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
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
anim8.override( anim8.DomAnimator.prototype = new anim8.Animator(),
{
  /**
   * A method thats invoked along with all other animators before updates are called.
   * This is used to make any necessary preparations before the animator is updated.
   *
   * If any events that were recently added have true values this is where we replace
   * this true values with the values currently on the subject.
   */
  preupdate: function()
  {
    // If there are events with paths that contain computed values we should
    // populate the frame directly from the HTML element.
    if ( this.computedUpdated )
    {
      var properties = {};
    
      for (var attr in this.computed)
      {
        if ( !(attr in this.frame) )
        {
          properties[ this.attributeToProperty[ attr ] ] = true;
      
          this.animating[ attr ] = false; 
        }
      }
      
      for (var prop in properties)
      {
        this.properties[ prop ].get( this.subject, this );
      }
    }

    // If a property currently being animated requires some heads up before it
    // gets or sets a value, notify it. TODO removed dead properties.
    for (var prop in this.properties)
    {
      var property = this.properties[ prop ];
      
      if ( anim8.isFunction( property.preset ) )
      {
        property.preset( this.subject, this );
      }
    }

    // Finish updating computed events, filling in the frame, and triggering.
    anim8.Animator.prototype.preupdate.apply( this, arguments );

    return this;
  },
    
  /**
   * Updates the animator with the current time. All events and springs in this
   * animator are updated.
   *
   * @param {number} now
   */
  update: function(now)
  {
    anim8.Animator.prototype.update.apply( this, arguments );
      
    this.getStyles();
    this.stylesUpdated = true;

    return this;
  },

  /**
   * A method invoked when an animation is about to be played in the Animator.
   * 
   * @param {anim8.Animation} animation
   * @param {object} options
   * @param {array:anim8.EventInstance} events
   */
  onAnimation: function(animation, options, events)
  {  
    if ( animation.input.units )
    {
      for (var i = 0; i < events.length; i++)
      {
        var e = events[i];
        var attr = e.attribute;
      
        if ( attr in animation.input.units )
        {
          e.unit = animation.input.units[ attr ];
        }
      }  
    }
  },

  /**
   * Builds the styles map in preparation to be applied.
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
        
        if ( prop in this.properties )
        {
          applyProperties[ prop ] = true; 
        }
      }
    }
    
    for (var prop in applyProperties)
    {
      this.properties[ prop ].set( this.subject, this );  
      
      this.styled = true;
    }
  },

  /**
   * Applies all updated attributes to the subject. This method is invoked with all of the other
   * animators at the end of the animation cycle.
   */
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
    
    this.trimEvents();

    return this;
  },
    
  /**
   * Places the event in this animator replacing any event that exists for the same
   * attribute. The next time the animator is updated the event will be started.
   *
   * @param {anim8.EventInstance} e
   */
  placeEvent: function( e )
  {
    anim8.Animator.prototype.placeEvent.apply( this, arguments );
    
    var attr = e.attribute;
    var attribute = this.attributes[ attr ];
    var prop = anim8.coalesce( attribute.property, attr );
    var property = anim8.dom.property( prop );
        
    this.properties[ prop ] = property;
    this.attributeToProperty[ attr ] = prop;
    this.units[ attr ] = e.unit || attribute.defaultUnit || '';

    return this;
  },
    
  /**
   * Places the spring in this animator replacing any spring that exists for the same
   * attribute. The next time the animator is updated the spring will be started.
   *
   * @param {anim8.Spring} s
   */
  placeSpring: function( s )
  {
    anim8.Animator.prototype.placeSpring.apply( this, arguments );
    
    var attr = s.attribute;
    var attribute = anim8.attribute( attr );
    var prop = anim8.coalesce( attribute.property, attr );
    var property = anim8.dom.property( prop );
    
    this.attributes[ attr ] = attribute;
    this.properties[ prop ] = property;
    this.attributeToProperty[ attr ] = prop;
    this.units[ attr ] = attribute.defaultUnit || '';

    return this;
  },
    
  /**
   * Restores any temporary state that may exist on this Animator that
   * is a result from animations.
   */
  restore: function()
  {
    for (var prop in this.properties)
    {
      this.properties[ prop ].unset( this.subject, this );
    }
  	
  	this.frame = {};

    return this;
  },

  /**
   * Sets the given attributes to this Animator immediately.
   *
   * @param {object} attributes
   */
  set: function(attributes)
  {
    var props = {};
    var updated = {};
    var units = {};
    var styles = {};
    
    for (var attr in attributes)
    {
      var attribute = anim8.attribute( attr );
      var prop      = anim8.coalesce( attribute.property, attr );
      var property  = anim8.dom.property( prop );
      var calc      = anim8.calculator( attribute.calculator );
      var value     = attributes[ attr ];
      
      units[ attr ] = attribute.defaultUnit || '';
      
      if ( anim8.isString( value ) )
      {
        var parsed = anim8.dom.parseValue( value, attribute.defaultUnit );
        
        if ( parsed !== false )
        {
          units[ attr ] = parsed.unit || attribute.defaultUnit || '';
          value = parsed.value;
        }  
      }
      
      var parsed = calc.parse( value, attribute.defaultValue );
      
      if ( parsed !== false )
      {
        props[ prop ] = property;
        attributes[ attr ] = parsed;
        updated[ attr ] = true;
      }
    }
      
    var flash = 
    {
      units: units,
       
      frame: attributes,
      
      updated: updated,
      
      styles: styles,
      
      cached: {},
      
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
   * Gets the current attribute values for all attributes specified. The argument must be an object
   * where the key is the name of an attribute and the value is the desired unit.
   *
   * @param {object} attributes
   */
  get: function(attributes)
  {
    var props = {};
    var animating = {};
    var units = {};
    var out = {};
    
    for (var attr in attributes)
    {    
      var attribute = anim8.attribute( attr );
      var prop      = anim8.coalesce( attribute.property, attr );
      var property  = anim8.dom.property( prop );
      var calc      = anim8.calculator( attribute.calculator );
      
      animating[ attr ] = false;    
      units[ attr ] = attributes[ attr ] || attribute.defaultUnit || '';
      props[ prop ] = property;
      out[ attr ] = calc.clone( attribute.defaultValue );
    }
    
    var flash = 
    {    
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
   * @param {string} attribute
   */
  ref: function(attribute, desiredUnit, relativeTo)
  {
    var animator = this;
    var request = {};
    
    return function()
    {
      if ( attribute in animator.frame && anim8.isNumber( animator.frame[ attribute ] ) )
      {
        return anim8.dom.convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
      }
      
      request[ attribute ] = desiredUnit;
      
      var current = animator.get( request );
      
      if ( anim8.isDefined( current[ attribute ] ) )
      {
        return current[ attribute ];
      }
      
      return anim8.attribute( attribute ).defaultValue;
    };
  },

  /**
   * Returns the value for the given attribute as a string with the current units.
   *
   * @param {string} attr
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
   * @param {string} attr
   * @param {string} other
   * @param [string] subproperty
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
  }

});
