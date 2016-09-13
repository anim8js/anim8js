# Points

< [Concepts](Getting-Started.md) | [Data Types](Data-Types.md) >

A point is a value that can be used in an animation and be parsed by a calculator.

For example, in the following places:
- Rest value, initial velocity, or gravity for a spring
- Velocity or acceleration for physics
- Tweening start and/or end
- Path point

There are different types of points:

- [Constant](#constant)
- [Computed Function](#computed-function)
  - [Current Value](#current-value)
  - [Relative Value](#relative-value)
  - [Random Value](#random-value)
  - [Parameter Value](#parameter-value)
- [Live Function](#live-function)

> The definition for `Calculator.parse` is `( input, defaultValue, ignoreRelative )` where `input` is one of the values below, `defaultValue` is an already parsed value to use if input is missing a value, and `ignoreRelative` ensures strings with signs that should be parsed as numbers aren't converted to a relative number.

#### Constant

Constant values typically use raw numbers. Here are examples based on each calculator:

###### number
`var Parsed = anim8.calculator('number').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 2.0 | 2.0 |
| [1.0] | 1.0 |
| '3.5' | 3.5 |

###### 2d
`var Parsed = anim8.calculator('2d').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 0.2 | {x: 0.2, y: 0.2} |
| [1.5, 3.4] | {x: 1.5, y: 3.4} |
| {x: 1, y: 4} | {x: 1, y: 4} |
| ['4', '1.2'] | {x: 4, y: 1.2} |
| {x: '1', y: '5'} | {x: 1, y: 5} |
| '1 -4' | {x: 1, y: -4} |
| '-4&#124;5' | {x: -4, y: 5} |
| '3,4.5' | {x: 3, y: 4.5} |

###### 3d
`var Parsed = anim8.calculator('3d').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 0.2 | {x: 0.2, y: 0.2, z: 0.2} |
| [1.5, 3.4, 0] | {x: 1.5, y: 3.4, z: 0} |
| {x: 1, y: 4, z: 6} | {x: 1, y: 4, z: 6} |
| ['4', '1.2', '5'] | {x: 4, y: 1.2, z: 5} |
|  {x: '1', y: '5', z: 0} | {x: 1, y: 5, z: 0} |
| '1 -4 3' | {x: 1, y: -4, z: 3} |
| '-4&#124;5&#124;1' | {x: -4, y: 5, z: 1} |
| '3,4.5,-2' | {x: 3, y: 4.5, z:-2} |

###### quaternion
`var Parsed = anim8.calculator('quaternion').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 34 | {x: 0, y: 0, z: 1: angle: 34} |
| [0.7, 0.7, 0, -20] | {x: 0.7, y: 0.7, z: 0, angle: -20} |
| {x: 1, y: 4, z: 6, angle: 23} | {x: 1, y: 4, z: 6, angle: 23} |
| ['4', '1.2', '5', '90'] | {x: 4, y: 1.2, z: 5, angle: 90} |
|  {x: '1', y: '5', z: 0, angle: '34'} | {x: 1, y: 5, z: 0, angle: 34} |
| '1 -4 3 45' | {x: 1, y: -4, z: 3, angle: 45} |
| '-4&#124;5&#124;1&#124;180' | {x: -4, y: 5, z: 1, angle: 180} |
| '3,4.5,-2,-15' | {x: 3, y: 4.5, z:-2, angle: -15} |

###### rgb
`var Parsed = anim8.calculator('rgb').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 20 | {r: 20, g: 20, b: 20} |
| [15, 34, 0] | {r: 15, g: 34, b: 0} |
| {r: 1, g: 4, b: 6} | {r: 1, g: 4, b: 6} |
| ['4', '12', '5'] | {r: 4, g: 12, b: 5} |
| {r: '1', g: '5', b: 0} | {r: 1, g: 5, b: 0} |
| '1 23 3' | {r: 1, g: 23, b: 3} |
| '40&#124;5&#124;1' | {r: 40, g: 5, b: 1} |
| '3,45,20' | {r: 3, g: 45, b: 20} |
| 'tan' | {r: 210, g: 180, b: 140} |
| '#454' | {r: 68:, g: 85:, b: 68} |
| '#123456' | {r: 18:, g: 52:, b: 86} |
| 'rgb(1,34,120)' | {r: 1, g: 34, b: 120} |
| 'rgba(1,34,120, 0.5)' | {r: 1, g: 34, b: 120} |

###### rgba
`var Parsed = anim8.calculator('rgba').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| 20 | {r: 20, g: 20, b: 20, a: 1.0} |
| [15, 34, 0, 0.5] | {r: 15, g: 34, b: 0, a: 0.5} |
| {r: 1, g: 4, b: 6} | {r: 1, g: 4, b: 6, a: 1.0} |
| ['4', '12', '5', '1'] | {r: 4, g: 12, b: 5, a: 1.0} |
| {r: '1', g: '5', b: 0} | {r: 1, g: 5, b: 0, a: 1.0} |
| '1 23 3 1' | {r: 1, g: 23, b: 3, a: 1.0} |
| '40&#124;5&#124;1&#124;0.1' | {r: 40, g: 5, b: 1, a: 0.1} |
| '3,45,20,0.4' | {r: 3, g: 45, b: 20, a: 0.4} |
| 'tan' | {r: 210, g: 180, b: 140, a: 1.0} |
| '#454' | {r: 68:, g: 85:, b: 68, a: 1.0} |
| '#123456' | {r: 18:, g: 52:, b: 86, a: 1.0} |
| 'rgb(1,34,120)' | {r: 1, g: 34, b: 120, a: 1.0} |
| 'rgba(1,34,120, 0.5)' | {r: 1, g: 34, b: 120, a: 0.5} |

#### Computed Function

A computed function is a special function that is only evaluated at the start of playing an attrimator on an animator. What makes it distinguished from a normal function is the presence of a `computed` property set to `true`. A computed function is also passed `(attrimator, animator)` arguments. The result of the function is placed in the attrimator overwriting the computed function. You can create your own computed function using `anim8.computed` like so:

```javascript
// Save a computed function factory
anim8.computed('myComputed', function(myInput) {
  // Return a computed function
  return anim8.computed(function(attrimator, animator) {
    // Take values on attrimator or animator
    return myInput * 3;
  });
});

var cmp = anim8.computed.myComputed( 34 );
```

There are 4 built-in computed functions:

- [Current Value](#current-value)
- [Relative Value](#relative-value)
- [Random Value](#random-value)
- [Parameter Value](#parameter-value)

##### Current Value

The current value on the subject/animator can be used in animation. This is represented by passing `true` or `anim8.computed.current` to an animation. This is useful for tweening from the current point to a new point.

##### Relative Value

A relative value adds a given value to the current value on the subject/animator. A relative value can also be partially constant - as in not moving relative to the current value. A mask is passed to the function to handle this - where a value of `1` means relative and `0` means not relative.

A relative value is specified as a string prefixed with `+` or `-`. Here are examples based on each calculator:

###### number
`var Parsed = anim8.calculator('number').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| '+2.0' | anim8.computed.relative(2.0) |
| '-1.5' | anim8.computed.relative(1.5) |
| ['+1.0'] | anim8.computed.relative(1.0) |

###### 2d
`var Parsed = anim8.calculator('2d').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| '+2.0' | anim8.computed.relative({x: 2.0, y: 2.0}) |
| ['+2.0', 1.0] | anim8.computed.relative({x: 2.0, y: 1.0}, {x: 1, y: 0}) // partially relative |
| ['+1', '-1'] | anim8.computed.relative({x: 1.0, y: -1.0}) |
| {x: '+4.5', y: -3.4} | anim8.computed.relative({x: 4.5, y: -3.4}, {x: 1, y: 0}) |
| {x: '+4.5', y: '-3.4'} | anim8.computed.relative({x: 4.5, y: -3.4}) |

###### 3d
`var Parsed = anim8.calculator('3d').parse( Input );`

| Input | Parsed |
| ----- | ------ |
| '+2.0' | anim8.computed.relative({x: 2.0, y: 2.0, z: 2.0}) |
| ['+2.0', 1.0, '-4'] | anim8.computed.relative({x: 2.0, y: 1.0, z: -4}, {x: 1, y: 0, z: 1}) // partially relative |
| ['+1', '-1', '-34'] | anim8.computed.relative({x: 1.0, y: -1.0, z: -34}) |
| {x: '+4.5', y: -3.4, z: '+1'} | anim8.computed.relative({x: 4.5, y: -3.4, z: 1}, {x: 1, y: 0, z: 1}) |
| {x: '+4.5', y: '-3.4', z: '+1'} | anim8.computed.relative({x: 4.5, y: -3.4, z: 1}) |

The remaining calculators behave similarly, input must be a single string, an array of mixed values, or an object of mixed values.

##### Random Value

A random value can be generated from a few different types of inputs using `anim8.computed.random`:

- Array: Choose one of the values randomly at the start of the animation
- Path: Choose a random point on the path
- Object: An object with a min and max value

###### Examples

```javascript
// number with array
anim8.computed.random([15, 30, 45, 90, 180]); // one of
// number with path
anim8.computed.random(anim8.path({
  type: 'linear',
  calculator: 'number',
  points: [3, 8, -2]
}));
// 2d with range
anim8.computed.random({
  min: {x: -10, y: -20},
  max: {x: 10, y: 20}
});
```

##### Parameter Value

You can learn more about these computed functions [here](Parametrized-Animations.md).

#### Live Function

A live function is a normal function which is evaluated on every animation frame. The result of the function must be a valid parsed data type. This is the most expensive point - the implementation should be as simple as possible. For example:

```javascript
var mouse = {x: 0, y: 0};
function getMouse() {
  return mouse;
}
// update mouse in listener
// use getMouse as point to make an animation use your mouse position
```

< [Concepts](Getting-Started.md) | [Data Types](Data-Types.md) >
