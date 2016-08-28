
/**
 * Provides the ability to defer method calls until certain events are triggered.
 *
 * @class DeferAnimator
 * @constructor
 * @extends Defer
 */
function DeferAnimator(animator, previous, eventType, event)
{
  this.$reset( animator, previous, eventType, event );
}

/**
 * Creates the Defer prototype for the following Animator methods.
 */
DeferAnimator.prototype = new Defer( DeferAnimator,
[
  /**
   * Defers the {{#crossLink "Animator/restore:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'restore',

  /**
   * Defers the {{#crossLink "Animator/placeAttrimator:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method placeAttrimator
   */
  'placeAttrimator',

  /**
   * Defers the {{#crossLink "Animator/applyInitialState:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method applyInitialState
   */
  'applyInitialState',

  /**
   * Defers the {{#crossLink "Animator/preupdate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method preupdate
   */
  'preupdate',

  /**
   * Defers the {{#crossLink "Animator/update:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method update
   */
  'update',

  /**
   * Defers the {{#crossLink "Animator/apply:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method apply
   */
  'apply',

  /**
   * Defers the {{#crossLink "Animator/trimAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   * @protected
   */
  'trimAttrimators',

  /**
   * Defers the {{#crossLink "Animator/activate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'activate',

  /**
   * Defers the {{#crossLink "Animator/deactivate:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'deactivate',

  /**
   * Defers the {{#crossLink "Animator/destroy:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'destroy',

  /**
   * Defers the {{#crossLink "Animator/spring:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'spring',

  /**
   * Defers the {{#crossLink "Animator/play:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   */
  'play',

  /**
   * Defers the {{#crossLink "Animator/playAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method restore
   * @protected
   */
  'playAttrimators',

  /**
   * Defers the {{#crossLink "Animator/queue:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method queue
   */
  'queue',

  /**
   * Defers the {{#crossLink "Animator/queueAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method queueAttrimators
   * @protected
   */
  'queueAttrimators',

  /**
   * Defers the {{#crossLink "Animator/transition:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method transition
   */
  'transition',

  /**
   * Defers the {{#crossLink "Animator/transitionAttrimators:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method transitionAttrimators
   * @protected
   */
  'transitionAttrimators',

  /**
   * Defers the {{#crossLink "Animator/tween:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tween
   */
  'tween',

  /**
   * Defers the {{#crossLink "Animator/tweenTo:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenTo
   */
  'tweenTo',

  /**
   * Defers the {{#crossLink "Animator/tweenMany:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenMany
   */
  'tweenMany',

  /**
   * Defers the {{#crossLink "Animator/tweenManyTo:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenManyTo
   */
  'tweenManyTo',

  /**
   * Defers the {{#crossLink "Animator/tweenFrom:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenFrom
   */
  'tweenFrom',

  /**
   * Defers the {{#crossLink "Animator/tweenManyFrom:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method tweenManyFrom
   */
  'tweenManyFrom',

  /**
   * Defers the {{#crossLink "Animator/move:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method move
   */
  'move',

  /**
   * Defers the {{#crossLink "Animator/moveMany:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method moveMany
   */
  'moveMany',

  /**
   * Defers the {{#crossLink "Animator/follow:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method follow
   */
  'follow',

  /**
   * Defers the {{#crossLink "Animator/stop:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method stop
   */
  'stop',

  /**
   * Defers the {{#crossLink "Animator/end:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method end
   */
  'end',

  /**
   * Defers the {{#crossLink "Animator/finish:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method finish
   */
  'finish',

  /**
   * Defers the {{#crossLink "Animator/nopeat:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method nopeat
   */
  'nopeat',

  /**
   * Defers the {{#crossLink "Animator/pause:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method pause
   */
  'pause',

  /**
   * Defers the {{#crossLink "Animator/resume:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method resume
   */
  'resume',

  /**
   * Defers the {{#crossLink "Animator/set:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method set
   */
  'set',

  /**
   * Defers the {{#crossLink "Animator/unset:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method unset
   */
  'unset',

  /**
   * Defers the {{#crossLink "Animator/get:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method get
   */
  'get',

  /**
   * Defers the {{#crossLink "Animator/invoke:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method invoke
   */
  'invoke',

  /**
   * Defers the {{#crossLink "Animator/onCycleStart:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method onCycleStart
   */
  'onCycleStart',

  /**
   * Defers the {{#crossLink "Animator/onCycleEnd:method"}}{{/crossLink}} method until the deferred event has occurred.
   *
   * @method onCycleEnd
   */
  'onCycleEnd'
]);
