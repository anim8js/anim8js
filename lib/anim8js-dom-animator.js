
/**
 * Instantiates a new DomAnimator given a subject.
 * 
 * @param {HTMLElement} e
 */
anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
  this.trues = {};
  this.truesUpdated = false;
  this.attributeToProperty = {};
  this.animating = {};
  this.units = {};
  this.cached = {};
  this.styles = {};
  this.styled = false;
  this.stylesUpdated = false;
  this.animation = null;
};

/**
 * Extends anim8.Animator
 */
anim8.DomAnimator.prototype = new anim8.Animator();

/**
 * A method thats invoked along with all other animators before updates are called.
 * This is used to make any necessary preparations before the animator is updated.
 *
 * If any events that were recently added have true values this is where we replace
 * this true values with the values currently on the subject.
 */
anim8.DomAnimator.prototype.preupdate = function()
{
  if ( this.truesUpdated )
  {    
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
            ps[i] = this.frame[ attr ];
          }
        }
    
        e.path = p;
      }
    
      delete this.trues[ attr ];
    }
    
    this.truesUpdated = false;
  }
  
  for (var prop in this.properties)
  {
    var property = this.properties[ prop ];
    
    if ( anim8.isFunction( property.preset ) )
    {
      property.preset( this.e, this );
    }
  }
  
  this.trigger('preupdate');
};
  
/**
 * Updates the animator with the current time. All events and springs in this
 * animator are updated.
 *
 * @param {number} now
 */
anim8.DomAnimator.prototype.update = function(now)
{
  anim8.Animator.prototype.update.apply( this, arguments );
    
  this.getStyles();
  this.stylesUpdated = true;
};

/**
 * A method invoked when an animation is about to be played in the Animator.
 * 
 * @param {anim8.Animation} animation
 * @param {object} options
 * @param {array:anim8.EventInstance} events
 */
anim8.DomAnimator.prototype.onAnimation = function(animation, options, events)
{  
  if ( animation.input.units )
  {
    for (var i = 0; i < events.length; i++)
    {
      var e = events[i];
      var attr = e.attribute;
    
      if ( e.attribtue in animation.input.units )
      {
        e.unit = animation.input.units[ attr ];
      }
    }  
  }
};

/**
 * Builds the styles map in preparation to be applied.
 */
anim8.DomAnimator.prototype.getStyles = function()
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
    this.properties[ prop ].set( this.e, this );  
    
    this.styled = true;
  }
};

/**
 * Applies all updated attributes to the subject. This method is invoked with all of the other
 * animators at the end of the animation cycle.
 */
anim8.DomAnimator.prototype.apply = function()
{
  if ( !this.styled && !this.stylesUpdated )
  {
    this.getStyles();
  }
  
  if ( this.styled )
  {    
    for (var prop in this.styles)
    {
       this.e.style[ prop ] = this.styles[ prop ];
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
};
  
/**
 * Places the event in this animator replacing any event that exists for the same
 * attribute. The next time the animator is updated the event will be started.
 *
 * @param {anim8.EventInstance} e
 */
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
    this.truesUpdated = true;
  }
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  this.units[ attr ] = e.unit || attribute.defaultUnit || '';
};
  
/**
 * Places the spring in this animator replacing any spring that exists for the same
 * attribute. The next time the animator is updated the spring will be started.
 *
 * @param {anim8.Spring} s
 */
anim8.DomAnimator.prototype.placeSpring = function( s )
{
  anim8.Animator.prototype.placeSpring.apply( this, arguments );
  
  var attr = s.attribute;
  var attribute = anim8.attribute( attr );
  var prop = anim8.coalesce( attribute.property, attr );
  var property = anim8.property( prop );
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  this.units[ attr ] = attribute.defaultUnit || '';
};
  
/**
 * Restores any temporary state that may exist on this Animator that
 * is a result from animations.
 */
anim8.DomAnimator.prototype.restore = function()
{
  for (var prop in this.properties)
  {
    this.properties[prop].unset( this.e, this );
  }
};
  
/**
 * A method that is invoked when an animator is finished and is being removed from the list
 * of currently animating Animators.
 */
anim8.DomAnimator.prototype.cleanup = function()
{
  // this.factory.cleanup( this );
  
  this.trigger('cleanup');
};
  
/**
 * Sets the given attributes to this Animator immediately.
 *
 * @param {object} attributes
 */
anim8.DomAnimator.prototype.set = function(attributes)
{
  var props = {};
  var updated = {};
  var units = {};
  var styles = {};
  
  for (var attr in attributes)
  {
    var attribute = anim8.attribute( attr );
    var prop      = anim8.coalesce( attribute.property, attr );
    var property  = anim8.property( prop );
    var calc      = anim8.calculator( attribute.calculator );
    var value     = attributes[ attr ];
    
    units[ attr ] = attribute.defaultUnit || '';
    
    if ( anim8.isString( value ) )
    {
      var parsed = anim8.parseValue( value, attribute.defaultUnit );
      
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
      props[ prop ].preset( this.e, flash );
    }
  }
  
  for (var prop in props)
  {
    props[ prop ].set( this.e, flash );
  }
  
  for (var prop in styles)
  {
    this.e.style[ prop ] = styles[ prop ];
  }
};

/**
 * Gets the current attribute values for all attributes specified. The argument must be an object
 * where the key is the name of an attribute and the value is the desired unit.
 *
 * @param {object} attributes
 */
anim8.DomAnimator.prototype.get = function(attributes)
{
  var props = {};
  var animating = {};
  var units = {};
  var out = {};
  
  for (var attr in attributes)
  {    
    var attribute = anim8.attribute( attr );
    var prop      = anim8.coalesce( attribute.property, attr );
    var property  = anim8.property( prop );
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
    props[ prop ].get( this.e, flash );
  }
  
  return out;
};

/**
 * Returns a function that returns the current value for the given attribute when invoked.
 * 
 * @param {string} attribute
 */
anim8.DomAnimator.prototype.ref = function(attribute, desiredUnit, relativeTo)
{
  var animator = this;
  var request = {};
  
  return function()
  {
    if ( attribute in animator.frame && anim8.isNumber( animator.frame[ attribute ] ) )
    {
      return anim8.convert( animator.e, animator.value( attribute ), desiredUnit, relativeTo );
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
anim8.DomAnimator.prototype.value = function(attr)
{
  return this.frame[ attr ] + this.units[ attr ];
};

/**
 * Returns the value for the given attribute as a string with the current units.
 * if the attribute doesn't exist a secondary one is looked up. If that value
 * is an object and contains the given subproperty the value is resolved once again.
 *
 * @param {string} attr
 * @param {string} other
 * @param [string] subproperty
 */
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
  
  return value + this.units[ attr ];
};
