
/**
 * Instantiates a new PathQuadratic.
 * 
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @class PathQuadratic
 * @constructor
 * @extends Path
 */
anim8.PathQuadratic = function(name, calculator, p0, p1, p2)
{
  this.reset( name, calculator, [p0, p1, p2] );
};

anim8.override( anim8.PathQuadratic.prototype = new anim8.Path(),
{
  compute: function(out, d1)
  {
    var calc = this.calculator;
    var d2 = d1 * d1;
    var i1 = 1 - d1;
    var i2 = i1 * i1;
    
    out = calc.copy( out, this.resolvePoint( 0 ) );
    out = calc.scale( out, i2 );
    out = calc.adds( out, this.resolvePoint( 1 ), 2 * i1 * d1 );
    out = calc.adds( out, this.resolvePoint( 2 ), d2 );
      
    return out;
  },
  copy: function() 
  {
    return new anim8.PathQuadratic( this.name, this.calculator, this.points[0], this.points[1], this.points[2] );
  },
  isLinear: function()
  {
    return false;
  }
});


/**
 * Parses an object for a quadratic path.
 * 
 * @param {Object} path
 * @return {PathQuadratic}
 */
anim8.path['quadratic'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PathQuadratic(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 )
  );
};
