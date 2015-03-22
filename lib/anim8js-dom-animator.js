
anim8.DomAnimator = function(e)
{
	this.reset( e );
  this.properties = {};
  this.trues = {};
  this.attributeToProperty = {};
  this.animating = {};
  this.units = {};
  this.cached = {};
  this.animation = null;
};

anim8.DomAnimator.prototype = new anim8.Animator();

anim8.DomAnimator.prototype.preupdate = function()
{
  if ( this.trues.length === 0 )
  {
    return;
  }
  
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
          ps[i] = this.frame[attr];
        }
      }
    
      e.path = p;
    }
    
    delete this.trues[ attr ];
  }
  
  for (var prop in this.properties)
  {
    var property = this.properties[ prop ];
    
    if ( anim8.isFunction( property.preset ) )
    {
      property.preset( this.e, this );
    }
  }
};

anim8.DomAnimator.prototype.onAnimation = function(animation, options, events)
{
  this.animation = animation;
};

anim8.DomAnimator.prototype.apply = function()
{
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
  }
  
  for (var attr in this.frame)
  {
    this.updated[ attr ] = false;
  }
  
  this.trimEvents();
};

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
  }
  
  this.attributes[ attr ] = attribute;
  this.properties[ prop ] = property;
  this.attributeToProperty[ attr ] = prop;
  
  if ( this.animation && this.animation.input && this.animation.input.units && attr in this.animation.input.units )
  {
    this.units[ attr ] = this.animation.input.units[ attr ];
  }
  else
  {
    this.units[ attr ] = attribute.defaultUnit;
  }
};

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
  this.units[ attr ] = attribute.defaultUnit;
};

anim8.DomAnimator.prototype.restore = function()
{
  for (var prop in this.properties)
  {
    this.properties[prop].unset( this.e, this );
  }
};

anim8.DomAnimator.prototype.cleanup = function()
{
	this.factory.cleanup( this );
  
  this.trigger('cleanup');
};

anim8.DomAnimator.prototype.set = function(attributes)
{
  var props = {};
  var updated = {};
  var units = {};
  
  for (var attr in attributes)
  {
    var attribute = anim8.attribute( attr );
    var prop      = anim8.coalesce( attribute.property, attr );
    var property  = anim8.property( prop );
    var calc      = anim8.calculator( attribute.calculator );
    var value     = attributes[ attr ];
    
    units[ attr ] = attribute.defaultUnit;
    
    if ( anim8.isString( value ) )
    {
      var parsed = anim8.parseValue( value, attribute.defaultUnit );
    
      if ( parsed !== false )
      {
        units[ attr ] = parsed.unit;
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
    
    cached: {},
    
    value: function(attr)
    {
      return attributes[ attr ] + this.unit( attr );
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
  
      return value + this.unit( attr );
    },
    
    unit: function(attr)
    {
      return units[ attr ] || '';
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
};

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
    units[ attr ] = attributes[ attr ] || attribute.defaultUnit;
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
      return units[ attr ] || '';
    }
  };
  
  for (var prop in props)
  {
    props[ prop ].get( this.e, flash );
  }
  
  return out;
};

anim8.DomAnimator.prototype.value = function(attr)
{
  return this.frame[ attr ] + this.unit( attr );
};

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
  
  return value + this.unit( attr );
};

anim8.DomAnimator.prototype.unit = function(attr)
{
  return ( this.units[ attr ] || '' );
};
