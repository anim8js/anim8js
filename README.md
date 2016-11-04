# anim8js

The ultimate javascript animation library. Animate everything - from HTML elements to objects like circles, sprites, or skeletons.

It's as easy as `anim8( button ).play('tada ~0.5s 1.5s x4 z100ms ease-inout')` - which plays the `tada` animation
in 1.5 seconds after waiting 0.5 seconds 4 times with a 100 ms break in between using the easing function `ease-inout`.

Attributes can be animated along a path, by using spring forces, or physical forces.
Attributes can be animated together or separately.
The values that define the paths, spring, and physical forces can be a constant value (ex: 0, {x:2, y:5}), a function which is evaluated during animation, a function which is evaluated at the beginning of an animation, the current value, or a value relative to the current value.

### Documentation

- [Developer Guide](docs/README.md)
- [Examples](http://anim8js.github.io/anim8js/examples.html)

### Installation

- Bower: `bower install anim8js`
- Node: `npm install anim8js`
- Download: [anim8js](https://raw.githubusercontent.com/anim8js/anim8js/master/build/anim8js.js) or [anim8js minified](https://raw.githubusercontent.com/anim8js/anim8js/master/build/anim8js.min.js)

### Extensions

- [anim8js-dom](http://github.com/anim8js/anim8js-dom) - animate HTML elements
- [anim8js-jquery](http://github.com/anim8js/anim8js-jquery) - animate HTML elements with [jQuery](http://jquery.com/)
- [anim8js-animate.css](http://github.com/anim8js/anim8js-animate.css) - [animate.css](https://daneden.github.io/animate.css/) inspired animations for HTML elements
- [anim8js-pixi](http://github.com/anim8js/anim8js-pixi) - animate [PixiJS](http://www.pixijs.com) display objects & shaders
- [anim8js-easel](http://github.com/anim8js/anim8js-easel) - animate [EaselJS](http://www.createjs.com/easeljs) objects

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
