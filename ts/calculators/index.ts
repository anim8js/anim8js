
import { Calculator2d } from './Calculator2d';
import { Calculator3d } from './Calculator3d';
import { CalculatorNumber } from './CalculatorNumber';
import { CalculatorQuaternion } from './CalculatorQuaternion';
import { CalculatorColor } from './CalculatorColor';
import { CalculatorString } from './CalculatorString';

const CALCULATORS = {
  'number':     new CalculatorNumber(),
  '2d':         new Calculator2d(),
  '3d':         new Calculator3d(),
  'quaternion': new CalculatorQuaternion(),
  'color':      new CalculatorColor(),
  'string':     new CalculatorString()
};

export default {
  'number':     CALCULATORS['number'],
  '2d':         CALCULATORS['2d'],
  '3d':         CALCULATORS['3d'],
  'quat':       CALCULATORS['quaternion'],
  'quaternion': CALCULATORS['quaternion'],
  'rgb':        CALCULATORS['color'],
  'rgba':       CALCULATORS['color'],
  'color':      CALCULATORS['color'],
  'string':     CALCULATORS['string'],
  'default':    CALCULATORS['number']
};