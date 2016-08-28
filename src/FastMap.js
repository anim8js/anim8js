
/**
 * A FastMap has the key-to-value benefits of a map and iteration benefits of an
 * array. This is especially beneficial when most of the time the contents of
 * the structure need to be iterated and order doesn't matter (since removal
 * performs a swap which breaks insertion order).
 *
 * @param {FastMap|Object} map
 * @class FastMap
 * @constructor
 */
function FastMap(map)
{
  this.reset();

  if ( map instanceof FastMap )
  {
    this.putMap( map );
  }
  else if ( isObject( map ) )
  {
    for (var prop in map)
    {
      this.put( prop, map[ prop ] );
    }
  }
}

Class.define( FastMap,
{

  /**
   * Resets the map by initializing the values, keys, and indexes.
   *
   * @method reset
   * @chainable
   */
  reset: function()
  {
    /**
     * An array of the values in this map.
     *
     * @property {Array} values
     */
    this.values = [];

    /**
     * An array of the keys in this map.
     *
     * @property {Array} keys
     */
    this.keys = [];

    /**
     * An object of key to index mappings.
     *
     * @property {Object} indices
     */
    this.indices = {};

    return this;
  },

  /**
   * Puts the value in the map by the given key.
   *
   * @method put
   * @param {String} key
   * @param {V} value
   * @chainable
   */
  put: function(key, value)
  {
    if ( key in this.indices )
    {
      this.values[ this.indices[ key ] ] = value;
    }
    else
    {
      this.indices[ key ] = this.values.length;
      this.values.push( value );
      this.keys.push( key );
    }

    return this;
  },

  /**
   * Puts all keys & values on the given map into this map overwriting any existing values mapped by similar keys.
   *
   * @method putMap
   * @param {FastMap} map
   * @chainable
   */
  putMap: function(map)
  {
    var keys = map.keys;
    var values = map.values;

    for (var i = 0; i < keys.length; i++)
    {
      this.put( keys[ i ], values[ i ] );
    }

    return this;
  },

  /**
   * Returns the value mapped by the given key.
   *
   * @method get
   * @param {String} key
   * @return {V}
   */
  get: function(key)
  {
    return this.values[ this.indices[ key ] ];
  },

  /**
   * Removes the value by a given key
   *
   * @method remove
   * @param {String} key
   * @chainable
   */
  remove: function(key)
  {
    var index = this.indices[ key ];

    if ( isNumber( index ) )
    {
      this.removeAt( index );
    }

    return this;
  },

  /**
   * Removes the value & key at the given index.
   *
   * @method removeAt
   * @param {Number} index
   * @chainable
   */
  removeAt: function(index)
  {
    var key = this.keys[ index ];
    var lastValue = this.values.pop();
    var lastKey = this.keys.pop();

    if ( index < this.values.length )
    {
      this.values[ index ] = lastValue;
      this.keys[ index ] = lastKey;
      this.indices[ lastKey ] = index;
    }

    delete this.indices[ key ];

    return this;
  },

  /**
   * Returns the index of the value in the array given a key.
   *
   * @method indexOf
   * @param {String} key
   * @return {Number}
   */
  indexOf: function(key)
  {
    return coalesce( this.indices[ key ], -1 );
  },

  /**
   * Returns whether this map has a value for the given key.
   *
   * @method has
   * @param {String} key
   * @return {Boolean}
   */
  has: function(key)
  {
    return key in this.indices;
  },

  /**
   * Returns whether the given input has overlap with keys in this map.
   *
   * @method hasOverlap
   * @param {FastMap|Object} map
   * @return {Boolean}
   */
  hasOverlap: function(map)
  {
    var keys = this.keys;
    var indices = map.indices;

    for (var i = 0; i < keys.length; i++)
    {
      if ( keys[i] in indices )
      {
        return true;
      }
    }

    return false;
  },

  /**
   * Returns the number of elements in the map.
   *
   * @method size
   * @return {Number}
   */
  size: function()
  {
    return this.values.length;
  },

  /**
   * Clears all keys & values from the map.
   *
   * @method clear
   * @chainable
   */
  clear: function()
  {
    this.values.length = 0;
    this.keys.length = 0;
    this.indices = {};

    return this;
  }

});
