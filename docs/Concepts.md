# Concepts

< [Getting Started & Installation](Getting-Started.md) | [Points](Points.md) >

#### Subject

The object to animate. Has one or more [attribute](#attribute)s

#### Data Type

A variable type which has a defined [calculator](#calculator). One of: number, 2d, 3d, string, rgb, rgba, & quaternion.

#### Calculator

A class which performs mathematical operations for a single [data type](#data-type). A calculator also takes user entered values and parses them into the expected data type format.

#### Attribute

A variable on an object which can be animated. An attribute has a specified [data type](#data-type) and default value.

#### Attrimator

Animates a single [attribute](#attribute). Has the following implementations: [Oncer](#oncer), [Event](#event), [Spring](#spring), & [Physics](#physics)

#### Animation

A set of [attrimator](#attrimator)s which is normally named to be referred to later.

#### Options

Modifiers to change how an animation plays: 

- delay: The amount of time the animation is delayed before playing (default 0ms)
- duration: How long to play the animation for (default 1s) 
- repeat: How many times to play the animation (default 1)
- sleep: How long to wait between repeating plays (default 0ms)
- scaling: Multiply the values of the animation by this value (default 1.0)
- easing: A function which determines the "velocity" of an animation (default ease)
- offset: An amount of time to fast-forward into the animation when playing it (default 0ms)

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
