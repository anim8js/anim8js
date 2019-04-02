
/**
 * Instantiates a new PathHermite.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} start
 * @param {T} startTangent
 * @param {T} end
 * @param {T} endTangent
 * @class PathHermite
 * @constructor
 * @extends Path
 */
function PathHermite(name, calculator, start, startTangent, end, endTangent)
{
  this.name = name;
  this.set( calculator, start, startTangent, end, endTangent );
}

Class.extend( PathHermite, Path,
{
  set: function(calculator, start, startTangent, end, endTangent)
  {
    this.reset( calculator, [start, end] );
    this.startTangent = startTangent;
    this.endTangent = endTangent;
  },

  compute: function(out, d)
  {
    var calc = this.calculator;
    var d2 = d * d;
    var d3 = d2 * d;

    out = calc.zero( out );
    out = calc.adds( out, this.resolvePoint( 0, d ), 2 * d3 - 3 * d2 + 1 );
    out = calc.adds( out, this.resolvePoint( 1, d ), -2 * d3 + 3 * d2 );
    out = calc.adds( out, resolve( this.startTangent ), d3 - 2 * d2 + d );
    out = calc.adds( out, resolve( this.endTangent ), d3 - d2 );

    return out;
  },

  copy: function()
  {
    return new PathHermite( this.name, this.calculator, this.points[0], this.startTangent, this.points[1], this.endTangent );
  },

  isLinear: function()
  {
    return false;
  }
});
