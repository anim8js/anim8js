
/**
 * Instantiates a new DistanceSpring.
 * 
 * @param {String|false} attribute
 * @param {anim8.Calculator} calculator
 * @param {T} position
 * @param {T} rest
 * @param {Number} distance
 * @param {Number} damping
 * @param {Number} stiffness
 * @param {T} velocity
 * @param {T} gravity
 * @param {Boolean} finishOnRest
 */
anim8.DistanceSpring = function(attribute, calculator, position, rest, distance, damping, stiffness, velocity, gravity, finishOnRest)
{
  this.set( attribute, calculator, rest, position, velocity, gravity, finishOnRest );
  
  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = null;
};

anim8.override( anim8.DistanceSpring.prototype = new anim8.Spring(), 
{
  start: function(now, animator)
  {
    anim8.Spring.prototype.start.apply( this, arguments );
    
    this.temp = this.calculator.create();
  },
  clone: function()
  {
    return new anim8.DistanceSpring( this.attribute, this.calculator, this.position, this.rest, this.distance, this.damping, this.stiffness, this.velocity, this.gravity, this.finishOnRest );
  },
  updateVelocity: function(dt)
  {
    // d = DISTANCE( position, rest )
    // velocity += ((position - rest) / d * stiffness * |distance - d| - (damping * velocity)) * elapsed.seconds;
    // position += velocity * elapsed.seconds;

    var calc = this.calculator;
    var rest = this.resolveRest();
    
    var d = calc.distance( this.position, rest );
    
    this.temp = calc.copy( this.temp, this.position )
    this.temp = calc.sub( this.temp, rest );
    
    if ( d !== 0 )
    {
      this.temp = calc.scale( this.temp, 1.0 / d );
      this.temp = calc.scale( this.temp, (d - this.distance) * this.stiffness );
    }

    this.temp = calc.adds( this.temp, this.velocity, -this.damping );

    this.velocity = calc.adds( this.velocity, this.temp, dt );
  }
});

/**
 * Register the spring parser.
 * 
 * @param {Object}
 * @return {anim8.LinearSpring}
 */
anim8.spring['distance'] = function(spring)
{ 
  return new anim8.DistanceSpring(
    spring.attribute,
    spring.calculator,
    anim8.coalesce( spring.position, true ),
    anim8.coalesce( spring.rest, true ),
    spring.distance,
    spring.damping,
    spring.stiffness,
    spring.velocity,
    spring.gravity,
    spring.finishOnRest
  );
};