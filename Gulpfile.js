'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();
var gutil = require('gulp-util');

var core = 
[
  './lib/anim8js-core.js',
  './lib/anim8js-easing.js',
  './lib/anim8js-path.js',
  './lib/anim8js-spring.js',
  './lib/anim8js-event.js',
  './lib/anim8js-animation.js',
  './lib/anim8js-animator.js',
  './lib/anim8js-sequence.js',
  './lib/anim8js-color.js',
  './lib/anim8js-calculator.js',
  './lib/anim8js-parser-deltavalues.js',
  './lib/anim8js-parser-final.js',
  './lib/anim8js-parser-initial.js',
  './lib/anim8js-parser-keyframe.js',
  './lib/anim8js-object.js'
];

var dom =
[
    './lib/anim8js-dom-core.js',
    './lib/anim8js-dom-property.js',
    './lib/anim8js-dom-attribute.js',
    './lib/anim8js-dom-animator.js'
];

var builds = 
{
  objects: 
  {
    filename: 'anim8js-object.min.js',
    output: './build/',
    include: core
  },
  dom: 
  {
    filename: 'anim8js-dom.min.js',
    output: './build/',
    include: core.concat( dom )
  },
  animatecss: 
  {
    filename: 'anim8js-animate.css.min.js',
    output: './build/',
    include: core.concat( dom, [
      './lib/anim8js-animate.css.js'
    ])
  },
  jquery:
  {
    filename: 'anim8js-jquery.min.js',
    output: './build/',
    include: core.concat( dom, [
      './lib/anim8js-animate.css.js',
      './plugins/anim8js-jquery.js'
    ])
  }
};

gulp.task('js:objects', function() 
{
	return gulp
		.src( builds.objects.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.objects.filename ) )
			.pipe( plugins.uglify().on('error', gutil.log) )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest( builds.objects.output ) )
  ;
});

gulp.task('js:dom', function() 
{
	return gulp
		.src( builds.dom.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.dom.filename ) )
			.pipe( plugins.uglify().on('error', gutil.log) )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest( builds.dom.output ) )
  ;
});

gulp.task('js:animatecss', function() 
{
	return gulp
		.src( builds.animatecss.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.animatecss.filename ) )
			.pipe( plugins.uglify() )
		.pipe( sourcemaps.write('.').on('error', gutil.log) )
		.pipe( gulp.dest( builds.animatecss.output ) )
  ;
});

gulp.task('js:jquery', function () 
{
	return gulp
		.src( builds.jquery.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.jquery.filename ) )
			.pipe( plugins.uglify() )
		.pipe( sourcemaps.write('.').on('error', gutil.log) )
		.pipe( gulp.dest( builds.jquery.output ) )
  ;
});

gulp.task('js', ['js:objects', 'js:dom', 'js:animatecss', 'js:jquery']);
gulp.task('default', ['js']);