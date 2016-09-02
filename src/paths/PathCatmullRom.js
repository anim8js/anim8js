
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
  this.set( calculator, points, loop, PathCatmullRom.MATRIX, PathCatmullRom.WEIGHT );
}

Class.extend( PathCatmullRom, PathParametric,
{
  copy: function()
  {
    return new PathCatmullRom( this.name, this.calculator, copy(this.points), this.loop );
  }
});

PathCatmullRom.WEIGHT = 0.5;
PathCatmullRom.MATRIX = [
  [ 0, 2, 0, 0],
	[-1, 0, 1, 0],
	[ 2,-5, 4,-1],
	[-1, 3,-3, 1]
];
