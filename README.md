# anim8js
The ultimate javascript animation library. Animate everything - from objects to HTML elements.

It's as easy as `anim8( button ).play('tada ~0.5s 1.5s x4 z100ms ease-inout')` - which plays the `tada` animation
in 1.5 seconds after waiting 0.5 seconds 4 times with a 100 ms break in between using the easing function `ease-inout`.

Attributes can be animated along a path, by using spring forces, or physical forces.
Attributes can be animated together or separately.
The values that define the paths, spring, and physical forces can be a constant value (ex: 0, {x:2, y:5}), a function which is evaluated during animation, a function which is evaluated at the beginning of an animation, the current value, or a value relative to the current value.

### Installation

- Bower: `bower install anim8js`
- Node: `npm install anim8js`
- Download: [anim8js](https://raw.githubusercontent.com/ClickerMonkey/anim8js/master/build/anim8js.js) or [anim8js minified](https://raw.githubusercontent.com/ClickerMonkey/anim8js/master/build/anim8js.min.js)

### Extensions

- [anim8js-dom](http://github.com/ClickerMonkey/anim8js-dom) - animate HTML elements
- [anim8js-jquery](http://github.com/ClickerMonkey/anim8js-jquery) - animate HTML elements with [jQuery](http://jquery.com/)
- [anim8js-animate.css](http://github.com/ClickerMonkey/anim8js-animate.css) - [animate.css](https://daneden.github.io/animate.css/) inspired animations for HTML elements
- [anim8js-pixi](http://github.com/ClickerMonkey/anim8js-pixi) - animate [PixiJS](http://www.pixijs.com) display objects & shaders
- [anim8js-easel](http://github.com/ClickerMonkey/anim8js-easel) - animate [EaselJS](http://www.createjs.com/easeljs) objects

### Features  
- Create your own animations
- Play animations by name, name & modifiers, or by custom definition
- Queue animations
- Transition into a new animation in 6 different ways
- Play multiple animations at once over different attributes
- Springs forces on an attribute given some rest value
- Sequential animations involving multiple subjects
- Defer animation commands until an event occurs
- Save animations to be used later
- Modify animations with a delay, duration, repeats, sleeping between repeats, scale, and easing
- Relative values (ex: '+20', '-100')
- Apply physical forces (velocity and/or acceleration) to an attribute
- An attribute can follow a path of points
- Keyframe animations
- Values used in paths, springs, and physics can be constants, functions that return a value at the beginning of the animation, functions that return a live value during the animation, or a value relative to the current value.

### Concepts  
- `Subject` = The thing being animated (an object, HTML element, etc)
- `Attribute` = an animatable property on a subject
- `Attrimator` = animates an attribute
- `Calculator` = performs math operations for a data type (number, color, 2d/3d points, etc)
- `Easing` = a function which controls the velocity of the animation over time
- `Path` = a set of points and an algorithm which computes a value at a given time
- `Event` = an attrimator which animates an attribute along a path with a delay, duration, # of repeats, a pause in between repititions, an easing, and a scale
- `Spring` = an attrimator which applies a force which animates an attribute to a resting value
- `Physics` = an attrimator which applies velocity and acceleration to an attribute
- `Animation` = a set of attrimators which can be played on an Animator
- `Defer` = defers calling functions on an object until a certain event occurs
- `Animator` = enables you to: play animations, queue animations, transition animations, tween attributes, add springs, and follow paths on a Subject
- `Animators` = a set of animators that can be controlled as if it it were a single Animator
- `Sequence` = animators where animations can be played at a delay between each animator creating a sequence of animations
- `Builder` = takes an animation definition and generates an Animation that can be played
- `Factory` = builds an Animator for a specific data type
- `Point` = a value used in attrimators. Can be a constant, a function to evaluate live or at the beginning of an animation, or a relative value

### Playing animations

There are tons of different ways of playing animations.
- `animator.play( 'tada' )` = plays the tada animation on the animator.
- `animator.play( 'tada', {delay:500, duration:'1.5s'} )` = plays the tada animation with a delay of 500 milliseconds and duration of 1.5 seconds.
- `animator.play( 'tada ~500ms 1.5s' )` = same as above.
- `animator.play( 'tada ~500ms 1.5s', {duration:200} )` = same as above excepts overrides duration to 200 milliseconds.
- `animator.play( 'tada, bounceOut, zoomIn 2s' )` = plays tada, queues bounceOut and then zoomIn with a modified duration of 2 seconds.
- `animator.play( *animationDefinition* )` = plays a custom animation - see *Animation Definition*.

### Animation Modifiers

- `duration`: a number in the string that doesn't start with a special character, ex: `2s`
- `repeat`: a string or number starting with an x, ex: `x4`, `infinite`, `twice`
- `sleep`: a string starting with a z, ex: `z4.5s`
- `delay`: a string starting with a ~, ex: `~750ms`
- `easing`: a string specifying an easing function, ex: `linear`, `ease-out`, `sqrt-yoyo`
- `scale`: a string starting with !, ex: `!1.2`
- `offset`: a string starting with @, ex: '@500ms'

### Animation Definitions

You can pass these objects in the following formats to `anim8.save`, `anim8.animation`, `Animator.play`, `Animator.queue`, `Animator.transition`, `Animator.transitionInto`, `Sequence.play`, `Sequence.queue`, `Sequence.transition`, and `Sequence.transitionInto`.

```javascript
{ // animates from current value to the following values
  tweenTo: {
    scale: 2,
    opacity: 0
  }
}
{ // sets the value when the animation starts
  initial: {
    origin: 'left center'
  }
}
{ // sets the value when the animation ends
  final: {
    visibility: 0
  }
}
{ // animates along key frames at given percents - just like CSS keyframes!
  keyframe: {
    '0,20,40,60,80,100': {
      opacity: 1,
      easing: 'linear'
    },
    '10,30,50,70,90': {
      opacity: 2,
      easing: 'quad'
    }
  }
}
{ // similar to keyframe - more compact and without interstitial easings.
  deltas: [0, 0.2, 1],
  values: {
    opacity: [1, 0, 1],
    scale: [1, 1.2, 1]
  }
}
{ // adds a spring between a rest point and the current value
  springs: {
    center: {
      type: 'linear',
      rest: [10, 10],
      damping 2.5,
      stiffness: -30
    }
  }
}
{ // move (add/remove) a value to an attributes existing value
  move: {
    left: 100
  }
}
{ // apply a velocity and/or acceleration to an attribute
  physics: {
    center: {
      calcluator: '2d',
      velocity: [100, 0],
      terminal: 200
    }
  }
}
{ // go from one point to another with a certain velocity
  travel: {
    center: {
      from: true, // true = current value
      to: [200, 40],
      velocity: 200
    }
  }
}
```

You can actually join multiple types of animation definitions into a single object!

```javascript
{
  // Whatever the current opacity is - to 0
  tweenTo: {
    opacity: 0
  },
  // Start at one scale and shrink to nothing
  keyframe: {
    from: {
      scale: {x:1, y:0.5}
    },
    to: {
      scale: 0
    }
  },
  // In the beginning of the animation set the transform origin
  initial: {
    origin: 'center top'
  },
  // At the end of the animation, make invisible
  final: {
    visibility: 0
  }
}
```

### FAQ  
> What are valid animation durations, delays, & sleeps?

A number of milliseconds or a string with a number followed by any of the following units: ms, s, c, cs, third, jiffy, sec, m, min, h, hr

> What are valid animation repeats?  

A number or any of the following strings: inf, infinity, infinite, once, twice, thrice, dozen, random

> What are valid easings?  

- A function which accepts a delta value and returns a new delta value.
- A string which is the name of an existing easing in `anim8.Easings`.
- A string in the format of `easing-easingType` where easing is an existing easing in `anim8.Easings` and easingType is an existing type in `anim8.EasingsTypes` like *in*, *out*, *inout*, or *pong*. An example is 'sqrt-inout'.
- An array of 4 values which represent control points for a bezier curve.

> How do I override any default values?  

You can find the following defaults in `anim8.Defaults`:  
duration, easing, teasing, delay, sleep, repeat, scale, transitionTime, transitionDelta, transitionIntoDelta,
transitionEasing, cache

> How do I add my own ______  

- `Easing`: anim8.Easings.myCustomEasing = function(x) { ... };
- `Path`: anim8.Paths.myCustomPath = function(pathDefinition) { ... return *instance of anim8.Path* ... };
- `Spring`: anim8.Springs.myCustomSpring = function(springDefinition) { ... return *instance of anim8.Spring* ... };
- `Builder`: anim8.Builders.myCustomParser = *instance of anim8.Parser*;
- `Animation`: anim8.save( 'myAnimationName', *animation definition* );
- `Calculator`: anim8.Calculators.myCustomCalculator = *instance of anim8.Calculator*;
