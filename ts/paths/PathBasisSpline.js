
/**
 * Instantiates a new PathBasisSpline.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathBasisSpline
 * @constructor
 * @extends PathParametric
 */
function PathBasisSpline(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathBasisSpline, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathBasisSpline.MATRIX, PathBasisSpline.WEIGHT, true );
  },

  copy: function()
  {
    return new PathBasisSpline( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                                 [-1, 3,-3, 1]   [p-1]
 * f(t) = [t^3, t^2, t, 1] * 1/6 * [ 3,-6, 3, 0] * [ p ]
 *                                 [-3, 0, 3, 0]   [p+1]
 *                                 [ 1, 4, 1, 0]   [p+2]
 */

PathBasisSpline.WEIGHT = 1.0 / 6.0;
PathBasisSpline.MATRIX = [
  [-1, 3,-3, 1],
  [ 3,-6, 3, 0],
  [-3, 0, 3, 0],
  [ 1, 4, 1, 0]
];
