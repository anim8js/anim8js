'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();

var core = [
  './lib/anim8js-core.js',
  './lib/anim8js-easing.js',
  './lib/anim8js-path.js',
  './lib/anim8js-event.js',
  './lib/anim8js-animation.js',
  './lib/anim8js-animator.js',
  './lib/anim8js-color.js',
  './lib/anim8js-calculator.js',
  './lib/anim8js-parser-deltavalues.js',
  './lib/anim8js-parser-final.js',
  './lib/anim8js-parser-initial.js',
  './lib/anim8js-parser-keyframe.js',
  './lib/anim8js-object.js'
];

var builds = {
  objects: 
  {
    filename: 'anim8js-object.js',
    output: './build/',
    include: core
  },
  dom: 
  {
    filename: 'anim8js-dom.js',
    output: './build/',
    include: core.concat([
      './lib/anim8js-dom.js'
    ])
  },
  animatecss: 
  {
    filename: 'anim8js-animate.css.js',
    output: './build/',
    include: core.concat([
      './lib/anim8js-dom.js',
      './lib/anim8js-animate.css.js'
    ])
  }
};

gulp.task('js:objects', function () {
	return gulp
		.src( builds.objects.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.objects.filename ) )
			.pipe( plugins.uglify() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest( builds.objects.output ) );
});

gulp.task('js:dom', function () {
	return gulp
		.src( builds.dom.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.dom.filename ) )
			.pipe( plugins.uglify() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest( builds.dom.output ) );
});

gulp.task('js:animatecss', function () {
	return gulp
		.src( builds.animatecss.include )
		.pipe( sourcemaps.init() )
			.pipe( plugins.concat( builds.animatecss.filename ) )
			.pipe( plugins.uglify() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest( builds.animatecss.output ) );
});

gulp.task('js', ['js:objects', 'js:dom', 'js:animatecss']);
gulp.task('default', ['js']);