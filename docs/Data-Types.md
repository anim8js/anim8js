# Data Types

< [Concepts](Getting-Started.md) | [Points](Points.md) >

There are 7 data types that are supported out of the box:

- `number`: 3.2
- `2d`: {x: 0, y: 1.5}
- `3d`: {x: 2, y: -4, z: 0.1}
- `quaternion`: {x: 0, y: 0, z: 1, angle: 45}
- `rgb`: {r: 128, g: 0, b: 255}
- `rgba`: {r: 128, g: 0, b: 255, a: 0.5}
- `string`: 'visible'

The examples above show the format to which they're stored in anim8 - in the next section ([Points](Points.md)) you'll see that there are multiple acceptable input formats for each data type.

These data types are "supported" because they have a [calculator](Concepts.md#calculator) implementation. You can add your own data types by extending the anim8.Calculator class and registering it with anim8.Calculators like so:

```javascript
function MyCalculator()
{
  this.createConstants();
}

anim8.Class.extend( MyCalculator, anim8.Calculator,
{
    // implement: parse, copy, zero, convert, create, adds, mul, div, distanceSq, isValid, isNaN, isZero, isEqual, min, max, & dot
});

anim8.Calculators['my'] = new MyCalculator();
```

< [Concepts](Getting-Started.md) | [Points](Points.md) >
