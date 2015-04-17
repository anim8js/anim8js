
/**
 * A factory for plain objects.
 */
anim8.FactoryPixi = function()
{
  this.priority = 3;
  this.attributes = {};
};

anim8.override( anim8.FactoryPixi.prototype = new anim8.Factory(),
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
      animator = new anim8.AnimatorPixi( subject );
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
      attribute = this.attributes[ attr ] = anim8.pixi.attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = anim8.calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );
      var dynamicName = attribute.dynamic;
      var dynamic = anim8.pixi.dynamic( dynamicName );

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
anim8.factory['pixi'] = new anim8.FactoryPixi();

anim8.AnimatorPixi = function( subject )
{
  this.reset( subject );
  this.dynamics = new anim8.FastMap();
};

anim8.override( anim8.AnimatorPixi.prototype = new anim8.Animator(),
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
 * Attributes defined in Pixi.js:
 * =============================================================================
 * AbstractFilter: 
 *    padding
 * AsciiFilter: 
 *    size
 * DisplayObjectContainer: 
 *    alpha, height, pivot(2d), position(2d), rotation, scale(2d), width, x, y
 * BlurFilter: 
 *    blur, blurX, blurY
 * Circle: 
 *    radius
 * ColorStepFilter: 
 *    step
 * DisplacementFilter: 
 *    offset(2d)
 * DotScreenFilter: 
 *    angle
 * Graphics: 
 *    blendMode, boundsPadding, fillAlpha, lineColor(rgba), lineWidth, tint(rgba)
 * GrayFilter: 
 *    gray
 * InvertFilter: 
 *    invert
 * Matrix: 
 *    a, b, c, d, tx, ty
 * NoiseFilter: 
 *    noise
 * PixelateFilter: 
 *    size
 * SepiaFilter: 
 *    sepia
 * SmartBlurFilter: 
 *    blur
 * Sprite: 
 *    anchor(2d)
 * Text.style: 
 *    fill(rgba), stroke, strokeThickness, wordWrapWidth, dropShadowAngle, dropShadowDistance
 * TilingSprite: 
 *    tilePosition, tileScale, tileScaleOffset
 * TiltShiftFilter: 
 *    end, gradientBlur, start
 */

/**
 * =============================================================================
 * Dynamic Attributes defined in anim8js
 * =============================================================================
 * number: scaleX, scaleY, pivotX, pivotY, offsetX, offsetY, anchorX, anchorY
 * 2d: dimension
 * rgba: 
 */

anim8.pixi = {};

anim8.pixi.getRGB = function(color)
{
  var r = anim8.clamp( Math.floor( color.r ), 0, 255 );
  var g = anim8.clamp( Math.floor( color.g ), 0, 255 );
  var b = anim8.clamp( Math.floor( color.b ), 0, 255 );

  return (r << 16) | (g << 8) | b;
};

anim8.pixi.attribute = function(attr)
{
  if ( anim8.isString( attr ) && attr in anim8.pixi.attribute )
  {
    return anim8.pixi.attribute[ attr ];
  }

  return anim8.pixi.attribute['default'];
}

// Attributes
anim8.pixi.attribute['default']      = {defaultValue: 0};
anim8.pixi.attribute.padding         = {defaultValue: 0};
anim8.pixi.attribute.sizeScalar      = {defaultValue: 0, dynamic: 'sizeScalar'};
anim8.pixi.attribute.alpha           = {defaultValue: 1};
anim8.pixi.attribute.height          = {defaultValue: 0};
anim8.pixi.attribute.pivot           = {defaultValue: 0, calculator: '2d'};
anim8.pixi.attribute.pivotX          = {defaultValue: 0, dynamic: 'pivotX'};
anim8.pixi.attribute.pivotY          = {defaultValue: 0, dynamic: 'pivotY'};
anim8.pixi.attribute.position        = {defaultValue: 0, calculator: '2d'};
anim8.pixi.attribute.rotation        = {defaultValue: 0};
anim8.pixi.attribute.scale           = {defaultValue: 1, calculator: '2d'};
anim8.pixi.attribute.scaleX          = {defaultValue: 1, dynamic: 'scaleX'};
anim8.pixi.attribute.scaleX          = {defaultValue: 1, dynamic: 'scaleY'};
anim8.pixi.attribute.width           = {defaultValue: 0};
anim8.pixi.attribute.dimension       = {defaultValue: 0, calculator:'2d', dynamic: 'dimension'};
anim8.pixi.attribute.x               = {defaultValue: 0};
anim8.pixi.attribute.y               = {defaultValue: 0};
anim8.pixi.attribute.blur            = {defaultValue: 2};
anim8.pixi.attribute.blurX           = {defaultValue: 2};
anim8.pixi.attribute.blurY           = {defaultValue: 2};
anim8.pixi.attribute.radius          = {defaultValue: 0};
anim8.pixi.attribute.step            = {defaultValue: 0};
anim8.pixi.attribute.offset          = {defaultValue: 0, calculator: '2d'};
anim8.pixi.attribute.offsetX         = {defaultValue: 0, dynamic: 'offsetX'};
anim8.pixi.attribute.offsetY         = {defaultValue: 0, dynamic: 'offsetY'};
anim8.pixi.attribute.angle           = {defaultValue: 0};
anim8.pixi.attribute.blendMode       = {defaultValue: 0};
anim8.pixi.attribute.boundsPadding   = {defaultValue: 0};
anim8.pixi.attribute.fillAlpha       = {defaultValue: 1};
anim8.pixi.attribute.lineColor       = {defaultValue: anim8.color(), calculator: 'rgba', dynamic: 'lineColor'};
anim8.pixi.attribute.lineWidth       = {defaultValue: 0};
anim8.pixi.attribute.tint            = {defaultValue: anim8.color(), calculator: 'rgb', dynamic: 'tint'};
anim8.pixi.attribute.gray            = {defaultValue: 1};
anim8.pixi.attribute.invert          = {defaultValue: 1};
anim8.pixi.attribute.a               = {defaultValue: 1};
anim8.pixi.attribute.b               = {defaultValue: 0};
anim8.pixi.attribute.c               = {defaultValue: 0};
anim8.pixi.attribute.d               = {defaultValue: 1};
anim8.pixi.attribute.tx              = {defaultValue: 0};
anim8.pixi.attribute.ty              = {defaultValue: 0};
anim8.pixi.attribute.noise           = {defaultValue: 0.5};
anim8.pixi.attribute.size            = {defaultValue: 10, calculator: '2d'};
anim8.pixi.attribute.sepia           = {defaultValue: 1};
anim8.pixi.attribute.anchor          = {defaultValue: 0, calculator: '2d'};
anim8.pixi.attribute.fill            = {defaultValue: anim8.color(), calculator: 'rgba', dynamic: 'fill'};
anim8.pixi.attribute.stroke          = {defaultValue: anim8.color(), calculator: 'rgba', dynamic: 'stroke'};
anim8.pixi.attribute.strokeThickness = {defaultValue: 0};
anim8.pixi.attribute.wordWrapWidth   = {defaultValue: 100};
anim8.pixi.attribute.dropShadowAngle = {defaultValue: Math.PI / 4};
anim8.pixi.attribute.dropShadowDistance = {defaultValue: 5};
anim8.pixi.attribute.dropShadowColor = {defaultValue: anim8.color(0,0,0), calculator:'rgba', dynamic: 'dropShadowColor'};
anim8.pixi.attribute.tilePosition    = {defaultValue: 0, calculator: '2d'};
anim8.pixi.attribute.tileScale       = {defaultValue: 1, calculator: '2d'};
anim8.pixi.attribute.tileScaleOffset = {defaultValue: 1, calculator: '2d'};
anim8.pixi.attribute.start           = {defaultValue: 0};
anim8.pixi.attribute.end             = {defaultValue: 0};
anim8.pixi.attribute.gradientBlur    = {defaultValue: 0};

// Dynamic Attributes
anim8.pixi.dynamic = function(nm)
{
  if ( anim8.isString( nm ) && nm in anim8.pixi.dynamic )
  {
    return anim8.pixi.dynamic[ nm ];
  }

  return false;
};

anim8.pixi.dynamic.scaleX = function(attr, subject)
{
  subject.scale.x = attr;
};

anim8.pixi.dynamic.scaleY = function(attr, subject)
{
  subject.scale.y = attr;
};

anim8.pixi.dynamic.pivotX = function(attr, subject)
{
  subject.pivot.x = attr;
};

anim8.pixi.dynamic.pivotY = function(attr, subject)
{
  subject.pivot.y = attr;
};

anim8.pixi.dynamic.offsetX = function(attr, subject)
{
  subject.offset.x = attr;
};

anim8.pixi.dynamic.offsetY = function(attr, subject)
{
  subject.offset.y = attr;
};

anim8.pixi.dynamic.dimension = function(attr, subject)
{
  subject.width = attr.x;
  subject.height = attr.y;
};

anim8.pixi.dynamic.color = function(attr, subject)
{
  subject.color = anim8.color.format( attr );
};

anim8.pixi.dynamic.lineColor = function(attr, subject)
{
  subject.lineColor = anim8.pixi.getRGB( attr );
};

anim8.pixi.dynamic.fill = function(attr, subject)
{
  subject.fill = anim8.color.format( attr );
};

anim8.pixi.dynamic.stroke = function(attr, subject)
{
  subject.stroke = anim8.color.format( attr );
};

anim8.pixi.dynamic.dropShadowColor = function(attr, subject)
{
  subject.dropShadowColor = anim8.color.format( attr );
};

anim8.pixi.dynamic.tint = function(attr, subject)
{
  subject.tint = anim8.pixi.getRGB( attr );
};

anim8.pixi.dynamic.sizeScalar = function(attr, subject)
{
  subject.size = attr;
};