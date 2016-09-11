# Concepts

< [Getting Started & Installation](Getting-Started.md) | [Points](Points.md) >

#### Subject

The object to animate. Has one or more [attributes](#attribute)

#### Data Type

A variable type which has a defined [calculator](#calculator). One of: number, 2d, 3d, string, rgb, rgba, & quaternion.

#### Data Point

A value that can be used in an [animation](#animation) and be parsed by a [calculator](#calculator). Valid formats:

- `true`: represents the current value on the [subject](#subject)
- `2.5`: a constant value
- `"-20"`: a [value relative](#relative-value) to the current value on the subject
- `anim8.computed(func)`: a [computed function](#computed-function) which is invoked at the start of an animation which should return a value to be used in its place
- `func`: a [live function](#live-function) that should be called each frame which returns a value to be used in its place
- `anim8.computed.random({min: 1, max: 5})`: a [computed function](#computed-function) which generates a random value between the min & max at the start of an animation
- `anim8.param( 'param' )`: a [parameter](#parameter) [computed function](#computed-function) for [parametrized animations](#parametrized-animation)

#### Calculator

A class which performs mathematical operations for a single [data type](#data-type). A calculator also takes user entered values and parses them into the expected data type format.

#### Attribute

A variable on a subject which can be animated. An attribute has a specified [data type](#data-type) and default value.

#### Attrimator

Animates a single [attribute](#attribute). Has the following implementations: [Oncer](#oncer), [Event](#event), [Spring](#spring), & [Physics](#physics)

#### Animation

A set of [attrimators](#attrimator) which is normally named to be referred to later.

#### Animation Definition

An object which contains [builder](#builder) names to use to generate [attrimators](#attrimator) when creating an [animation](#animation).

#### Animation Input

A variable which can be parsed into an animation. A reference to an [Animation](#animation) instance can be used, a string containing one or more animation names & options, or an [animation definition](#animation-definition).

For example, the following inputs are all valid:

```javascript
var input0 = 'animationName';
var input1 = 'animationName ~1s 2s';
var input2 = 'animationName & concurrentAnimation, queuedAnimation';
var input3 = anim8.animation( input2 ); // Animation instance
var input4 = {
  values: {
    opacity: [1, 0, 1] // blink
  }
};
```

#### Options

Modifiers to change how an animation plays:

- `delay`: The amount of time the animation is delayed before playing (default ~0ms)
- `duration`: How long to play the animation for (default 1s)
- `repeat`: How many times to play the animation (default x1)
- `sleep`: How long to wait between repeating plays (default z0ms)
- `scaling`: Multiply the values of the animation by this value (default !1.0)
- `easing`: An [easing](#easing) to use for the animation (default ease)
- `offset`: An amount of time to fast-forward into the animation when playing it (default @0ms)
- `parameter`: A key=value pair to use in [parametrized animations](#parametrized-animation)

For example: `~500ms 2s x3 z1s !1.5 linear-yoyo angle=32` (delay animation by 500ms, play it over 2 seconds, 3 times, wait 1 second in between repeating plays, scale animation values by 1.5, use parameter angle with value 32, and use [easing](#easing) linear combined with [type](#easing-type) yoyo)

Options can also be supplied as an object:

```javascript
var options = {
  delay: '500ms',
  duration: '2s',
  repeat: 3,
  sleep: 1000, // ms default unit for time
  scale: 1.5,
  easing: 'linear-yoyo',
  parameters: {
    angle: 32
  }
};
```

#### Animator

The controller for a [subject](#subject) which manages a set of [attrimator](#attrimator)s. Playing animations and other functions are done here and applied to the subject on the next [animation frame](#animation-frame).

#### Animators

An array of [animator](#animator)s that can be handled as a single animator. Animators are also used to generate a [sequence](#sequence) for sequential animations.

#### Builder

A builder (also referred to as an animation type) takes an animation definition and generates a set of [attrimator](#attrimator)s.

#### Animation Frame

Animation is done in a "frame" which is a 3 step process involving calling the following three functions on all active animators: `preupdate`, `update`, & `apply`. These steps are separated for efficiently handling certain scenarios. When an animator is finished at the end of a frame it's removed form the active animator list. When this list is empty the frames stop occurring until an animator is activated by playing an animation.

#### Sequence

The controller for [animators](#animators) to play, queue, and transition animations with some delay between each [animator](#animator).

#### Oncer

An [attrimator](#attrimator) which applies a value to the subject only once - at the start or end of an animation.

#### Event

An [attrimator](#attrimator) which follows an [attribute](#attribute) along a [path](#path) given some [options](#options).

#### Spring

An [attrimator](#attrimator) which applies spring forces to an [attribute](#attribute) - moves it to some resting value.

#### Physics

An [attrimator](#attrimator) which applies a velocity and/or acceleration to an [attribute](#attribute).

#### Path

A function which returns a value given a number between 0 and 1. This could be a tween, a curved path, or a linear path.

#### Movie

A set of [attrimator](#attrimator)s to apply to a set of [subject](#subject)s at specific times. A movie can be played at any speed, in any direction, and can jump around to any time in the movie.

#### Transition Options

Modifiers to describe how an animation transitions into another:

- `time`: How much time to spend transitioning from the current animation to the next
- `intro`: The amount of time to transition into the next animation. A negative value will create a curve before the next animation and smoothly transition into it
- `outro`: The amount of time to transition out of the current animation. A positive value will create a curve out of the current animation
- `granularity`: How many points to calculate along the transition to use to create a transition which respects the outro and intro animation velocity
- `lookup`: How far into & out of the next & current animations to look when calculating their velocity. This is a delta value (0-1)
- `easing`: The [easing](#easing) to use for the transition path

For example: `2s <500ms >100ms linear ^0.1 /100` (transition over 2 seconds, 500ms smoothly into the next animation, 100ms smoothly out of the current animation, using the linear [easing](#easing), with a smooth velocity transition using 100 data points and 0.1 of the current/next animations to calculate the exit/entrance velocity)

#### Parameter

A key value pair that can be specified in [options](#options) and used in the [animation definition](#animation-definition) to create [parametrized animations](#parametrized-animation). A parameter can be any [data type](#data-type). A parameter is created in an animation definition by using the `anim8.param( 'paramName' )` function.

#### Parametrized Animation

An [animation](#animation) containing [parameters](#parameter) that can be specified in [options](#options) to procedurally generate an animation.

For example:

```javascript
anim8.save('moveX', {
  tweenTo: {
    translateX: anim8.param( 'x' ).relative()
  }
});

animator.play( 'moveX 2s x=100' );
```

#### Computed Function

A [data point](#data-point) function which is called at the start of an animation and returns a value to replace it self in the [attrimator](#attrimator).

#### Live Function

A [data point](#data-point) function which is called during every frame of an animation in an [attrimator](#attrimator).

#### Relative Value

A [data point](#data-point) which is a [computed function](#computed-function) which adds a value to the current value on the [subject](#subject).

#### Easing

A function which determines the "velocity" of an animation. It takes a delta value between 0 and 1 and returns a new value typically between the same range.

#### Easing Type

A function which takes an easing function and a delta value between 0 and 1 and returns a new value. Easing types are used using a hyphen after an easing. These types are another layer on easings providing more control.

#### Factory

Takes a [subject](#subject) and returns an [animator](#animator) that can handle animating the subject and provides the animator with [attribute](#attribute) definitions.

#### Defer

To wait to invoke functions on an object until that object triggers a specific event.

< [Getting Started & Installation](Getting-Started.md) | [Points](Points.md) >
