/**
 * Animate.css animations in anim8js.
 *
 * http://daneden.github.io/animate.css/
 */

anim8.save('bounce', {
  keyframe: {
    '0,20,53,80,100': {
      translate3d: 0,
      easing: [0.215, 0.610, 0.355, 1.000]
    },
    '40,43': {
      translate3d: {y:-30},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '70': {
      translate3d: {y:-15},
      easing: [0.755, 0.050, 0.855, 0.060]
    },
    '90': {
      translate3d: {y:-4}
    }
  }
});

anim8.save('rubberBand', {
  keyframe: {
    '0,100': {
      scale3d: 1
    },
    '30': {
      scale3d: {x:1.25, y:0.75}
    },
    '40': {
      scale3d: {x:0.75, y:1.25}
    },
    '50': {
      scale3d: {x:1.15, y:0.85}
    },
    '65': {
      scale3d: {x:0.95, y:1.05}
    },
    '75': {
      scale3d: {x:1.05, y:0.95}
    }
  },
  scaleBases: {
    scale3d: 1
  }
});

anim8.save('flash', {
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

anim8.save('pulse', {
  keyframe: {
    '0': {
      scale3d: 1
    },
    '50': {
      scale3d: 1.05
    },
    '100': {
      scale3d: 1
    }
  },
  scaleBases: {
    scale3d: 1
  }
});

anim8.save('shake', {
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

anim8.save('swing', {
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

anim8.save('tada', {
  keyframe: {
    '0,100': {
      scale3d: 1,
      rotate: 0
    },
    '10,20': {
      scale3d: 0.9,
      rotate: -3
    },
    '30,50,70,90': {
      scale3d: 1.1,
      rotate: 3
    },
    '40,60,80': {
      scale3d: 1.1,
      rotate: -3
    }
  },
  scaleBases: {
    scale3d: 1
  }
});

/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

anim8.save('wobble', {
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

anim8.save('bounceIn', {
  keyframe: {
    '0': {
      opacity: 0.0,
      scale3d: 0.3
    },
    '20': {
      scale3d: 1.1
    },
    '40': {
      scale3d: 0.9
    },
    '60': {
      opacity: 1,
      scale3d: 1.03
    },
    '80': {
      scale3d: 0.97
    },
    '100': {
      opacity: 1.0,
      scale3d: 1
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
}, {
  easing: [0.215, 0.610, 0.355, 1.000]
});

anim8.save('bounceInDown', {
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

anim8.save('bounceInLeft', {
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


anim8.save('bounceInRight', {
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

anim8.save('bounceInUp', {
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

anim8.save('bounceOut', {
  keyframe: {
    '0': {
      scale3d: 1
    },
    '20': {
      scale3d: 0.9
    },
    '50,55': {
      opacity: 1,
      scale3d: 1.1
    },
    '100': {
      opacity: 0,
      scale3d: 0.3
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
}, {
  duration: 750
});

anim8.save('bounceOutDown', {
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

anim8.save('bounceOutLeft', {
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

anim8.save('bounceOutRight', {
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

anim8.save('bounceOutUp', {
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

anim8.save('fadeIn', {
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

anim8.save('fadeInDown', {
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

anim8.save('fadeInDownBig', {
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

anim8.save('fadeInLeft', {
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

anim8.save('fadeInLeftBig', {
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

anim8.save('fadeInRight', {
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

anim8.save('fadeInRightBig', {
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

anim8.save('fadeInUp', {
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

anim8.save('fadeInUpBig', {
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

anim8.save('fadeOut', {
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

anim8.save('fadeOutDown', {
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

anim8.save('fadeOutDownBig', {
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

anim8.save('fadeOutLeft', {
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

anim8.save('fadeOutLeftBig', {
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

anim8.save('fadeOutRight', {
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

anim8.save('fadeOutRightBig', {
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

anim8.save('fadeOutUp', {
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

anim8.save('fadeOutUpBig', {
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

anim8.save('flip', {
  keyframe: {
    '0': {
      translateZ: 0,
      rotate3d: {x:0, y:1, z:0, angle:-360},
      scale3d: 1,
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
      scale3d: 0.95,
      easing: 'cssEaseIn'
    },
    '100': {
      scale3d: 1
    }
  },
  scaleBases: {
    scale3d: 1
  },
  initial: {
    backface: 1.0
  },
  final: {
    backface: 0.0
  }
});

anim8.save('flipInX', {
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

anim8.save('flipInY', {
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

anim8.save('flipOutX', {
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

anim8.save('flipOutY', {
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

anim8.save('lightSpeedIn', {
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

anim8.save('lightSpeedOut', {
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

anim8.save('rotateIn', {
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

anim8.save('rotateInDownLeft', {
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

anim8.save('rotateInDownRight', {
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

anim8.save('rotateInUpLeft', {
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

anim8.save('rotateInUpRight', {
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

anim8.save('rotateOut', {
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

anim8.save('rotateOutDownLeft', {
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
})

anim8.save('rotateOutDownRight', {
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

anim8.save('rotateOutUpLeft', {
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

anim8.save('rotateOutUpRight', {
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

anim8.save('hinge', {
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

anim8.save('rollIn', {
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

anim8.save('rollOut', {
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

anim8.save('zoomIn', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.3
    },
    '50': {
      opacity: 1
    },
    '100': {
      scale3d: 1
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
});

anim8.save('zoomInDown', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateY: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateY: 60,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateY: 0
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
});

anim8.save('zoomInLeft', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateX: -1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateX: 10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateX: 0
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
});

anim8.save('zoomInRight', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateX: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateX: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateX: 0
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
});

anim8.save('zoomInUp', {
  keyframe: {
    '0': {
      opacity: 0,
      scale3d: 0.1,
      translateY: 1000,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '60': {
      opacity: 1,
      scale3d: 0.475,
      translateY: -10,
      easing: [0.175, 0.885, 0.320, 1.000]
    },
    '100': {
      scale3d: 1,
      translateY: 0
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
});

anim8.save('zoomOut', {
  keyframe: {
    '0': {
      opacity: 1,
      scale3d: 1
    },
    '100': {
      opacity: 0,
      scale3d: 0.3
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  }
}, {
  duration: '500ms'
});

anim8.save('zoomOutDown', {
  keyframe: {
    '0': {
      scale3d: 1,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateY: -60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateY: 2000,
      origin: 'center bottom'
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

anim8.save('zoomOutLeft', {
  keyframe: {
    '0': {
      scale3d: 1,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateX: 42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateX: -2000,
      origin: 'left center'
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

anim8.save('zoomOutRight', {
  keyframe: {
    '0': {
      scale3d: 1,
      translateX: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateX: -42,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateX: 2000,
      origin: 'right center'
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

anim8.save('zoomOutUp', {
  keyframe: {
    '0': {
      scale3d: 1,
      translateY: 0,
      origin: 'center'
    },
    '40': {
      opacity: 1,
      scale3d: 0.475,
      translateY: 60,
      easing: [0.550, 0.055, 0.675, 0.190]
    },
    '100': {
      opacity: 0,
      scale3d: 0.1,
      translateY: -2000,
      origin: 'center bottom'
    }
  },
  scaleBases: {
    scale3d: 1,
    opacity: 1
  },
  scales: {
    origin: 1
  }
});

anim8.save('slideInDown', {
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

anim8.save('slideInLeft', {
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

anim8.save('slideInRight', {
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

anim8.save('slideInUp', {
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

anim8.save('slideOutDown', {
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

anim8.save('slideOutLeft', {
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

anim8.save('slideOutRight', {
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

anim8.save('slideOutUp', {
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

anim8.save('blurOut', {
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

anim8.save('blurIn', {
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

anim8.save('rotateLeft', {
  move: {
    rotate: -90
  }
});

anim8.save('rotateRight', {
  move: {
    rotate: 90
  }
});

anim8.save('rotateLeftFull', {
  move: {
    rotate: -360
  }
});

anim8.save('rotateRightFull', {
  move: {
    rotate: 360
  }
});

anim8.save('wiggle', {
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
    'zoom': {scale3d:{from:0,to:1}}
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
            
            anim8.save( animName, anim );
          }
        }
      }
    }
  }
  
})();