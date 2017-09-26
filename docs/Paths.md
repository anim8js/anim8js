# Paths

< [Points](Points.md) | [Events](Events.md) >

A path is essentially a function which returns a point given a value between 0 and 1 (`compute( 0.5 )` returns a value halfway along the path). Paths are the main animation structure in anim8 - they define how an attribute animates over time. A simple example of a Path is what is referred to as a "tween". A tween is a path with a starting and ending point. With tweening, you can change the background color from blue to purple in a linear fashion. There are many path implementations available and are useful for different types of animation:

### Linear
- [tween](#tween)
- [jump](#jump)
- [delta](#delta)
- [linear](#linear)
- [keyframe](#keyframe)

### Curved
- [quadratic](#quadratic)
- [quadratic-corner](#quadratic-corner)
- [cubic](#cubic)
- [bezier](#bezier)
- [hermite](#hermite)
- [basis-spline](#basis-spline)
- [catmull-rom](#catmull-rom)
- [parametric](#parametric)

### Composite
- [sub](#sub)
- [combo](#combo)
- [compiled](#compiled)
- [uniform](#uniform)

<a href="#delta"></a>

You will see the term [delta](#delta) used throughout the definitions below. This represents the value passed to the `compute` function of a path. This value is expected to be between 0 and 1 - where 0 is the start of the path/animation and 1 is the end. Because easing functions are used in animation, the delta value may be less than 0 or greater than 1.

#### Following a Path

Below you will see paths being generated with the `anim8.path` factory function. You can pass these `anim8.Path` instances to the `anim8.Animator#follow` function like so:

```javascript
// Examples are below
var myPath = anim8.path({ /* ... definition ... */ });
// Move the position along the given path in 5 seconds
anim8( subject ).follow( 'position', myPath, '5s' );
```

You can also pass raw path definitions to the `follow` function, it doesn't have to be `anim8.Path` instances.

#### Animating along a Path
```javascript
// This animation definition can be passed to anim8.save, anim8.animation, or any of the animator animation functions
var animationDefinition = {
  path: { // the builder which converts the path definition below into an animation
    position: { // the attribute to animate
      // the actual path definition
      type: 'path-type',
      calculator: 'data-type', // (optional: this can be inferred by the attribute)
      /* ... remaining path definition (see below for examples) ...  */
    }
  }
};

// Save the animation for repeated use
anim8.save( 'myCachedAnimation', animationDefinition );

// Create an animation for repeated use
var myAnimationInstance = anim8.animation( animationDefinition );

// Play an animation. For best efficiency - you should avoid sending definitions directly to animation functions.
anim8( subject ).play( animationDefinition );
```

<hr>

## Tween

A tween is a linear path between two points. The starting point is returned when [delta](#delta) is 0.0 and the ending point is returned when [delta](#delta) is 1.0.

You can use tween paths in several ways:

#### Return a Path instance
```javascript
// myTween is instanceof anim8.Path
var myTween = anim8.path({
  type: 'tween',
  calculator: 'rgb',
  start: '#450067',
  end: 'black'
});
```

#### Create an Animation
```javascript
// Change my background color from the current color to black
var myTweenTo = {
  tweenTo: { // the name of the builder which generates the animation
    backgroundColor: 'black'
  }
};
// Change my background color from white to the current color
var myTweenFrom = {
  tweenFrom: {
    backgroundColor: 'white'
  }
};

// Save the animation (the name can be passed to animation functions)
anim8.save( 'myTweenTo', myTweenTo );
// Build an animation and get the object (which can be passed to animation functions)
var myTweenFromAnimation = anim8.animation( myTweenFrom );
// Play or queue the animation on the subject
anim8( subject ).play( myTweenTo );
anim8( subject ).queue( myTweenFromAnimation );
anim8( subject ).transition( 'myTweenTo' );
```

#### Directly on an Animator
```javascript
var animator = anim8( subject );
animator.tween( 'rotation', 45/*start*/, 135/*end*/ );
animator.tweenMany({
  scale: 1, // start
  alpha: 1
}, {
  scale: 2, // end
  alpha: 0.5
});
animator.tweenTo( 'backgroundColor', '#1122AA', '4s' );
animator.tweenManyTo({
  scale: 2,
  alpha: 0.5
});
animator.tweenFrom( 'backgroundColor', 'rgb(128, 255, 67)' );
animator.tweenManyFrom({
  scale: 1,
  alpha: 0
});
```

<hr>

## Jump

A jump is a "linear" path which moves a value between a set of points - without interpolating the value. So if the jump path is defined as `[0, 1, 5]` then the returned value will only be one of those values. This type of animation is useful if you want to "teleport" a value between points. This is also used in sprite animation - where each point represents a frame of the sprite to display.

You can use jump paths in several ways:

#### Return a Path instance
```javascript
// myJump is instanceof anim8.Path
var myJump = anim8.path({
  type: 'jump',
  points: [0, 2, 4, 5, 1, 0]
});
```


#### Create an Animation
```javascript
// Move the animation frame between the given frame indices
var myJump = {
  path: {
    animationFrame: {
      type: 'jump',
      points: [0, 1, 3]
    }
  }
};
// You can pass anim8.Path instances to the definition as well
var myJumpInstance = {
  path: {
    animationFrame: myJump
  }
};

// Save the animation (the name can be passed to animation functions)
anim8.save( 'myJump', myJump );
// Build an animation and get the object (which can be passed to animation functions)
var myJumpAnimation = anim8.animation( myJumpInstance );
// Play or queue the animation on the subject
anim8( subject ).play( myJump );
anim8( subject ).queue( myJumpAnimation );
anim8( subject ).transition( 'myJump' );
```

<hr>

## Delta

A delta is a "linear" path which moves a value between a set of points that can be varying `delta`s apart. The points to interpolate between is chosen based on an array of delta values. So if the points are defined as `[4, 2, 7]` and the deltas are defined as `[0, 0.1, 1]`

<hr>

## Linear

<hr>

## Keyframe

<hr>

## Quadratic

<hr>

## Quadratic Corner

<hr>

## Cubic

<hr>

## Bezier

<hr>

## Hermite

<hr>

## Basis Spline

<hr>

## Catmull-Rom

<hr>

## Parametric

<hr>

## Sub

<hr>

## Combo

<hr>

## Compiled

<hr>

## Uniform

< [Points](Points.md) | [Events](Events.md) >
