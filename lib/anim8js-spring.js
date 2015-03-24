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
  reset: function(attribute, calculator, rest, position, gravity)
  {
    var calc = anim8.calculator( calculator );
    var a = anim8.attribute( attribute );
    
    this.attribute    = attribute;
    this.calculator   = calc;
    this.rest         = calc.parse( rest, a.defaultValue );
    this.position     = calc.parse( position, a.defaultValue );
    this.gravity      = calc.parse( gravity, calc.create() );
    this.velocity     = calc.create();
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
    
    var calc = this.calculator;
    
    // the number of elapsed seconds (maxed to avoid crazy behavior with low FPS)
    var dt = Math.min( (now - this.time) * 0.001, anim8.Spring.MAX_DT );
    
    // keep track of the starting position to determine whether the position has updated.
    var starting = calc.copy( {}, this.position );
    
    // call the update method which should update the position
    this.updateVelocity( dt );
    this.velocity = calc.adds( this.velocity, this.gravity, dt );
    this.position = calc.adds( this.position, this.velocity, dt );
    
    this.time = now;
    
    // track whether the attribute has updated so the animator knows if it needs to apply the attribute to the subject.
    var updated = !calc.isEqual( starting, this.position, anim8.Spring.EPSILON );
    
    if ( updated )
    {
      frame[ this.attribute ] = this.position;
    }
    
    return updated;
  },
  
  /**
   * Resolves the position to the expected format.
   */
  resolveRest: function()
  {
    return anim8.isFunction( this.rest ) ? this.rest() : this.rest;
  },
  
  /**
   * Method that's invoked on each update.
   *
   * @param {number} dt
   */
  updateVelocity: function(dt)
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
anim8.BoxSpring = function(attribute, calculator, position, rest, constant, gravity)
{
  var a = anim8.attribute( attribute );
    
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.acceleration   = this.calculator.create();
  this.constant       = this.calculator.parse( constant, a.defaultValue );
};

anim8.BoxSpring.prototype = new anim8.Spring();

anim8.BoxSpring.prototype.updateVelocity = function(dt)
{
  var calc = this.calculator;
  
  this.acceleration = calc.copy( this.acceleration, this.resolveRest() );
  this.acceleration = calc.sub( this.acceleration, this.position );
  this.acceleration = calc.mul( this.acceleration, this.constant );
  this.velocity     = calc.adds( this.velocity, this.acceleration, dt );
};

anim8.spring.box = function(spring)
{ 
  return new anim8.BoxSpring(
    spring.attribute,
    anim8.calculator( anim8.attribute( spring.attribute ).calculator ),
    spring.position,
    spring.rest,
    spring.constant,
    spring.gravity
  );
};




anim8.LinearSpring = function(attribute, calculator, position, rest, damping, stiffness, gravity)
{
  var a = anim8.attribute( attribute );
  
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.damping      = this.calculator.parse( damping, a.defaultValue );
  this.stiffness    = this.calculator.parse( stiffness, a.defaultValue );
  this.temp0        = this.calculator.create();
  this.temp1        = this.calculator.create();
};

anim8.LinearSpring.prototype = new anim8.Spring();

anim8.LinearSpring.prototype.updateVelocity = function(dt)
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
};

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







anim8.DistanceSpring = function(attribute, calculator, position, rest, distance, damping, stiffness, gravity)
{
  this.reset( attribute, calculator, rest, position, gravity );
  
  this.distance   = distance;
  this.damping    = damping;
  this.stiffness  = stiffness;
  this.temp       = this.calculator.create();
};

anim8.DistanceSpring.prototype = new anim8.Spring();

anim8.DistanceSpring.prototype.updateVelocity = function(dt)
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
    spring.stiffness,
    spring.gravity
  );
};