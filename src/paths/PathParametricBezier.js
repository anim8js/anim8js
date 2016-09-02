
/**
 * Instantiates a new PathParametricBezier.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathParametricBezier
 * @constructor
 * @extends PathParametric
 */
function PathParametricBezier(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathParametricBezier, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathParametricBezier.MATRIX, PathParametricBezier.WEIGHT, true );
  },

  copy: function()
  {
    return new PathParametricBezier( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                           [-1, 3,-3, 1]   [p-1]
 * f(t) = [t^3, t^2, t, 1] * [ 3,-6, 3, 0] * [ p ]
 *                           [-3, 3, 0, 0]   [p+1]
 *                           [ 1, 0, 0, 0]   [p+2]
 */

PathParametricBezier.WEIGHT = 1.0;
PathParametricBezier.MATRIX = [
  [-1, 3,-3, 1],
  [ 3,-6, 3, 0],
  [-3, 3, 0, 0],
  [ 1, 0, 0, 0]
];
