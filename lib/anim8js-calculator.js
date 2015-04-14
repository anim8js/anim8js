
/**
 * Returns a calculator based on the input. If the input is an instance of
 * anim8.Calculator it is immediately returned. If the input is a string the 
 * calculator with that name is returned. If no calculator could be determined
 * the default calculator is returned.
 *
 * @param {anim8.Calculator|String} calc
 * @return {anim8.Calculator}
 */
anim8.calculator = function(calc)
{
  if ( calc instanceof anim8.Calculator )
  {
    return calc;
  }
  if ( anim8.isString( calc ) && calc in anim8.calculator )
  {
    return anim8.calculator[ calc ];
  }
  
  return anim8.calculator.default;
};

/**
 * Instantiates a new Calculator instance.
 */
anim8.Calculator = function()
{

};

anim8.Calculator.prototype = 
{

  /**
   * Creates the constants for this calculator.
   */
  createConstants: function()
  {
    this.ZERO = this.create();
    this.ONE = this.parse( 1.0, this.ZERO );
    this.INFINITY = this.parse( Number.POSITIVE_INFINITY, this.ZERO );
  },

  /**
   * Parses the given input for a value this calculator understands.
   * 
   * @param  {T} x
   * @param  {T} defaultValue
   * @return {T|Function|false}
   */
  parse: function(x, defaultValue)
  {
    throw 'Calculator.parse not implemented';
  },

  /**
   * Copies a value and places it in out and returns out.
   * 
   * @param  {T} out
   * @param  {T} copy
   * @return {T}
   */
  copy: function(out, copy)
  {
    throw 'Calculator.copy not implemented';
  },

  /**
   * Clones the value and returns the clone.
   * 
   * @param {T} clone
   * @return {T}
   */
  clone: function(clone) 
  {
    return this.copy( this.create(), clone );
  },

  /**
   * Creates an empty value equivalent to zero.
   * 
   * @return {T}
   */
  create: function()
  {
    throw 'Calculator.create not implemented';
  },

  /**
   * Scales out by the given scalar value and returns out.
   * 
   * @param {T} out
   * @param {Number} scale
   * @return {T}
   */
  scale: function(out, scale) 
  {
    return this.adds( out, out, scale - 1 );
  },

  /**
   * Adds an amount to out and returns out.
   * 
   * @param {T} out
   * @param {T} amount
   * @return {T}
   */
  add: function(out, amount) 
  {
    return this.adds( out, amount, 1 );
  },

  /**
   * Adds an amount scaled by a scalar value to out and returns out.
   * 
   * @param {T} out
   * @param {T} amount
   * @param {Number} amountScale
   * @return {T}
   */
  adds: function(out, amount, amountScale)
  {
    throw 'Calculator.adds not implemented';
  },

  /**
   * Subtracts an amount from out and returns out.
   * 
   * @param {T} out
   * @param {T} amount
   * @return {T}
   */
  sub: function(out, amount) 
  {
    return this.adds( out, amount, -1 );
  },

  /**
   * Multiplies out by some amount and returns out.
   * 
   * @param {T} out
   * @param {T} scale
   * @return {T}
   */
  mul: function(out, scale)
  {
    throw 'Calculator.mul not implemented';
  },

  /**
   * Interpolates out between start & end given a delta value and returns out. 
   * A delta value typically lies between 0 and 1 inclusively.
   * 
   * @param {T} out
   * @param {T} start
   * @param {T} end
   * @param {Number} delta
   * @return {T}
   */
  interpolate: function(out, start, end, delta) 
  {
    out = this.zero( out );
    out = this.adds( out, start, 1 - delta );
    out = this.adds( out, end, delta );
    return out;
  },

  /**
   * Returns a random value between the given min and max.
   * 
   * @param {T} out
   * @param {T} min
   * @param {T} max
   * @return {T}
   */
  random: function(out, min, max)
  {
    return this.interpolate( out, min, max, Math.random() );
  },

  /**
   * Calculates the distance between the two values.
   * 
   * @param {T} a
   * @param {T} b
   * @return {Number}
   */
  distance: function(a, b)
  {
    return Math.sqrt( this.distanceSq( a, b ) );
  },

  /**
   * Calculates the squared distance between the two values.
   * 
   * @param {T} a
   * @param {T} b
   * @return {Number}
   */
  distanceSq: function(a, b)
  {
    throw 'Calculator.distanceSq not implemented';
  },

  /**
   * Returns the distance the given value is from zero.
   * 
   * @param {T} a
   * @return {Number}
   */
  length: function(a)
  {
    return this.distance( a, this.ZERO );
  },

  /**
   * Returns the squared distance the given value is from zero.
   * 
   * @param {T} a
   * @return {Number}
   */
  lengthSq: function(a)
  {
    return this.distanceSq( a, this.ZERO );
  },

  /**
   * Determines whether the given value is valid for this calculator.
   * 
   * @param {any} a
   * @return {Boolean}
   */
  isValid: function(a)
  {
    throw 'Calculator.isValid not implemented';
  },

  /**
   * Returns whether the given value is not a number or has a component which is
   * not a number.
   * 
   * @param {T} a
   * @return {Boolean}
   */
  isNaN: function(a)
  {
    throw 'Calculator.isNaN not implemented';
  },

  /**
   * Determines whether the given value is equivalent to zero given an 
   * acceptable distance from zero (epsilon).
   * 
   * @param {T} a
   * @param  {Number} epsilon
   * @return {Boolean}
   */
  isZero: function(a, epsilon)
  {
    throw 'Calculator.isZero not implemented';
  },

  /**
   * Determines whether the given values are equivalent up to an acceptable
   * distance apart.
   * 
   * @param {T} a
   * @param {T} b
   * @param {Number} epsilon
   * @return {Boolean}
   */
  isEqual: function(a, b, epsilon)
  {
    throw 'Calculator.isEqual not implemented';
  },

  /**
   * Sets out to the minimum value between the two values and returns out.
   * 
   * @param {T} out
   * @param {T} a
   * @param {T} b
   * @return {T}
   */
  min: function(out, a, b)
  {
    throw 'Calculator.min not implemented';
  },

  /**
   * Sets out to the maximum value between two values and returns out.
   * 
   * @param {T} out
   * @param {T} a
   * @param {T} b
   * @return {T}
   */
  max: function(out, a, b)
  {
    throw 'Calculator.max not implemented';
  },

  /**
   * Clamps out between the given minimum and maximum values and returns out.
   * 
   * @param {T} out
   * @param {T} min
   * @param {T} max
   * @return {T}
   */
  clamp: function(out, min, max)
  {
    var distSq = this.distanceSq( out, this.ZERO );

    if ( distSq < min * min )
    {
      return this.scale( out, min / Math.sqrt( distSq ) );
    }
    else if ( distSq > max * max )
    {
      return this.scale( out, max / Math.sqrt( distSq ) );
    }

    return out;
  },

  /**
   * Determines whether the given value appears to be a relative value. Relative
   * values are stored as strings starting with a plus or minus for positive or
   * negative respectively.
   * 
   * @param {any} x
   * @return {Boolean}
   */
  isRelative: function(x)
  {
    return anim8.isString( x ) && ( x[0] === '-' || x[0] === '+' );
  },

  /**
   * Returns the relative amount of the given relative value. If the value is 
   * not a valid relative value false is returned.
   * 
   * @param {String} x
   * @return {Number}
   */
  getRelativeAmount: function(x)
  {
    var z = parseFloat( x );

    return isNaN(z) ? false : z;
  }

};
