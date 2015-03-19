anim8.Path = function(name, points, deltas, calculator) 
{
  this.name = name;
  this.points = points;        
  this.deltas = deltas;
  this.calculator = calculator || anim8.calculator.default;
  this.trues = this.hasTrue();
};

anim8.Path.prototype = 
{
  compute: function(out, delta) 
	{
    var ds = this.deltas;
    var end = ds.length - 2;
    var i = 0;
    while (ds[i + 1] < delta && i < end) i++;
    var d0 = ds[i];
    var d1 = ds[i + 1];
    var pd = (delta - d0) / (d1 - d0);
    var p0 = this.points[i];
    var p1 = this.points[i + 1];
    
    return this.calculator.interpolate( out, p0, p1, pd );
  },
  hasTrue: function() 
	{
    var ps = this.points;
    for (var i = 0; i < ps.length; i++) {
      if (ps[i] === true) {
        return true;
      }
    }
    return false;
  },
  reference: function() 
	{
    return this.trues ? this.copy() : this;
  },
  copy: function() 
	{
    return new anim8.Path( this.name, anim8.copy(this.points), anim8.copy(this.deltas), this.calculator );
  }
};