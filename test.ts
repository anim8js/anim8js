import { Input, Value2d, path, param, resolve } from 'anim8js';

path({
  type: 'point',
  point: 3
})

const x = 43;
let y;

let a: number = 4;
let b = resolve(a);

let c = () => 43;
let d = resolve(c);

let e = (x: number, y: boolean) => x * 3;
let f = resolve(e, [45, false]);

let g = (x: number, y: boolean) => x * 3;;
// let h = resolve(g); // supposed to error

param('meow').abs().scale(54);

let z: Input<Value2d> = { x: 0 };
let w: Input<string> = ['{ y: 5, x: 9 }'];