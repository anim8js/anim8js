
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
   * @param {Number} offset
   * @param {Function} [onNewAttribute]
   * @param {Object} [context]
   * @chainable
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
   * Inserts the given map into the beginning of this map. If a function is
   * provided as the second argument it is invoked whenever an attrimator in
   * the given map is new & added to this map.
   *
   * @method insertMap
   * @param {AttrimatorMap} map
   * @param {Function} [onNewAttribute]
   * @param {Object} [context]
   * @chainable
   */
  insertMap: function(map, onNewAttribute, context)
  {
    var attrimators = map.values;
    var duration = map.timeRemaining();
    var hasCallback = isFunction( onNewAttribute );

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var attrimator = attrimators[ i ];
      var attr = attrimator.attribute;
      var existing = this.get( attr );

      this.put( attr, attrimator );

      if ( existing )
      {
        if ( attrimator.isInfinite() )
        {
          attrimator.stopIn( duration );
        }
        else
        {
          existing.delay += (duration - attrimator.timeRemaining());
        }

        attrimator.queue( existing );
      }

      if ( hasCallback )
      {
        onNewAttribute.call( context || this, attrimator );
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
      this.playAttrimatorAt( attrimators[ i ], time );
    }

    return this;
  },

  playAttrimatorAt: function(attrimator, time)
  {
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
  },

  transitionMap: function(transition, attrimatorMap, getValue, getAttribute, placeAttrimator, getValueAt, stopAttrimator, context)
  {
    // TRANSITIONING:
    // If the animator doesn't have an attrimator for the given attribute just add the attrimator adding the total delay
    // If the animator has an attrimator currently...
    //   If the current attrimator or new attrimator don't have values at the desired times...
    //      Stop the current attrimator after the total delay (adding the delay of the new attrimator as well)
    //      Queue the new attrimator
    //   Else
    //      Create a path using the methods detailed above
    // If all is true and there's an attrimator left on the animator that isn't being transitioned, stop it after the total delay.

    // CREATING A TRANSITION PATH:
    // If intro & outro are 0, use Tween
    // If intro is 0, use Quadratic Path between current value, outro point, and first point on new path.
    // If outro is 0, use Quadratic Path between current value, first point on new path, and intro point.
    // If intro & outro are not 0, use Cubic Path between current value, outro point, first point on new path, and intro point.
    // If granularity is given > 1 then compile the path, compute intro & outro velocities, and compute deltas for new
    //    compiled path based on interpolated velocity over the path (knowing it's length and transition time)

    var attrimators = attrimatorMap.values;

    if ( this.hasOverlap( attrimatorMap ) )
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        var next = attrimators[ i ];
        var attr = next.attribute;
        var curr = this.get( attr );
        var currValue = getValue.call( context, attr );

        if ( curr && isDefined( currValue ) )
        {
          var attribute = getAttribute.call( context, attr );
          var calc = attribute.calculator;

          var p2 = next.valueAt( 0, calc.create() );

          if ( p2 !== false )
          {
            var transitionTime = transition.time;
            var p0 = calc.clone( currValue );
            var p1 = transition.outro ? getValueAt.call( context, curr, transition.outro, calc.create() ) : false;
            var p3 = transition.intro ? next.valueAt( transition.intro, calc.create() ) : false;
            var path = null;

            // If the intro is negative we can look into the past by looking a little bit into
            // the future and assume the past is going in the same direction (only the opposite).
            if ( p3 !== false && transition.intro < 0 && transition.lookup > 0 )
            {
              var pastLookahead = next.valueAt( transition.lookup, calc.create() );
              var pastVelocity = calc.sub( pastLookahead, p2 );

              if ( pastVelocity !== false )
              {
                var pastNegativeVelocity = calc.scale( pastVelocity, transition.intro / transition.lookup );
                var past = calc.add( pastNegativeVelocity, p2 );

                p3 = p2;
                p2 = past;
              }
            }

            // Build a path with as many of the points as possible.
            if ( p1 === false && p3 === false )
            {
              path = new Tween( attr, calc, p0, p2 );
            }
            else if ( p1 === false )
            {
              path = new PathQuadratic( attr, calc, p0, p2, p3 );
            }
            else if ( p3 === false )
            {
              path = new PathQuadratic( attr, calc, p0, p1, p2 );
            }
            else
            {
              path = new PathCubic( attr, calc, p0, p1, p2, p3 );
            }

            // If granularity is specified we will try to make the transition
            // smooth by maintaining exit (outro) velocity from the current attrimator
            // and interpolating it to the entrance (intro) velocity for the
            // attrimator we're transitioning into.
            if ( transition.granularity > 2 && transition.lookup > 0 )
            {
              var outTime  = p1 === false ? 0 : transition.outro;
              var outPoint = p1 === false ? p0 : p1;
              var outNext  = getValueAt.call( context, curr, outTime + transition.lookup, calc.create() );

              var inTime   = p3 === false ? 0 : transition.intro;
              var inPoint  = p3 === false ? p2 : p3;
              var inNext   = next.valueAt( inTime + transition.lookup, calc.create() );

              // We can only proceed if we have reference points to calculate
              // exit & entrance velocity.
              if ( outNext !== false && inNext !== false )
              {
                var outVelocity  = calc.sub( calc.clone( outNext ), outPoint );
                var outPerMillis = calc.length( outVelocity ) / transition.lookup;

                var inVelocity   = calc.sub( calc.clone( inNext ), inPoint );
                var inPerMillis  = calc.length( inVelocity ) / transition.lookup;

                var compiled = new PathCompiled( attr, path, transition.granularity );
                var points = compiled.points;
                var lastPoint = points.length - 1;
                var totalDistance = 0;
                var distances = [];

                for (var k = 0; k < lastPoint; k++)
                {
                  distances[ k ] = totalDistance;
                  totalDistance += calc.distance( points[ k ], points[ k + 1 ] );
                }
                distances[ lastPoint ] = totalDistance;

                if ( !isNaN( totalDistance ) )
                {
                  var requiredTime = 2.0 * totalDistance / (outPerMillis + inPerMillis);
                  var acceleration = 0.5 * (inPerMillis - outPerMillis) / requiredTime;
                  var timeDelta = requiredTime / lastPoint;
                  var deltas = [];

                  for (var k = 0; k < lastPoint; k++)
                  {
                    var time = k * timeDelta;
                    var position = outPerMillis * time + acceleration * time * time;

                    deltas[ k ] = position / totalDistance;
                  }
                  deltas[ lastPoint ] = 1.0;

                  path = new PathDelta( attr, calc, points, deltas );
                  transitionTime = requiredTime;
                }
              }
            }

            var transitionEvent = new Event( attr, path, transitionTime, transition.easing, 0, 0, 0, 1 );

            transitionEvent.next = next;
            transitionEvent.cycle = next.cycle;

            next.offset = transition.intro;

            placeAttrimator.call( context, transitionEvent );
          }
          else
          {
            stopAttrimator.call( context, curr, transition.time + next.delay );

            curr.queue( next );
            next.delay = 0;
          }
        }
        else
        {
          next.delay += transition.time;

          placeAttrimator.call( context, next );
        }
      }
    }
    // We don't need to transition, just play the events
    else
    {
      for (var i = attrimators.length - 1; i >= 0; i--)
      {
        placeAttrimator.call( context, attrimators[ i ] );
      }
    }

    return this;
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
