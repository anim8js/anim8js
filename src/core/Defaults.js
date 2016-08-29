

/**
 * The default values for anim8js properties.
 *
 * @property {Object} anim8.defaults
 */
var Defaults =
{

  /**
   * The default animation duration in milliseconds.
   *
   * @property {Number} duration
   * @for anim8.defaults
   * @default 1000
   */
  duration: 1000,

  /**
   * The default easing.
   *
   * @property {String|Function|Array} easing
   * @for anim8.defaults
   * @default 'ease'
   */
  easing: 'ease',

  /**
   * The default "total easing" which is the overall easing
   * for an animation which actually has easing values per frame.
   *
   * @property {String|Function|Array} teasing
   * @for anim8.defaults
   * @default 'linear'
   */
  teasing: 'linear',

  /**
   * The default animation delay in milliseconds.
   *
   * @property {Number} delay
   * @for anim8.defaults
   * @default 0
   */
  delay: 0,

  /**
   * The default animation sleep in milliseconds.
   *
   * @property {Number} sleep
   * @for anim8.defaults
   * @default 0
   */
  sleep: 0,

  /**
   * The default number of repeats for an animation.
   *
   * @property {Number} repeat
   * @for anim8.defaults
   * @default 1
   */
  repeat: 1,

  /**
   * The default scale for an animation.
   *
   * @property scale
   * @for anim8.defaults
   * @default 1.0
   * @type {Number}
   */
  scale: 1.0,

  /**
   * The default animation offset in milliseconds.
   *
   * @property {Number} offset
   * @for anim8.defaults
   * @default 0
   */
  offset: 0,

  /**
   * The default transition time in milliseconds.
   *
   * @property {Number} transitionTime
   * @for anim8.defaults
   * @default 500
   */
  transitionTime: 500,

  /**
   * The default transition outroduction time in milliseconds.
   *
   * @property {Number} transitionOutro
   * @for anim8.defaults
   * @default 100
   */
  transitionOutro: 100,

  /**
   * The default transition introduction time in milliseconds.
   *
   * @property {Number} transitionIntro
   * @for anim8.defaults
   * @default 100
   */
  transitionIntro: 100,

  /**
   * The default transition easing when none is specified.
   *
   * @property {String|Function|Array} transitionEasing
   * @for anim8.defaults
   * @default 'linear'
   */
  transitionEasing: 'linear',

  /**
   * The default transition granularity. This is used for smooth transitions to
   * provide a smooth transition from the outro velocity to the intro velocity,
   * the cubic or quadratic path between the two is a curve with unknown length
   * so the length needs to be calculated using a maximum number of points to
   * calculate along the path - summing the distances between the consecutive points.
   *
   * @property {Number} transitionGranularity
   * @for anim8.defaults
   * @default 0
   */
  transitionGranularity: 0,

  /**
   * TODO
   *
   * @property {Number} transitionLookup
   * @for anim8.defaults
   * @default 10
   */
  transitionLookup: 10,

  /**
   * Whether animtions are cached whenever possible. Animations that can be
   * cached are strings with options specified in the string and without an
   * option object given. For example 'tada ~1s 3s x3' is cacheable.
   *
   * **See:** {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}}
   *
   * @property {Boolean} cache
   * @for anim8.defaults
   * @default false
   */
  cache: false,

  /**
   * Whether parsed options are cached whenever possible. Options that can be
   * cached must be strings.
   *
   * **See:** {{#crossLink "Core/anim8.options:method"}}{{/crossLink}}
   *
   * @property {Boolean} cacheOptions
   * @for anim8.defaults
   * @default false
   */
  cacheOptions: false,

  /**
   * Whether parsed transitions are cached whenever possible. Transitions that can be
   * cached must be strings.
   *
   * **See:** {{#crossLink "Core/anim8.transition:method"}}{{/crossLink}}
   *
   * @property {Boolean} cacheTransitions
   * @for anim8.defaults
   * @default false
   */
  cacheTransitions: false,

  /**
   * The value to return when options could not be parsed from input.
   *
   * @property {Object} noOptions
   * @for anim8.defaults
   * @default {}
   */
  noOptions: {},

  /**
   * The value to return when a transition could not be parsed from input.
   *
   * @property {Object} noTransition
   * @for anim8.defaults
   * @default {}
   */
  noTransition: {},

  /**
   * The target number of milliseconds between frames. This only applies if the
   * browser doesn't support any of the requestAnimationFrame variations.
   *
   * @property {Number} frameRate
   * @for anim8.defaults
   * @default 33
   */
  frameRate: 16,

  /**
   * The number of milliseconds to pause between looping to let the UI react
   * to user events.
   *
   * @property {Number} pauseTime
   * @for anim8.defaults
   * @default 5
   */
  pauseTime: 5

};
