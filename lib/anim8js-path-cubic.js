
/**
 * Instantiates a new PathCubic.
 * 
 * @param {String|false} name
 * @param {anim8.Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @param {T} p3
 */
anim8.PathCubic = function(name, calculator, p0, p1, p2, p3)
{
  this.reset( name, calculator, [p0, p1, p2, p3] );
};

anim8.override( anim8.PathCubic.prototype = new anim8.Path(),
{
  compute: function(out, d1)
  {
    var calc = this.calculator;
    var d2 = d1 * d1;
    var d3 = d1 * d2;
    var i1 = 1 - d1;
    var i2 = i1 * i1;
    var i3 = i1 * i2;
    
    out = calc.copy( out, this.resolvePoint( 0 ) );
    out = calc.scale( out, i3 );
    out = calc.adds( out, this.resolvePoint( 1 ), 3 * i2 * d1 );
    out = calc.adds( out, this.resolvePoint( 2 ), 3 * i1 * d2 );
    out = calc.adds( out, this.resolvePoint( 3 ), d3 );
    
    return out;
  },
  copy: function() 
  {
    return new anim8.PathCubic( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
  },
  isLinear: function()
  {
    return false;
  }
});

/**
 * Parses an object for a cubic path.
 * 
 * @param {Object} path
 * @return {anim8.PathCubic}
 */
anim8.path['cubic'] = function(path)
{
  var calc = anim8.calculator( path.calculator );
  
  return new anim8.PathCubic(
    path.name,
    calc,
    calc.parse( path.p0 ),
    calc.parse( path.p1 ),
    calc.parse( path.p2 ),
    calc.parse( path.p3 )
  );
};
