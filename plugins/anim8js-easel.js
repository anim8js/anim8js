
/**
 * A factory for plain objects.
 */
anim8.FactoryEasel = function()
{
  this.priority = 3;
  this.attributes = {};
};

anim8.override( anim8.FactoryEasel.prototype = new anim8.Factory(),
{
  is: function(subject)
  {
    return anim8.isObject( subject ) && !anim8.isArray( subject );
  },
  animatorFor: function(subject)
  {
    var animator = subject.$animator;
      
    if ( !animator )
    {
      animator = new anim8.AnimatorEasel( subject );
      animator.factory = this;      
      
      subject.$animator = animator;
    }
    
    return animator;
  },
  destroy: function(animator)
  {
    delete animator.subject.$animator;
  },
  attribute: function(attr)
  {
    var attribute = this.attributes[ attr ];

    if ( !attribute )
    {
      attribute = this.attributes[ attr ] = anim8.easel.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = anim8.calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );
      var dynamicName = attribute.dynamic;
      var dynamic = anim8.easel.dynamic( dynamicName );

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.dynamicName = dynamicName;
      attribute.dynamic = dynamic;
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

/**
 * Registers the object factory.
 */
anim8.factory['easeljs'] = new anim8.FactoryEasel();

anim8.AnimatorEasel = function( subject )
{
  this.reset( subject );
  this.dynamics = new anim8.FastMap();
};

anim8.override( anim8.AnimatorEasel.prototype = new anim8.Animator(),
{
  placeAttrimator: function( attrimator )
  {
    anim8.fn.placeAttrimator.apply( this, arguments );
    
    // Place any dynamic function on this animator.
    var attr = attrimator.attribute;
    var attribute = this.getAttribute( attr );
    var dynamic = attribute.dynamic;

    if ( dynamic )
    {
      this.dynamics.put( attr, dynamic );
    }

    return this;
  },
  apply: function()
  {
    // If a dynamic attribute has been updated, call the dynamic function and
    // mark the attribute as not needing to be updated.
    for (var attr in this.frame)
    {
      var dynamic = this.dynamics.get( attr );

      if ( this.updated[ attr ] && dynamic )
      {
        dynamic( this.frame[ attr ], this.subject );

        this.updated[ attr ] = false;
      }
    }

    // Call the parent apply
    anim8.fn.apply.apply( this, arguments );

    return this;
  }
});

/**
 * =============================================================================
 * Attributes defined in EaselJS:
 * =============================================================================
 * DisplayObject:
 *    alpha, regX, regY, rotation, scaleX, scaleY, skewX, 
 *    skewY, x, y, 
 * BitmapText (DisplayObject):
 *    lineHeight, letterSpacing, spaceWidth
 * BlurFilter:
 *    blurX, blurY, quality
 * ColorFilter:
 *    redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier,
 *    redOffset, greenOffset, blueOffset, alphaOffset    
 * Graphics.Arc:
 *    x, y, radius, startAngle, endAngle
 * Graphics.BezierCurveTo:
 *    cp1x, cp1y, cp2x, cp2y, x, y
 * Graphics.Circle:
 *    x, y, radius
 * Graphics.Ellipse:
 *    x, y, w, h
 * Graphics.Fill:
 *    style (color)
 * Graphics.LineTo:
 *    x, y
 * Graphics.MoveTo:
 *    x, y
 * Graphics.PolyStar:
 *    x, y, radius, sides, pointSize, angle
 * Graphics.QuadraticCurveTo:
 *    cpx, cpy, x, y
 * Graphics.Rect:
 *    x, y, w, h
 * Graphics.RoundRect:
 *    x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL
 * Graphics.Stroke:
 *    style (color)
 * Graphics.StrokeStyle:
 *    width, miterLimit
 * Point:
 *    x, y
 * Rectangle:
 *    x, y, width, height
 * Shadow:
 *    color, offsetX, offsetY, blur
 * Sprite:
 *    currentAnimationFrame, framerate
 * SpriteSheet:
 *    framerate
 * Text:
 *    color
 */

/**
 * =============================================================================
 * Dynamic Attributes defined in anim8js
 * =============================================================================
 * number: cornerRadius, ColorMatrix{brightness, contrast, saturation, hue}
 * 2d: reg, position, offset, cp, cp1, cp2, filterBlur, size, scale, skew
 * rgba: filterMultiplier, filterOffset
 */

anim8.easel = {};

anim8.easel.attribute = function(attr)
{
  if ( anim8.isString( attr ) && attr in anim8.easel.attribute )
  {
    return anim8.easel.attribute[ attr ];
  }

  return anim8.easel.attribute['default'];
}

// Defined
anim8.easel.attribute['default']      = {defaultValue: 0};
anim8.easel.attribute.alpha           = {defaultValue: 1};
anim8.easel.attribute.regX            = {defaultValue: 0};
anim8.easel.attribute.regY            = {defaultValue: 0};
anim8.easel.attribute.rotation        = {defaultValue: 0};
anim8.easel.attribute.scaleX          = {defaultValue: 1};
anim8.easel.attribute.scaleY          = {defaultValue: 1};
anim8.easel.attribute.skewX           = {defaultValue: 0};
anim8.easel.attribute.skewY           = {defaultValue: 0};
anim8.easel.attribute.x               = {defaultValue: 0};
anim8.easel.attribute.y               = {defaultValue: 0};
anim8.easel.attribute.lineHeight      = {defaultValue: 0};
anim8.easel.attribute.letterSpacing   = {defaultValue: 0};
anim8.easel.attribute.spaceWidth      = {defaultValue: 0};
anim8.easel.attribute.blurX           = {defaultValue: 0};
anim8.easel.attribute.blurY           = {defaultValue: 0};
anim8.easel.attribute.quality         = {defaultValue: 1};
anim8.easel.attribute.redMultiplier   = {defaultValue: 1};
anim8.easel.attribute.greenMultiplier = {defaultValue: 1};
anim8.easel.attribute.blueMultiplier  = {defaultValue: 1};
anim8.easel.attribute.alphaMultiplier = {defaultValue: 1};
anim8.easel.attribute.redOffset       = {defaultValue: 0};
anim8.easel.attribute.greenOffset     = {defaultValue: 0};
anim8.easel.attribute.blueOffset      = {defaultValue: 0};
anim8.easel.attribute.alphaOffset     = {defaultValue: 0};
anim8.easel.attribute.radius          = {defaultValue: 0};
anim8.easel.attribute.startAngle      = {defaultValue: 0};
anim8.easel.attribute.endAngle        = {defaultValue: 0};
anim8.easel.attribute.cp1x            = {defaultValue: 0};
anim8.easel.attribute.cp1y            = {defaultValue: 0};
anim8.easel.attribute.cp2x            = {defaultValue: 0};
anim8.easel.attribute.cp2y            = {defaultValue: 0};
anim8.easel.attribute.w               = {defaultValue: 0};
anim8.easel.attribute.h               = {defaultValue: 0};
anim8.easel.attribute.width           = {defaultValue: 0};
anim8.easel.attribute.height          = {defaultValue: 0};
anim8.easel.attribute.sides           = {defaultValue: 0};
anim8.easel.attribute.pointSize       = {defaultValue: 0};
anim8.easel.attribute.angle           = {defaultValue: 0};
anim8.easel.attribute.cpx             = {defaultValue: 0};
anim8.easel.attribute.cpy             = {defaultValue: 0};
anim8.easel.attribute.radiusTL        = {defaultValue: 0};
anim8.easel.attribute.radiusTR        = {defaultValue: 0};
anim8.easel.attribute.radiusBL        = {defaultValue: 0};
anim8.easel.attribute.radiusBR        = {defaultValue: 0};
anim8.easel.attribute.miterLimit      = {defaultValue: 0};
anim8.easel.attribute.offsetX         = {defaultValue: 0};
anim8.easel.attribute.offsetY         = {defaultValue: 0};
anim8.easel.attribute.blur            = {defaultValue: 0};
anim8.easel.attribute.framerate       = {defaultValue: 0};
anim8.easel.attribute.currentAnimationFrame = {defaultValue: 0};

// Dynamic
anim8.easel.attribute.style           = {defaultValue: anim8.color(), calculator:'rgba'};
anim8.easel.attribute.color           = {defaultValue: anim8.color(), calculator:'rgba'};
anim8.easel.attribute.cornerRadius    = {defaultValue: 0, dynamic: 'cornerRadius'};
anim8.easel.attribute.brightness      = {defaultValue: 0, dynamic: 'brightness'};
anim8.easel.attribute.contrast        = {defaultValue: 0, dynamic: 'contrast'};
anim8.easel.attribute.saturation      = {defaultValue: 0, dynamic: 'saturation'};
anim8.easel.attribute.hue             = {defaultValue: 0, dynamic: 'hue'};
anim8.easel.attribute.reg             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'reg'};
anim8.easel.attribute.position        = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'position'};
anim8.easel.attribute.offset          = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'offset'};
anim8.easel.attribute.cp              = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp'};
anim8.easel.attribute.cp1             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp1'};
anim8.easel.attribute.cp2             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp2'};
anim8.easel.attribute.filterBlur      = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'filterBlur'};
anim8.easel.attribute.size            = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'size'};
anim8.easel.attribute.scale           = {defaultValue: {x:1, y:1}, calculator: '2d', dynamic:'scale'};
anim8.easel.attribute.skew            = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'skew'};
anim8.easel.attribute.filterMultiplier= {defaultValue: anim8.color(), calculator: 'rgba', dynamic:'filterMultiplier'};
anim8.easel.attribute.filterOffset    = {defaultValue: anim8.color(), calculator: 'rgba', dynamic:'filterOffset'};


// Dynamic Fields
anim8.easel.dynamic = function(nm)
{
  if ( anim8.isString( nm ) && nm in anim8.easel.dynamic )
  {
    return anim8.easel.dynamic[ nm ];
  }

  return false;
};

anim8.easel.dynamic.style = function(attr, subject)
{
  subject.style = anim8.color.format( attr );
};

anim8.easel.dynamic.color = function(attr, subject)
{
  subject.color = anim8.color.format( attr );
};

anim8.easel.dynamic.cornerRadius = function(attr, subject)
{
  subject.radiusTL = attr;
  subject.radiusTR = attr;
  subject.radiusBL = attr;
  subject.radiusBR = attr;
};

anim8.easel.dynamic.brightness = function(attr, subject)
{
  subject.adjustBrightness( attr );
};

anim8.easel.dynamic.contrast = function(attr, subject)
{
  subject.adjustContrast( attr );
};

anim8.easel.dynamic.saturation = function(attr, subject)
{
  subject.adjustSaturation( attr );
};

anim8.easel.dynamic.hue = function(attr, subject)
{
  subject.adjustHue( attr );
};

anim8.easel.dynamic.reg = function(attr, subject)
{
  subject.regX = attr.x;
  subject.regY = attr.y;
};

anim8.easel.dynamic.position = function(attr, subject)
{
  subject.x = attr.x;
  subject.y = attr.y;
};

anim8.easel.dynamic.offset = function(attr, subject)
{
  subject.offsetX = attr.x;
  subject.offsetY = attr.y;
};

anim8.easel.dynamic.cp = function(attr, subject)
{
  subject.cpx = attr.x;
  subject.cpy = attr.y;
};

anim8.easel.dynamic.cp1 = function(attr, subject)
{
  subject.cp1x = attr.x;
  subject.cp1y = attr.y;
};

anim8.easel.dynamic.cp2 = function(attr, subject)
{
  subject.cp2x = attr.x;
  subject.cp2y = attr.y;
};

anim8.easel.dynamic.filterBlur = function(attr, subject)
{
  subject.blurX = attr.x;
  subject.blurY = attr.y;
};

anim8.easel.dynamic.size = function(attr, subject)
{
  subject.w = subject.width  = attr.x;
  subject.h = subject.height = attr.y;
};

anim8.easel.dynamic.scale = function(attr, subject)
{
  subject.scaleX = attr.x;
  subject.scaleY = attr.y;
};

anim8.easel.dynamic.skew = function(attr, subject)
{
  subject.skewX = attr.x;
  subject.skewY = attr.y;
};

anim8.easel.dynamic.filterMultiplier = function(attr, subject)
{
  subject.redMultiplier   = attr.r;
  subject.greenMultiplier = attr.g;
  subject.blueMultiplier  = attr.b;
  subject.alphaMultiplier = attr.a;
};

anim8.easel.dynamic.filterOffset = function(attr, subject)
{
  subject.redOffset   = attr.r;
  subject.greenOffset = attr.g;
  subject.blueOffset  = attr.b;
  subject.alphaOffset = attr.a;
};
