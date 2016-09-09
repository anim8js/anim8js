# Getting Started & Installation

< [Index](README.md) | [Concepts](Concepts.md) >

## Getting Started

### What is anim8js?

anim8js is a library for animating anything. It allows you to animate the properties of any object - from plain objects, to DOM elements, sprites, and 3d skeletons.

**Examples of things you animate:**

- Buttons, text, & images on & off the screen
- Text in game dialogues
- Simple particle effects
- Springs in a game
- Sprite animation
- Skeletal animations
- Colors

**Animations**

Animations can be repeated, they can be delayed, eased, and played over any duration. Not only can you play an animation - but you can pause, resume, stop, stop repeating animations (nopeat), transition into animations, queue animations, and unplay animations. An animation can cover one or many attributes on an object - the animator can handle playing one animation at a time or multiple animations over multiple attributes.

**Extensions**

By default anim8js can animate simple objects. Extensions exist to animate other types of objects.

- [anim8js-dom](http://github.com/ClickerMonkey/anim8js-dom) - animate HTML elements
- [anim8js-jquery](http://github.com/ClickerMonkey/anim8js-jquery) - animate HTML elements with [jQuery](http://jquery.com/)
- [anim8js-animate.css](http://github.com/ClickerMonkey/anim8js-animate.css) - [animate.css](https://daneden.github.io/animate.css/) inspired animations for HTML elements
- [anim8js-pixi](http://github.com/ClickerMonkey/anim8js-pixi) - animate [PixiJS](http://www.pixijs.com) display objects & shaders
- [anim8js-easel](http://github.com/ClickerMonkey/anim8js-easel) - animate [EaselJS](http://www.createjs.com/easeljs) objects

**Features**

Here's a comprehensive list of features in anim8js:

- Animate an attribute along a path, apply spring forces, or apply physical forces
- Animate attributes independently from each other
- An easy to understand format for specifying how an animation should play
- Smoothly transition from current animation to next animation
- Create movies (animation sequences involving any number of subjects) and play them at any speed, in reverse, or jump to a specific time
- Sequentially animate a set of subjects
- Event based system for listening when animations start or finish
- Defer calling methods on an animator until an animation event has occurred
- Animate using the current state of an object, a relative state, constant values, randomly generated values, or dynamically created values
- Save animations to efficiently use them later
- Translate animations from one set attributes to another
- Attribute Types
  - Number, 2d [xy], 3d [xyz], quaternion [xyz theta] RGB, & RGBA
- Animation Controls
  - play, unplay, queue, transition, pause, resume, stop, end, finish, nopeat
- Animator Controls
  - (including above), tweenTo, tweenManyTo, tweenFrom, tweenManyFrom, tween, tweenMany, move, moveMany, follow, & spring
- Animation Types
  - keyframe, spring, physics, path [following], move [relatively], travel, tweenFrom, tweenTo, initial, final, deltas/values, queue, & and
- Path Types
  - Tween, Keyframe, Quadratic, Cubic, Delta, Jump, Compiled, Combo, Sub, Quadratic Corners, Linear, Uniform, Hermite, Bezier, Parametric, Basis Spline, & Catmull-Rom
- Springs
  - Linear & Distance
- Easing Types
  - in, out, inout, yoyo, mirror, reverse, flip
- Easings
  - linear, quad, ease, cubic, quartic, quintic, back, sine, overshot, elastic, revisit, lasso, slowbounce, bounce, smallbounce, tinybounce, hesitant, sqrt, sqrtf, slingshot, gentle, bezier

### Installation

anim8js is built to work in the browser (AMD or global `anim8`) and with node.

- Bower: `bower install anim8js`
- Node: `npm install anim8js`
- Download: [anim8js](https://raw.githubusercontent.com/ClickerMonkey/anim8js/master/build/anim8js.js) or [anim8js minified](https://raw.githubusercontent.com/ClickerMonkey/anim8js/master/build/anim8js.min.js)

**Installing Extensions**

Here's a list of the extensions you can install via `bower` or `npm`:

- [anim8js-dom](http://github.com/ClickerMonkey/anim8js-dom)
- [anim8js-jquery](http://github.com/ClickerMonkey/anim8js-jquery)
- [anim8js-animate.css](http://github.com/ClickerMonkey/anim8js-animate.css)
- [anim8js-pixi](http://github.com/ClickerMonkey/anim8js-pixi)
- [anim8js-easel](http://github.com/ClickerMonkey/anim8js-easel)
