anim8.attribute.padding                 = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingTop              = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingRight            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingBottom           = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.paddingLeft             = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.margin                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginTop               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginRight             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginBottom            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.marginLeft              = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderRadius            = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopLeftRadius     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopRightRadius    = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomLeftRadius  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomRightRadius = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.borderWidth             = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderTopWidth          = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderRightWidth        = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderBottomWidth       = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderLeftWidth         = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.outlineWidth						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.outlineOffset						= {defaultValue: 0};
anim8.attribute.textIndent							= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.borderSpacing						= {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.fontSize								= {defaultValue: 1, defaultUnit: 'em'};
anim8.attribute.lineHeight							= {defaultValue: 1, defaultUnit: 'em'};

anim8.attribute.origin                  = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'transformOrigin', calculator: '2d'};
anim8.attribute.originX                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};
anim8.attribute.originY                 = {defaultValue: 50, defaultUnit: '%', property: 'transformOrigin'};

anim8.attribute.opacity                 = {defaultValue: 1};
anim8.attribute.zIndex                  = {defaultValue: 1};

anim8.attribute.width                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minWidth                = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxWidth                = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.height                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.minHeight               = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.maxHeight               = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.angle                   = {defaultValue: 0, property: 'orbit'};
anim8.attribute.distance                = {defaultValue: 0, property: 'orbit'};
anim8.attribute.orbitOffset             = {defaultValue: {x:50, y:50}, defaultUnit: '%', property: 'orbitOffset', calculator: '2d'};

anim8.attribute.top                     = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.right                   = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.bottom                  = {defaultValue: 0, defaultUnit: 'px'};
anim8.attribute.left                    = {defaultValue: 0, defaultUnit: 'px'};

anim8.attribute.center                  = {defaultValue: {x:0, y:0}, defaultUnit: 'px', property: 'center', calculator: '2d'};
anim8.attribute.centerX                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};
anim8.attribute.centerY                 = {defaultValue: 0, defaultUnit: 'px', property: 'center'};

anim8.attribute.blur                    = {defaultValue: 0, property: 'filter', defaultUnit: 'px'};
anim8.attribute.sepia                   = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.brightness              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.grayscale               = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.contrast                = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.invert                  = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.saturation              = {defaultValue: 0, property: 'filter', defaultUnit: '%'};
anim8.attribute.hueRotate               = {defaultValue: 0, property: 'filter', defaultUnit: 'deg'};

anim8.attribute.rotate                  = {defaultValue: 0, property: 'transform', defaultUnit: 'deg'};
anim8.attribute.rotate3d                = {defaultValue: {x:0, y:0, z:1, angle:0}, property: 'transform', calculator: 'quaternion', defaultUnit: 'deg'};

anim8.attribute.translate               = {defaultValue: {x:0, y:0}, property: 'transform', calculator: '2d', defaultUnit: 'px'};
anim8.attribute.translateX              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateY              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translateZ              = {defaultValue: 0, property: 'transform', defaultUnit: 'px'};
anim8.attribute.translate3d             = {defaultValue: {x:0, y:0, z:0}, property: 'transform', calculator: '3d', defaultUnit: 'px'};

anim8.attribute.scale                   = {defaultValue: {x: 0, y:0}, property: 'transform', calculator: '2d'};
anim8.attribute.scaleX	                = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleY  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scaleZ  	              = {defaultValue: 1, property: 'transform'};
anim8.attribute.scale3d                 = {defaultValue: {x:1, y:1, z:1}, property: 'transform', calculator: '3d'};

anim8.attribute.skew                    = {defaultValue: {x:0, y:0}, defaultUnit: 'deg', property: 'transform', calculator: '2d'};
anim8.attribute.skewX                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};
anim8.attribute.skewY                   = {defaultValue: 0, defaultUnit: 'deg', property: 'transform'};

anim8.attribute.backface                = {defaultValue: 0};
anim8.attribute.visibility              = {defaultValue: 1};

anim8.attribute.backgroundColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.color                   = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderTopColor          = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderRightColor        = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderBottomColor       = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.borderLeftColor         = {defaultValue: anim8.color(), calculator: 'rgba'};
anim8.attribute.outlineColor            = {defaultValue: anim8.color(), calculator: 'rgba'};