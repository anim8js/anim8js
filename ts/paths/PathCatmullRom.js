
/**
 * Instantiates a new PathCatmullRom.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @param {Boolean} loop
 * @class PathCatmullRom
 * @constructor
 * @extends PathParametric
 */
function PathCatmullRom(name, calculator, points, loop)
{
  this.name = name;
  this.set( calculator, points, loop );
}

Class.extend( PathCatmullRom, PathParametric,
{
  set: function(calculator, points, loop)
  {
    this._set( calculator, points, loop, PathCatmullRom.MATRIX, PathCatmullRom.WEIGHT, false );
  },

  copy: function()
  {
    return new PathCatmullRom( this.name, this.calculator, copy(this.points), this.loop );
  }
});

/** http://www.cs.cornell.edu/Courses/cs4620/2013fa/lectures/16spline-curves.pdf
 *
 *                                 [-1, 3,-3, 1]   [p-1]
 * f(t) = [1, t, t^2, t^3] * 1/2 * [ 3,-6, 3, 0] * [ p ]
 *                                 [-3, 0, 3, 0]   [p+1]
 *                                 [ 1, 4, 1, 0]   [p+2]
 */

PathCatmullRom.WEIGHT = 0.5;
PathCatmullRom.MATRIX = [
  [ 0, 2, 0, 0],
	[-1, 0, 1, 0],
	[ 2,-5, 4,-1],
	[-1, 3,-3, 1]
];
