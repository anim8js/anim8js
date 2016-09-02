
/**
 * Instantiates a new PathParametricHermite.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathParametricHermite
 * @constructor
 * @extends PathParametric
 */
function PathParametricHermite(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathParametricHermite, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathParametricHermite.MATRIX, PathParametricHermite.WEIGHT, true );
  },

  copy: function()
  {
    return new PathParametricHermite( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                           [ 2,-2, 1, 2]   [p-1]
 * f(t) = [t^3, t^2, t, 1] * [-3, 3,-2,-1] * [ p ]
 *                           [ 0, 0, 1, 0]   [p+1]
 *                           [ 1, 0, 0, 0]   [p+2]
 */

PathParametricHermite.WEIGHT = 1.0;
PathParametricHermite.MATRIX = [
  [ 2,-2, 1, 2],
  [-3, 3,-2,-1],
  [ 0, 0, 1, 0],
  [ 1, 0, 0, 0]
];
