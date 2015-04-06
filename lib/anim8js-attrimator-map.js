
/**
 * [AttributeMap description]
 */
anim8.AttrimatorMap = function()
{
  this.reset();
};

anim8.override( anim8.AttrimatorMap.prototype = new anim8.FastMap(),
{

  /**
   * [queue description]
   * @param  {[type]}
   * @return {[type]}
   */
  queue: function(attrimator)
  {
    var attr = attrimator.attribute;

    if ( this.has( attr ) )
    {
      this.get( attr ).queue( attrimator );
    }
    else
    {
      this.put( attr, attrimator );
    }
  },

  /**
   * [queueMap description]
   * @param  {[type]}
   * @param  {[type]}
   * @param  {[type]}
   * @return {[type]}
   */
  queueMap: function(map, onNewAttribute, context)
  {
    var maxRemaining = this.timeRemaining();
    var attrimators = map.values;
    
    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = this.get( attr );

      if ( existing && !existing.isInfinite() )
      {
        attrimator.delay += (maxRemaining - existing.timeRemaining());

        existing.queue( attrimator );
      }
      else
      {
        attrimator.delay += maxRemaining;
        
        this.put( attr, attrimator );

        if ( anim8.isFunction( onNewAttribute ) )
        {
          onNewAttribute.call( context || this, attrimator );
        }
      }
    }
    
    return this;
  },

  /**
   * [unqueue description]
   * @param  {[type]}
   * @return {[type]}
   */
  unqueueAt: function(index)
  {
    var current = this.values[ index ];

    if ( current.next )
    {
      this.values[ index ] = current.next;
    }
    else
    {
      this.removeAt( index );
    }
  },

  /**
   * [clone description]
   * @return {[type]}
   */
  clone: function()
  {
    var values = this.values;
    var keys = this.keys;
    var clone = new anim8.AttrimatorMap();

    for (var i = values.length - 1; i >= 0; i--)
    {
      clone.values[i] = values[i].clone();
      clone.keys[i] = keys[i];
      clone.indices[ keys[i] ] = i;
    }

    return clone;
  },

  /**
   * [timeRemaining description]
   * @return {[type]}
   */
  timeRemaining: function()
  {
    var remaining = 0;
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[i];

      if ( !attrimator.isInfinite() )
      {
        remaining = Math.max( remaining, attrimator.timeRemaining() );
      }
    }

    return remaining;
  }

});