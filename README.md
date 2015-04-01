# anim8js
The ultimate javascript animation library. Animate everything - from objects to HTML elements.

It's as easy as `anim8( button ).play('tada ~0.5s 1.5s x4 z100ms ease-inout')` - which plays the `tada` animation
in 1.5 seconds after waiting 0.5 seconds 4 times with a 100 ms break in between using the easing function `ease-inout`.

### Features  
1. Play animations by name, name & modifiers, or by custom definition.
2. Queue animations.
3. Transition into a new animation smoothly.
4. Play multiple animations at once over different attributes.
5. Springs.
6. Animation sequences.
7. Defer commands until an event occurs.
8. Save animations to be used later.

### Concepts  
- `Subject` = The thing being animated (an object, HTML element, etc).
- `Attribute` = an animatable property on a subject.
- `Calculator` = performs math operations for a data type (number, color, 2d/3d points, etc).
- `Easing` = a function which controls the velocity of the animation over time.
- `Path` = a set of points and an algorithm which computes a value at a given time.
- `Event` = animates a single value along a path with a delay, duration, # of repeats, a pause in between repititions, an easing, and a scale.
- `Spring` = a force which animates an attribute to a resting value.
- `Animation` = a set of events which can be played on an Animator.
- `Defer` = defers calling functions on an object until a certain event occurs.
- `Animator` = enables you to: play animations, queue animations, transition animations, tween attributes, add springs, and follow paths. 
- `Animators` = a set of animators that can be used as it were a single Animator.
- `Sequence` = animators where animations can be played at a delay between each animator creating a sequence of animations.
- `Parser` = takes an animation definition and generates an Animation that can be played.
- `Factory` = builds an Animator for a specific data type.

### Playing animations

There are tons of different ways of playing animations.
- `animator.play( 'tada' )` = plays the tada animation on the animator.
- `animator.play( 'tada', {delay:500, duration:'1.5s'} )` = plays the tada animation with a delay of 500 milliseconds and duration of 1.5 seconds.
- `animator.play( 'tada ~500ms 1.5s' )` = same as above.
- `animator.play( 'tada ~500ms 1.5s', {duration:200} )` = same as above excepts overrides duration to 200 milliseconds.
- `animator.play( *animationDefinition* )` = plays a custom animation - see *Animation Definition*.

### Animation Definitions

### FAQ  
> What are valid animation durations, delays, & sleeps?
A number of milliseconds or a string with a number followed by any of the following units: ms, s, c, cs, third, jiffy, sec, m, min, h, hr

> What are valid animation repeats?
A number or any of the following strings: inf, infinity, infinite, once, twice, thrice, dozen, random

> What are valid easings?
- A function which accepts a delta value and returns a new delta value.
- A string which is the name of an existing easing in `anim8.easing`.
- A string in the format of `easing-easingType` where easing is an existing easing in `anim8.easing` and easingType is an existing type in `anim8.easingType` like *in*, *out*, *inout*, or *pong*. An example is 'sqrt-inout'.
- An array of 4 values which represent control points for a bezier curve.

> How do I override any default values?
You can find the following defaults in `anim8.defaults`:  
duration, easing, teasing, delay, sleep, repeat, scale, transitionTime, transitionDelta, transitionIntoDelta, 
transitionEasing, cache

> How do I add my own ____
- `Easing`: anim8.easing.myCustomEasing = function(x) { ... };
- `Path`: anim8.path.myCustomPath = function(pathDefinition) { ... return *instance of anim8.Path* ... };
- `Parser`: anim8.parser.myCustomParser = *instance of anim8.Parser*;
- `Animation`: anim8.save( 'myAnimationName', *animation definition* );
- `Calculator`: anim8.calculator.create( 'myCustomCalculator', *calculator methods* );

