
/**
 * Instantiates a new SpringDistance.
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
 * @class SpringDistance
 * @constructor
 * @extends Spring
 */
function SpringDistance(attribute, calculator, position, rest, distance, damping, stiffness, velocity, gravity, finishOnRest)
{
  this.set( attribute, calculator, rest, position, velocity, gravity, finishOnRest );

  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = null;
}

Class.extend( SpringDistance, Spring,
{

  start: function(now, animator)
  {
    this._start( now, animator );

    this.temp = this.calculator.create();
  },

  clone: function()
  {
    return new SpringDistance( this.attribute, this.calculator, this.position, this.rest, this.distance, this.damping, this.stiffness, this.velocity, this.gravity, this.finishOnRest );
  },

  updateVelocity: function(dt)
  {
    // d = DISTANCE( position, rest )
    // velocity += ((position - rest) / d * stiffness * |distance - d| - (damping * velocity)) * elapsed.seconds;
    // position += velocity * elapsed.seconds;

    var calc = this.calculator;
    var rest = this.resolveRest();

    var d = calc.distance( this.position, rest );

    this.temp = calc.copy( this.temp, this.position );
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
