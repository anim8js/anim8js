'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();
var gutil = require('gulp-util');

var core = 
[
  './lib/anim8js-core.js',
  './lib/anim8js-fast-map.js',
  './lib/anim8js-defer.js',
  './lib/anim8js-easing.js',
  './lib/anim8js-easing-type.js',
  './lib/anim8js-easing-css.js',
  './lib/anim8js-color.js',
  './lib/anim8js-computed.js',
  './lib/anim8js-calculator.js',
  './lib/anim8js-calculator-number.js',
  './lib/anim8js-calculator-2d.js',
  './lib/anim8js-calculator-3d.js',
  './lib/anim8js-calculator-quaternion.js',
  './lib/anim8js-calculator-rgb.js',
  './lib/anim8js-calculator-rgba.js',
  './lib/anim8js-path.js',
  './lib/anim8js-path-tween.js',
  './lib/anim8js-path-cubic.js',
  './lib/anim8js-path-quadratic.js',
  './lib/anim8js-path-delta.js',
  './lib/anim8js-path-jump.js',
  './lib/anim8js-path-compiled.js',
  './lib/anim8js-path-keyframe.js',
  './lib/anim8js-path-point.js',
  './lib/anim8js-attrimator.js',
  './lib/anim8js-attrimator-map.js',
  './lib/anim8js-event.js',
  './lib/anim8js-spring.js',
  './lib/anim8js-spring-linear.js',
  './lib/anim8js-spring-distance.js',
  './lib/anim8js-physics.js',
  './lib/anim8js-animation.js',
  './lib/anim8js-transition.js',
  './lib/anim8js-options.js',
  './lib/anim8js-animator.js',
  './lib/anim8js-animators.js',
  './lib/anim8js-loop.js',
  './lib/anim8js-sequence.js',
  './lib/anim8js-parser.js',
  './lib/anim8js-parser-deltavalues.js',
  './lib/anim8js-parser-final.js',
  './lib/anim8js-parser-initial.js',
  './lib/anim8js-parser-keyframe.js',
  './lib/anim8js-parser-tweenTo.js',
  './lib/anim8js-parser-tweenFrom.js',
  './lib/anim8js-parser-move.js',
  './lib/anim8js-parser-springs.js',
  './lib/anim8js-parser-physics.js',
  './lib/anim8js-parser-travel.js',
  './lib/anim8js-factory.js',
  './lib/anim8js-object.js'
];

var dom =
[
  './lib/anim8js-dom-core.js',
  './lib/anim8js-dom-property.js',
  './lib/anim8js-dom-attribute.js',
  './lib/anim8js-dom-animator.js'
];

var animatecss =
[
  './lib/anim8js-animate.css.js'
];

var jquery =
[
  './lib/anim8js-jquery.js',
  './plugins/anim8js-jquery.js'
];

var builds = 
{
  objects: 
  {
    filename: 'anim8js-object.js',
    minified: 'anim8js-object.min.js',
    output: './build/',
    include: core
  },
  dom: 
  {
    filename: 'anim8js-dom.js',
    minified: 'anim8js-dom.min.js',
    output: './build/',
    include: core.concat( dom )
  },
  animatecss: 
  {
    filename: 'anim8js-animate.css.js',
    minified: 'anim8js-animate.css.min.js',
    output: './build/',
    include: animatecss
  },
  jquery:
  {
    filename: 'anim8js-jquery.js',
    minified: 'anim8js-jquery.min.js',
    output: './build/',
    include: core.concat( dom, animatecss, jquery )
  }
};

var executeMinifiedBuild = function(props)
{
	return function() {
    return gulp
  		.src( props.include )
  		.pipe( sourcemaps.init() )
  			.pipe( plugins.concat( props.minified ) )
  			.pipe( plugins.uglify().on('error', gutil.log) )
  		.pipe( sourcemaps.write('.') )
  		.pipe( gulp.dest( props.output ) )
    ;
  };
};

var executeBuild = function(props)
{
	return function() {
    return gulp
  		.src( props.include )
			.pipe( plugins.concat( props.filename ) )
  		.pipe( gulp.dest( props.output ) )
    ;
  };
};

gulp.task( 'js:objects:min',    executeMinifiedBuild( builds.objects ) );
gulp.task( 'js:dom:min',        executeMinifiedBuild( builds.dom ) );
gulp.task( 'js:animatecss:min', executeMinifiedBuild( builds.animatecss ) );
gulp.task( 'js:jquery:min',     executeMinifiedBuild( builds.jquery ) );

gulp.task( 'js:objects',        executeBuild( builds.objects ) );
gulp.task( 'js:dom',            executeBuild( builds.dom ) );
gulp.task( 'js:animatecss',     executeBuild( builds.animatecss ) );
gulp.task( 'js:jquery',         executeBuild( builds.jquery ) );

gulp.task( 'js:min', ['js:objects:min', 'js:dom:min', 'js:animatecss:min', 'js:jquery:min']);
gulp.task( 'js', ['js:objects', 'js:dom', 'js:animatecss', 'js:jquery']);
gulp.task( 'default', ['js:min', 'js'] );
