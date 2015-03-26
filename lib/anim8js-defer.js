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
	$reset: function(eventable, previous, eventType, event)
	{
		this.$eventable = eventable;
		this.$previous = previous;
		this.$eventType = eventType;
		this.$event = event;
		this.$calls = [];
		this.$next = [];
		
		if ( this.$isRoot() )
		{
			this.$register();
		}
	},
	$isRoot: function()
	{
		return this.$eventable === this.$previous;
	},
	$register: function()
	{
		this.$eventable[ this.$eventType ]( this.$event, this.$run, this );
	},
	$push: function(methodName)
	{
		return function() 
		{
			this.$calls.push( [methodName, arguments] );
			
			return this;
		};
	},
	$run: function() 
	{
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
	undefer: function()
	{
		return this.$previous;
	},
	defer: function(eventType, event)
	{
		var next = new this.$factory( this.$eventable, this, eventType, event );
		
		this.$next.push( next );
		
		return next;
	}
};