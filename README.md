# anim8js
The ultimate javascript animation library. Animate everything - from objects to HTML elements.

Inspired by the [animate.css](http://daneden.github.io/animate.css/) library - anim8js includes all animations and allows you to leverage Javascript's power to animate in almost any imaginable way.

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
9. Modify animations with a delay, duration, repeats, sleeping between repeats, scale, and easing.
10. Relative Values

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
- `animator.play( 'tada, bounceOut, zoomIn 2s' )` = plays tada, queues bounceOut and then zoomIn with a modified duration of 2 seconds.
- `animator.play( *animationDefinition* )` = plays a custom animation - see *Animation Definition*.

### Animation Modifiers

- `duration`: a number in the string that doesn't start with a special character, ex: `2s`.
- `repeat`: a string or number starting with an x, ex: `x4`, `infinite`, `twice`.
- `sleep`: a string starting with a z, ex: `z4.5s`.
- `delay`: a string starting with a ~, ex: `~750ms`.
- `easing`: a string specifying an easing function, ex: `linear`, `ease-out`, `sqrt-yoyo`.
- `scale`: a string starting with !, ex: `!1.2`.

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
```

You can actually join multiple types of animation definitions into a single object!

```javascript
{
  tweenTo: {
    opacity: 0
  },
  keyframe: {
    from: {
      scale: {x:1, y:0.5}
    },
    to: {
      scale: 0
    }
  },
  initial: {
    origin: 'center top'
  },
  final: {
    visibility: 0
  }
}
```

### jQuery Functions

A few functions are available for jQuery which will help you animate jQuery objects:  
- `m8/anim8/animator`: returns an animator instance for the first element in the jQuery object.
- `m8s/anim8s/animators`: returns animators for all elements in the jQuery object.
- `dataPlay`: plays the animation specified in the `data-...` attribute for all elements in the jQuery object and returns a jQuery object which contains only elements that had a valid animation to play.
- `dataQueue`: queues the animation specified in the `data-...` attribute for all elements in the jQuery object and returns a jQuery object which contains only elements that had a valid animation to queue.
- `dataTransition`: transitions into the animation specified in the `data-...` attribute for all elements in the jQuery object and returns a jQuery object which contains only elements that had a valid animation to transition into.

For example if you have the following HTML:

```html
<div id="box" data-intro="fadeIn ~5s" data-outro="flipOutX 0.5s">Hello World!</div>
```

You can play the specified animations with...

```javascript
$('#box').dataPlay('intro').dataQueue('outro');
```

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

> How do I add my own ______  

- `Easing`: anim8.easing.myCustomEasing = function(x) { ... };
- `Path`: anim8.path.myCustomPath = function(pathDefinition) { ... return *instance of anim8.Path* ... };
- `Parser`: anim8.parser.myCustomParser = *instance of anim8.Parser*;
- `Animation`: anim8.save( 'myAnimationName', *animation definition* );
- `Calculator`: anim8.calculator.create( 'myCustomCalculator', *calculator methods* );


