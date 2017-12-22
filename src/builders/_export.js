
var Builders = {};

/**
 * Register the builder.
 */
Builders['values'] = new BuilderDeltas();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      ... other builders ...
 *      and: {
 *       ... more builders ...
 *      }
 *     });
 *
 *
 * @property {BuilderAnd} and
 * @for anim8.builder
 */
Builders['and'] = new BuilderAnd();

/**
 * Register the builder.
 */
Builders['final'] = new BuilderFinal();

/**
 * Register the builder.
 */
Builders['initial'] = new BuilderInitial();

/**
 * Register the builder.
 */
Builders['point'] = new BuilderPoint();

/**
 * Registers the builder.
 */
Builders['keyframe'] = new BuilderKeyframe();

/**
 * Register the builder.
 */
Builders['move'] = new BuilderMove();

/**
 * A builder which generates attrimators which follow a given path.
 *
 * **Examples:**
 *
 *     animator.play({
 *      path: {
 *       opacity: {
 *        type: 'quadratic',
 *        p0: 0,
 *        p1: 0.4,
 *        p2: 1.0
 *       }
 *      }
 *     });
 *
 *
 * @property {BuilderPath} path
 * @for anim8.builder
 */
Builders['path'] = new BuilderPath();

/**
 * Register the builder.
 */
Builders['physics'] = new BuilderPhysics();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      ... other builders ...
 *      queue: {
 *       ... more builders to play after the others ...
 *      }
 *     });
 *
 *
 * @property {BuilderQueue} queue
 * @for anim8.builder
 */
Builders['queue'] = new BuilderQueue();

/**
 * Register the builder.
 */
Builders['springs'] = new BuilderSpring();

/**
 * Register the builder.
 */
Builders['travel'] = new BuilderTravel();

/**
 * Register the builder.
 */
Builders['tweenFrom'] = new BuilderTweenFrom();

/**
 * A builder which generates attrimators which tween from the current value to
 * the given values.
 *
 * **Examples:**
 *
 *     animator.play({
 *      tweenTo: {
 *       opacity: 1.0,       // absolute value
 *       left: '+40'         // 40 more units from current value
 *      }
 *     });
 *
 *
 * @property {BuilderTweenTo} tweenTo
 * @for anim8.builder
 */
Builders['tweenTo'] = new BuilderTweenTo();
