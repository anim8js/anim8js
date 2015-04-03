/**
 * Calculators perform math and basic operations for a specific data structure.
 */

/**
 * Returns a calculator based on the input. If the input is an object that object is immediately returned.
 * If the input is a string the calculator with that name is returned. If no calculator could be determined
 * the default calculator is returned.
 *
 * @param {object|string} calc
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
   * [parse description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  parse: function(x, defaultValue)
  {
    throw 'Calculator.parse not implemented';
  },

  /**
   * [copy description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  copy: function(out, copy)
  {
    throw 'Calculator.copy not implemented';
  },

  /**
   * [clone description]
   * @param  {[type]}
   * @return {[type]}
   */
  clone: function(out) 
  {
    return this.copy( this.create(), out );
  },

  /**
   * [create description]
   * @return {[type]}
   */
  create: function()
  {
    throw 'Calculator.create not implemented';
  },

  /**
   * [scale description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  scale: function(out, scale) 
  {
    return this.adds( out, out, scale - 1 );
  },

  /**
   * [add description]
   * @param {[type]}
   * @param {[type]}
   */
  add: function(out, amount) 
  {
    return this.adds( out, amount, 1 );
  },

  /**
   * [adds description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  adds: function(out, amount, amountScale)
  {
    throw 'Calculator.adds not implemented';
  },

  /**
   * [sub description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  sub: function(out, amount) 
  {
    return this.adds( out, amount, -1 );
  },

  /**
   * [mul description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  mul: function(out, scale)
  {
    throw 'Calculator.mul not implemented';
  },

  /**
   * [interpolate description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  interpolate: function(out, start, end, delta) 
  {
    out = this.zero( out );
    out = this.adds( out, start, 1 - delta );
    out = this.adds( out, end, delta );
    return out;
  },

  /**
   * [distance description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  distance: function(a, b)
  {
    return Math.sqrt( this.distanceSq( a, b ) );
  },

  /**
   * [distanceSq description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  distanceSq: function(a, b)
  {
    throw 'Calculator.distanceSq not implemented';
  },

  /**
   * [isValid description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isValid: function(a)
  {
    throw 'Calculator.isValid not implemented';
  },

  /**
   * [isNaN description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isNaN: function(a)
  {
    throw 'Calculator.isNaN not implemented';
  },

  /**
   * [isZero description]
   * @param  {[type]}
   * @param  {[type]}
   * @return {Boolean}
   */
  isZero: function(a, epsilon)
  {
    throw 'Calculator.isZero not implemented';
  },

  /**
   * [isEqual description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {Boolean}
   */
  isEqual: function(a, b, epsilon)
  {
    throw 'Calculator.isEqual not implemented';
  },

  /**
   * [isRelative description]
   * @param  {[type]}
   * @return {Boolean}
   */
  isRelative: function(x)
  {
    return anim8.isString( x ) && ( x[0] === '-' || x[0] === '+' );
  },

  /**
   * [relativeAmount description]
   * @param  {[type]}
   * @return {[type]}
   */
  getRelativeAmount: function(x)
  {
    var z = parseFloat( x );

    return isNaN(z) ? false : z;
  }

};
