
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
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.damping      = damping;
  this.stiffness    = stiffness;
  this.temp0        = null;
  this.temp1        = null;
};

anim8.override( anim8.LinearSpring.prototype = new anim8.Spring(), 
{
  preupdate: function(animator)
  {
    anim8.Spring.prototype.preupdate.apply( this, arguments );

    var attribute = animator.getAttribute( this.attribute );
    var calc = this.calculator;

    this.damping      = this.parseValue( animator, this.damping, attribute.defaultValue );
    this.stiffness    = this.parseValue( animator, this.stiffness, attribute.defaultValue );
    this.temp0        = calc.create();
    this.temp1        = calc.create();
  },

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
anim8.spring['linear'] = function(spring)
{ 
  return new anim8.LinearSpring(
    spring.attribute,
    spring.calculator,
    anim8.coalesce( spring.position, true ),
    anim8.coalesce( spring.rest, true ),
    spring.damping,
    spring.stiffness,
    spring.gravity
  );
};