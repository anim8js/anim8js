m8.Distance = function(d, squared)
{
  this.d = d;
  this.squared = squared || false;
};

m8.Distance.fromOrigin = function(x, y)
{
  return new m8.Distance(x * x + y * y, true);
};

m8.Distance.fromPoint = function(x0, y0, x1, y1)
{
  var dx = x1 - x0;
  var dy = y1 - y0;
  
  return new m8.Distance(dx * dx + dy * dy, true);
};

m8.Distance.prototype.dist = function()
{
  return this.squared ? Math.sqrt(this.d) : this.d;
};

m8.Distance.prototype.distsq = function()
{
  return this.squared ? this.d : this.d * this.d;
};

m8.Distance.prototype.gt = function(distance)
{
  return this.squared ? (this.d > distance * distance) : (this.d > distance);
};

m8.Distance.prototype.lt = function(distance)
{
  return this.squared ? (this.d < distance * distance) | (this.d < distance);
};