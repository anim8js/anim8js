
/**
 * Instantiates a new PathBezier.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {Array} points
 * @class PathBezier
 * @constructor
 * @extends Path
 */
function PathBezier(name, calculator, points, weights)
{
  this.name = name;
  this.set( calculator, points, weights );
}

Class.extend( PathBezier, Path,
{
  set: function(calculator, points, weights)
  {
    this.reset( calculator, points );
    this.weights = weights || PathBezier.computeWeights( points.length );
    this.inverses = new Array( points.length );
  },

  compute: function(out, delta)
  {
    var calc = this.calculator;
    var inverses = this.inverses;
    var weights = this.weights;
    var n = this.points.length;
    var x = 1;

    inverses[n - 1] = 1;

    for (var i = n - 2; i >= 0; i--)
    {
      inverses[i] = inverses[i + 1] * (1 - delta);
    }

    out = calc.zero( out );

    for (var i = 0; i < n; i++)
    {
      out = calc.adds( out, this.resolvePoint( i, delta ), weights[ i ] * inverses[ i ] * x );

      x *= delta;
    }

    return out;
  },

  copy: function()
  {
    return new PathBezier( this.name, this.calculator, copy(this.points), this.weights );
  },

  isLinear: function()
  {
    return false;
  }
});

PathBezier.computeWeights = function(n)
{
  var w = new Array( n-- );

  for (var i = 0; i <= n; i++)
  {
    w[ i ] = choose( n, i );
  }

  return w;
};
