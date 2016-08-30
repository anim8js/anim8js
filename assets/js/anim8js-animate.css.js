/* anim8js-animate.css 1.0.0 - anim8 your HTML elements with animate.css animations by Philip Diffenderfer */
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

  var save = anim8.save;


/**
 * Animate.css animations in anim8js.
 *
 * http://daneden.github.io/animate.css/
 */

save('bounce', {
  keyframe: {
    '0,20,53,80,100': {
      translate: 0,
      easing: [0.215, 0.610, 0.355, 1.000]
    },
    '40,43': {
      translate: {y:-30},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '70': {
      translate: {y:-15},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '90': {
      translate: {y:-4}
    }
  }
});

save('rubberBand', {
  keyframe: {
    '0,100': {
      scale: 1
    },
    '30': {
      scale: {x:1.25, y:0.75}
    },
    '40': {
      scale: {x:0.75, y:1.25}
    },
    '50': {
      scale: {x:1.15, y:0.85}
    },
    '65': {
      scale: {x:0.95, y:1.05}
    },
    '75': {
      scale: {x:1.05, y:0.95}
    }
  },
  scaleBases: {
    scale: 1
  }
});

save('flash', {
  keyframe: {
    '0,50,100': {
      opacity: 1
    },
    '25,75': {
      opacity: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

save('pulse', {
  keyframe: {
    '0': {
      scale: 1
    },
    '50': {
      scale: 1.05
    },
    '100': {
      scale: 1
    }
  },
  scaleBases: {
    scale: 1
  }
});

save('shake', {
  keyframe: {
    '0,100': {
      translateX: 0.0
    },
    '10,30,50,70,90': {
      translateX: -10.0
    },
    '20,40,60,80': {
      translateX: 10.0
    }
  }
});

save('swing', {
  keyframe: {
    '0': {
      rotate: 0
    },
    '20': {
      rotate: 15
    },
    '40': {
      rotate: -10
    },
    '60': {
      rotate: 5
    },
    '80': {
      rotate: -5
    },
    '100': {
      rotate: 0
    }
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'center top'
  }
});

save('tada', {
  keyframe: {
    '0,100': {
      scale: 1,
      rotate: 0
    },
    '10,20': {
      scale: 0.9,
      rotate: -3
    },
    '30,50,70,90': {
      scale: 1.1,
      rotate: 3
    },
    '40,60,80': {
      scale: 1.1,
      rotate: -3
    }
  },
  scaleBases: {
    scale: 1
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

save('wobble', {
  keyframe: {
    '0,100': {
      translateX: 0,
      rotate: 0
    },
    '15': {
      translateX: -25,
      rotate: -5
    },
    '30': {
      translateX: 20,
      rotate: 3
    },
    '45': {
      translateX: -15,
      rotate: -3
    },
    '60': {
      translateX: 10,
      rotate: 2
    },
    '75': {
      translateX: -5,
      rotate: -1
    }
  },
  units: {
    translateX: '%'
  }
});

save('bounceIn', {
  keyframe: {
    '0': {
      opacity: 0.0,
      scale: 0.3
    },
    '20': {
      scale: 1.1
    },
    '40': {
      scale: 0.9
    },
    '60': {
      opacity: 1,
      scale: 1.03
    },
    '80': {
      scale: 0.97
    },
    '100': {
      opacity: 1.0,
      scale: 1
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
}, {
  easing: [0.215, 0.610, 0.355, 1.000]
});

save('bounceInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -3000
    },
    '60': {
      opacity: 1,
      translateY: 25
    },
    '75': {
      translateY: -10
    },
    '90': {
      translateY: 5
    },
    '100': {
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
}, {
  duration: 2000,
  easing: [0.215, 0.610, 0.355, 1.000]
});

save('bounceInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -3000
    },
    '60': {
      opacity: 1,
      translateX: 25
    },
    '75': {
      translateX: -10
    },
    '90': {
      translateX: 5
    },
    '100': {
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
}, {
  duration: 2000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});


save('bounceInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 3000
    },
    '60': {
      opacity: 1,
      translateX: -25
    },
    '75': {
      translateX: 10
    },
    '90': {
      translateX: -5
    },
    '100': {
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
}, {
  duration: 2000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});

save('bounceInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 3000
    },
    '60': {
      opacity: 1,
      translateY: -25
    },
    '75': {
      translateY: 10
    },
    '90': {
      translateY: -5
    },
    '100': {
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
}, {
  duration: 1000,
  teasing: [0.215, 0.610, 0.355, 1.000]
});

save('bounceOut', {
  keyframe: {
    '0': {
      scale: 1
    },
    '20': {
      scale: 0.9
    },
    '50,55': {
      opacity: 1,
      scale: 1.1
    },
    '100': {
      opacity: 0,
      scale: 0.3
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
}, {
  duration: 750
});

save('bounceOutDown', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '20': {
      translateY: 10
    },
    '40,45': {
      opacity: 1,
      translateY: -20
    },
    '100': {
      opacity: 0,
      translateY: 2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('bounceOutLeft', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '20': {
      opacity: 1,
      translateX: 20
    },
    '100': {
      opacity: 0,
      translateX: -2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('bounceOutRight', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '20': {
      opacity: 1,
      translateX: -20
    },
    '100': {
      opacity: 0,
      translateX: 2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('bounceOutUp', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '20': {
      translateY: -10
    },
    '40,45': {
      opacity: 1,
      translateY: 20
    },
    '100': {
      opacity: 0,
      translateY: -2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeIn', {
  keyframe: {
    '0': {
      opacity: 0
    },
    '100': {
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -100
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateY: '%'
  }
});

save('fadeInDownBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: -2000
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -100
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

save('fadeInLeftBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -2000
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 100
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

save('fadeInRightBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: 2000
    },
    '100': {
      opacity: 1,
      translateX: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 100
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateY: '%'
  }
});

save('fadeInUpBig', {
  keyframe: {
    '0': {
      opacity: 0,
      translateY: 2000
    },
    '100': {
      opacity: 1,
      translateY: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeOut', {
  keyframe: {
    '0': {
      opacity: 1
    },
    '100': {
      opacity: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeOutDown', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: 100
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateY: '%'
  }
});

save('fadeOutDownBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: 2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeOutLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: -100
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

save('fadeOutLeftBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: -2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeOutRight', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: 100
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

save('fadeOutRightBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0
    },
    '100': {
      opacity: 0,
      translateX: 2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('fadeOutUp', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: -100
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateY: '%'
  }
});

save('fadeOutUpBig', {
  keyframe: {
    '0': {
      opacity: 1,
      translateY: 0
    },
    '100': {
      opacity: 0,
      translateY: -2000
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('flip', {
  keyframe: {
    '0': {
      translateZ: 0,
      rotate3d: {x:0, y:1, z:0, angle:-360},
      scale: 1,
      easing: 'cssEaseOut'
    },
    '40': {
      translateZ: 150,
      rotate3d: {x:0, y:1, z:0, angle:-190},
      easing: 'cssEaseOut'
    },
    '50': {
      translateZ: 150,
      rotate3d: {x:0, y:1, z:0, angle:-170},
      easing: 'cssEaseIn'
    },
    '80': {
      translateZ: 0,
      rotate3d: {x:0, y:1, z:0, angle:0},
      scale: 0.95,
      easing: 'cssEaseIn'
    },
    '100': {
      scale: 1
    }
  },
  scaleBases: {
    scale: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

save('flipInX', {
  keyframe: {
    '0': {
      opacity: 0,
      rotate3d: {x:1, y:0, z:0, angle:90},
      easing: 'cssEaseIn'
    },
    '40': {
      rotate3d: {x:1, y:0, z:0, angle:-20},
      easing: 'cssEaseIn'
    },
    '60': {
      opacity: 1,
      rotate3d: {x:1, y:0, z:0, angle:10}
    },
    '80': {
      rotate3d: {x:1, y:0, z:0, angle:-5}
    },
    '100': {
      rotate3d: {x:1, y:0, z:0, angle:0}
    }
  },
  scaleBases: {
    opacity: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

save('flipInY', {
  keyframe: {
    '0': {
      opacity: 0,
      rotate3d: {x:0, y:1, z:0, angle:90},
      easing: 'cssEaseIn'
    },
    '40': {
      rotate3d: {x:0, y:1, z:0, angle:-20},
      easing: 'cssEaseIn'
    },
    '60': {
      opacity: 1,
      rotate3d: {x:0, y:1, z:0, angle:10}
    },
    '80': {
      rotate3d: {x:0, y:1, z:0, angle:-5}
    },
    '100': {
      rotate3d: {x:0, y:1, z:0, angle:0}
    }
  },
  scaleBases: {
    opacity: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

save('flipOutX', {
  keyframe: {
    '0': {
      rotate3d: {x:1, y:0, z:0, angle:0}
    },
    '30': {
      opacity: 1,
      rotate3d: {x:1, y:0, z:0, angle:-20}
    },
    '100': {
      opacity: 0,
      rotate3d: {x:1, y:0, z:0, angle:90}
    }
  },
  scaleBases: {
    opacity: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
}, {
  duration: 750
});

save('flipOutY', {
  keyframe: {
    '0': {
      rotate3d: {x:0, y:1, z:0, angle:0}
    },
    '30': {
      opacity: 1,
      rotate3d: {x:0, y:1, z:0, angle:-20}
    },
    '100': {
      opacity: 0,
      rotate3d: {x:0, y:1, z:0, angle:90}
    }
  },
  scaleBases: {
    opacity: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
}, {
  duration: 750
});

save('lightSpeedIn', {
  keyframe: {
    '0': {
      translateX: 100,
      skewX: -30,
      opacity: 0
    },
    '60': {
      skewX: 20,
      opacity: 1
    },
    '80': {
      skewX: -5
    },
    '100': {
      translateX: 0,
      skewX: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
}, {
  easing: 'cssEaseOut'
});

save('lightSpeedOut', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0,
      skewX: 0
    },
    '100': {
      opacity: 0,
      translateX: 100,
      skewX: 30
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
}, {
  easing: 'cssEaseIn'
});

save('rotateIn', {
  keyframe: {
    '0': {
      rotate: -200,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'center'
  }
});

save('rotateInDownLeft', {
  keyframe: {
    '0': {
      rotate: -45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'left bottom'
  }
});

save('rotateInDownRight', {
  keyframe: {
    '0': {
      rotate: 45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'right bottom'
  }
});

save('rotateInUpLeft', {
  keyframe: {
    '0': {
      rotate: 45,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'left bottom'
  }
});

save('rotateInUpRight', {
  keyframe: {
    '0': {
      rotate: -90,
      opacity: 0
    },
    '100': {
      rotate: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1
  },
  initial: {
    origin: 'right bottom'
  }
});

save('rotateOut', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 200
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'center'
  }
});

save('rotateOutDownLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 45
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'left bottom'
  }
});

save('rotateOutDownRight', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: -45
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'right bottom'
  }
});

save('rotateOutUpLeft', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: -45
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'left bottom'
  }
});

save('rotateOutUpRight', {
  keyframe: {
    '0': {
      opacity: 1,
      rotate: 0
    },
    '100': {
      opacity: 0,
      rotate: 90
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'right bottom'
  }
});

save('hinge', {
  keyframe: {
    '0': {
      rotate: 0
    },
    '20,60': {
      rotate: 80
    },
    '40': {
      rotate: 60
    },
    '80': {
      rotate: 60,
      translateY: 0,
      opacity: 1
    },
    '100': {
      rotate: 0,
      translateY: 700,
      opacity: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  scales: {
    origin: 1.0
  },
  initial: {
    origin: 'top left'
  }
}, {
  easing: 'cssEaseInOut',
  duration: 2000
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

save('rollIn', {
  keyframe: {
    '0': {
      opacity: 0,
      translateX: -100,
      rotate: -120
    },
    '100': {
      opacity: 1,
      translateX: 0,
      rotate: 0
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

save('rollOut', {
  keyframe: {
    '0': {
      opacity: 1,
      translateX: 0,
      rotate: 0
    },
    '100': {
      opacity: 0.0,
      translateX: 100,
      rotate: 120
    }
  },
  scaleBases: {
    opacity: 1
  },
  units: {
    translateX: '%'
  }
});

save('zoomIn', {
  keyframe: {
    '0': {
      opacity: 0,
      scale: 0.3
    },
    '50': {
      opacity: 1
    },
    '100': {
      scale: 1
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
});

save('zoomInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      scale: 0.1,
      translateY: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale: 0.475,
      translateY: 60,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale: 1,
      translateY: 0
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
});

save('zoomInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      scale: 0.1,
      translateX: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale: 0.475,
      translateX: 10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale: 1,
      translateX: 0
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
});

save('zoomInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      scale: 0.1,
      translateX: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale: 0.475,
      translateX: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale: 1,
      translateX: 0
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
});

save('zoomInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      scale: 0.1,
      translateY: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale: 0.475,
      translateY: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale: 1,
      translateY: 0
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
});

save('zoomOut', {
  keyframe: {
    '0': {
      opacity: 1,
      scale: 1
    },
    '100': {
      opacity: 0,
      scale: 0.3
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  }
}, {
  duration: '500ms'
});

save('zoomOutDown', {
  keyframe: {
    '0': {
      scale: 1,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale: 0.475,
      translateY: -60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale: 0.1,
      translateY: 2000,
      origin: 'center bottom'
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

save('zoomOutLeft', {
  keyframe: {
    '0': {
      scale: 1,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale: 0.475,
      translateX: 42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale: 0.1,
      translateX: -2000,
      origin: 'left center'
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

save('zoomOutRight', {
  keyframe: {
    '0': {
      scale: 1,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale: 0.475,
      translateX: -42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale: 0.1,
      translateX: 2000,
      origin: 'right center'
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

save('zoomOutUp', {
  keyframe: {
    '0': {
      scale: 1,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale: 0.475,
      translateY: 60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale: 0.1,
      translateY: -2000,
      origin: 'center bottom'
    }
  },
  scaleBases: {
    scale: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

save('slideInDown', {
  keyframe: {
    '0': {
      translateY: -100
    },
    '100': {
      translateY: 0
    }
  },
  units: {
    translateY: '%'
  }
});

save('slideInLeft', {
  keyframe: {
    '0': {
      translateX: -100
    },
    '100': {
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

save('slideInRight', {
  keyframe: {
    '0': {
      translateX: 100
    },
    '100': {
      translateX: 0
    }
  },
  units: {
    translateX: '%'
  }
});

save('slideInUp', {
  keyframe: {
    '0': {
      translateY: 100
    },
    '100': {
      translateY: 0
    }
  },
  units: {
    translateY: '%'
  }
});

save('slideOutDown', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '100': {
      translateY: 100
    }
  },
  units: {
    translateY: '%'
  },
  final: {
    visibility: 0
  }
});

save('slideOutLeft', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '100': {
      translateX: -100
    }
  },
  units: {
    translateX: '%'
  },
  final: {
    visibility: 0
  }
});

save('slideOutRight', {
  keyframe: {
    '0': {
      translateX: 0
    },
    '100': {
      translateX: 100
    }
  },
  units: {
    translateX: '%'
  },
  final: {
    visibility: 0
  }
});

save('slideOutUp', {
  keyframe: {
    '0': {
      translateY: 0
    },
    '100': {
      translateY: -100
    }
  },
  units: {
    translateY: '%'
  },
  final: {
    visibility: 0
  }
});

/* anim8js animations */

save('blurOut', {
  keyframe: {
    '0': {
      blur: 0,
      opacity: 1
    },
    '50': {
      blur: 4,
      opacity: 0.9
    },
    '100': {
      blur: 5,
      opacity: 0
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('blurIn', {
  keyframe: {
    '0': {
      blur: 5,
      opacity: 0
    },
    '50': {
      blur: 4,
      opacity: 0.9
    },
    '100': {
      blur: 0,
      opacity: 1
    }
  },
  scaleBases: {
    opacity: 1
  }
});

save('rotateLeft', {
  move: {
    rotate: -90
  }
});

save('rotateRight', {
  move: {
    rotate: 90
  }
});

save('rotateLeftFull', {
  move: {
    rotate: -360
  }
});

save('rotateRightFull', {
  move: {
    rotate: 360
  }
});

save('wiggle', {
  keyframe: {
    '0.00,100.00': {
      rotate: 0
    },
    '12.50': {
      rotate: -45
    },
    '37.50': {
      rotate: 45
    },
    '58.33': {
      rotate: -30
    },
    '75.00': {
      rotate: 30
    },
    '87.50': {
      rotate: -15
    },
    '95.83': {
      rotate: 15
    }
  },
  initial: {
    origin: 'center'
  }
});


/**
 * Generate animations for all permutations of the following concepts:
 *
 * (slide|fade|zoom)(Out|In)(Down|Up)(Right|Left)(|x2|Big)
 */
(function()
{
  var actions = {
    'slide': {},
    'fade': {opacity:{from:0,to:1}},
    'zoom': {scale:{from:0,to:1}}
  };

  var directions = {
    'Out':  {from:0, to:1},
    'In':   {from:1, to:0}
  };

  var vertical = {
    'Down': 1,
    'Up': -1
  };

  var horizontal = {
    'Right': 1,
    'Left': -1
  };

  var sizes = {
    '':     {value: 100, unit: '%'},
    'x2':   {value: 200, unit: '%'},
    'Big':  {value: 2000, unit: 'px'}
  };

  for ( var a in actions )
  {
    var attrs = actions[ a ];

    for ( var d in directions )
    {
      var dir = directions[ d ];

      for ( var v in vertical )
      {
        var ver = vertical[ v ];

        for ( var h in horizontal )
        {
          var hor = horizontal[ h ];

          for ( var s in sizes )
          {
            var siz = sizes[ s ];

            var animName = a + d + v + h + s;

            if ( animName in anim8.animation )
            {
              continue;
            }

            var anim =
            {
              keyframe: {
                from: {
                  translateX: hor * dir.from * siz.value,
                  translateY: ver * dir.from * siz.value
                },
                to: {
                  translateX: hor * dir.to * siz.value,
                  translateY: ver * dir.to * siz.value
                }
              },
              units: {
                translateX: siz.unit,
                translateY: siz.unit
              }
            };

            for (var attr in attrs)
            {
              var attribute = attrs[attr];

              anim.keyframe.from[ attr ] = dir.to * attribute.to + dir.to * attribute.from;
              anim.keyframe.to[ attr ]   = dir.from * attribute.from + dir.from * attribute.to;
            }

            save( animName, anim );
          }
        }
      }
    }
  }

})();


  return anim8;

}));
