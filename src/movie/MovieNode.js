function MovieNode(start, end, next, prev, actions)
{
  // When the actions in this node start
  this.start = start;
  // The greatest finite stopTime for the actions
  this.end = end;
  this.callbacks = [];
  this.next = next || this;
  this.prev = prev || this;
  this.initializeActions( actions );
}

Class.define(
{
  initializeActions: function(actions)
  {
    this.actions = [];

    if ( isArray( actions ) )
    {
      var maxRemaining = 0;

      for (var i = 0; i < actions.length; i++)
      {
        var action = actions[i];

        if (action.end > this.start)
        {
          maxRemaining = Math.max( maxRemaining, action.attrimators.timeRemaining() );

          this.actions.push( action );
        }
      }

      this.end += maxRemaining;
    }
  },
  addAction: function(animators, attrimators, all)
  {
    var duration = attrimators.timeRemaining( true );
    var start = this.start;
    var end = start + duration;
    var action = new MovieAction( start, end, animators, attrimators, all );

    if ( isFinite( duration ) )
    {
      this.end = Math.max( this.end, end );
    }

    this.actions.push( action );
  },
  findActionFor: function(animators)
  {
    var actions = this.actions;

    for (var i = 0; i < actions.length; i++)
    {
      var action = actions[ i ];

      if ( action.animators === animators )
      {
        return action;
      }
    }

    return false;
  }
});

MovieNode.insertAfter = function(node, start)
{
  var time = coalesce( start, node.last );
  var after = new MovieNode( time, time, node.next, node, node.actions );

  node.next.prev = after;
  node.next = after;

  return after;
};
