
/**
 * Returns an attribute based on the given input. If the input is an object it's assumed to be an attribute and it's
 * returned immediately. If the input is a string the attribute with the given name is returned. Otherwise
 * the default attribute is returned.
 *
 * @param {object|string} attr
 */
anim8.dom.attribute = function(attr) 
{
  if ( anim8.isObject( attr ) && anim8.isDefined( attr.defaultValue ) ) 
  {
    return attr;
  }
  if ( anim8.isString( attr ) && attr in anim8.dom.attribute ) 
  {
    return anim8.dom.attribute[ attr ];
  }
  
  return anim8.dom.attribute.default;
};

/**
 * The default attribute.
 */
anim8.dom.attribute.default                 = {defaultValue: 0};

/**
 * All animatable attributes for DomAnimators & HTMLElements.
 */

anim8.dom.attribute.padding                 = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.margin                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.outlineWidth						= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.outlineOffset						= {defaultValue: 0};
anim8.dom.attribute.textIndent							= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.borderSpacing						= {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.fontSize								= {defaultValue: 1, defaultUnit: 'em'};
anim8.dom.attribute.lineHeight							= {defaultValue: 1, defaultUnit: 'em'};

anim8.dom.attribute.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
anim8.dom.attribute.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
anim8.dom.attribute.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

anim8.dom.attribute.opacity                 = {defaultValue: 1};
anim8.dom.attribute.zIndex                  = {defaultValue: 1};

anim8.dom.attribute.width                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.height                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.angle                   = {defaultValue: 0, property: 'orbit'};
anim8.dom.attribute.distance                = {defaultValue: 0, property: 'orbit'};
anim8.dom.attribute.orbitOffset             = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'orbitOffset', calculator: '2d'};

anim8.dom.attribute.top                     = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.right                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.dom.attribute.left                    = {defaultValue: 0, defaultUnit: 'px'};

anim8.dom.attribute.center                  = {defaultValue: {x:0, y:0}, defaultUnit: 'px', property: 'center', calculator: '2d'};
anim8.dom.attribute.centerX                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};
anim8.dom.attribute.centerY                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};

anim8.dom.attribute.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
anim8.dom.attribute.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.brightness              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.contrast                = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.dom.attribute.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

anim8.dom.attribute.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
anim8.dom.attribute.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

anim8.dom.attribute.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
anim8.dom.attribute.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.dom.attribute.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

anim8.dom.attribute.scale                   = {defaultValue: {x:1, y:1}, property: 'transform', calculator: '2d'};
anim8.dom.attribute.scaleX	                = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scaleY  	              = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scaleZ  	              = {defaultValue: 1, property: 'transform'};
anim8.dom.attribute.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

anim8.dom.attribute.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
anim8.dom.attribute.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
anim8.dom.attribute.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

anim8.dom.attribute.backface                = {defaultValue: 0};
anim8.dom.attribute.visibility              = {defaultValue: 1};

anim8.dom.attribute.backgroundColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.color                   = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderTopColor          = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderRightColor        = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderBottomColor       = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.borderLeftColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.dom.attribute.outlineColor            = {defaultValue: anim8.color(), calculator: 'rgba'};
