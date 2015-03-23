/**
 * Returns a spring if the provided argument is a spring, the name of a spring, or
 * an object with a spring type to be created. If none of these conditions are true
 * then false is returned.
 *
 * @param {anim8.Spring|string|object} spring
 */
anim8.spring = function(spring)
{
  if ( spring instanceof anim8.Spring )
  {
    return spring;
  }
  if ( anim8.isString( spring ) && spring in anim8.spring )
  {
    return anim8.spring[ spring ];
  }
  if ( anim8.isObject( spring ) && spring.type in anim8.spring )
  {
    return anim8.spring[ spring.type ]( spring );
  }
  
  return false;
};


/**
 * A spring has a resting point, a current position, and the velocity currently enacting on the position
 * based on the implementing classes logic.
 */
anim8.Spring = function()
{
};

anim8.Spring.prototype = 
{
  /**
   * Resets the spring's properties.
   * 
   * @param {string} attribute
   * @param {string|object} calculator
   * @param {any} rest
   * @param {any} position
   */
  reset: function(attribute, calculator, rest, position)
  {
    var a = anim8.attribute( attribute );
    
    this.attribute    = attribute;
    this.calculator   = anim8.calculator( calculator );
    this.rest         = this.calculator.parse( rest, a.defaultValue );
    this.position     = this.calculator.parse( position, a.defaultValue );
    this.velocity     = this.calculator.create();
    this.time         = 0;
  },
  
  /**
   * Updates the spring given the current time in milliseconds and the frame which
   * contains (or will contain) the attribute to which this spring is animating.
   *
   * @param {number} now
   * @param {object} frame
   */
  update: function(now, frame)
  {
    if (this.time === 0)
    {
      this.time = now;
    }
    
    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (now - this.time) * 0.001, anim8.Spring.MAX_DT );
    
    // keep track of the starting position to determine whether the position has updated.
    var starting = this.calculator.copy( {}, this.position );
    
    // call the update method which should update the position
    this.onUpdate( dt );
    
    this.time = now;
    
    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !this.calculator.isEqual( starting, this.position, anim8.Spring.EPSILON );
    
    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    
    return updated;
  },
  
  /**
   * Method that's invoked on each update.
   *
   * @param {number} dt
   */
  onUpdate: function(dt)
  {
    
  }
};

/**
 * The maximum elapsed time that should be used for the spring simulation. If you allow the elapsed time
 * to get to high the spring will overreact and produce undesirable results.
 */
anim8.Spring.MAX_DT = 0.1;

/**
 * The value used to determine whether two positions in a spring are different.
 */
anim8.Spring.EPSILON = 0.0001;




/**
 * A box spring is a simple string
 */
anim8.BoxSpring = function(attribute, calculator, position, rest, constant)
{
  var a = anim8.attribute( attribute );
    
  this.reset( attribute, calculator, rest, position );
  
  this.acceleration   = this.calculator.create();
  this.constant       = this.calculator.parse( constant, a.defaultValue );
};

anim8.BoxSpring.prototype = new anim8.Spring();

anim8.BoxSpring.prototype.onUpdate = function(dt)
{
  var calc = this.calculator;
  
  this.acceleration = calc.copy( this.acceleration, this.rest );
  this.acceleration = calc.sub( this.acceleration, this.position );
  this.acceleration = calc.mul( this.acceleration, this.constant );
  this.position     = calc.adds( this.position, this.acceleration, dt );
//  this.velocity     = calc.adds( this.velocity, this.acceleration, dt );
};

anim8.spring.box = function(spring)
{ 
  return new anim8.BoxSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.constant
  );
};




anim8.LinearSpring = function(attribute, calculator, position, rest, damping, stiffness)
{
  var a = anim8.attribute( attribute );
  
  this.reset( attribute, calculator, rest, position );
  
  this.damping      = this.calculator.parse( damping, a.defaultValue );
  this.stiffness    = this.calculator.parse( stiffness, a.defaultValue );
  this.temp0        = this.calculator.create();
  this.temp1        = this.calculator.create();
};

anim8.LinearSpring.prototype = new anim8.Spring();

anim8.LinearSpring.prototype.onUpdate = function(dt)
{
  // velocity += ((stiffness * (position - rest)) - (damping * velocity)) * elapsed.seconds;
	// position += velocity * elapsed.seconds;
    
  var calc = this.calculator;

  this.temp1 = calc.copy( this.temp1, this.damping );
  this.temp1 = calc.mul( this.temp1, this.velocity );
  
  this.temp0 = calc.copy( this.temp0, this.position );
  this.temp0 = calc.sub( this.temp0, this.rest );
  this.temp0 = calc.mul( this.temp0, this.stiffness );
  this.temp0 = calc.sub( this.temp0, this.temp1 );
  
  this.velocity = calc.adds( this.velocity, this.temp0, dt );
  this.position = calc.adds( this.position, this.velocity, dt );
};

anim8.spring.linear = function(spring)
{ 
  return new anim8.LinearSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.damping,
    spring.stiffness
  );
};







anim8.DistanceSpring = function(attribute, calculator, position, rest, distance, damping, stiffness)
{
  this.reset( attribute, calculator, rest, position );
  
  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = this.calculator.create();
};

anim8.DistanceSpring.prototype = new anim8.Spring();

anim8.DistanceSpring.prototype.onUpdate = function(dt)
{
  // d = DISTANCE( position, rest )
  // velocity += ((position - rest) / d * stiffness * |distance - d| - (damping * velocity)) * elapsed.seconds;
  // position += velocity * elapsed.seconds;

  var calc = this.calculator;
  var d = calc.distance( this.position, this.rest );
  
  this.temp = calc.copy( this.temp, this.position )
  this.temp = calc.sub( this.temp, this.rest );
  
  if ( d !== 0 )
  {
  	this.temp = calc.scale( this.temp, 1.0 / d );
  	this.temp = calc.scale( this.temp, (d - this.distance) * this.stiffness );
  }

  this.temp = calc.adds( this.temp, this.velocity, -this.damping );

  this.velocity = calc.adds( this.velocity, this.temp, dt );
  this.position = calc.adds( this.position, this.velocity, dt );
};

anim8.spring.distance = function(spring)
{ 
  return new anim8.DistanceSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.distance,
    spring.damping,
    spring.stiffness
  );
};