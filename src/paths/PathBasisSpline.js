
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
  this.set( calculator, points, loop, PathBasisSpline.MATRIX, PathBasisSpline.WEIGHT );
}

Class.extend( PathBasisSpline, PathParametric,
{
  copy: function()
  {
    return new PathBasisSpline( this.name, this.calculator, copy(this.points), this.loop );
  }
});

PathBasisSpline.WEIGHT = 1.0 / 6.0;
PathBasisSpline.MATRIX = [
  [-1, 3,-3, 1 ],
  [ 3,-6, 3, 0 ],
  [-3, 0, 3, 0 ],
  [ 1, 4, 1, 0 ]
];
