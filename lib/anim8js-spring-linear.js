
/**
 * [LinearSpring description]
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 * @param {[type]}
 */
anim8.LinearSpring = function(attribute, calculator, position, rest, damping, stiffness, gravity)
{
  var a = anim8.attribute( attribute );
  
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.damping      = this.calculator.parse( damping, a.defaultValue );
  this.stiffness    = this.calculator.parse( stiffness, a.defaultValue );
  this.temp0        = this.calculator.create();
  this.temp1        = this.calculator.create();
};

anim8.override( anim8.LinearSpring.prototype = new anim8.Spring(), 
{
  updateVelocity: function(dt)
  {
    // velocity += ((stiffness * (position - rest)) - (damping * velocity)) * elapsed.seconds;
    // position += velocity * elapsed.seconds;
      
    var calc = this.calculator;

    this.temp1 = calc.copy( this.temp1, this.damping );
    this.temp1 = calc.mul( this.temp1, this.velocity );
    
    this.temp0 = calc.copy( this.temp0, this.position );
    this.temp0 = calc.sub( this.temp0, this.resolveRest() );
    this.temp0 = calc.mul( this.temp0, this.stiffness );
    this.temp0 = calc.sub( this.temp0, this.temp1 );
    
    this.velocity = calc.adds( this.velocity, this.temp0, dt );
  }
});

/**
 * Register the spring parser.
 * 
 * @param  {object}
 * @return {anim8.LinearSpring}
 */
anim8.spring.linear = function(spring)
{ 
  return new anim8.LinearSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};