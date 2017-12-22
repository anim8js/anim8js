
/**
 * Instantiates a new instance of Builder Helper.
 *
 * @param {Object} input
 * @param {Object} oldOptions
 * @param {Object} newOptions
 * @class BuilderHelper
 * @constructor
 */
function BuilderHelper( input, oldOptions, newOptions, forObject )
{
  this.input = input;
  this.oldOptions = oldOptions || {};
  this.newOptions = newOptions || {};
  this.forObject = forObject;

  this.prepareSpecifics( 'easings' );
  this.prepareSpecifics( 'repeats' );
  this.prepareSpecifics( 'delays' );
  this.prepareSpecifics( 'sleeps' );
  this.prepareSpecifics( 'durations' );
  this.prepareSpecifics( 'offsets' );
  this.prepareSpecifics( 'scales' );
  this.prepareSpecifics( 'scaleBases' );
  this.prepareSpecifics( 'parameters' );
}

Class.define( BuilderHelper,
{

  /**
   * If an object with the given name doesn't exist on the input it's created.
   *
   * @method prepareSpecifics
   * @param {String} specifics
   */
  prepareSpecifics: function(specifics)
  {
    if ( !isObject( this.input[ specifics ] ) )
    {
      this.input[ specifics ] = {};
    }
  },

  /* PARSING */

  /**
   * Parses an easing from the input.
   *
   * @method parseEasing
   * @param  {String} attr
   * @return {String|Function|Array}
   */
  parseEasing: function(attr)
  {
    return this.parseFirst( attr, 'easing', 'easings' );
  },

  /**
   * Parses repeats from the input.
   *
   * @method parseRepeat
   * @param  {String} attr
   * @return {Number}
   */
  parseRepeat: function(attr)
  {
    return this.parseNumber( attr, $repeat, $repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
  },

  /**
   * Parses delay from the input.
   *
   * @method parseDelay
   * @param  {String} attr
   * @return {Number}
   */
  parseDelay: function(attr)
  {
    return this.parseNumber( attr, $delay, $time, 'delay', 'delayAdd', 'delayScale', 'delays' );
  },

  /**
   * Parses sleep from the input.
   *
   * @method parseSleep
   * @param  {String} attr
   * @return {Number}
   */
  parseSleep: function(attr)
  {
    return this.parseNumber( attr, $sleep, $time, 'sleep', 'sleepAdd', 'sleepScale', 'sleeps' );
  },

  /**
   * Parses duration from the input.
   *
   * @method parseDuration
   * @param  {String} attr
   * @return {Number}
   */
  parseDuration: function(attr)
  {
    return this.parseNumber( attr, $duration, $time, 'duration', 'durationAdd', 'durationScale', 'durations' );
  },

  /**
   * Parses offset from the input.
   *
   * @method parseOffset
   * @param  {String} attr
   * @return {Number}
   */
  parseOffset: function(attr)
  {
    return this.parseNumber( attr, $offset, $time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
  },

  /**
   * Parses scale from the input.
   *
   * @method parseScale
   * @param  {String} attr
   * @return {Number}
   */
  parseScale: function(attr)
  {
    return this.parseNumber( attr, $scale, $number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
  },

  /**
   * Parses scale base from the input.
   *
   * @method parseScaleBase
   * @param  {String} attr
   * @return {Any}
   */
  parseScaleBase: function(attr)
  {
    return this.parseFirst( attr, 'scaleBase', 'scaleBases' );
  },

  /**
   * Parses a value from the input given the attribute, option, and specific.
   *
   * @method parseFirst
   * @param {String} attr
   * @param {String} option
   * @param {String} specifics
   * @return {Any}
   */
  parseFirst: function(attr, option, specifics)
  {
    return coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
  },

  /**
   * Parses an event from the input given a path & builder for the event.
   *
   * @method parseEvent
   * @param {String} attr
   * @param {Path} path
   * @param {Builder} builder
   * @param {Boolean} hasInitialState
   * @return {Event}
   */
  parseEvent: function(attr, path, builder, hasInitialState, mergeId)
  {
    var duration   = this.parseDuration( attr );
    var easing     = this.parseEasing( attr );
    var delay      = this.parseDelay( attr );
    var sleep      = this.parseSleep( attr );
    var repeat     = this.parseRepeat( attr );
    var offset     = this.parseOffset( attr );
    var scale      = this.parseScale( attr );
    var scaleBase  = this.parseScaleBase( attr );
    var parameters = this.parseParameters();
    var event      = new Event( attr, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, parameters, hasInitialState, builder, null, this.input );

    return event;
  },

  /**
   * Parses a number from the input given parse functions.
   *
   * @method parseNumber
   * @param {String} attr
   * @param {Function} parseFunction
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} optionAdd
   * @param {String} optionScale
   * @param {String} specifics
   * @return {Number}
   */
  parseNumber: function(attr, parseFunction, parseOptionFunction, option, optionAdd, optionScale, specifics)
  {
    var baseRaw = coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
    var base = parseFunction( baseRaw );
    var add = parseOptionFunction( this.oldOptions[ optionAdd ], 0 );
    var scale = coalesce( this.oldOptions[ optionScale ], 1 );

    return (add === 0 && scale === 1) ? baseRaw : (base + add) * scale;
  },

  /**
   * Parses parameters from input and the given options.
   *
   * @method parseParameters
   * @return {Object}
   */
  parseParameters: function()
  {
    return extend( {}, this.input.parameters, this.oldOptions );
  },

  /* MERGING */

  /**
   * Merges easing based on the input, new options, and the current easing.
   *
   * @method mergeEasing
   * @param {String} attr
   * @param {Function} current
   * @return {Function}
   */
  mergeEasing: function(attr, current)
  {
    return this.mergeFirst( attr, current, $easing, 'easing', 'easings' );
  },

  /**
   * Merges repeats based on the input, new options, and the current repeat.
   *
   * @method mergeRepeat
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeRepeat: function(attr, current)
  {
    return this.mergeNumber( attr, current, $repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
  },

  /**
   * Merges delay based on the input, new options, and the current delay.
   *
   * @method mergeDelay
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeDelay: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'delay', 'delayAdd', 'delayScale', 'delays' );
  },

  /**
   * Merges sleep based on the input, new options, and the current sleep.
   *
   * @method mergeSleep
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeSleep: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'sleep', 'sleepAdd', 'sleepScale', 'scales' );
  },

  /**
   * Merges duration based on the input, new options, and the current duration.
   *
   * @method mergeDuration
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeDuration: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'duration', 'durationAdd', 'durationScale', 'durations' );
  },

  /**
   * Merges offset based on the input, new options, and the current offset.
   *
   * @method mergeOffset
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeOffset: function(attr, current)
  {
    return this.mergeNumber( attr, current, $time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
  },

  /**
   * Merges scale based on the input, new options, and the current scale.
   *
   * @method mergeScale
   * @param {String} attr
   * @param {Number} current
   * @return {Number}
   */
  mergeScale: function(attr, current)
  {
    return this.mergeNumber( attr, current, $number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
  },

  /**
   * Merges scale base based on the input, new options, and the current scale
   * base.
   *
   * @method mergeScaleBase
   * @param {String} attr
   * @param {T} current
   * @param {Factory} factory
   * @return {T}
   */
  mergeScaleBase: function(attr, current, factory)
  {
    var calc = factory.attribute( attr ).calculator;

    var parseFunction = function(value, defaultValue) {
      return calc.parse( value, defaultValue );
    };

    return this.mergeFirst( attr, current, parseFunction, 'scaleBase', 'scaleBases' );
  },

  /**
   * Merges parameters from across the input and options.
   *
   * @method mergeParameters
   * @param {Object} current
   * @return {Object}
   */
  mergeParameters: function(current)
  {
    return extend( {}, this.newOptions.parameters, current );
  },

  /**
   * Returns the first available option from input, new options, old options,
   * and the current value.
   *
   * @method mergeFirst
   * @param {String} attr
   * @param {T} current
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} specifics
   * @return {T}
   */
  mergeFirst: function(attr, current, parseOptionFunction, option, specifics)
  {
    var specific = this.input[ specifics ][ attr ];
    var value = coalesce( specific, this.newOptions[ option ], this.oldOptions[ option ] );

    return parseOptionFunction( value, current );
  },

  /**
   * Merges a number by returning the first occurrence from input, new options,
   * old options, and the current value.
   *
   * @method mergeNumber
   * @param {String} attr
   * @param {Number} current
   * @param {Function} parseOptionFunction
   * @param {String} option
   * @param {String} optionAdd
   * @param {String} optionScale
   * @param {String} specifics
   * @return {Number}
   */
  mergeNumber: function(attr, current, parseOptionFunction, option, optionAdd, optionScale, specifics)
  {
    var baseRaw = coalesce( this.input[ specifics ][ attr ], this.newOptions[ option ], this.oldOptions[ option ] );
    var base = parseOptionFunction( baseRaw, current );
    var add = parseOptionFunction( coalesce( this.newOptions[ optionAdd ], this.oldOptions[ optionAdd ] ), 0 );
    var scale = coalesce( this.newOptions[ optionScale ], this.oldOptions[ optionScale ], 1 );

    return (base + add) * scale;
  }

});
