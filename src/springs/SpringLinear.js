
/**
 * Instantiates a new SpringLinear.
 *
 * @param {String|false} attribute
 * @param {Calculator} calculator
 * @param {T} position
 * @param {T} rest
 * @param {T} damping
 * @param {T} stiffness
 * @param {T} velocity
 * @param {T} gravity
 * @param {Boolean} finishOnRest
 * @class SpringLinear
 * @constructor
 * @extends Spring
 */
function SpringLinear(attribute, calculator, position, rest, damping, stiffness, velocity, gravity, finishOnRest)
{
  this.set( attribute, calculator, rest, position, velocity, gravity, finishOnRest );

  this.damping      = damping;
  this.stiffness    = stiffness;
  this.temp0        = null;
  this.temp1        = null;
}

Class.extend( SpringLinear, Spring,
{

  start: function(now, animator)
  {
    this._start( now, animator );

    var attribute = animator.getAttribute( this.attribute );
    var calc = this.calculator;

    this.damping      = this.parseValue( animator, this.damping, attribute.defaultValue );
    this.stiffness    = this.parseValue( animator, this.stiffness, attribute.defaultValue );
    this.temp0        = calc.create();
    this.temp1        = calc.create();
  },

  clone: function()
  {
    return new SpringLinear( this.attribute, this.calculator, this.position, this.rest, this.damping, this.stiffness, this.velocity, this.gravity, this.finishOnRest );
  },

  hasComputed: function()
  {
    return isComputed( this.rest ) ||
           isComputed( this.position ) ||
           isComputed( this.gravity ) ||
           isComputed( this.velocity ) ||
           isComputed( this.damping ) ||
           isComputed( this.stiffness );
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
