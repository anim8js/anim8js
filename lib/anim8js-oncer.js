
/**
 * Instantiates a new Oncer which extends Attrimator.
 * 
 * @param {String} attribute
 * @param {T} value
 * @param {String|Number} delay
 * @param {Boolean} hasInitialState
 * @param {Parser} parser
 * @param {Attrimator} next
 * @class Oncer
 * @constructor
 * @extends Attrimator
 */
anim8.Oncer = function( attribute, value, delay, hasInitialState, parser, next, input ) 
{
  this.reset( attribute, parser, next );

  /**
   * The value that's set to the animator once.
   * 
   * @property {T} value
   */
  this.value = value;

  /**
   * Whether or not this event has an initial value which can be applied at the
   * start of the animation (or when 
   * {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} is invoked).
   * 
   * @property {Boolean} hasInitialState
   */
  this.hasInitialState  = anim8.coalesce( hasInitialState, true );

  this.delay            = anim8.delay( delay );
  this.applied          = false;
  this.input            = input;
};

anim8.override( anim8.Oncer.prototype = new anim8.Attrimator(),
{
  /**
   * Computes the value of this Oncer.
   *
   * @method getValue
   * @return {T}
   */
  getValue: function()
  {
    return anim8.isFunction( this.value ) ? this.value() : this.value;
  },
  finish: function(frame)
  {
    var update = !this.applied;

    if ( update )
    {
      frame[ this.attribute ] = this.getValue();
     
      this.applied = true;
    }

    return update;
  },
  start: function(now, animator)
  {
    this.prestart( now );

    this.value = animator.getAttribute( this.attribute ).parse( this.value );
    
    if ( anim8.isComputed( this.value ) )
    {
      this.value = this.value( this, animator );
    }

    this.applied = false;
  },
  startCycle: function(frame)
  {
    return this.hasInitialState && this.finish( frame );
  },
  update: function(elapsed, frame)
  {
    return elapsed >= this.delay && this.finish( frame );
  },
  valueAt: function(time, out)
  {
    if ( time < this.delay )
    {
      return false;
    }

    return this.getValue();
  },
  totalTime: function()
  {
    return Math.min( this.stopTime, this.delay );
  },
  clone: function()
  {
    return new anim8.Oncer( this.attribute, this.value, this.delay, this.hasInitialState, this.parser, this.next ? this.next.clone() : null );
  },
  hasComputed: function()
  {
    return anim8.isComputed( this.value );
  },
  isInfinite: function()
  {
    return false;
  },
  isFinished: function()
  {
    return this.applied;
  }
});