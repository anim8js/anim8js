
/**
 * Instantiates a Defer instance. Defer instances keep track of method calls
 * to call at a later time - after an event occurs. The first argument needs
 * to be a function which returns an instance of anim8.Defer when it's invoked.
 * The second argument is an array of methods that can be deferred.
 * 
 * @param {Function} factory
 * @param {Array} methods
 * @class Defer
 * @constructor
 */
anim8.Defer = function(factory, methods)
{
  this.$factory = factory;
  
  for (var i = 0; i < methods.length; i++)
  {  
    this[ methods[i] ] = this.$push( methods[i] );
  }
};

anim8.Defer.prototype = 
{  
  /**
   * Resets the defer instance.
   *
   * @method $reset
   * @param {Object} eventable
   * @param {Any} previous
   * @param {String} eventType
   * @param {String} event
   * @param {Function} callback
   */
  $reset: function(eventable, previous, eventType, event, callback)
  {
    this.$eventable = eventable;
    this.$previous = previous;
    this.$eventType = eventType;
    this.$event = event;
    this.$callback = callback;
    this.$calls = [];
    this.$next = [];
    
    if ( this.$isRoot() )
    {
      this.$register();
    }
  },

  /**
   * Determines whether this Defer instance is at the root.
   *
   * @method $isRoot
   * @return {Boolean}
   */
  $isRoot: function()
  {
    return this.$eventable === this.$previous;
  },

  /**
   * Registers this Defer instance with the eventable.
   *
   * @method $register
   */
  $register: function()
  {
    this.$eventable[ this.$eventType ]( this.$event, this.$run, this );
  },

  /**
   * Creates a defered function which passes the method and arguments for
   * any method call into an array of calls on this Defer instance.
   *
   * @method $push
   * @param {String} methodName
   * @return {Function}
   */
  $push: function(methodName)
  {
    return function() 
    {
      this.$calls.push( [methodName, arguments] );
      
      return this;
    };
  },

  /**
   * Executes all defered method calls and starts any child Defer instances.
   *
   * @method $run
   */
  $run: function() 
  {
    // Invoke the callback if one was given.
    if ( anim8.isFunction( this.$callback ) )
    {
      this.$callback.call( this.$eventable, this );
    }
    
    for (var i = 0; i < this.$calls.length; i++)
    {
      var call = this.$calls[ i ];
      
      this.$eventable[ call[0] ].apply( this.$eventable, call[1] );
    }
    
    for (var k = 0; k < this.$next.length; k++)
    {
      this.$next[ k ].$register();
    }
  },

  /**
   * Returns the object before the defer statement.
   *
   * @method undefer
   * @return {Any}
   */
  undefer: function()
  {
    return this.$previous;
  },

  /**
   * Defers any following method calls to after the given event is triggered. A
   * callback can be specified which is a function invoked after the event is
   * triggered.
   *
   * @method defer
   * @param {String} eventType
   * @param {String} event
   * @param {Function} callback
   * @return {Defer}
   */
  defer: function(eventType, event, callback)
  {
    var next = new this.$factory( this.$eventable, this, eventType, event, callback );
    
    this.$next.push( next );
    
    return next;
  }
  
};