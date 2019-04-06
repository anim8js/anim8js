import { param, PathPointDefinition, resolve, path, DomAnimator, m8 } from 'anim8js';

let el: Element = document.createElement('DIV');
let an: DomAnimator = m8(el);

an.tween('opacity', 0, '+43');

path({
  type: 'point',
  
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
let h = resolve(g);

// param('meow').abs().scale(54);

let dom = {} as DomAnimator;

dom
.defer('once', 'finished')
  .play('wiggle')
  .defer('once', 'finished')
    .stop('opacity')
  .undefer()
.undefer();
