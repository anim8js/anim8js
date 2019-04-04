
/**
 * @module anim8
 * @class Core
 */

/**
 * Converts a subject into an animator and returns it. If the subject
 * is already an animator it's returned immediately. If the subject can't be
 * animated then false is returned.
 *
 * **See:** {{#crossLink "Core/anim8.factoryFor:method"}}{{/crossLink}}
 *
 * @param {Any} subject
 * @return {Animator|false}
 * @method anim8
 */
function anim8(subject)
{
  if ( subject instanceof Animator )
  {
    return subject;
  }

  var factory = $factoryFor( subject, true );

  if ( factory === false )
  {
    return false;
  }

  return factory.animatorFor( subject );
}

/**
 * Add events to the animation cycle: begin, end, finished, starting
 */
eventize( anim8 );

/**
 * Converts an array of subjects into an array of Animators.
 *
 * @param {Array} subject
 * @return {Animators}
 * @method anim8s
 */
function anim8s(subjects)
{
  var factory = $factoryFor( subjects, true );
  var animators = [];

  if ( factory !== false )
  {
    factory.animatorsFor( subjects, animators );

    return new Animators( animators );
  }

  if ( !isArray( subjects ) )
  {
    subjects = [ subjects ];
  }

  var animators = [];

  for (var i = 0; i < subjects.length; i++)
  {
    var animator = anim8( subjects[i] );

    if ( animator !== false )
    {
      animators.push( animator );
    }
  }

  return new Animators( animators );
}

/**
 * Whether the animation cycle is currently running. This is true
 * when where are active animators and anim8.run is being called
 * and false otherwise.
 *
 * @property {Boolean} anim8.running
 * @readOnly
 */
var running = false;

/**
 * Live Mode keeps the animation cycles running even when there aren't
 * Animators. For highly interactive applications enabling this may
 * take up more resources but it will result in smoother animations. When
 * the animation cycle goes from stopped to running it takes a few frames
 * to smooth out when this is false.
 *
 * @property {Boolean} anim8.live
 */
var live = false;

/**
 * The anim8 instance for all active animators.
 *
 * @property {Animators} anim8.animating
 * @readOnly
 */
var animating = new Animators();


function isRunning()
{
  return running;
}

function isLive()
{
  return live;
}

function setLive(newLive)
{
  live = newLive;
}

/**
 * Adds an animator to the list of animating if it isn't there already. If the
 * animation loop isn't currently running it's started.
 *
 * @method anim8.add
 * @param {Animator} animator
 */
function activateAnimator(animator)
{
  pushAnimator( animator );

  activate();
}

function pushAnimator(animator)
{
  if ( !animator.active )
  {
    animator.active = true;
    animating.push( animator );
  }
}

function activate()
{
  if ( !running )
  {
    running = true;

    anim8.trigger('starting');

    requestRun( run );
  }
}

/**
 * The function to call if animations need to be done.
 *
 * @method anim8.requestRun
 * @param {Function} callback
 */
var requestRun = (function()
{
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var requestor = this.requestAnimationFrame || global.requestAnimationFrame;
  var setTimeout = this.setTimeout || global.setTimeout || setTimeout;

  for (var x = 0; x < vendors.length && !requestor; ++x)
  {
    requestor = global[ vendors[x] + 'RequestAnimationFrame' ];
  }

  if (!requestor)
  {
    var lastTime = 0;

    return function(callback)
    {
      var currentTime = now();
      var timeToCall = Math.max( Defaults.pauseTime, Defaults.frameRate - (currentTime - lastTime) );
      var id = setTimeout( function() { callback( currentTime + timeToCall ); }, timeToCall );
      lastTime = currentTime + timeToCall;
      return id;
    };
  }

  return function(callback)
  {
    requestor( callback );
  };

})();

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
function run()
{
  anim8.trigger('begin');

  var currentTime = now();
  var active = animating.length();

  // notify animators that we're about to update
  animating.preupdate( currentTime, active );

  // update animating based on the current time
  animating.update( currentTime, active );

  // apply the attributes calculated
  animating.apply( active );

  // if the animator is done remove it
  animating.filter( animating.handleFinished );

  // The loop has ended!
  anim8.trigger('end');

  // if there are animators still remaining call me again!
  if ( animating.length() || live )
  {
    requestRun( run );
  }
  else
  {
    running = false;

    anim8.trigger('finished');
  }
}

/**
 * Pauses all animators.
 *
 * **See:** {{#crossLink "Animator/pause:method"}}{{/crossLink}}
 *
 * @method anim8.pause
 * @param {String|Array} attributes
 * @return {anim8}
 */
function pause(attributes)
{
  animating.pause( attributes );

  return anim8;
}

/**
 * Resumes all animators.
 *
 * **See:** {{#crossLink "Animator/resume:method"}}{{/crossLink}}
 *
 * @method anim8.resume
 * @param {String|Array} attributes
 * @return {anim8}
 */
function resume(attributes)
{
  animating.resume( attributes );

  return anim8;
}

/**
 * Stops all animators.
 *
 * **See:** {{#crossLink "Animator/stop:method"}}{{/crossLink}}
 *
 * @method anim8.stop
 * @param {String|Array} attributes
 * @return {anim8}
 */
function stop(attributes)
{
  animating.stop( attributes );

  return anim8;
}

/**
 * Ends all animators.
 *
 * **See:** {{#crossLink "Animator/end:method"}}{{/crossLink}}
 *
 * @method anim8.end
 * @param {String|Array} attributes
 * @return {anim8}
 */
function end(attributes)
{
  animating.end( attributes );

  return anim8;
}

/**
 * Finishes all animators.
 *
 * **See:** {{#crossLink "Animator/finish:method"}}{{/crossLink}}
 *
 * @method anim8.finish
 * @param {String|Array} attributes
 * @return {anim8}
 */
function finish(attributes)
{
  animating.finish( attributes );

  return anim8;
}

/**
 * Interrupts all animators from repeating currently running animations.
 *
 * **See:** {{#crossLink "Animator/nopeat:method"}}{{/crossLink}}
 *
 * @method anim8.nopeat
 * @param {String|Array} attributes
 * @return {anim8}
 */
function nopeat(attributes)
{
  animating.nopeat( attributes );

  return anim8;
}
