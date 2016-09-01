
/**
 * Instantiates a new PathLinear.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathLinear
 * @constructor
 * @extends PathDelta
 */
function PathLinear(name, calculator, points)
{
  this.name = name;
  this.set( calculator, points );
}

Class.extend( PathLinear, PathDelta,
{
  set: function(calculator, points)
  {
    var deltas = PathLinear.getTimes( calculator, points );

    this._set( calculator, points, deltas );
  },

  copy: function()
  {
    return new PathLinear( this.name, this.calculator, copy(this.points) );
  }
});

PathLinear.getTimes = function(calc, points)
{
  var n = points.length - 1;
	var distances = [];

	distances[ 0 ] = 0;

	for (var i = 1; i <= n; i++)
	{
		distances[ i ] = distances[ i - 1 ] + calc.distance( points[ i - 1 ], points[ i ] );
	}

	var invlength = 1.0 / distances[ n ];

	for (var i = 1; i < n; i++)
	{
		distances[ i ] *= invlength;
	}

  distances[ n ] = 0;

	return distances;
};
