/* anim8js-easel 1.0.0 - anim8 EaselJS (http://www.createjs.com/easeljs) by Philip Diffenderfer */
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
  var isObject = anim8.isObject;
  var isArray = anim8.isArray;
  var isString = anim8.isString;

  var $calculator = anim8.calculator;


var Attributes = {};

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

// Defined
Attributes['default']      = {defaultValue: 0};
Attributes.alpha           = {defaultValue: 1};
Attributes.regX            = {defaultValue: 0};
Attributes.regY            = {defaultValue: 0};
Attributes.rotation        = {defaultValue: 0};
Attributes.scaleX          = {defaultValue: 1};
Attributes.scaleY          = {defaultValue: 1};
Attributes.skewX           = {defaultValue: 0};
Attributes.skewY           = {defaultValue: 0};
Attributes.x               = {defaultValue: 0};
Attributes.y               = {defaultValue: 0};
Attributes.lineHeight      = {defaultValue: 0};
Attributes.letterSpacing   = {defaultValue: 0};
Attributes.spaceWidth      = {defaultValue: 0};
Attributes.blurX           = {defaultValue: 0};
Attributes.blurY           = {defaultValue: 0};
Attributes.quality         = {defaultValue: 1};
Attributes.redMultiplier   = {defaultValue: 1};
Attributes.greenMultiplier = {defaultValue: 1};
Attributes.blueMultiplier  = {defaultValue: 1};
Attributes.alphaMultiplier = {defaultValue: 1};
Attributes.redOffset       = {defaultValue: 0};
Attributes.greenOffset     = {defaultValue: 0};
Attributes.blueOffset      = {defaultValue: 0};
Attributes.alphaOffset     = {defaultValue: 0};
Attributes.radius          = {defaultValue: 0};
Attributes.startAngle      = {defaultValue: 0};
Attributes.endAngle        = {defaultValue: 0};
Attributes.cp1x            = {defaultValue: 0};
Attributes.cp1y            = {defaultValue: 0};
Attributes.cp2x            = {defaultValue: 0};
Attributes.cp2y            = {defaultValue: 0};
Attributes.w               = {defaultValue: 0};
Attributes.h               = {defaultValue: 0};
Attributes.width           = {defaultValue: 0};
Attributes.height          = {defaultValue: 0};
Attributes.sides           = {defaultValue: 0};
Attributes.pointSize       = {defaultValue: 0};
Attributes.angle           = {defaultValue: 0};
Attributes.cpx             = {defaultValue: 0};
Attributes.cpy             = {defaultValue: 0};
Attributes.radiusTL        = {defaultValue: 0};
Attributes.radiusTR        = {defaultValue: 0};
Attributes.radiusBL        = {defaultValue: 0};
Attributes.radiusBR        = {defaultValue: 0};
Attributes.miterLimit      = {defaultValue: 0};
Attributes.offsetX         = {defaultValue: 0};
Attributes.offsetY         = {defaultValue: 0};
Attributes.blur            = {defaultValue: 0};
Attributes.framerate       = {defaultValue: 0};
Attributes.currentAnimationFrame = {defaultValue: 0};
Attributes.style           = {defaultValue: Color(), calculator:'rgba'};
Attributes.color           = {defaultValue: Color(), calculator:'rgba'};

// Dynamic
Attributes.cornerRadius    = {defaultValue: 0, dynamic: 'cornerRadius'};
Attributes.brightness      = {defaultValue: 0, dynamic: 'brightness'};
Attributes.contrast        = {defaultValue: 0, dynamic: 'contrast'};
Attributes.saturation      = {defaultValue: 0, dynamic: 'saturation'};
Attributes.hue             = {defaultValue: 0, dynamic: 'hue'};
Attributes.reg             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'reg'};
Attributes.position        = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'position'};
Attributes.offset          = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'offset'};
Attributes.cp              = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp'};
Attributes.cp1             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp1'};
Attributes.cp2             = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'cp2'};
Attributes.filterBlur      = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'filterBlur'};
Attributes.size            = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'size'};
Attributes.scale           = {defaultValue: {x:1, y:1}, calculator: '2d', dynamic:'scale'};
Attributes.skew            = {defaultValue: {x:0, y:0}, calculator: '2d', dynamic:'skew'};
Attributes.filterMultiplier= {defaultValue: Color(), calculator: 'rgba', dynamic:'filterMultiplier'};
Attributes.filterOffset    = {defaultValue: Color(), calculator: 'rgba', dynamic:'filterOffset'};


function $attribute(attr)
{
  if ( isString( attr ) && attr in Attributes )
  {
    return Attributes[ attr ];
  }

  return Attributes['default'];
}


var Dynamics = {};

Dynamics.style = function(attr, subject)
{
  subject.style = Color.format( attr );
};

Dynamics.color = function(attr, subject)
{
  subject.color = Color.format( attr );
};

Dynamics.cornerRadius = function(attr, subject)
{
  subject.radiusTL = attr;
  subject.radiusTR = attr;
  subject.radiusBL = attr;
  subject.radiusBR = attr;
};

Dynamics.brightness = function(attr, subject)
{
  subject.adjustBrightness( attr );
};

Dynamics.contrast = function(attr, subject)
{
  subject.adjustContrast( attr );
};

Dynamics.saturation = function(attr, subject)
{
  subject.adjustSaturation( attr );
};

Dynamics.hue = function(attr, subject)
{
  subject.adjustHue( attr );
};

Dynamics.reg = function(attr, subject)
{
  subject.regX = attr.x;
  subject.regY = attr.y;
};

Dynamics.position = function(attr, subject)
{
  subject.x = attr.x;
  subject.y = attr.y;
};

Dynamics.offset = function(attr, subject)
{
  subject.offsetX = attr.x;
  subject.offsetY = attr.y;
};

Dynamics.cp = function(attr, subject)
{
  subject.cpx = attr.x;
  subject.cpy = attr.y;
};

Dynamics.cp1 = function(attr, subject)
{
  subject.cp1x = attr.x;
  subject.cp1y = attr.y;
};

Dynamics.cp2 = function(attr, subject)
{
  subject.cp2x = attr.x;
  subject.cp2y = attr.y;
};

Dynamics.filterBlur = function(attr, subject)
{
  subject.blurX = attr.x;
  subject.blurY = attr.y;
};

Dynamics.size = function(attr, subject)
{
  subject.w = subject.width  = attr.x;
  subject.h = subject.height = attr.y;
};

Dynamics.scale = function(attr, subject)
{
  subject.scaleX = attr.x;
  subject.scaleY = attr.y;
};

Dynamics.skew = function(attr, subject)
{
  subject.skewX = attr.x;
  subject.skewY = attr.y;
};

Dynamics.filterMultiplier = function(attr, subject)
{
  subject.redMultiplier   = attr.r;
  subject.greenMultiplier = attr.g;
  subject.blueMultiplier  = attr.b;
  subject.alphaMultiplier = attr.a;
};

Dynamics.filterOffset = function(attr, subject)
{
  subject.redOffset   = attr.r;
  subject.greenOffset = attr.g;
  subject.blueOffset  = attr.b;
  subject.alphaOffset = attr.a;
};


// Dynamic Fields
function $dynamic(nm)
{
  if ( isString( nm ) && nm in Dynamics )
  {
    return Dynamics[ nm ];
  }

  return false;
}

function FactoryEasel()
{
  this.priority = 3;
  this.attributes = {};
}

Class.extend( FactoryEasel, Factory,
{
  is: function(subject)
  {
    return isObject( subject ) && !isArray( subject );
  },

  animatorFor: function(subject)
  {
    var animator = subject.$animator;

    if ( !animator )
    {
      animator = new AnimatorEasel( subject );
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
      attribute = this.attributes[ attr ] = $attribute( attr );

      var calculatorName = attribute.calculator;
      var calculator = $calculator( calculatorName );
      var defaultValue = calculator.parse( attribute.defaultValue, calculator.ZERO );
      var dynamicName = attribute.dynamic;
      var dynamic = $dynamic( dynamicName );

      attribute.calculatorName = calculatorName;
      attribute.calculator = calculator;
      attribute.defaultValue = defaultValue;
      attribute.name = attr;
      attribute.dynamicName = dynamicName;
      attribute.dynamic = dynamic;
      attribute.parse = function(value, ignoreRelative) {
        return this.calculator.parse( value, this.defaultValue, ignoreRelative );
      };
      attribute.cloneDefault = function() {
        return this.calculator.clone( this.defaultValue );
      };
    }

    return attribute;
  }
});


function AnimatorEasel( subject )
{
  this.reset( subject );
  this.dynamics = new FastMap();
}

Class.extend( AnimatorEasel, Animator,
{

  placeAttrimator: function( attrimator )
  {
    this._placeAttrimator( attrimator );

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
    this._apply();

    return this;
  }

});



  // Register Factory
  anim8.Factories['easel'] = new FactoryEasel();

  // Classes
  anim8.AnimatorEasel = AnimatorEasel;
  anim8.FactoryEasel = FactoryEasel;

  // Namespace
  anim8.easel = {
    Attributes:           Attributes,
    attribute:            $attribute,
    Dynamics:             Dynamics,
    dynamic:              $dynamic
  };

  return anim8;

}));
