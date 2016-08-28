
/**
 * A collection of calculators. A calculator is responsible for performing
 * mathematical operations for a specific animatable data type.
 *
 * @class anim8.calculator
 */
var Calculators = {};

/**
 * A calculator for numbers.
 *
 * @property {CalculatorNumber} number
 * @for anim8.Calculators
 */
Calculators['number'] = new CalculatorNumber();

/**
 * A calculator for 2d points; objects with x & y Number components.
 *
 * @property {Calculator2d} 2d
 * @for anim8.Calculators
 */
Calculators['2d'] = new Calculator2d();

/**
 * A calculator for 3d points; objects with x, y, & z Number components.
 *
 * @property {Calculator3d} 3d
 * @for anim8.Calculators
 */
Calculators['3d'] = new Calculator3d();

/**
 * A calculator for quaternions; objects with x, y, z, & angle Number components.
 *
 * @property {CalculatorQuaternion} quaternion
 * @for anim8.Calculators
 */
Calculators['quaternion'] = new CalculatorQuaternion();

/**
 * A calculator for opaque colors; objects with r, g, & b Number components.
 *
 * @property {CalculatorRGB} rgb
 * @for anim8.Calculators
 */
Calculators['rgb'] = new CalculatorRGB();

/**
 * A calculator for colors; objects with r, g, b, & a Number components.
 *
 * @property {CalculatorRGBA} rgba
 * @for anim8.Calculators
 */
Calculators['rgba'] = new CalculatorRGBA();

/**
 * A calculator for strings.
 *
 * @property {CalculatorString} string
 * @for anim8.Calculators
 */
Calculators['string'] = new CalculatorString();

/**
 * The default calculator.
 *
 * @property {CalculatorNumber} default
 * @for anim8.Calculators
 */
Calculators['default'] = Calculators['number'];
