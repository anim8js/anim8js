
/**
 * @class Core
 */

/**
 * Whether the animation cycle is currently running. This is true
 * when where are active animators and anim8.run is being called
 * and false otherwise.
 *
 * @property {Boolean} anim8.running
 * @readOnly
 */
anim8.running = false;

/**
 * Live Mode keeps the animation cycles running even when there aren't
 * Animators. For highly interactive applications enabling this may
 * take up more resources but it will result in smoother animations. When
 * the animation cycle goes from stopped to running it takes a few frames
 * to smooth out when this is false.
 *
 * @property {Boolean} anim8.live
 */
anim8.live = false;

/**
 * The anim8 instance for all active animators.
 *
 * @property {Animators} anim8.animating
 * @readOnly
 */
anim8.animating = new anim8.Animators();

/**
 * The function to call if animations need to be done.
 *
 * @method anim8.requestRun
 * @param {Function} callback
 */
anim8.requestRun = (function() 
{  
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var requestor = window.requestAnimationFrame;
  
  for (var x = 0; x < vendors.length && !requestor; ++x) 
  {
    requestor = window[ vendors[x] + 'RequestAnimationFrame' ];
  }
  
  if (!requestor)
  {
    var lastTime = 0;
    
    return function(callback)
    {
      var now = anim8.now();
      var timeToCall = Math.max( 1, anim8.defaults.frameRate - (now - lastTime) );
      var id = window.setTimeout( function() { callback( now + timeToCall ); }, timeToCall );
      lastTime = now + timeToCall;
      return id;
    };
  }
  
  return function(callback)
  {
    requestor( callback );
  };
  
})();

/**
 * Adds an animator to the list of animating if it isn't there already. If the 
 * animation loop isn't currently running it's started.
 *
 * @method anim8.add
 * @param {Animator} animator
 */
anim8.add = function(animator)
{
  if ( !animator.active )
  {
    anim8.animating.push( animator );
    
    animator.active = true;
  }
  
  if ( !anim8.running )
  {
    anim8.running = true;
    anim8.trigger('starting');
    anim8.requestRun( anim8.run );
  }
}

/**
 * Executes an animation loop cycle which consists of four operations:
 * 
 * 1. Call preupdate on all Animators
 * 2. Call update on all Animators
 * 3. Call apply on all Animators
 * 4. Remove finished Animators
 * 
 * When there are no more animating the loop cycle is stopped.
 *
 * @method anim8.run
 */
anim8.run = function() 
{
  anim8.trigger('begin');
  
  var now = anim8.now();
  
  // notify animators that we're about to update
  anim8.animating.each(function(animator)
  {
    animator.preupdate( now );
  });
  
  // update animating based on the current time
  anim8.animating.each(function(animator)
  {
    animator.update( now );
  });
  
  // apply the attributes calculated
  anim8.animating.each(function(animator)
  {
    animator.apply();
  });
  
  // if the animator is done remove it
  anim8.animating.filter(function(animator)
  {
    if ( animator.finished )
    {
      animator.deactivate();
      animator.active = false;
    }
    
    return animator.finished;
  });
  
  anim8.trigger('end');
  
  // if there are animators still remaining call me again!
  if ( anim8.animating.length || anim8.live )
  {
    anim8.requestRun( anim8.run );
  } 
  else 
  {
    anim8.running = false;
    anim8.trigger('finished');
  }
};

/**
 * Pauses all animators.
 *
 * **See:** {{#crossLink "Animator/pause:method"}}{{/crossLink}}
 *
 * @method anim8.pause
 * @param {String|Array} attributes
 * @return {anim8}
 */
anim8.pause = function(attributes)
{
  anim8.animating.pause( attributes );

  return anim8;
};

/**
 * Resumes all animators.
 * 
 * **See:** {{#crossLink "Animator/resume:method"}}{{/crossLink}}
 *
 * @method anim8.resume
 * @param {String|Array} attributes
 * @return {anim8}
 */
anim8.resume = function(attributes)
{
  anim8.animating.resume( attributes );

  return anim8;
};

/**
 * Stops all animators.
 * 
 * **See:** {{#crossLink "Animator/stop:method"}}{{/crossLink}}
 * 
 * @method anim8.stop
 * @param {String|Array} attributes
 * @return {anim8}
 */
anim8.stop = function(attributes)
{
  anim8.animating.stop( attributes );

  return anim8;
};

/**
 * Ends all animators.
 * 
 * **See:** {{#crossLink "Animator/end:method"}}{{/crossLink}}
 *
 * @method anim8.end
 * @param {String|Array} attributes
 * @return {anim8}
 */
anim8.end = function(attributes)
{
  anim8.animating.end( attributes );

  return anim8;
};

/**
 * Finishes all animators.
 * 
 * **See:** {{#crossLink "Animator/finish:method"}}{{/crossLink}}
 *
 * @method anim8.finish
 * @param {String|Array} attributes
 * @return {anim8}
 */
anim8.finish = function(attributes)
{
  anim8.animating.finish( attributes );

  return anim8;
};

/**
 * Add events to the animation cycle: begin, end, finished, starting
 */
anim8.eventize( anim8 );
