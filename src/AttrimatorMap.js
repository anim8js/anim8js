
/**
 * A map of attrimators by their attribute name.
 *
 * @class AttrimatorMap
 * @constructor
 * @extends FastMap
 */
function AttrimatorMap()
{
  this.reset();
}

Class.extend( AttrimatorMap, FastMap,
{

  /**
   * Sets the group identifier for attrimators in this map. If force is
   * specified it will overwrite any existing group identifier on attrimators.
   * If deep is true, then all next attrimators also could have their group
   * identifiers set.
   *
   * @method setGroup
   * @param {Number} groupId
   * @param {Boolean} [force=false]
   * @param {Boolean} [deep=false]
   */
  setGroup: function(groupId, force, deep)
  {
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[ i ];

      do
      {
        if ( !attrimator.groupId || force )
        {
          attrimator.groupId = groupId;
        }

        attrimator = attrimator.next;

      } while ( deep && attrimator );
    }
  },

  /**
   * Adds a delay to all attrimators in this map.
   *
   * @method delay
   * @param {Number} time
   * @return {AttrimatorMap}
   */
  delay: function(time)
  {
    var attrimators = this.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      attrimators[ i ].delay += time;
    }

    return this;
  },

  /**
   * Queues the attrimator on this map. If the attribute is already on this map
   * this is placed on the end of the Attrimator chain, otherwise the attrimator
   * is added to the map. If there is an attrimator already on the map it's
   * returned.
   *
   * @method queue
   * @param {Attrimator} attrimator
   * @return {Attrimator}
   */
  queue: function(attrimator)
  {
    var attr = attrimator.attribute;
    var current = this.get( attr );

    if ( current )
    {
      current.queue( attrimator );
    }
    else
    {
      this.put( attr, attrimator );
    }

    return current;
  },

  /**
   * Queues the given map to this map. The attrimators placed on this map are
   * queued and delayed in a way that they all start at the same time. If a
   * function is provided as the second argument it is invoked whenever an
   * attrimator in the given map is new & added to this map.
   *
   * @method queueMap
   * @param {AttrimatorMap} map
   * @param {Function} [onNewAttribute]
   * @param {Object} [context]
   * @chainable   188703090
   */
  queueMap: function(map, offset, onNewAttribute, context)
  {
    var maxRemaining = this.timeRemaining();
    var attrimators = map.values;
    var hasCallback = isFunction( onNewAttribute );
    var mapOffset = coalesce( offset, 0 );
    var timeOffset = maxRemaining + mapOffset;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = this.get( attr );

      if ( existing )
      {
        if ( existing.isInfinite() )
        {
          existing.stopIn( attrimator.delay + timeOffset );
        }
        else
        {
          attrimator.delay += (timeOffset - existing.timeRemaining());
        }

        existing.queue( attrimator );
      }
      else
      {
        attrimator.delay += timeOffset;

        this.put( attr, attrimator );

        if ( hasCallback )
        {
          onNewAttribute.call( context || this, attrimator );
        }
      }
    }

    return this;
  },

  /**
   * Removes the attrimator at the given index replacing it with the next
   * attrimator if one exists.
   *
   * @method unqueueAt
   * @param {Number} index
   * @chainable
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

    return this;
  },

  /**
   * Plays the given attrimators at the given time. This performs the necessary
   * stopping, queueing, and delaying of attrimators that may need to be done.
   *
   * @method playMapAt
   * @param {AttrimatorMap} attrimatorMap
   * @param {Boolean} all
   * @param {Number} time
   * @chainable
   */
  playMapAt: function(attrimatorMap, all, time)
  {
    if ( all )
    {
      this.stopNotPresentAt( attrimatorMap, time );
    }

    var attrimators = attrimatorMap.values;

    for (var i = 0; i < attrimators.length; i++)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = this.get( attr );

      if ( existing )
      {
        existing.nextAt( attrimator, time );
      }
      else
      {
        attrimator.delay += time;

        this.put( attr, attrimator );
      }
    }

    return this;
  },

  // TODO
  transitionMapAt: function(attrimatorMap, transition, all)
  {

  },

  /**
   * Finishes any attrimators on this animator that are not present in the given
   * map of attrimators. Optionally a delay in stopping them can be given.
   *
   * @method finishNotPresent
   * @param {AttrimatorMap} attrimatorMap
   * @param {Number} [delay=0]
   * @chainable
   * @protected
   */
  finishNotPresent: function(attrimatorMap, delay)
  {
    var attrimators = this.values;
    var stopIn = delay || 0;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( !attrimatorMap.has( attrimator.attribute ) )
      {
        attrimator.stopIn( stopIn );
      }
    }

    return this;
  },

  /**
   * Finishes any attrimators on this animator that are not present in the given
   * map of attrimators. Optionally a delay in stopping them can be given.
   *
   * @method stopNotPresentAt
   * @param {AttrimatorMap} attrimatorMap
   * @param {Number} time
   * @chainable
   * @protected
   */
  stopNotPresentAt: function(attrimatorMap, time)
  {
    var attrimators = this.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];

      if ( !attrimatorMap.has( attrimator.attribute ) )
      {
        attrimator.stopAt( time );
      }
    }

    return this;
  },

  /**
   * Clones this map returning a deep clone where all attrimators are cloned.
   *
   * @method clone
   * @return {AttrimatorMap}
   */
  clone: function()
  {
    var values = this.values;
    var keys = this.keys;
    var clone = new AttrimatorMap();

    for (var i = values.length - 1; i >= 0; i--)
    {
      clone.values[i] = values[i].clone();
      clone.keys[i] = keys[i];
      clone.indices[ keys[i] ] = i;
    }

    return clone;
  },

  /**
   * Returns the time remaining for all finite attrimators in this map. The time
   * remaining includes queued attrimators.
   *
   * @method timeRemaining
   * @return {Number}
   */
  timeRemaining: function(returnInfinity)
  {
    var maxRemaining = 0;
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[i];

      if ( !attrimator.isInfinite() )
      {
        maxRemaining = Math.max( maxRemaining, attrimator.timeRemaining() );
      }
      else if ( returnInfinity )
      {
        return Number.Infinity;
      }
    }

    return maxRemaining;
  },

  /**
   * Sets the cycle of the attrimators in this map. If there are attrimators
   * queued the are given the next cycle number. The final cycle number is
   * returned.
   *
   * @method applyCycle
   * @param {Number} nextCycle
   * @return {Number}
   */
  applyCycle: function(nextCycle)
  {
    var currentDepth = this.values;
    var nextDepth = null;

    while ( currentDepth.length )
    {
      nextDepth = [];

      for (var i = currentDepth.length - 1; i >= 0; i--)
      {
        var attrimator = currentDepth[ i ];

        attrimator.cycle = nextCycle;

        if ( attrimator.next )
        {
          nextDepth.push( attrimator.next );
        }
      }

      if ( nextDepth.length )
      {
        nextCycle++;
      }

      currentDepth = nextDepth;
    }

    return nextCycle;
  },

  /**
   * Iterates through all attrimators in this map, at any depth.
   *
   * @method iterate
   * @param  {Function} callback
   * @param  {Object} [context]
   * @chainable
   */
  iterate: function(callback, context)
  {
    var values = this.values;

    for (var i = values.length - 1; i >= 0; i--)
    {
      var attrimator = values[i];
      var previous = null;
      var depth = 0;

      while ( attrimator )
      {
        callback.call( context || this, attrimator, depth++, previous );

        attrimator = (previous = attrimator).next;
      }
    }

    return this;
  }

});
