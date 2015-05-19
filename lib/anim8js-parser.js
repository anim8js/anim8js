
/**
 * A collection of {{#crossLink "Parser"}}parsers{{/crossLink}} which takes 
 * animation definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generates {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 * 
 * @class anim8.parser
 */

/**
 * Returns a parser based on the input. If the input is an instance of Parser
 * it's returned immediately. If the input is a string the parser with that name 
 * is returned. If no parser could be determined then false is returned.
 *
 * **See:** {{#crossLink "anim8.parser"}}{{/crossLink}}
 * 
 * @method anim8.parser
 * @for Core
 * @param {Parser|String} parser
 * @return {Parser|false}
 */
anim8.parser = function(parser)
{
  if ( parser instanceof anim8.Parser )
  {
    return parser;
  }
  if ( anim8.isString( parser ) && parser in anim8.parser )
  {
    return anim8.parser[ parser ];
  }
  
  return false;
};


/**
 * Instantiates a new Parser. Parsers are responsible for taking animation
 * definitions (an Object passed to {{#crossLink "Core/anim8.animation:method"}}{{/crossLink}})
 * and generating & placing {{#crossLink "Attrimator"}}Attrimators{{/crossLink}} 
 * onto an {{#crossLink "AttrimatorMap"}}{{/crossLink}}.
 *
 * Parsers are added to the {{#crossLink "anim8.parser"}}{{/crossLink}} object
 * by a key and when that key exists in an animation definition, the animation
 * definition is passed to the {{#crossLink "Parser/parse:method"}}{{/crossLink}}
 * to generate {{#crossLink "Attrimator"}}Attrimators{{/crossLink}}.
 *
 * @class Parser
 * @constructor
 */
anim8.Parser = function()
{
  
};

anim8.Parser.prototype = 
{
  
  /**
   * Parses the animation object (and optionally an option object) and pushes
   * all generated attrimatorMap to the given array.
   *
   * @method parse
   * @param {Object} animation
   * @param {Object} options
   * @param {AttrimatorMap} attrimatorMap
   * @param {ParserHelper} helper
   */
  parse: function( animation, options, attrimatorMap, helper )
  {
    throw 'Parser.parse not implemented';
  },
  
  /**
   * Merges the options with the given event instances. This is when an existing 
   * animation is provided but the user wants to override the animation's options.
   *
   * Because event properties can be specified in several places there's a priority
   * to which one takes precedence. The properties specified in the animation object
   * itself are highest priority, followed by the new options, then by the old
   * options, and finally by the existing property on the event instance.
   *
   * @method merge
   * @param {Object} animation
   * @param {Object} newOptions
   * @param {Object} oldOptions
   * @param {AttrimatorMap} attrimatorMap
   * @param {ParserHelper} helper
   */
  merge: function( animation, newOptions, oldOptions, attrimatorMap, helper )
  { 
    var factory = anim8.factory( animation.factory );
    var attrimators = attrimatorMap.values;

    for (var i = attrimators.length - 1; i >= 0; i--)
    {
      var e = attrimators[ i ];
      var attr = e.attribute;
      
      if ( e.getParser() !== this )
      {
        continue;
      }

      e.easing    = helper.mergeEasing( attr, e.easing );
      e.repeat    = helper.mergeRepeat( attr, e.repeat );
      e.delay     = helper.mergeDelay( attr, e.delay );
      e.sleep     = helper.mergeSleep( attr, e.sleep );
      e.duration  = helper.mergeDuration( attr, e.duration );
      e.offset    = helper.mergeOffset( attr, e.offset );
      e.scale     = helper.mergeScale( attr, e.scale );
      e.scaleBase = helper.mergeScaleBase( attr, e.scaleBase, factory );
    }
  }
};


/**
 * Instantiates a new instance of Parser Helper.
 *
 * @param {Object} input
 * @param {Object} oldOptions
 * @param {Object} newOptions
 * @class ParserHelper
 * @constructor
 */
anim8.ParserHelper = function( input, oldOptions, newOptions )
{
  this.input = input;
  this.oldOptions = oldOptions || {};
  this.newOptions = newOptions || {};

  this.prepareSpecifics( 'easings' );
  this.prepareSpecifics( 'repeats' );
  this.prepareSpecifics( 'delays' );
  this.prepareSpecifics( 'sleeps' );
  this.prepareSpecifics( 'durations' );
  this.prepareSpecifics( 'offsets' );
  this.prepareSpecifics( 'scales' );
  this.prepareSpecifics( 'scaleBases' );
};

anim8.ParserHelper.prototype = 
{

  /**
   * If an object with the given name doesn't exist on the input it's created.
   *
   * @method prepareSpecifics
   * @param {String} specifics
   */
  prepareSpecifics: function(specifics)
  {
    if ( !anim8.isObject( this.input[ specifics ] ) )
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
    return this.parseNumber( attr, anim8.repeat, anim8.repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
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
    return this.parseNumber( attr, anim8.delay, anim8.time, 'delay', 'delayAdd', 'delayScale', 'delays' );
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
    return this.parseNumber( attr, anim8.sleep, anim8.time, 'sleep', 'sleepAdd', 'sleepScale', 'sleeps' );
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
    return this.parseNumber( attr, anim8.duration, anim8.time, 'duration', 'durationAdd', 'durationScale', 'durations' );
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
    return this.parseNumber( attr, anim8.offset, anim8.time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
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
    return this.parseNumber( attr, anim8.scale, anim8.number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
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
    return anim8.coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
  },

  /**
   * Parses an event from the input given a path & parser for the event.
   * 
   * @method parseEvent
   * @param {String} attr
   * @param {Path} path
   * @param {Parser} parser
   * @param {Boolean} hasInitialState
   * @return {Event}
   */
  parseEvent: function(attr, path, parser, hasInitialState)
  {
    var duration   = this.parseDuration( attr );
    var easing     = this.parseEasing( attr );
    var delay      = this.parseDelay( attr );
    var sleep      = this.parseSleep( attr );
    var repeat     = this.parseRepeat( attr );
    var offset     = this.parseOffset( attr );
    var scale      = this.parseScale( attr );
    var scaleBase  = this.parseScaleBase( attr );
    var event      = new anim8.Event( attr, path, duration, easing, delay, sleep, offset, repeat, scale, scaleBase, hasInitialState, parser );

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
    var baseRaw = anim8.coalesce( this.input[ specifics ][ attr ], this.oldOptions[ option ] );
    var base = parseFunction( baseRaw );
    var add = parseOptionFunction( this.oldOptions[ optionAdd ], 0 );
    var scale = anim8.coalesce( this.oldOptions[ optionScale ], 1 );

    return (add === 0 && scale === 1) ? baseRaw : (base + add) * scale;
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
    return this.mergeFirst( attr, current, anim8.easing, 'easing', 'easings' );
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
    return this.mergeNumber( attr, current, anim8.repeat, 'repeat', 'repeatAdd', 'repeatScale', 'repeats' );
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
    return this.mergeNumber( attr, current, anim8.time, 'delay', 'delayAdd', 'delayScale', 'delays' );
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
    return this.mergeNumber( attr, current, anim8.time, 'sleep', 'sleepAdd', 'sleepScale', 'scales' );
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
    return this.mergeNumber( attr, current, anim8.time, 'duration', 'durationAdd', 'durationScale', 'durations' );
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
    return this.mergeNumber( attr, current, anim8.time, 'offset', 'offsetAdd', 'offsetScale', 'offsets' );
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
    return this.mergeNumber( attr, current, anim8.number, 'scale', 'scaleAdd', 'scaleScale', 'scales' );
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
    return parseOptionFunction( anim8.coalesce( this.input[ specifics ][ attr ], this.newOptions[ option ], this.oldOptions[ option ] ), current );
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
    var baseRaw = anim8.coalesce( this.input[ specifics ][ attr ], this.newOptions[ option ], this.oldOptions[ option ] );
    var base = parseOptionFunction( baseRaw, current );
    var add = parseOptionFunction( anim8.coalesce( this.newOptions[ optionAdd ], this.oldOptions[ optionAdd ] ), 0 );
    var scale = anim8.coalesce( this.newOptions[ optionScale ], this.oldOptions[ optionScale ], 1 );

    return (base + add) * scale;
  }

};