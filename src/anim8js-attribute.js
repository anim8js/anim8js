function Attribute(prop)
{
  if (_isDefined(prop)) {
    this.prop = prop;
    this.calculator = m8.calculators[m8.properties[prop].calculator];
    this.value = this.calculator.create();
  }
}

Attribute.prototype.isComplex = function()
{
  return false;
};


function Attribute2d(x, y)
{
  this.x = x;
  this.y = y;
  this.calculator = m8.calculators['2d'];
}

Attribute2d.prototype = new Attribute();

Attribute2d.prototype.isComplex = function()
{
  return true;
};