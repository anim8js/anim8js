import { DomAnimator, m8, DomAttributes, DomAttributeInputs } from 'anim8js';

let el: Element = document.createElement('DIV');
let an: DomAnimator = m8(el);

an.tween('opacity', 0, '+43');

